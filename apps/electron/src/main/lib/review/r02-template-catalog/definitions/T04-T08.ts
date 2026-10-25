import type { TemplateVersion } from '@profer/shared'

/** Generated from the reviewed R02 research source; this is not a school-issued template. */
export const template: TemplateVersion = {
  "templateId": "T04-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "部门公务用车调派及公车使用资格审核",
  "description": "本地研究模板 · 非校方正式模板。用于材料事实核验、风险提示和人工复核；不构成学校正式表单、制度或批准决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策适用、审批权限和最终决定必须由有权人员核验，不创建政策版本。",
  "objectType": "transaction",
  "displayName": {
    "template": "{{caseTitle}}"
  },
  "fields": [
    {
      "key": "requestId",
      "label": "requestId 字符串｜U·A 起",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 | requestId 字符串｜U·A 起 | SYS 建案事件，M003 关联键 | P1 | 系统未建案则不做跨材料关联；非用户填报"
    },
    {
      "key": "requestRevision",
      "label": "requestRevision 正整数｜U·A 起/变更",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F002；F002 | requestRevision 正整数｜U·A 起/变更 | SYS 版本事件，M003/M016 元数据 | P1 | 未知版本不覆盖旧结论，先恢复可信版本"
    },
    {
      "key": "applicantUnitId",
      "label": "applicantUnitId 机构 ID｜A·A/B",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F003；F003 | applicantUnitId 机构 ID｜A·A/B | HOST 组织关系、M001；M003 的单位名仅待验 | P1 | 单位身份不明→来源失联/待人核，不承认自填单位为权威"
    },
    {
      "key": "initiatorActorId",
      "label": "initiatorActorId 主体 ID｜A·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F004；F004 | initiatorActorId 主体 ID｜A·A/B | HOST 签入记录，M001 | P2 | 无可信 Actor 不可完成授权前置核验"
    },
    {
      "key": "initiatorRelation",
      "label": "initiatorRelation 枚举（本人/经办/代理/未知）｜A·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F005；F005 | initiatorRelation 枚举（本人/经办/代理/未知）｜A·A/B | HOST 角色及 M002 的代理授权 | P2 | 不得默认为单位负责人；待代理校验"
    },
    {
      "key": "delegationRef",
      "label": "delegationRef 可空引用｜A·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F006；F006 | delegationRef 可空引用｜A·A/B | HOST 授权记录或可核 M002 | P2 | 非代理不适用；代理而无证→待证，阻止越权签批"
    },
    {
      "key": "dutyTaskId",
      "label": "dutyTaskId 可空业务 ID｜T·A/B",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F007；F007 | dutyTaskId 可空业务 ID｜T·A/B | TASK 任务系统/M004/M005 编号 | P1 | 无已批任务编号可先按 M004 描述初核；正式效力待人核"
    },
    {
      "key": "dutyDescription",
      "label": "dutyDescription 文本｜T·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F008；F008 | dutyDescription 文本｜T·A/B | USER 的 M003 事由；对照 M004 原文 | P1/P3 | 事由未说明→NEEDS_MATERIAL；敏感只限权威核验"
    },
    {
      "key": "dutyCategory",
      "label": "dutyCategory 枚举（行政/教学/科研/应急/接待/其他/未知）｜T·A/B",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F009；F009 | dutyCategory 枚举（行政/教学/科研/应急/接待/其他/未知）｜T·A/B | M003/M004 归类建议，须人工/任务源确认 | P1 | 未知不能判非公务或准派"
    },
    {
      "key": "dutyAuthorizationStatus",
      "label": "dutyAuthorizationStatus 枚举+版本｜T·B/C",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F010；F010 | dutyAuthorizationStatus 枚举+版本｜T·B/C | TASK 的 M005（仅实际已产生的任务决定） | P1 | 任务本身尚未有决定时不伪造已批准；按流程待人核"
    },
    {
      "key": "dutyResponsibleUnitId",
      "label": "dutyResponsibleUnitId 机构 ID｜T·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F011；F011 | dutyResponsibleUnitId 机构 ID｜T·A/B | TASK/HOST 与 M004/M005 | P1 | 与 F003 不同须核跨单位责任，不任意归并"
    },
    {
      "key": "plannedDepartureAt",
      "label": "plannedDepartureAt 带时区时间｜U·A/B",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F012；F012 | plannedDepartureAt 带时区时间｜U·A/B | USER 的 M003 时间栏 | P1 | 缺失需补当前事实；提前申请天数未校证"
    },
    {
      "key": "plannedReturnAt",
      "label": "plannedReturnAt 带时区时间｜U·A/B",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F013；F013 | plannedReturnAt 带时区时间｜U·A/B | USER 的 M003 时间栏 | P1 | 缺失需补当前预计；未知最长时长不作阈值判断"
    },
    {
      "key": "plannedOrigin",
      "label": "plannedOrigin 地点文本/代码｜U·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F014；F014 | plannedOrigin 地点文本/代码｜U·A/B | USER 的 M003 起点 | P1/P3 | 无法定位需澄清，不假设从校本部发车"
    },
    {
      "key": "plannedStops",
      "label": "plannedStops 有序地点列表｜U·A/B",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F015；F015 | plannedStops 有序地点列表｜U·A/B | USER 的 M003，详情可在 M006 | P1/P3 | 目的地不明补证；敏感路线按受限证据处理"
    },
    {
      "key": "expectedPassengerCount",
      "label": "expectedPassengerCount 非负整数｜U·A/B",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F016；F016 | expectedPassengerCount 非负整数｜U·A/B | USER M003 /条件 M006 | P1 | 缺失可补总人数；不自设载客最低人数门槛"
    },
    {
      "key": "passengerGroupType",
      "label": "passengerGroupType 受限枚举/聚合｜U·A/B",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F017；F017 | passengerGroupType 受限枚举/聚合｜U·A/B | USER/TASK 的 M006（按实际需要） | P2/P3 | 无需时不强收实名全员名单；冲突查责任单位"
    },
    {
      "key": "vehicleMode",
      "label": "vehicleMode 枚举（校有/社会租赁/待定）｜U·A/B",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F018；F018 | vehicleMode 枚举（校有/社会租赁/待定）｜U·A/B | USER M003；DISP M008 再核 | P1 | 待定并不等于准许租车；需路由管理人"
    },
    {
      "key": "emergencyClaim",
      "label": "emergencyClaim 布尔/未知｜U·A/B",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F019；F019 | emergencyClaim 布尔/未知｜U·A/B | USER M003 +当下可得的 M007 | P1/P3 | 自称紧急不能自动豁免正式许可"
    },
    {
      "key": "incidentEvidenceRef",
      "label": "incidentEvidenceRef 引用｜T·A/B",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F020；F020 | incidentEvidenceRef 引用｜T·A/B | 业务事件报告 M007 | P3 | 非紧急不适用；紧急缺当下可得事实时待人核"
    },
    {
      "key": "submittedAt",
      "label": "submittedAt 时间｜U·A/B",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F021；F021 | submittedAt 时间｜U·A/B | SYS 真正提交事件，M003 元数据 | P1 | 不能用材料落款/上传时间替代真实提交时点"
    },
    {
      "key": "policyVersionRef",
      "label": "policyVersionRef 版本/效力枚举｜V·B/C",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F022；F022 | policyVersionRef 版本/效力枚举｜V·B/C | POLICY 管理校本制度 M010 | P1 | 无现行校本依据→POLICY_UNCONFIRMED，不得绑定硬时限"
    },
    {
      "key": "useDecisionId",
      "label": "useDecisionId 引用｜D·C 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F023；F023 | useDecisionId 引用｜D·C 起 | DEC 正式决定 M011 | P1 | C 前不适用；C 后缺权威决定→待人工，非 PASS_FACT"
    },
    {
      "key": "decisionActorId",
      "label": "decisionActorId 主体/机构授权引用｜D·C 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F024；F024 | decisionActorId 主体/机构授权引用｜D·C 起 | DEC/HOST 的 M011 签批链 | P2 | Renderer、自填签名不可信；授权失联则不可宣称有效"
    },
    {
      "key": "decisionDisposition",
      "label": "decisionDisposition 枚举+意见｜D·C 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F025；F025 | decisionDisposition 枚举+意见｜D·C 起 | DEC 的 M011 原始结论 | P1 | 无正式结论不推导“批准”；本模板只读引用"
    },
    {
      "key": "decisionScope",
      "label": "decisionScope 对象/时地/版本范围｜D·C 起",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F026；F026 | decisionScope 对象/时地/版本范围｜D·C 起 | DEC 的 M011 附条件与范围 | P1/P3 | 无法判范围则不得沿用旧许可到新任务/路线"
    },
    {
      "key": "decisionAt",
      "label": "decisionAt 可信时间｜D·C 起",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F027；F027 | decisionAt 可信时间｜D·C 起 | DEC 原始签批审计 M011 | P1 | 扫描日期非权威系统时间；冲突需人工查源"
    },
    {
      "key": "dispatchId",
      "label": "dispatchId 调派事件 ID｜P·D 起",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F028；F028 | dispatchId 调派事件 ID｜P·D 起 | DISP 的 M012 派车单或调度记录 | P1 | D 前不适用；无真实事件不得称已派车"
    },
    {
      "key": "vehicleAssetId",
      "label": "vehicleAssetId 车辆 ID/车牌引用｜P·D 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F029；F029 | vehicleAssetId 车辆 ID/车牌引用｜P·D 起 | DISP M012/M013；申请预计车型不可信 | P1 | 车辆未分配不强制先填；已分配不一致→冲突"
    },
    {
      "key": "vehicleOperationalState",
      "label": "vehicleOperationalState 枚举/时间戳｜P·D 起",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F030；F030 | vehicleOperationalState 枚举/时间戳｜P·D 起 | DISP 受管资产/车务状态 M013 | P1 | 台账失联→SOURCE_UNAVAILABLE；封存冲突不得自己解除"
    },
    {
      "key": "assignedDriverId",
      "label": "assignedDriverId 受控主体引用｜P·D 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F031；F031 | assignedDriverId 受控主体引用｜P·D 起 | DISP M014 排班事件 | P2 | D 前不适用；不收司机身份证复印件作为替代授权"
    },
    {
      "key": "dispatchReservedWindow",
      "label": "dispatchReservedWindow 时间区间｜P·D 起",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F032；F032 | dispatchReservedWindow 时间区间｜P·D 起 | DISP M012/M014 实际预约 | P1 | 与 F012–013 不符→CONFLICT，不擅自改申请"
    },
    {
      "key": "actualDepartureAt",
      "label": "actualDepartureAt 时间｜E·E 起",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F033；F033 | actualDepartureAt 时间｜E·E 起 | TRIP M015 出车记录 | P1/P3 | 未出车不适用，不能填预计值；已出车无源→待核"
    },
    {
      "key": "actualReturnAt",
      "label": "actualReturnAt 时间｜E·E 起",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F034；F034 | actualReturnAt 时间｜E·E 起 | TRIP M015 收车记录 | P1/P3 | 未收车不适用；漏记按车务补记流程，时限未知"
    },
    {
      "key": "actualStops",
      "label": "actualStops 受限路线/地点｜E·E 起",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F035；F035 | actualStops 受限路线/地点｜E·E 起 | TRIP M015；仅有真实原始证据时 | P3 | 缺失按实际制度补证，不推断个人轨迹"
    },
    {
      "key": "actualMileage",
      "label": "actualMileage 非负数+单位｜E·E 起",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F036；F036 | actualMileage 非负数+单位｜E·E 起 | TRIP M015 仪表/登记 | P1 | 未完成不适用；无可信实绩不能用估计值结算"
    },
    {
      "key": "tripAnomalyRef",
      "label": "tripAnomalyRef 事件引用｜E·E 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F037；F037 | tripAnomalyRef 事件引用｜E·E 起 | TRIP M015/M020，必要时事故/变更记录 | P2/P3 | 无异常可空；有异常不隐去并交人工"
    },
    {
      "key": "changeRequestId",
      "label": "changeRequestId 版本关联｜C·触发时",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F038；F038 | changeRequestId 版本关联｜C·触发时 | SYS/USER M016，绑定原申请 F001/F002 | P1 | 无变更不适用；丢原版不得直接覆盖"
    },
    {
      "key": "withdrawalDisposition",
      "label": "withdrawalDisposition 状态+时间｜C·撤回时",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F039；F039 | withdrawalDisposition 状态+时间｜C·撤回时 | DEC/DISP 对 M016 的真实处理记录 | P1 | 单方提交不等于已取消排车或销案"
    },
    {
      "key": "reviewRequestId",
      "label": "reviewRequestId 引用/状态｜C·复核时",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F040；F040 | reviewRequestId 引用/状态｜C·复核时 | SYS/DEC 的 M017 | P1/P2 | 无复核不适用；复核决定权/时限未知"
    },
    {
      "key": "upstreamDecisionRef",
      "label": "upstreamDecisionRef 业务决定引用｜X·B/C",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F041；F041 | upstreamDecisionRef 业务决定引用｜X·B/C | TASK 已有的 M005，如接待、科研任务、教学外业 | P1 | 不可采信截图的裸编号；跨系统无法核→待核"
    },
    {
      "key": "financeReferenceId",
      "label": "financeReferenceId 只读引用｜X·F",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F042；F042 | financeReferenceId 只读引用｜X·F | FIN 的 M019 或已生成报销事项 | P1 | F 前不适用；财务回执不代表派车许可"
    },
    {
      "key": "sourceVersionFingerprint",
      "label": "sourceVersionFingerprint 哈希/版本令牌｜V·所有阶段",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F043；F043 | sourceVersionFingerprint 哈希/版本令牌｜V·所有阶段 | SYS 各 M 的原件版本、采集时间及目标归属 | P1 | 源版本不明→旧审核失效标记/重新定位证据"
    },
    {
      "key": "caseLifecycleState",
      "label": "caseLifecycleState 阶段枚举｜U·所有阶段",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F044；F044 | caseLifecycleState 阶段枚举｜U·所有阶段 | SYS 真实主案状态、DEC/DISP/TRIP 事件集合 | P1 | 仅有文本“已通过”不改变主案状态；状态冲突交 Owner"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 证明申请主体与校内责任单位、经办授权的真实身份",
      "purpose": "证明申请主体与校内责任单位、经办授权的真实身份。持有人：学校统一身份及组织授权方；认证会话/机构岗位记录；A/B·当期；可由校方经授权的人工人事/组织证明核验；不要求申请人重复上传身份证/工牌；F003–F005；SRC-007 仅通用系统参考；归属 requestId+actorId+unitId+identityVersion；失联 SOURCE_UNAVAILABLE，自填截图不能替代；不可读人工校验",
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
        "证明申请主体与校内责任单位、经办授权的真实身份",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 证明某经办人受单位授权，或代理范围",
      "purpose": "证明某经办人受单位授权，或代理范围。持有人：授权机构/委托人；正式委托记录、受管电子授权；A/B·条件（F005=代理）；允许现场可核书面授权及有效签发人复核；F005/F006/F043；SRC-007 通用委托功能，事项授权依据待证 SRC-001；归属委托人/受托人/机构与有效区间；无代理不适用，代理缺证则 NEEDS_MATERIAL；文字不清 UNREADABLE",
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
        "证明某经办人受单位授权，或代理范围",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 非声称学校存在特定正式表单",
      "purpose": "表述本次用车需求。持有人：校内主责申请单位；表单事件或可审阅的申请说明（非声称学校存在特定正式表单）；A·当期；如校方系统有规范表单，系统记录本身即为载体；无须纸质副本；F001/F002/F003/F008/F009/F012–F019/F021/F043/F044；SRC-001/008 仅事项原则；归属单次任务和申请版本；核心事由/起止时间/地点不明→NEEDS_MATERIAL，扫描不可读→UNREADABLE，与版本不符→CONFLICT",
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
        "非声称学校存在特定正式表单",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 证明公务任务的内容、背景及主责单位",
      "purpose": "证明公务任务的内容、背景及主责单位。持有人：任务归口单位/校内活动组织方；会议通知、教学科研任务安排、任务批准或当时可出具说明；A/B·当期（紧急 C03 用 M007 特例）；可信任务系统只读记录优先；未完成前置任务审批时可先有待核说明，但不能被认定正式批准；F007–F011/F041；SRC-002 区分差旅类型，SRC-008 原则；归属具体任务 ID/主办单位/发生期；缺依据→NEEDS_MATERIAL；任务来源失联→SOURCE_UNAVAILABLE；文字不可辨→UNREADABLE",
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
        "证明公务任务的内容、背景及主责单位",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 核对另一归口事项已生效的真实批准，防止越权重复裁定",
      "purpose": "核对另一归口事项已生效的真实批准，防止越权重复裁定。持有人：教学、科研、接待、出差等权威业务系统/其正式办理机关；B/C·条件（任务已有正式决议或本校明确要求）；官方决定查询/可验证签章文件为替代；未形成不催交；F010/F011/F041；SRC-002、具体邻接模板 SRC 待补；以决定 ID、颁发机构、版本、对象/时间范围为归属；源失联→SOURCE_UNAVAILABLE，截图与权威矛盾→CONFLICT",
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
        "核对另一归口事项已生效的真实批准，防止越权重复裁定",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 证明联合团队/特殊行程的人数、站点与任务范围",
      "purpose": "证明联合团队/特殊行程的人数、站点与任务范围。持有人：申请主责单位；活动名单（必要字段）或人数/路线明细；A/B·条件（C02/C05 或复杂路线）；经确认的任务日程与人员类别聚合可替代实名全名单；F015–F017；SRC-008 第 27 条为管理原则，具体清单要求待校证；归属该趟次/任务版本；未必需要身份证号；必要人数缺失→NEEDS_MATERIAL，名单不可读→UNREADABLE",
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
        "证明联合团队/特殊行程的人数、站点与任务范围",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 证明应急事件发生的基本事实、时间地点、报事渠道",
      "purpose": "证明应急事件发生的基本事实、时间地点、报事渠道。持有人：应急责任/值班单位；值班记录、报事登记、应急任务通知；A/B·条件（C03、突发 C04）；紧急当下可得的初报记录可先作为核验起点，正式追认机制待证；F019/F020/F008/F012/F015；SRC-008 第 27 条；归属事件 ID/报事机构/时点；无即时报事基础→NEEDS_HUMAN_DECISION 并补证；来源断开→SOURCE_UNAVAILABLE",
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
        "证明应急事件发生的基本事实、时间地点、报事渠道",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 证明车务可调资源状态/无车或时间冲突，支持是否转租赁",
      "purpose": "证明车务可调资源状态/无车或时间冲突，支持是否转租赁。持有人：车务管理/调度岗位；预约资源查询/调度意见；D·后生；C06 当需要转路由时由管理侧提供，不由申请人自证“无车”；F018/F028/F030/F032；SRC-008 第 27、39 条；归属调度窗口、车况版本；未产生不阻断 A；查无数据 SOURCE_UNAVAILABLE，矛盾 CONFLICT",
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
        "证明车务可调资源状态/无车或时间冲突，支持是否转租赁",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 单位初核或内部推荐是否存在及意见",
      "purpose": "单位初核或内部推荐是否存在及意见。持有人：有权单位/岗位；校方受管审签事件；B·条件（校方明确该节点后才可能必需）；可核实内部流转记录替代纸质盖章；F003/F011/F043；SRC-001 仅会议审定，具体环节无证；归属申请版本和签发主体；目前不设硬缺件；如声称已签而记录失联→SOURCE_UNAVAILABLE",
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
        "单位初核或内部推荐是否存在及意见",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 现行办法、细则、岗位委托及其效力",
      "purpose": "现行办法、细则、岗位委托及其效力。持有人：校方制度发布和权限管理机构；有效政策/授权配置；B/C·配置（非申请人上传）；正式发文、校务授权清单核对后配置；F022/F024；SRC-001/008/009/010；归属制度文号、生效日、适用单位、版本；缺→POLICY_UNCONFIRMED，无法读取→SOURCE_UNAVAILABLE，禁止套外校门槛",
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
        "现行办法、细则、岗位委托及其效力",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 证明学校真实准许、退回或拒绝本次用车",
      "purpose": "证明学校真实准许、退回或拒绝本次用车。持有人：现行有权许可岗位；正式意见/有审计的审批事件；C·后生；可校验的纸质原件由有权机构核真后替代线上事件；F023–F027/F039/F043；SRC-001 仅证明制度议题、权限未知；绑定申请版本、时间范围和签批主体；C 前 NOT_APPLICABLE；声称批准但查不到→SOURCE_UNAVAILABLE，未经核真不可放行",
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
        "证明学校真实准许、退回或拒绝本次用车",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 证明某车被实际调派给本任务",
      "purpose": "证明某车被实际调派给本任务。持有人：车辆调度机构；派车单或有审计的车务事件；D·后生；同一派车事件可在财务 F 阶段复用；不得要求 A 时就上传；F028/F029/F032/F042；SRC-002 第 5 页、SRC-008 第 27 条；归属决定/调派 ID、车辆、时窗、版本；D 前不适用；丢失或不可读先向车务取源，无法找回→SOURCE_UNAVAILABLE",
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
        "证明某车被实际调派给本任务",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 核车的资产有效、停驶/封存及可用状态",
      "purpose": "核车的资产有效、停驶/封存及可用状态。持有人：学校国资/车辆台账责任方；D·后生（车辆指派时管理端读取）；授权只读资产快照可替代申请上传的行驶证；F029/F030；SRC-008 第 26–31 条；归属车辆标识/查询时点/台账版本；无数据 SOURCE_UNAVAILABLE，已封存而拟派→CONFLICT",
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
        "核车的资产有效、停驶/封存及可用状态",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 核司机安排、调度窗口与同车冲突",
      "purpose": "核司机安排、调度窗口与同车冲突。持有人：调度/驾驶岗位；排班事件；D·后生；正式排班或经核真的调度记录可替代；F031/F032/F028；SRC-008 第 27 条；归属调度事件 ID/时间；未安排不强求申请人报司机姓名，安排与派车单冲突→CONFLICT",
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
        "核司机安排、调度窗口与同车冲突",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 记录实际出发、返回、路线、里程及异常",
      "purpose": "记录实际出发、返回、路线、里程及异常。持有人：车务/司机/实际执行责任方；登记表/受管行程记录；E·后生；签认的原始车辆使用登记或有权限的数据记录可替代；F033–F037；SRC-008 第 27、31 条；归属同车同趟次、记录时点/修订版本；未出车不适用，已出车无记录→SOURCE_UNAVAILABLE/按校规补记，乱码→UNREADABLE",
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
        "记录实际出发、返回、路线、里程及异常",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 明确变更内容或撤回意愿",
      "purpose": "明确变更内容或撤回意愿。持有人：有权申请/委托主体；本案变更/撤回提交事件和理由；C07/C08 触发时·当期；校方可信流程意见或纸质申请可替代；F002/F038/F039/F043；SRC-007 只证明通用系统操作，具体权限 SRC-001 待查；必须关联原版和新版本；无法对应原事项→NEEDS_MATERIAL，提交不意味着已取消，后续需核 M011/M012",
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
        "明确变更内容或撤回意愿",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 证明复核请求所指决定、理由和申请资格",
      "purpose": "证明复核请求所指决定、理由和申请资格。持有人：原责任主体/校方复核机关；复核请求与受理记录；C08 复核子情形·当期（C 后）；可核的校内申诉/复核平台记录替代；F040/F023/F024/F025；SRC-001/007，具体校规未知；归属被复核决定 ID/版本；未作决定前不要求，复核期限/机关未知→POLICY_UNCONFIRMED",
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
        "证明复核请求所指决定、理由和申请资格",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 证明社会租车另行审批/采购程序已获得合法结论",
      "purpose": "证明社会租车另行审批/采购程序已获得合法结论。持有人：采购及租赁归口机构；C06 路由后·后生/条件；已存在的可信采购合同/租车许可引用可替代；F018/F041；SRC-008 第 39 条；T04-T01–T03 需引用；未批准时不要求提交合同；若有人声称已获租赁批准而源不可核→SOURCE_UNAVAILABLE；与本案车辆调派不得混同",
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
        "证明社会租车另行审批/采购程序已获得合法结论",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 支持后续财务引用，核派车记录对应结算对象",
      "purpose": "支持后续财务引用，核派车记录对应结算对象。持有人：G07/财务；报销单与派车单关联；F·后生；财务系统已有记录时直接只读引用，不额外索取同一派车单；F042/F028/F036；SRC-002 第 5 页、SRC-013 第 3/12 页（详略异同待核）；归属外部财务单和本案调派 ID；F 前不适用；报销错案 CONFLICT，财务来源失联 SOURCE_UNAVAILABLE；是否当前必交派车单交 G07 核",
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
        "支持后续财务引用，核派车记录对应结算对象",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 具体证据",
      "purpose": "保存与指向事实冲突、疑似私用或安全异常的具体证据。持有人：发起人/发现冲突的管理系统/核查人；C10 或其他异常触发·条件；可读的冲突原件、经授权问题单、值班记录可替代；F008/F015/F017/F037/F043；SRC-008 第 27、45 条；必须保留被质疑字段及两个版本来源；无真实证据不能因 AI 怀疑创设违规事实，源缺→SOURCE_UNAVAILABLE，无法判定→NEEDS_HUMAN_DECISION",
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
        "具体证据",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "原件第 08 节审核规则",
      "description": "源自 T04-T08 原件第 08 节规则表；研究来源与案卷材料分离，未确认政策只生成语义提示或人工待办。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "案卷与当前申请版本归属",
          "requirement": "规则：R001 A–F·案卷与当前申请版本归属；列2：T：真实创建/提交事项；F：未创建事项；U：状态/版本令牌不可核；列3：SRC-007 仅技术背景；F001/F002/F021/F044，M003/M016；SYS(L1) 建案、提交、修订事件与材料目标版本一致性；按每次写入时点；列4：不能以上传时间代提交时间；有效→PASS_FACT，缺当前提交记录→NEEDS_MATERIAL，可信案卷失联→SOURCE_UNAVAILABLE，错案关联→CONFLICT；下一角色：案卷 Owner/经办人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "经办身份与责任单位",
          "requirement": "规则：R002 A/B·经办身份与责任单位；列2：T：经办/单位发起；F：非申请事件；U：可信身份状态不明；列3：SRC-001/007（无授权条款）；F003/F004/F005，M001/M003；HOST(L1) 的 actorId、组织任职/服务关系对照申请单位，锁定办理时点；列4：教师、学生、外聘身份均不自动等于许可资格；身份吻合仅 PASS_FACT，自填与 Host 异人→CONFLICT，Host 失联→SOURCE_UNAVAILABLE，校本申请人资格未知→另触发 R012；下一角色：学校身份/组织管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "代办与有效委托范围",
          "requirement": "规则：R003 A/B·代办与有效委托范围；列2：T：F005=代理/受托；F：真实本人直接经办；U：经办关系未知；列3：SRC-007/001（通用委托非专项授权）；F005/F006/F004/F043，M001/M002；比较委托人、代理人 ID、职责范围、有效起止时间和本案业务对象，L1 优先于已核 L2；列4：无委托材料→NEEDS_MATERIAL；不可读→UNREADABLE；委托范围冲突→CONFLICT；身份来源失联→SOURCE_UNAVAILABLE；是否允许此事项代办未知→POLICY_UNCONFIRMED；下一角色：委托机构/岗位授权管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "公务任务事实与主责单位",
          "requirement": "规则：R004 A/B·公务任务事实与主责单位；列2：T：非紧急常规公务；F：经证实走 C03 当下应急初报；U：任务性质未知；列3：SRC-002/008 第 27 条；F007/F008/F009/F011，M003/M004；按任务 ID、单位、日期、地点、事由对照 TASK(L1)/L2；事件时间应覆盖拟用车目的；列4：邀请函可证明事项线索而非最终任务批准；缺任务事实→NEEDS_MATERIAL，与申请冲突→CONFLICT，存在公务争议→NEEDS_HUMAN_DECISION；下一角色：任务主责单位/归口业务岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "外部任务已签决定引用",
          "requirement": "规则：R005 B/C·外部任务已签决定引用；列2：T：上游决定已产生或校本确认此节点必须先获批；F：上游尚无决定且本阶段不要求；U：上游决定存在性/前置性未知；列3：SRC-002/001；F010/F011/F041，M005/M004；向 TASK(L1) 校验决定 ID、颁发者、状态、目标、有效期与版本，不能引用文本“已同意”；列4：已产生而查不到原件→SOURCE_UNAVAILABLE；待决材料不写“通过”；决定撤销或不一致→CONFLICT；究竟应否前置不明→POLICY_UNCONFIRMED；下一角色：教学/科研/接待等上游 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "计划时段、起止地点完整及顺序",
          "requirement": "规则：R006 A/B·计划时段、起止地点完整及顺序；列2：T：申报具体用车；F：仅未提交的空草稿检查关闭；U：申请阶段不明；列3：SRC-008 第 27 条只作记录原则；F012–F015/F018/F021，M003/M006；核开始早于结束、地点可辨、时间区间按原时区；以申请当前版本为效力期；列4：跨零点/异地不按自然日误拒；常规申请缺必要时地→NEEDS_MATERIAL，OCR 不清→UNREADABLE，申请内部时间自相矛盾→CONFLICT；C03 应急预计返回时间暂不明时交人工补录，不阻断真实应急报事。本 R 不对照任务批准范围（交 R004/R008）；不设提前天数/最长时间；下一角色：经办/用车单位",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "人数、人员类别与行程范围",
          "requirement": "规则：R007 A/B·人数、人员类别与行程范围；列2：T：涉及乘车人数或特殊行程；F：任务经证实无乘车人员明细核验必要；U：人员/路线事实不足；列3：SRC-008 第 27 条；F015/F016/F017，M003/M006/M004；以当前任务范围比对人数和站点，L1/L2 优于 OCR L3；核业务所需聚合事实；列4：无校本依据不设最低人数/全员实名必报；缺本次必要人数→NEEDS_MATERIAL，跨源矛盾→CONFLICT，隐私超采→NEEDS_HUMAN_DECISION；下一角色：申请单位/数据保护责任人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r008",
          "title": "A/B/E·用途为公务还是有私用疑点",
          "requirement": "规则：R008 A/B/E·用途为公务还是有私用疑点；列2：T：事由与已知任务/路线需比对或已有异常；F：本案不涉及学校公务车辆申请；U：任务真伪/路线目的不可查；列3：SRC-008 第 27、45 条；F008/F009/F015/F017/F037，M003/M004/M020/M015；对照经证实的任务内容和异常事实，保留两方来源/时间；L1/L2 支撑事实，非关键词模型结论；列4：非公务疑点仅开人工核查，不对有争议事实自动“处罚/拒批”；明确矛盾→CONFLICT，需要判断用途合法性→NEEDS_HUMAN_DECISION，可见事实吻合→PASS_FACT；下一角色：用车许可有权岗/监督岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "A/B/C·应急事实及特殊路由",
          "requirement": "规则：R009 A/B/C·应急事实及特殊路由；列2：T：F019=true 或可信报事提示突发；F：确认一般公务；U：紧急性主张不明；列3：SRC-008 第 27 条；F019/F020/F012/F008，M003/M007/M010；比对报事时间、地点、事件 ID、责任单位和当前已形成凭证，来源 L1/L2；列4：值班初报可先进入人工应急处理；没有校本追认程序不自动许诺“先派后补”；事实缺→NEEDS_MATERIAL/急件 NEEDS_HUMAN_DECISION，校规缺→POLICY_UNCONFIRMED；下一角色：应急责任/用车许可管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "A/B/C/D·夜间、休息日、节假日的例外判断",
          "requirement": "规则：R010 A/B/C/D·夜间、休息日、节假日的例外判断；列2：T：拟出车在需例外管理的时段（按实际校本配置）；F：可信时间与已核校本规则不触发；U：校本时段定义/适用例外未知；列3：SRC-008 第 27 条；F012/F013/F019/F022/F030，M003/M007/M010/M013；先核日期与时区，法定节假日/本校值班时段以 POLICY(L0) 定义；列4：不凭通用日历或外校“周末禁止”硬判；L0 缺→POLICY_UNCONFIRMED，真实紧急性由人核→NEEDS_HUMAN_DECISION；下一角色：车辆管理与应急授权岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "跨学院/外来人员的主责单位",
          "requirement": "规则：R011 A/B·跨学院/外来人员的主责单位；列2：T：F003 与任务主办不同或同乘校外人员；F：单一责任单位无外来者；U：单位归属未知；列3：SRC-001/008；F003/F011/F016/F017/F041，M001/M003/M004/M006/M005；组织关系 HOST/TASK(L1) 与申请人声明对照，按任务时点确认唯一主责单位；列4：学生/退休或外校人员只是乘车对象不能单凭身份成为申请人；无主责单位→NEEDS_MATERIAL，两个任务归口冲突→CONFLICT；下一角色：组织任务主责单位/联合主办方",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "制度效力、审批门槛与权责配置",
          "requirement": "规则：R012 B/C·制度效力、审批门槛与权责配置；列2：T：尝试作硬性资格/期限/许可判定；F：仅记录未经裁量的事实；U：制度生效或适用性未能核实；列3：SRC-001/003/008/009/010/011/012 分级引用；F022/F024，M010/M011；仅将当前有原文且效力明确的校本 L0 绑定单位、时段、授权动作，报道/外校 L4 不能替代；列4：未有校本办法全文→POLICY_UNCONFIRMED；岗位授权已核且适用仅可 PASS_FACT 表示制度配置可核，绝非批准；下一角色：校办/制度归口、岗位授权管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "B·校本单位初核节点与意见",
          "requirement": "规则：R013 B·校本单位初核节点与意见；列2：T：有效校本流程确认需单位签署且已到节点；F：已核现行流程无此节点或尚未到；U：是否存在此环节未知；列3：SRC-001/007；F003/F011/F022/F043，M009/M010；按签发者身份与当时单位、申请版本核 L1/L2；列4：当前绝不把历史四级报销审批移植成派车初核；节点未证→POLICY_UNCONFIRMED，已要求但材料缺→NEEDS_MATERIAL，签发主体不符→CONFLICT；下一角色：真实单位审批/制度管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "C·正式用车决定真伪与决定人权限",
          "requirement": "规则：R014 C·正式用车决定真伪与决定人权限；列2：T：有人声称校方已作决定或进入真实决定阶段；F：A/B 尚无决定；U：该流程是否产生过决定未知；列3：SRC-001/008（岗位未列）、SRC-012（平台线索非授权）；F023/F024/F025/F027/F043，M011/M010；核签发事件、真实 Actor、岗位授权区间、业务关联与原始审计；DEC/HOST(L1)；列4：Renderer、签名图片、AI 文字不可当授权；决定记录失联→SOURCE_UNAVAILABLE，签发与授权不符→CONFLICT，岗位规章未知→POLICY_UNCONFIRMED，核真仅 PASS_FACT；下一角色：真实许可签批岗/授权核验人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "正式决定作用范围及当前有效性",
          "requirement": "规则：R015 C–D·正式决定作用范围及当前有效性；列2：T：有可核 M011 且拟引用为本次申请许可；F：尚无已产生决定；U：决定是否覆盖当前时地/修订未知；列3：SRC-001/008；F002/F012–F015/F023/F025/F026/F027/F043，M003/M011/M016；比较申请版本、批准时间窗、用途、附条件、撤销/变更状态，以决定当时快照为准；列4：决定若为拒绝/退回，可核验其原始结论真实但不可进入 D；过期、对象错案或新路线超范围→CONFLICT/待重批，尚未决定→NEEDS_HUMAN_DECISION；下一角色：许可原权责岗；通过不创造新批准",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "D·已授权任务与真实调派绑定",
          "requirement": "规则：R016 D·已授权任务与真实调派绑定；列2：T：真实派车或有人主张已派；F：C 尚未批准且无真实调派；U：车务记录不可知；列3：SRC-002/008/012；F023/F025/F026/F028/F029/F032，M011/M012；DEC 有效对象/时间与 DISP 事件 ID、车辆和时窗关联；电子有审计记录优先，纸件经授权核真可替代；列4：未取得有效许可但发现已出车，保存事实并交异常处理，不能事后反造决定；派车单源失联→SOURCE_UNAVAILABLE，错案绑定→CONFLICT；下一角色：车务调度+原许可岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "D·车辆资产与可使用状态",
          "requirement": "规则：R017 D·车辆资产与可使用状态；列2：T：已实际指派具体车辆；F：A–C 尚未选车；U：车辆资产状态不可取；列3：SRC-008 第 26–31 条；F029/F030/F043，M012/M013；DISP/资产(L1) 按车辆 ID、状态生效时点与预约期间核对；列4：封存/停用须报 CONFLICT，不得自行解封；台账失联→SOURCE_UNAVAILABLE，验核一致→PASS_FACT；下一角色：车辆资产 Owner/调度岗",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r018",
          "title": "D·同车预约时段重叠",
          "requirement": "规则：R018 D·同车预约时段重叠；列2：T：存在可信车辆指派与预约；F：无指派/未到 D；U：其他预约不可读取；列3：SRC-008 第 27 条；F028/F029/F032，M008/M012/M014；同车已生效预约区间求交集（终点相等不算重叠），不使用用户截图作占用事实；列4：真重叠→CONFLICT，调度源失联→SOURCE_UNAVAILABLE，冲突后的改派须实际 Owner 签发；下一角色：车务调度岗",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r019",
          "title": "D·驾驶人及排班事件一致性",
          "requirement": "规则：R019 D·驾驶人及排班事件一致性；列2：T：有实际安排且校本要求管理侧配置驾驶人；F：未到派车/安排尚未产生；U：司机配置要求或班次不明；列3：SRC-008 第 27 条；F028/F031/F032，M012/M014/M010；DISP(L1) 排班记录对照同趟次/时段、有效岗位；列4：不能向申请人催司机身份证/驾驶证复印件；若学校对司机要求未有规则→POLICY_UNCONFIRMED，记录冲突→CONFLICT，缺官方排班源→SOURCE_UNAVAILABLE；下一角色：车务/驾驶管理岗",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r020",
          "title": "E·实际出车、收车和里程原始事实",
          "requirement": "规则：R020 E·实际出车、收车和里程原始事实；列2：T：可信事件表明已发生出/收车；F：尚未出车；U：出车是否发生或登记源失联；列3：SRC-008 第 27、31 条；F028/F029/F033–F036，M012/M015；TRIP(L1)/核真L2 的实际时间、趟次、车牌、里程登记，禁止计划值填实绩；列4：已出车无实绩源→SOURCE_UNAVAILABLE（非让申请人伪造）；原件模糊→UNREADABLE；时间逆序/负里程→CONFLICT；下一角色：驾驶/车务记录岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "E·实绩与授权路线及异常对照",
          "requirement": "规则：R021 E·实绩与授权路线及异常对照；列2：T：行程已产生或存在明确异常举报；F：未出车也无真实异常；U：实绩或异常来源不明；列3：SRC-008 第 27、45 条；F015/F026/F033–F037/F043，M003/M011/M015/M020；以同版本计划、决定边界对照实际地点/时间和异常原件，不凭轨迹推定用途；列4：实绩超批准范围→CONFLICT，是否合法例外需 NEEDS_HUMAN_DECISION；来源失联先 SOURCE_UNAVAILABLE；下一角色：车务责任/原许可/监督岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "无车与社会租赁跨事项路由",
          "requirement": "规则：R022 B/D·无车与社会租赁跨事项路由；列2：T：申请转社会租赁或管理侧有真实无车结论；F：保持校方保留车需求，未申请租赁；U：车况平台不可读或需求类型未知；列3：SRC-008 第 39 条、SRC-002 仅后续报销；F018/F028/F030/F032/F041，M003/M008/M018/M005；只核 DISP(L1) 资源状态与相邻采购/租车决定引用，按实际产生时点；列4：平台失联不等于无车；合同、招采、费用由相邻 T04/G07 决定；材料尚未生成→NOT_APPLICABLE，无权源→SOURCE_UNAVAILABLE，待路线决策→NEEDS_HUMAN_DECISION；下一角色：车辆管理/采购 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "任意阶段·申请变更与受影响结论失效",
          "requirement": "规则：R023 任意阶段·申请变更与受影响结论失效；列2：T：真实提交 M016 改任务/时段/地点等；F：版本未变；U：新旧版本/变更权限不可核；列3：SRC-001/007（具体流程未证）；F001/F002/F012–F018/F026/F038/F043，M003/M004/M005/M006/M011/M012/M016；计算同源旧新字段差异，并沿依赖图将受影响 R 标 STALE，原批准范围不随版本扩张；列4：变更事实已核可 PASS_FACT（仅提交事件）；有效校本重批规则未知由 R012 另报 POLICY_UNCONFIRMED，版本互斥→CONFLICT；下一角色：原申请单位、许可/调度 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "C08·撤回意愿、撤回效力与取消调度",
          "requirement": "规则：R024 C08·撤回意愿、撤回效力与取消调度；列2：T：真实 M016 撤回请求；F：没有撤回；U：提出者或处理状态不明；列3：SRC-007/001/008；F001/F002/F028/F033/F038/F039/F043，M001/M002/M011/M012/M015/M016；校验申请人授权及撤回请求→正式受理/撤销决定→调度取消是否生效的事件链；列4：撤回申请≠撤销已有许可/取消派车；已出车记录永不删除；缺当前受理记录→NEEDS_HUMAN_DECISION 或 SOURCE_UNAVAILABLE，流程权限未知→POLICY_UNCONFIRMED；下一角色：原有权许可与调度岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "C08·复核申请对原决定的绑定",
          "requirement": "规则：R025 C08·复核申请对原决定的绑定；列2：T：收到真实复核请求 M017；F：无复核或原决定尚不存在；U：申请人/可复核范围/时效未知；列3：SRC-001/007 仅一般线索；F023–F025/F040/F043，M001/M002/M011/M017/M010；核请求主体、被复核决定 ID、版本及理由；不靠职务称谓推定复核权限；列4：校本复核机关/期限未证→POLICY_UNCONFIRMED，旧决定引用错案→CONFLICT；复核请求不自动撤销原决定；下一角色：校方确认的复核受理/决定岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "F·财务引用派车事实（只读）",
          "requirement": "规则：R026 F·财务引用派车事实（只读）；列2：T：确有下游报销/监督取证；F：未发生后续结算；U：财务单关联未知；列3：SRC-002 第 5 页与 SRC-013 第 3/12 页；F028/F036/F042，M012/M015/M019；用原调派 ID、趟次、出车实绩连接 FIN(L1)，财务只消费事实，不反写许可；两份 2025-04 财务手册的清单详略须由 G07 确认；列4：科研野外租车不再因报销普遍索要司机身份证/驾驶证等复印件〔SRC-002/013〕；错案关联→CONFLICT，财务源失联→SOURCE_UNAVAILABLE，派车单是否目前必交→POLICY_UNCONFIRMED（在 G07 范围内）；下一角色：G07/财务 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "证据归属、原件指纹和版本可信性",
          "requirement": "规则：R027 A–F·证据归属、原件指纹和版本可信性；列2：T：任何 M 被采集、补交、替换；F：没有本事项证据输入；U：原件目标或版本无法辨识；列3：SRC-001/007（校本具体存储规则待定）；F001/F002/F038/F043/F044，M001–M020；核原件所有者、签发者、目标申请及 sourceVersion/fingerprint、页码/字段位置，只有明确替代关系才使旧版本不再当前有效；列4：同名文件非同一版本；错案混料→CONFLICT，已存在但无法读取→UNREADABLE，可信源消失→SOURCE_UNAVAILABLE；下一角色：案卷 Owner/证据持有人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "A·误将校园车辆通行许可作为公车派遣",
          "requirement": "规则：R028 A·误将校园车辆通行许可作为公车派遣；列2：T：提交校园通行年卡/因公进校通行证作“公车许可”；F：确实属于公车调派；U：材料目的混淆；列3：SRC-006/007，F008/F018/F023/F028，M003/M011/M012；比对事项名称、签发目的、对象类型/车牌，校内 通行 不等于 调派；列4：错路由→NEEDS_HUMAN_DECISION/提示正确主管业务，不能创建用车批准；来源失联→SOURCE_UNAVAILABLE；下一角色：申请人、车务与校园通行管理责任人",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "A",
      "name": "申请草拟",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "B",
      "workflowOwner": "local"
    },
    {
      "id": "B",
      "name": "任务与单位初核",
      "kind": "auto-check",
      "executorRole": "reviewer",
      "nextStageId": "C",
      "returnToStageId": "A",
      "workflowOwner": "local"
    },
    {
      "id": "C",
      "name": "校方用车决定（仅记录真实授权决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "D",
      "returnToStageId": "B",
      "workflowOwner": "local"
    },
    {
      "id": "D",
      "name": "调派与出车前（仅在有效授权成立后）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "E",
      "returnToStageId": "C",
      "workflowOwner": "local"
    },
    {
      "id": "E",
      "name": "出车与收车（记录真实行程和差异）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "F",
      "returnToStageId": "D",
      "workflowOwner": "local"
    },
    {
      "id": "F",
      "name": "报销/监督引用（只读记录；不代审结算）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "E",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-results",
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
      "id": "dispatch-record-reference",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "version-and-review-history",
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
  "templateId": "T04-T08",
  "name": "部门公务用车调派及公车使用资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T08.md",
  "sourceDocumentSha256": "a991eae590d4dfe2ceba8691b426b5470a5712ab6b8e09ff73b922f4c98b23a3",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T04-T08.md",
  "researchOriginalBlobSha1": "84ab28f3537c72890fb38f607fb023daf0712d18",
  "manifestBytes": 149688,
  "manifestSha256": "a991eae590d4dfe2ceba8691b426b5470a5712ab6b8e09ff73b922f4c98b23a3",
  "manifestSourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "researchAsOf": "2026-10-23",
  "officialSchoolTemplate": false,
  "researchStatus": "REVIEWED_WITH_INTEGRATION_GUARD_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "sourceHashNormalization": "Reviewed copy is the current research blob plus one LF to match the manifest; the research-original blob is unchanged.",
  "fields": [
    {
      "fieldId": "F001",
      "key": "requestId",
      "sourceLabel": "requestId 字符串｜U·A 起",
      "scope": "case"
    },
    {
      "fieldId": "F002",
      "key": "requestRevision",
      "sourceLabel": "requestRevision 正整数｜U·A 起/变更",
      "scope": "subject"
    },
    {
      "fieldId": "F003",
      "key": "applicantUnitId",
      "sourceLabel": "applicantUnitId 机构 ID｜A·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F004",
      "key": "initiatorActorId",
      "sourceLabel": "initiatorActorId 主体 ID｜A·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F005",
      "key": "initiatorRelation",
      "sourceLabel": "initiatorRelation 枚举（本人/经办/代理/未知）｜A·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F006",
      "key": "delegationRef",
      "sourceLabel": "delegationRef 可空引用｜A·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F007",
      "key": "dutyTaskId",
      "sourceLabel": "dutyTaskId 可空业务 ID｜T·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F008",
      "key": "dutyDescription",
      "sourceLabel": "dutyDescription 文本｜T·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F009",
      "key": "dutyCategory",
      "sourceLabel": "dutyCategory 枚举（行政/教学/科研/应急/接待/其他/未知）｜T·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F010",
      "key": "dutyAuthorizationStatus",
      "sourceLabel": "dutyAuthorizationStatus 枚举+版本｜T·B/C",
      "scope": "subject"
    },
    {
      "fieldId": "F011",
      "key": "dutyResponsibleUnitId",
      "sourceLabel": "dutyResponsibleUnitId 机构 ID｜T·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F012",
      "key": "plannedDepartureAt",
      "sourceLabel": "plannedDepartureAt 带时区时间｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F013",
      "key": "plannedReturnAt",
      "sourceLabel": "plannedReturnAt 带时区时间｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F014",
      "key": "plannedOrigin",
      "sourceLabel": "plannedOrigin 地点文本/代码｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F015",
      "key": "plannedStops",
      "sourceLabel": "plannedStops 有序地点列表｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F016",
      "key": "expectedPassengerCount",
      "sourceLabel": "expectedPassengerCount 非负整数｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F017",
      "key": "passengerGroupType",
      "sourceLabel": "passengerGroupType 受限枚举/聚合｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F018",
      "key": "vehicleMode",
      "sourceLabel": "vehicleMode 枚举（校有/社会租赁/待定）｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F019",
      "key": "emergencyClaim",
      "sourceLabel": "emergencyClaim 布尔/未知｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F020",
      "key": "incidentEvidenceRef",
      "sourceLabel": "incidentEvidenceRef 引用｜T·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F021",
      "key": "submittedAt",
      "sourceLabel": "submittedAt 时间｜U·A/B",
      "scope": "subject"
    },
    {
      "fieldId": "F022",
      "key": "policyVersionRef",
      "sourceLabel": "policyVersionRef 版本/效力枚举｜V·B/C",
      "scope": "subject"
    },
    {
      "fieldId": "F023",
      "key": "useDecisionId",
      "sourceLabel": "useDecisionId 引用｜D·C 起",
      "scope": "subject"
    },
    {
      "fieldId": "F024",
      "key": "decisionActorId",
      "sourceLabel": "decisionActorId 主体/机构授权引用｜D·C 起",
      "scope": "subject"
    },
    {
      "fieldId": "F025",
      "key": "decisionDisposition",
      "sourceLabel": "decisionDisposition 枚举+意见｜D·C 起",
      "scope": "subject"
    },
    {
      "fieldId": "F026",
      "key": "decisionScope",
      "sourceLabel": "decisionScope 对象/时地/版本范围｜D·C 起",
      "scope": "subject"
    },
    {
      "fieldId": "F027",
      "key": "decisionAt",
      "sourceLabel": "decisionAt 可信时间｜D·C 起",
      "scope": "subject"
    },
    {
      "fieldId": "F028",
      "key": "dispatchId",
      "sourceLabel": "dispatchId 调派事件 ID｜P·D 起",
      "scope": "subject"
    },
    {
      "fieldId": "F029",
      "key": "vehicleAssetId",
      "sourceLabel": "vehicleAssetId 车辆 ID/车牌引用｜P·D 起",
      "scope": "subject"
    },
    {
      "fieldId": "F030",
      "key": "vehicleOperationalState",
      "sourceLabel": "vehicleOperationalState 枚举/时间戳｜P·D 起",
      "scope": "subject"
    },
    {
      "fieldId": "F031",
      "key": "assignedDriverId",
      "sourceLabel": "assignedDriverId 受控主体引用｜P·D 起",
      "scope": "subject"
    },
    {
      "fieldId": "F032",
      "key": "dispatchReservedWindow",
      "sourceLabel": "dispatchReservedWindow 时间区间｜P·D 起",
      "scope": "subject"
    },
    {
      "fieldId": "F033",
      "key": "actualDepartureAt",
      "sourceLabel": "actualDepartureAt 时间｜E·E 起",
      "scope": "subject"
    },
    {
      "fieldId": "F034",
      "key": "actualReturnAt",
      "sourceLabel": "actualReturnAt 时间｜E·E 起",
      "scope": "subject"
    },
    {
      "fieldId": "F035",
      "key": "actualStops",
      "sourceLabel": "actualStops 受限路线/地点｜E·E 起",
      "scope": "subject"
    },
    {
      "fieldId": "F036",
      "key": "actualMileage",
      "sourceLabel": "actualMileage 非负数+单位｜E·E 起",
      "scope": "subject"
    },
    {
      "fieldId": "F037",
      "key": "tripAnomalyRef",
      "sourceLabel": "tripAnomalyRef 事件引用｜E·E 起",
      "scope": "subject"
    },
    {
      "fieldId": "F038",
      "key": "changeRequestId",
      "sourceLabel": "changeRequestId 版本关联｜C·触发时",
      "scope": "case"
    },
    {
      "fieldId": "F039",
      "key": "withdrawalDisposition",
      "sourceLabel": "withdrawalDisposition 状态+时间｜C·撤回时",
      "scope": "subject"
    },
    {
      "fieldId": "F040",
      "key": "reviewRequestId",
      "sourceLabel": "reviewRequestId 引用/状态｜C·复核时",
      "scope": "subject"
    },
    {
      "fieldId": "F041",
      "key": "upstreamDecisionRef",
      "sourceLabel": "upstreamDecisionRef 业务决定引用｜X·B/C",
      "scope": "subject"
    },
    {
      "fieldId": "F042",
      "key": "financeReferenceId",
      "sourceLabel": "financeReferenceId 只读引用｜X·F",
      "scope": "subject"
    },
    {
      "fieldId": "F043",
      "key": "sourceVersionFingerprint",
      "sourceLabel": "sourceVersionFingerprint 哈希/版本令牌｜V·所有阶段",
      "scope": "subject"
    },
    {
      "fieldId": "F044",
      "key": "caseLifecycleState",
      "sourceLabel": "caseLifecycleState 阶段枚举｜U·所有阶段",
      "scope": "case"
    }
  ],
  "materials": [
    {
      "materialId": "M001",
      "name": "M001 证明申请主体与校内责任单位、经办授权的真实身份"
    },
    {
      "materialId": "M002",
      "name": "M002 证明某经办人受单位授权，或代理范围"
    },
    {
      "materialId": "M003",
      "name": "M003 非声称学校存在特定正式表单"
    },
    {
      "materialId": "M004",
      "name": "M004 证明公务任务的内容、背景及主责单位"
    },
    {
      "materialId": "M005",
      "name": "M005 核对另一归口事项已生效的真实批准，防止越权重复裁定"
    },
    {
      "materialId": "M006",
      "name": "M006 证明联合团队/特殊行程的人数、站点与任务范围"
    },
    {
      "materialId": "M007",
      "name": "M007 证明应急事件发生的基本事实、时间地点、报事渠道"
    },
    {
      "materialId": "M008",
      "name": "M008 证明车务可调资源状态/无车或时间冲突，支持是否转租赁"
    },
    {
      "materialId": "M009",
      "name": "M009 单位初核或内部推荐是否存在及意见"
    },
    {
      "materialId": "M010",
      "name": "M010 现行办法、细则、岗位委托及其效力"
    },
    {
      "materialId": "M011",
      "name": "M011 证明学校真实准许、退回或拒绝本次用车"
    },
    {
      "materialId": "M012",
      "name": "M012 证明某车被实际调派给本任务"
    },
    {
      "materialId": "M013",
      "name": "M013 核车的资产有效、停驶/封存及可用状态"
    },
    {
      "materialId": "M014",
      "name": "M014 核司机安排、调度窗口与同车冲突"
    },
    {
      "materialId": "M015",
      "name": "M015 记录实际出发、返回、路线、里程及异常"
    },
    {
      "materialId": "M016",
      "name": "M016 明确变更内容或撤回意愿"
    },
    {
      "materialId": "M017",
      "name": "M017 证明复核请求所指决定、理由和申请资格"
    },
    {
      "materialId": "M018",
      "name": "M018 证明社会租车另行审批/采购程序已获得合法结论"
    },
    {
      "materialId": "M019",
      "name": "M019 支持后续财务引用，核派车记录对应结算对象"
    },
    {
      "materialId": "M020",
      "name": "M020 具体证据"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "成都理工大学校长办公室，《校长办公会通报｜校长办公会纪要〔2024〕1号》；学校 PDF",
      "url": "https://dbxb.cdut.edu.cn/__local/B/A0/BE/AEE3FE9DF44A4382326CAC4E5CA_2979B53E_154C3.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-002",
      "title": "成都理工大学财务处（采购与招标管理中心），《成都理工大学“只跑一次”财务事项清单》；学校 PDF",
      "url": "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-003",
      "title": "成都理工大学后勤保障部，《部门简介》；官网",
      "url": "https://clhq.cdut.edu.cn/bmgk/bmjj.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-004",
      "title": "成都理工大学新闻网/宣传部，《拉开“大总务”改革帷幕，贡献新后勤保障力量》；学校新闻网",
      "url": "https://news.cdut.edu.cn/info/1083/36185.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-005",
      "title": "成都理工大学财务处，《关于编制2022年校级预算和2022—2024年预算规划的通知》；学校财务处",
      "url": "https://jcc.cdut.edu.cn/info/1012/1274.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-006",
      "title": "成都理工大学党委保卫部（保卫处），《关于校园机动车注册管理工作的通知》；学校保卫处",
      "url": "https://bwc.cdut.edu.cn/info/1033/2244.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-007",
      "title": "成都理工大学砚湖易办，《砚湖易办 2.0 使用说明》；学校 PDF",
      "url": "https://bsdt.cdut.edu.cn/EIP/%E7%A0%9A%E6%B9%96%E6%98%93%E5%8A%9E2.0%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-008",
      "title": "四川省机关事务管理局、四川省财政厅，《四川省省属事业单位公务用车管理暂行办法》（川机管发〔2024〕123号）；省属高校转载原文 PDF；国家机关事务管理局印发消息",
      "url": "https://xb.sasu.edu.cn/__local/E/38/6C/4C43F07AED74154B5752FABA64C_3056026A_1183A5.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-009",
      "title": "国家机关事务管理局，《四川：印发〈四川省省属事业单位公务用车管理暂行办法〉》；国家机关事务管理局",
      "url": "https://www.ggj.gov.cn/xwzx/dfjgswdt/202408/t20240807_46353.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-010",
      "title": "中共中央办公厅、国务院办公厅，《党政机关公务用车管理办法》（中办发〔2017〕71号），国家机关事务管理局公开；国管局",
      "url": "https://www.ggj.gov.cn/zcfg/flfg/202201/t20220126_34481.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-011",
      "title": "四川工商职业技术学院，《公务用车管理办法》（2025 年修订）；该校官网",
      "url": "https://www.sctbc.net/info/1028/19623.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-012",
      "title": "四川在线记者采访四川省机关事务管理局，《纸质派单将成历史！四川推动省属事业单位公务用车信息化管理》；报道原文",
      "url": "https://sichuan.scol.com.cn/ggxw/202601/83187792.html",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-013",
      "title": "成都理工大学财务处（采购与招标管理中心），《成都理工大学财务报销应知应会手册》；学校 PDF",
      "url": "https://jcc.cdut.edu.cn/__local/D/23/C5/05E72CFA4532D2A2946EBEBE258_FFC48E39_8EEE3.pdf",
      "evidenceStatus": "PARTIAL"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "r001",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r003",
      "srcIds": [
        "SRC-007",
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r004",
      "srcIds": [
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r005",
      "srcIds": [
        "SRC-002",
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r006",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r007",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r008",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r009",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r010",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r016",
      "srcIds": [
        "SRC-002",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r017",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r018",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r019",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r020",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r021",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r022",
      "srcIds": [
        "SRC-008",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r024",
      "srcIds": [
        "SRC-007",
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r026",
      "srcIds": [
        "SRC-002",
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
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r028",
      "srcIds": [
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    }
  ],
  "sourceStages": [
    {
      "id": "A",
      "name": "申请草拟",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "B",
      "name": "任务与单位初核",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "C",
      "name": "校方用车决定",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "D",
      "name": "调派与出车前",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "E",
      "name": "出车与收车",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "F",
      "name": "报销/监督引用",
      "sourceSection": "03.1",
      "mainline": true
    }
  ],
  "sourceBranches": [
    {
      "id": "WAIT_MATERIAL",
      "sourceSection": "11.1",
      "meaning": "仅当前阶段缺失的必需材料待补"
    },
    {
      "id": "WAIT_SOURCE",
      "sourceSection": "11.1",
      "meaning": "可信来源暂不可用，交来源 Owner 核验"
    },
    {
      "id": "WAIT_POLICY",
      "sourceSection": "11.1",
      "meaning": "校本政策/授权待确认"
    },
    {
      "id": "WAIT_HUMAN",
      "sourceSection": "11.1",
      "meaning": "必要性、例外、疑似私用或复核交人工裁量"
    },
    {
      "id": "WITHDRAW_REQUESTED",
      "sourceSection": "11.1",
      "meaning": "撤回请求本身不等于许可或调度取消"
    },
    {
      "id": "REVIEW_REQUESTED",
      "sourceSection": "11.1",
      "meaning": "复核请求本身不使原决定失效"
    }
  ],
  "stageModelNote": "TemplateVersion.stages 映射原件 §03.1 A–F 主线。§11.1 的 WAIT_*、撤回/复核请求和异常状态作为规则驱动分支保存在 r02Metadata.sourceBranches；不得串成所有案件必经阶段。C 只记录真实授权岗位的决定，D 只在授权有效后记录调派，F 只读财务/监督证据，不派车、不回写学校系统。",
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "仅指定对象的可核事实一致；不批准也不拒绝派车。"
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "触发条件可信为假，或后续阶段材料尚未形成；须留理由。"
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "当前阶段确需且合法持有人可提供的事实证据缺失。"
    },
    {
      "code": "CONFLICT",
      "meaning": "同目标有效材料/版本/身份/时间/车辆出现互斥事实主张。"
    },
    {
      "code": "UNREADABLE",
      "meaning": "已存在材料无法可靠提取指定字段。"
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "外部可信源/接口/归档暂不可获取或核验。"
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "校本规则有效版本、授权角色、硬阈值、例外或复核程序未确认。"
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "疑似非公务、紧急优先、许可、核查或复核涉及行政裁量。"
    }
  ],
  "outputContract": [
    {
      "id": "fact-results",
      "sourceType": "resultCode/targetKey/trigger T-F-U",
      "sourceSection": "10.1/10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-issues",
      "sourceType": "issueId/affectedF/affectedM/conflictingValues",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-todos",
      "sourceType": "todoId/blockingReason/nextOwnerRole",
      "sourceSection": "10.2",
      "runtimeKind": "supplement-list",
      "audience": "teacher"
    },
    {
      "id": "dispatch-record-reference",
      "sourceType": "M011/M012/M013/M014 true dispatch records",
      "sourceSection": "03.1/10.2/11.1",
      "runtimeKind": "item-feedback",
      "audience": "teacher",
      "readOnly": true
    },
    {
      "id": "version-and-review-history",
      "sourceType": "M016/M017/supersedes/previous result",
      "sourceSection": "10.2/11.1",
      "runtimeKind": "item-feedback",
      "audience": "reviewer",
      "readOnly": true
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
