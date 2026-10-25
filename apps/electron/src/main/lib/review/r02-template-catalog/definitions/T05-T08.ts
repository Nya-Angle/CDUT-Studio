import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T05-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "教师教学工作量核算、异议和复核审核",
  "description": "本地研究模板 · 非校方正式模板。成都理工大学教师课程与相关教学工作量的核算事实、记录差异、异议材料与复核前置核验；本科、研究生课程、宜宾校区及不同学期作为同一模板办理情形；导师指导工作量及培养职责独立认定路由 T06-T05；不作绩效认定、薪酬审批或排课变更决定。政策证据状态为 PARTIAL；仅用于本地事实预审与问题提示，不代表校方授权，不生成学校远端回写或正式批准。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T05-T08 来自 R02 research-original；非校方正式模板，校内授权和现行政策尚未全部确认；SRC IDs 仅为研究来源，不是案卷 SourceRef。",
  "objectType": "person",
  "displayName": {
    "template": "T05-T08 · 教师教学工作量核算、异议和复核审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "caseId string / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0 起全程；业务主端生成；案卷持久 ID；SEC1；不得凭文件名生成正式案卷；建案失败阻断"
    },
    {
      "key": "F002",
      "label": "scenarioCode enum A–H / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0 或 P2；由已核事实路由，M010#requestType 可提出主张；SEC1；未定时保留待分流，不默认为 A"
    },
    {
      "key": "F003",
      "label": "stage enum P0–P6 / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "全程；服务端状态与有效事件记录；SEC1；状态未知暂停写决议/撤回"
    },
    {
      "key": "F004",
      "label": "teacherUid string / TeacherSubject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P2；SYS 人事/校方身份唯一号；M001#uid；SEC2；没有可信唯一标识不得用同名合并；CONFLICT"
    },
    {
      "key": "F005",
      "label": "teacherDisplayName string / TeacherSubject",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "P0/P2；M001#name；USR 姓名仅显示差异；SEC2；姓名不符触发权威身份核对，不强制身份证扫描件"
    },
    {
      "key": "F006",
      "label": "employmentUnitAndStatus structured / TeacherSubject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P3；SYS 人事处岗位与单位历史；M001#unit,status,effectiveAt；SEC3；无法取到标 SOURCE_UNAVAILABLE；不按空值拒认实际授课"
    },
    {
      "key": "F007",
      "label": "requestActorIdRole structured / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "P2/P4/P5；可信会话、岗位权限；M002#actor,authAt；SEC3；Renderer 字段一律无效；认证缺失不执行动作"
    },
    {
      "key": "F008",
      "label": "proxyAuthority structured/null / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "代理条件出现时；M002#delegation,scope,validity 经校方确认；SEC3；未确认不得代提交/撤回/签决，转人审"
    },
    {
      "key": "F009",
      "label": "dataDomain enum UG/PG/other / WorkloadLine",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0/P3；M004/M008 业务源标识；SRC-001 第七条；SEC1；不明则分域待办；“导师指导”转 T06-T05"
    },
    {
      "key": "F010",
      "label": "accountPeriod academicYear+term/range / WorkloadPeriod",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0 起；M003#period 或 M004#term；期间版本；SEC1；原始期间缺失需补权威记录，不按当前学期推算"
    },
    {
      "key": "F011",
      "label": "batchIdNoticeCutoff structured/null / WorkloadPeriod",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "有当期批次时；M003#noticeId,cutoff; 截止只能来自当期有效通知；SEC1；未公布或未取到为“未知”，不擅自判断逾期"
    },
    {
      "key": "F012",
      "label": "campusSite enum/str / WorkloadPeriod",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P3；M004#campus、校区有权人员核对；SEC1；本部/宜宾不明确时发跨单位待办"
    },
    {
      "key": "F013",
      "label": "taskId string / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P3；M004#taskId@version 官方任务记录；SEC1；无任务标识可用组合键暂定位，但不能自动定论"
    },
    {
      "key": "F014",
      "label": "courseClassComponent structured / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P3；M004#course,class,teachingType；SEC1；班级/环节不明不得串联不同课程"
    },
    {
      "key": "F015",
      "label": "taskOwnerUnit string / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P3；M004#issuingUnit 与 M001#unit 分存；SEC1；两单位不一致标跨部门核验，不随意择一"
    },
    {
      "key": "F016",
      "label": "taskVersionApprovedAt structured / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0/P3；M004#version,approvedAt（签批真实性待验）；SEC1；多版并存则 CONFLICT，先判有效期间"
    },
    {
      "key": "F017",
      "label": "teacherShareAllocation list teacherUid→plannedHours / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "合授 C 或分配争议时；M004#teacherShares；必要时 M015 归属会商；SEC2；一人申报不能重写他人份额，冲突转主管部门"
    },
    {
      "key": "F018",
      "label": "scheduledSessions list / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "课表差异时；M005#timetableEntry@version，2025 学期见 SRC-005；SEC1；课表不能证明实际授课，缺失先查源"
    },
    {
      "key": "F019",
      "label": "changeApprovalRef structured/null / TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "E 或发生变更时；M007#decisionId,actor,validAt；SEC2；无批准材料不能自动判“有效/无效”，转 T01 与人审"
    },
    {
      "key": "F020",
      "label": "deliveredTeachingEvidence references + rawUnits / WorkloadLine",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1/P3；M006#lessonLog,attendance,unit，须核来源；SEC2；实施证明无或不可读分别标缺证/不可读"
    },
    {
      "key": "F021",
      "label": "calcLineIdVersion string+version / WorkloadLine",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1/P2；M008#lineId@sourceVersion；SEC2；未形成初算时 A 不要求；B/H 无法定位则待补"
    },
    {
      "key": "F022",
      "label": "recordedAmountUnitBreakdown decimal+unit+items / WorkloadLine",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1/P2；M008#recordedValue,unit,components；非 AI 计算；SEC2；未见原口径不能从排课数填定值；POLICY_UNCONFIRMED"
    },
    {
      "key": "F023",
      "label": "policyIdVersionValidity structured/null / PolicySnapshot",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "准备计算或 P3–P5；M009#docNo,clauses,validRange，校本原件；SEC1；当期依据未取得，不自动乘系数或判逾期"
    },
    {
      "key": "F024",
      "label": "sourceProvenance structured / SourceProvenance",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "每次读取/更新；M001/M004/M008/M018#sourceSystem,recordId,version,readAt,hash；SEC2；不留源版本不得形成肯定结论；失联 SOURCE_UNAVAILABLE"
    },
    {
      "key": "F025",
      "label": "disputedLineAndIssueType ID+enum / DisputeItem",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B/E/F/H、C/D 争议时；M010#lineId,issueType 由 USR 提出并核对 F021；SEC2；无目标条目请澄清，不能重算整学年"
    },
    {
      "key": "F026",
      "label": "claimedValueAndDelta optional decimal/unit / DisputeItem",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "金额或学时差额主张时；M010#claimedValue,unit；系统可显示算术差但非认定；SEC2；教师可只主张漏记事实；无现行系数则不强制填"
    },
    {
      "key": "F027",
      "label": "disputeReason string / DisputeItem",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P2/P6；M010#reason，USR 声明；SEC3；缺失具体争点时 NEEDS_MATERIAL，要求最小澄清"
    },
    {
      "key": "F028",
      "label": "claimEvidenceRefs list / DisputeItem",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "条件补证 P2/P3；M011#items 附件逐条归属和 OCR 页位；SEC3；已有官方数据先引用；不可读 UNREADABLE"
    },
    {
      "key": "F029",
      "label": "noticeOrReceiptAt timestamp+channel/null / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "如判断时限需要；M003/M013#sentAt,receivedAt,proof；SEC2；无正式规则不可算逾期，不用上传日代替送达日"
    },
    {
      "key": "F030",
      "label": "materialAvailability enum+reason / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0–P6；每 M 槽的 readable/source/missing 状态；SEC1；区分 NEEDS_MATERIAL、UNREADABLE、SOURCE_UNAVAILABLE"
    },
    {
      "key": "F031",
      "label": "sourceConflictItems list / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "C/D/E/F/P3；M004/M006/M008/M015/M016 逐项源比较；SEC2；保留矛盾两边版本并阻断通过；CONFLICT"
    },
    {
      "key": "F032",
      "label": "withdrawalIntent actor+scope+at/null / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "G、P4；M014#request,scope + M002 可信本人/代理；SEC3；权限/窗口未知仅记意向，不自动终止已有决定"
    },
    {
      "key": "F033",
      "label": "priorDecisionRef string+version / AuthorityDecision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "F 有旧决定或 H；M012#decisionId,version,issuer；SEC2；H 无前次决定不能作为“复核”，需更正路由"
    },
    {
      "key": "F034",
      "label": "priorDecisionServiceProof structured/null / AuthorityDecision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "H 时限判定条件；M013#deliveredAt,recipient,method；SEC3；送达缺失不得推定已逾期；由主管部门确认"
    },
    {
      "key": "F035",
      "label": "newFormalDecision structured/null / AuthorityDecision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P5/P6 决定后；M017#decision,issuer,actor,signature,at 经可信校验；SEC3；未产生绝不是初审缺件；没有授权不得伪造"
    },
    {
      "key": "F036",
      "label": "revisedSourceVersion id+hash/null / SourceRevision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "有权更正后；M018#oldVersion,newVersion,updater,at；SEC2；未更正不要求；决定存在而源未更新产生待办"
    },
    {
      "key": "F037",
      "label": "relatedAuthorityDecisionRef structured/null / ExternalDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "引用 G50/S/T 或外部门结论时；M012/M016#templateId,decisionId,version,issuer；SEC2；不能引用候选技术结论作官方审批；缺引用待源证"
    },
    {
      "key": "F038",
      "label": "roleAuthorizationSnapshot structured / ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P2–P6 有权限动作时；M002/M017#role,scope,issuer,validAt 可信主端；SEC3；权限未验即 NEEDS_HUMAN_DECISION；不可从附件正文提升权限"
    },
    {
      "key": "F039",
      "label": "disclosureOrNoticeRef {noticeId,version,publishedAt,recipientScope,channel}/ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1 告知确已发生、P2 须判是否知悉时；M019#snapshot,deliveryAudit 校方业务源；仅打印列表不能证明本人送达；SEC2；未公示/未接入不伪称已通知；若未证期限规则，则仅登记事实 POLICY_UNCONFIRMED"
    },
    {
      "key": "F040",
      "label": "objectionReceiptRef {requestId,submittedAt,acceptedAt?,channel,status}/ReviewActivity",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P2 提交/官方受理后；教师提交日志 M010 与校方确认回执 M020 分开；可信平台时间；SEC2；只有提交日志则不能自动标为校方受理；尚未生成正式回执为 LT 而非教师缺件"
    },
    {
      "key": "F041",
      "label": "teachingComponentKind enum theory,experiment,practice,thesis,examDuty,other,unknown / WorkloadLine",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1/P3 分类或重复核算争议时；M004#component + M006#actualActivity + M008#lineCategory 按校本权威源对照；SEC1；类别不一致 CONFLICT；具体类别应否采计、是否合并一律 POLICY_UNCONFIRMED"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "教师唯一身份、所属单位与在岗历史",
      "purpose": "教师唯一身份、所属单位与在岗历史；人事部门 SYS/OFF 教职工记录，不默认索取身份证照；人事部门带唯一号的认证结果/岗位历史摘要；F004–F006,F024；SRC-001 第七、十条；教师 UID+有效期间+来源版本；失联 SOURCE_UNAVAILABLE，同名不符 CONFLICT。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "教师唯一身份、所属单位与在岗历史",
        "人事部门 SYS/OFF 教职工记录，不默认索取身份证照",
        "人事部门带唯一号的认证结果/岗位历史摘要",
        "F004–F006,F024",
        "SRC-001 第七、十条"
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
      "id": "M002",
      "name": "发起人真实会话、岗位授权及代理权",
      "purpose": "发起人真实会话、岗位授权及代理权；学校认证/授权系统 SYS，必要时经有权人核验的委托 OFF；经校方认可的可信代理/任职授权记录；F007,F008,F032,F038；SRC-001 第十七、二十一条；绑定 actor、被代理教师、动作范围及有效期；不可读 UNREADABLE、未授权停止动作。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "发起人真实会话、岗位授权及代理权",
        "学校认证/授权系统 SYS，必要时经有权人核验的委托 OFF",
        "经校方认可的可信代理/任职授权记录",
        "F007,F008,F032,F038",
        "SRC-001 第十七、二十一条"
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
      "name": "证明核算学期/批次、公开节点与截止",
      "purpose": "证明核算学期/批次、公开节点与截止；教学主管 OFF 当期通知；校方正式发文系统记录/当期业务公告；F010,F011,F029；SRC-005 仅示范教学任务学期，非统一异议期限；批次文号+所适用期间；无核算通知不设截止，POLICY_UNCONFIRMED。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明核算学期/批次、公开节点与截止",
        "教学主管 OFF 当期通知",
        "校方正式发文系统记录/当期业务公告",
        "F010,F011,F029",
        "SRC-005 仅示范教学任务学期，非统一异议期限"
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
      "name": "原始课程教学任务、主讲人、合授学时分配",
      "purpose": "原始课程教学任务、主讲人、合授学时分配；学院/教务/研究生教学主管 SYS/OFF；该部门签认的教学任务清单、含版本的正式系统摘录；F009,F012–F017,F024；SRC-002、005；按课程/班级/教师/学期归属；多版本保留而不按上传日覆盖；失联 SOURCE_UNAVAILABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "原始课程教学任务、主讲人、合授学时分配",
        "学院/教务/研究生教学主管 SYS/OFF",
        "该部门签认的教学任务清单、含版本的正式系统摘录",
        "F009,F012–F017,F024",
        "SRC-002、005"
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
      "name": "说明排定节次/场地",
      "purpose": "说明排定节次/场地；教学运行部门 SYS/OFF 课表快照；带正式版本和有效日期的课表/调整记录；F014,F018,F024；SRC-005；课表版本及授课教师关联；不能替代实际教学 M006；不可读 UNREADABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "说明排定节次/场地",
        "教学运行部门 SYS/OFF 课表快照",
        "带正式版本和有效日期的课表/调整记录",
        "F014,F018,F024",
        "SRC-005"
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
      "name": "证明实际授课、实践活动或指导活动发生",
      "purpose": "证明实际授课、实践活动或指导活动发生；有权教学运行/实践单位的日志 SYS/OFF；经学院核实的考勤/授课日志/实践完成记录，不以教师自拍唯一证明；F020,F024,F031；SRC-002、008（仅有实践统计事实）；每次活动/教师/时段归属，原始值与来源分离；未留痕请求有权单位核实；不可读 UNREADABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明实际授课、实践活动或指导活动发生",
        "有权教学运行/实践单位的日志 SYS/OFF",
        "经学院核实的考勤/授课日志/实践完成记录，不以教师自拍唯一证明",
        "F020,F024,F031",
        "SRC-002、008（仅有实践统计事实）"
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
      "name": "证明调课、停课、替课、补课等变更获何机构批准",
      "purpose": "证明调课、停课、替课、补课等变更获何机构批准；T01/教学运行部门 SYS/OFF；有权教学运行系统批准事件及其时间、编号；F019,F016,F031；SRC-005（任务不得随意改）；关联原任务/新任务和批准人；未批准或查不到均不能自动按“有效”或“无效”定量，待人核。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明调课、停课、替课、补课等变更获何机构批准",
        "T01/教学运行部门 SYS/OFF",
        "有权教学运行系统批准事件及其时间、编号",
        "F019,F016,F031",
        "SRC-005（任务不得随意改）"
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
      "name": "初算/拟核定明细、原记录值与条目 ID",
      "purpose": "初算/拟核定明细、原记录值与条目 ID；学院、校区或权威核算单位 SYS/OFF；经核算单位签认的同批次可追溯明细；F021,F022,F024–F026；SRC-002～004；lineId@sourceVersion、教师/期间/单位一一对应；未初算不能要求，B/H 不可定位时 NEEDS_MATERIAL/源查找。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "初算/拟核定明细、原记录值与条目 ID",
        "学院、校区或权威核算单位 SYS/OFF",
        "经核算单位签认的同批次可追溯明细",
        "F021,F022,F024–F026",
        "SRC-002～004"
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
      "id": "M009",
      "name": "核算期间适用的现行校本公式、口径、例外及生效范围",
      "purpose": "核算期间适用的现行校本公式、口径、例外及生效范围；教务处/研究生院/校制度主管 OFF；校方正式制度库有权版本及变更/废止证明；F023,F010,F022；SRC-006 只证历史审定，不具备计算依据；按期间、学段、课程/实践类别版本匹配；未取得 POLICY_UNCONFIRMED，不得令教师自行证明学校政策。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "核算期间适用的现行校本公式、口径、例外及生效范围",
        "教务处/研究生院/校制度主管 OFF",
        "校方正式制度库有权版本及变更/废止证明",
        "F023,F010,F022",
        "SRC-006 只证历史审定，不具备计算依据"
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
      "id": "M010",
      "name": "明确争议条目、事由及希望核查的事实",
      "purpose": "明确争议条目、事由及希望核查的事实；本人或可信代理 USR 声明（待核校本专用表）；校方正式异议渠道的同等结构化陈述，若存在且确证；F002,F025–F027,F033；SRC-001 第十二条仅涉及共享数据纠错；指向 M008 行 ID 或能定位的记录；缺具体争点 NEEDS_MATERIAL，陈述非正式决定。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "明确争议条目、事由及希望核查的事实",
        "本人或可信代理 USR 声明（待核校本专用表）",
        "校方正式异议渠道的同等结构化陈述，若存在且确证",
        "F002,F025–F027,F033",
        "SRC-001 第十二条仅涉及共享数据纠错"
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
      "name": "补足官方源不能覆盖的实际上课事实或争议线索",
      "purpose": "补足官方源不能覆盖的实际上课事实或争议线索；教师 USR 图片、邮件、文件；经有权教学单位确认的原始记录，优先于私人截图；F028,F020,F030；SRC-001 第九、十、十二条；一证一争议项，保留页码/帧位、版本、上传人；UNREADABLE 重传，非必要不收其他人信息。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "补足官方源不能覆盖的实际上课事实或争议线索",
        "教师 USR 图片、邮件、文件",
        "经有权教学单位确认的原始记录，优先于私人截图",
        "F028,F020,F030",
        "SRC-001 第九、十、十二条"
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
      "name": "识别被复核/被追补影响的原正式决定",
      "purpose": "识别被复核/被追补影响的原正式决定；原签发部门 SYS/OFF；有权决定库的决定 ID、签发人、时间与版本；F033,F037,F024；SRC-001 第七、十四条（记录治理，不授权实体复核）；决定与事项/教师/期间精确关联；H 没有则不能假称“复核”；无法读取 SOURCE_UNAVAILABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "识别被复核/被追补影响的原正式决定",
        "原签发部门 SYS/OFF",
        "有权决定库的决定 ID、签发人、时间与版本",
        "F033,F037,F024",
        "SRC-001 第七、十四条（记录治理，不授权实体复核）"
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
      "name": "证明前决定通知/送达时间",
      "purpose": "证明前决定通知/送达时间；受理/送达主管 SYS/OFF；校方可核验的正式通知日志；F029,F034；尚无校本复核期限 SRC；绑定 M012，未证不推算逾期；不可读 UNREADABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明前决定通知/送达时间",
        "受理/送达主管 SYS/OFF",
        "校方可核验的正式通知日志",
        "F029,F034",
        "尚无校本复核期限 SRC"
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
      "name": "有效当事人提出撤回的意思表示",
      "purpose": "有效当事人提出撤回的意思表示；教师或可信代理 USR；如校本承认的在线撤回事件/书面申请；F032,F007,F008；暂无校本撤回条款；原请求 ID+范围+可信操作人；不得删除 M012/M018；撤回是否生效待授权。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "有效当事人提出撤回的意思表示",
        "教师或可信代理 USR",
        "如校本承认的在线撤回事件/书面申请",
        "F032,F007,F008",
        "暂无校本撤回条款"
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
      "name": "多人授课、跨学院/校区分配矛盾时的单位事实会商",
      "purpose": "多人授课、跨学院/校区分配矛盾时的单位事实会商；相关教学主管 OFF；各单位可签认的同一任务来源、分配历史及核查纪要；F015–F017,F031,F038；SRC-002、004、005；含多人信息按最小范围展示；未经全部适当主体确认不重分配；缺则 CONFLICT/待协调。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "多人授课、跨学院/校区分配矛盾时的单位事实会商",
        "相关教学主管 OFF",
        "各单位可签认的同一任务来源、分配历史及核查纪要",
        "F015–F017,F031,F038",
        "SRC-002、004、005"
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
      "id": "M016",
      "name": "本研两业务域或邻接 T01/T02/T06 的既有有效决定引用",
      "purpose": "本研两业务域或邻接 T01/T02/T06 的既有有效决定引用；权威部门 SYS/OFF；带决定号、签发机关、版本的可信交换记录；F009,F031,F037,F024；SRC-001 第七、十三、十七条；SRC-009 禁作校本决定；保留原发文/数据源引用，不在本案双写；无授权 SOURCE_UNAVAILABLE，技术 G 候选只作提示。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "本研两业务域或邻接 T01/T02/T06 的既有有效决定引用",
        "权威部门 SYS/OFF",
        "带决定号、签发机关、版本的可信交换记录",
        "F009,F031,F037,F024",
        "SRC-001 第七、十三、十七条"
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
      "name": "有权人员正式核定/复核决定及法定/校定签发要素",
      "purpose": "有权人员正式核定/复核决定及法定/校定签发要素；待确认的主管机构 OFF/SYS；经校方认可、可验证的正式电子签批或纸质原件；F035,F038,F023,F033；现无明确实体签批 SRC；必须绑定案件、争议/期间、签发角色、政策、版本；未产生不作初审缺件；签发权不明 NEEDS_HUMAN_DECISION。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "有权人员正式核定/复核决定及法定/校定签发要素",
        "待确认的主管机构 OFF/SYS",
        "经校方认可、可验证的正式电子签批或纸质原件",
        "F035,F038,F023,F033",
        "现无明确实体签批 SRC"
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
      "id": "M018",
      "name": "权威部门修正后的教学工作量源记录和变更日志",
      "purpose": "权威部门修正后的教学工作量源记录和变更日志；教务处/研究生院 SYS/OFF；经源部门认证的前后版本对照与修改日志；F024,F036,F035；SRC-001 第九、十二至十四条；旧/新版本并存，索引到 M017；没有有权修正不要求上传，也不允许系统伪造新值。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "权威部门修正后的教学工作量源记录和变更日志",
        "教务处/研究生院 SYS/OFF",
        "经源部门认证的前后版本对照与修改日志",
        "F024,F036,F035",
        "SRC-001 第九、十二至十四条"
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
      "id": "M019",
      "name": "校方实际发布的本人明细/公示范围、版本、发布及查阅记录",
      "purpose": "校方实际发布的本人明细/公示范围、版本、发布及查阅记录；业务主管 SYS/OFF；校方签认的批次明细及正式告知日志；外校 SRC-011/012 只提示可能存在此阶段；F021,F029,F039,F024；SRC-002/004/011/012（外校非校规）；绑定批次+教师+明细版本，含可见范围和时间；不能凭截图证明有效送达；没有校本公示规定不强制教师提供，不自行启算期限。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "校方实际发布的本人明细/公示范围、版本、发布及查阅记录",
        "业务主管 SYS/OFF",
        "校方签认的批次明细及正式告知日志",
        "外校 SRC-011/012 只提示可能存在此阶段",
        "F021,F029,F039,F024"
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
      "id": "M020",
      "name": "受理机构对特定异议请求的接收编号、状态与反馈",
      "purpose": "受理机构对特定异议请求的接收编号、状态与反馈；学校有权受理源 SYS/OFF；经授权可核的业务回执/处理日志；外校 SRC-011/012 仅为设计参照；F007,F025,F040,F038；SRC-001（数据权限制约）、SRC-011/012（外校流程）；绑定原 M010+申请事件版本、受理单位、时间；仅教师点击提交不可生成官方已受理事实；尚未受理不报教师缺件，后续形成才校验。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "受理机构对特定异议请求的接收编号、状态与反馈",
        "学校有权受理源 SYS/OFF",
        "经授权可核的业务回执/处理日志",
        "外校 SRC-011/012 仅为设计参照",
        "F007,F025,F040,F038"
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
    }
  ],
  "sections": [
    {
      "id": "rules-001-011",
      "name": "身份、任务、形成事实及计算规则",
      "description": "来源章节：身份、任务、形成事实及计算规则；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "业务域与授权目的",
          "requirement": "原文规则编号与阶段：R001 业务域与授权目的 P0/P2/P3。触发条件与来源：T=教师课程工作量条目，F=纯导师指导/人事业绩/财务，U=条目类别不清；SRC-001/009，F002,F009,F013,F014,F037；M004,M016；核验方法与结果：按任务类别、业务域及可核外部正式决定路由。T 且确属课程仅 PASS_FACT（路由事实）；F NOT_APPLICABLE 并转 T06-T05/T02-T07/T01 等，不重复决定；U 源失联 SOURCE_UNAVAILABLE、类别矛盾 CONFLICT、规则边界待有权部门确认 NEEDS_HUMAN_DECISION。下一角色：案卷分流人/教务处或研究生院。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "教师主体与任教期间身份",
          "requirement": "原文规则编号与阶段：R002 教师主体与任教期间身份 P0/P2/P3。触发条件与来源：T=条目对应一名教师，F=本案无该教师目标，U=仅同名/转岗关系不清；SRC-001 第七、十条，F004–F006,F010,F024；M001,M004；核验方法与结果：以人事唯一 UID、有效期间的单位/岗位历史对任务 UID；匹配 PASS_FACT 仅证身份归属，不判该聘用类型可否折算；不匹配 CONFLICT，源不可取 SOURCE_UNAVAILABLE。F 为其它教师条目 NOT_APPLICABLE。下一角色：人事身份数据责任人，课程源部门协同。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "发起、代理与岗位动作授权 P2–P6",
          "requirement": "原文规则编号与阶段：R003 发起、代理与岗位动作授权 P2–P6。触发条件与来源：T=出现提交、初核、撤回、签发或写源动作，F=仅无动作只读，U=代理/岗位授予不明；SRC-001 第十七、二十一条，F007,F008,F038；M002；核验方法与结果：核服务端学校可信会话、委托范围、授权机构和有效期，绝不接受 Renderer 声称角色。完全证实权限 PASS_FACT（仅本次动作的权限事实）；不匹配/校本代理规则不明 NEEDS_HUMAN_DECISION 并阻止动作；授权系统不可取 SOURCE_UNAVAILABLE。下一角色：身份/授权管理人、校方受理人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "核算期间与批次归属",
          "requirement": "原文规则编号与阶段：R004 核算期间与批次归属 P0/P1/P2。触发条件与来源：T=本案有课程工作量任务或核算期间，F=明确已转其他目的且不发生本案期间核验，U=期间/校区未知；SRC-001/005（005 只限指定学期），F010–F012,F023；M003,M004,M009；核验方法与结果：校验学年学期、校区、批次与文号时间相符；时间/归属一致 PASS_FACT，期间冲突 CONFLICT，原源不可取 SOURCE_UNAVAILABLE。F NOT_APPLICABLE 只对已路由排除的对象成立；即使没有截止通知也要做期间核对，无可证当期截止不判超期，交 R016 POLICY_UNCONFIRMED。下一角色：批次主管/学院或校区。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r005",
          "title": "原始教学任务唯一性与有效版本",
          "requirement": "原文规则编号与阶段：R005 原始教学任务唯一性与有效版本 P0/P3。触发条件与来源：T=有课程/班级任务，F=仅非任务引用，U=主任务版本/签发源不明；SRC-002/005，F013–F016,F024；M004；核验方法与结果：比同域、同学期、课程+班级+环节+任务 ID、签发来源与适用版；相符 PASS_FACT（任务安排事实）；同任务多源有效版相斥 CONFLICT，源不可得 SOURCE_UNAVAILABLE；旧版/新上传时间不决定合法有效。下一角色：任务来源单位。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "多人合授份额与单位归属",
          "requirement": "原文规则编号与阶段：R006 多人合授份额与单位归属 P0/P3。触发条件与来源：T=合授/跨单位或分配冲突 C，F=单人且无争议，U=分配人数、原份额未知；SRC-002/004/005（005 仅该学期），F015–F017,F031；M004,M015；核验方法与结果：逐教师 UID 对源任务的计划分配和协同核查，不用“全班学时”自动赋给一人。相同有效版本支持计划份额 PASS_FACT；份额冲突 CONFLICT；重新分摊的实体权力/规则不清 NEEDS_HUMAN_DECISION。下一角色：相关学院/校区与所属数据主管。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "r007",
          "title": "课表安排与任务对应",
          "requirement": "原文规则编号与阶段：R007 课表安排与任务对应 P0/P3。触发条件与来源：T=课表差异被提出或该批次确需核课表，F=未涉及课表证明，U=课表正式版本未知；SRC-005，F013,F014,F018,F024；M004,M005；核验方法与结果：比课程/班级/教师/节次与版本有效期；一致 PASS_FACT（仅安排）；两个校方安排矛盾 CONFLICT，模糊扫描 UNREADABLE。F NOT_APPLICABLE，不得用课表断言实授。下一角色：教学运行主管。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r008",
          "title": "教学活动真实完成事实",
          "requirement": "原文规则编号与阶段：R008 教学活动真实完成事实 P1/P3。触发条件与来源：T=需要核已发生工作或教师主张漏记，F=当前仅安排未到实际执行阶段，U=完成记录不知有无；SRC-002/008（只支持工作量统计活动存在），F020,F024,F028；M006,M011；核验方法与结果：逐节次/实践活动比校方日志与本人补证，判断“发生与否”的证据一致性；可信源已证发生 PASS_FACT，校方与本人证据矛盾 CONFLICT；未形成时 F NOT_APPLICABLE，源失联 SOURCE_UNAVAILABLE、私人扫描不可读 UNREADABLE。不认定任何折算。下一角色：授课/实践主管单位。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r009",
          "title": "教学任务变更及其效力",
          "requirement": "原文规则编号与阶段：R009 教学任务变更及其效力 P2/P3。触发条件与来源：T=课表、实际执行与原安排不同 E，F=一致无变更，U=变更是否存在/何时批准未知；SRC-005（指定学期的任务管理），F016,F018–F020,F031,F037；M004–M007,M016；核验方法与结果：时间顺序比原任务、执行日志与经 T01/教学主管认可的变更事件。有效变更的事实核对可 PASS_FACT（已获有权单位认定的变更），冲突 CONFLICT；批准真实性/补批政策未证 NEEDS_HUMAN_DECISION 或 POLICY_UNCONFIRMED，不由缺 M007 自动断言“未获批准”。下一角色：T01 教学运行决定人，随后工作量主管。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "初算条目、原数值与来源",
          "requirement": "原文规则编号与阶段：R010 初算条目、原数值与来源 P1/P2/P3。触发条件与来源：T=已有初算/异议所指初算 B，F=P0 尚未初算，U=是否形成初算不明；SRC-001/002/004，F009,F021,F022,F024,F030；M008；核验方法与结果：以 lineId@sourceVersion 核教师、期间、课程、原数、单位及分项并比相同对象版本；可信一致 PASS_FACT 仅表示原记录是什么值；漏行/来源矛盾 CONFLICT、源失联 SOURCE_UNAVAILABLE。P0 未形成时 NOT_APPLICABLE，非申请缺件。下一角色：原初算单位、教务处/研究生院。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "当期计算依据、可计量与例外",
          "requirement": "原文规则编号与阶段：R011 当期计算依据、可计量与例外 P1/P3/P5。触发条件与来源：T=要从事实推导应计量/折算/例外，F=只检来源原始值不作规范计算，U=期间对应政策无法确认；SRC-006/007 只证历史线索、不授权当期公式，SRC-001 仅数据管理；F010,F014,F020,F022,F023；M006,M008,M009；核验方法与结果：必须匹配有权发布的校本原文、文号、版本、生效/废止与该学段/活动、身份、期间；政策正式验证后可报告“按配置重算的供核值与原值算术是否相符”的事实，但正式例外及采计由主管决定。当前全部政策计算分支 POLICY_UNCONFIRMED；例外裁量 NEEDS_HUMAN_DECISION；F NOT_APPLICABLE。下一角色：制度主管/业务主管，不让 AI 填系数。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "rules-012-025",
      "name": "异议、跨域、历史、复核与决议规则",
      "description": "来源章节：异议、跨域、历史、复核与决议规则；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r012",
          "title": "争议条目与主张可定位性",
          "requirement": "原文规则编号与阶段：R012 争议条目与主张可定位性 P2/P3/P6。触发条件与来源：T=初次异议或复核 B/E/F/H，F=A 无异议，U=主张难定位；SRC-001 第十二条仅共享数据差错反馈，F021,F025–F028；M008,M010,M011；核验方法与结果：核 M010 对应 lineId@version、具体问题和教师/期间，原值与主张值分列；定位证实 PASS_FACT（争点可定位，不是主张成立），缺要点 NEEDS_MATERIAL、主张证据与源相悖 CONFLICT、附件不可读 UNREADABLE。无异议 F NOT_APPLICABLE。下一角色：教师/受理核对人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r013",
          "title": "本研分域、导师与邻接决定引用",
          "requirement": "原文规则编号与阶段：R013 本研分域、导师与邻接决定引用 P0/P3。触发条件与来源：T=跨 UG/PG、导师指导混入或引用邻接业务 D，F=单域课程且无邻接引用，U=外部决定类型/真伪不明；SRC-001 第七、十七条、006/009（不具实体授权），F009,F024,F031,F037；M004,M016；核验方法与结果：按教务处/研究生院权威来源核同一任务是否多计，只引用 T06-T05/T06-T04/T02-T07/T01 有签发机关及版本的既有决定；双计矛盾 CONFLICT，权威引用有效 PASS_FACT（引用身份事实）；跨域共享权限缺失 SOURCE_UNAVAILABLE，重叠计入政策不明 POLICY_UNCONFIRMED。下一角色：双方数据主管/相邻业务 owner。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "冲突链、材料归属与协调记录",
          "requirement": "原文规则编号与阶段：R014 冲突链、材料归属与协调记录 P3。触发条件与来源：T=两单位/两材料关于同一证明对象冲突 C/D/E，F=无冲突需协调，U=来源主从不明；SRC-001 第九至十四条、SRC-002/004，F015,F024,F030,F031,F038；M004,M006,M008,M015,M016；核验方法与结果：先校 UID、域、期间、task/line、版本和权威来源，再比同一事实，双方保留到有权协调 M015；确实一致 PASS_FACT，仍矛盾 CONFLICT，一方源失联 SOURCE_UNAVAILABLE；学院意见不得直接替换主管数据。下一角色：争议源主管/跨部门协调人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r015",
          "title": "历史期间与旧决定/旧政策效力",
          "requirement": "原文规则编号与阶段：R015 历史期间与旧决定/旧政策效力 P2/P3。触发条件与来源：T=跨期追补、已归档或旧决定 F，F=当期未归档无历史问题，U=原期版本不可知；SRC-001、006（不含办法正文），F010,F021–F024,F033；M008,M009,M012；核验方法与结果：对原核算时点适用政策及历史源版，不以后来制度自动追溯；可证旧值/决定存在 PASS_FACT，不可证原期折算 POLICY_UNCONFIRMED，追补时效/已结算例外 NEEDS_HUMAN_DECISION，旧档不可取 SOURCE_UNAVAILABLE。下一角色：原核算主管及有权复核机构，财务后续仅作结算引用。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "告知、受理与复核期限可证性",
          "requirement": "原文规则编号与阶段：R016 告知、受理与复核期限可证性 P2/P6。触发条件与来源：T=须比较期限/送达规则，F=不涉及期限，U=收到日/规则缺失；SRC-001 无实体异议期限，SRC-005 只教学任务安排；F011,F029,F034,F023；M003,M013,M009；核验方法与结果：必须核当期制度规定的起算点/受理日/例外再算期限；当前即使有收到日也 POLICY_UNCONFIRMED，不得拒收；取得规则后若送达证据冲突 CONFLICT，不可得 SOURCE_UNAVAILABLE。F NOT_APPLICABLE。下一角色：受理制度主管。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "补件/撤回请求归属及权限",
          "requirement": "原文规则编号与阶段：R017 补件/撤回请求归属及权限 P3/P4。触发条件与来源：T=G 补件或撤回，F=没有该操作，U=所撤请求/代理权限未定；SRC-001 第十七、二十一条仅数据/访问授权，F007,F008,F025,F028,F032,F038；M002,M010,M011,M014；核验方法与结果：验原请求 ID、事项范围、操作人、补件归属；有效补证 PASS_FACT（接收事实），撤回意思可 PASS_FACT（已表达，不等于生效）；撤回生效及窗口尚无校本规则 NEEDS_HUMAN_DECISION，无对象 NEEDS_MATERIAL，未授权不写终止事件。下一角色：教师/受理人/有权撤回决定者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r018",
          "title": "既有决定与复核资格",
          "requirement": "原文规则编号与阶段：R018 既有决定与复核资格 P6。触发条件与来源：T=H 请求复核，F=无已作出决定的初次核对，U=前决定或程序合法性不明；SRC-001 第十二条只数据差错，F025,F027,F033,F037,F038；M010,M012,M016；核验方法与结果：核前次决定号、签发机关、对象、期间、效力、是否同争点；可核前决定存在 PASS_FACT（决定元事实），复核制度/层级/回避或次数未知 NEEDS_HUMAN_DECISION，源库失联 SOURCE_UNAVAILABLE；根本没有前决定时不假称复核，应核是否改为 B。下一角色：校方正式复核受理与授权负责人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "正式核定决定签发真实性",
          "requirement": "原文规则编号与阶段：R019 正式核定决定签发真实性 P5/P6。触发条件与来源：T=已由外部有权渠道形成核定/复核决定，F=正在初核且未来才有 M017，U=签发权限/有效性未知；SRC-001 第七、十七、二十一条不直接授予实体审批权，F007,F023,F033,F035,F038；M002,M009,M012,M017；核验方法与结果：对决定号、范围、依据、校本授权岗位、有效签发时间和可信原件校验；证明存在有效正式决定才 PASS_FACT（签发事实），授权未知 NEEDS_HUMAN_DECISION、文件不可读 UNREADABLE、有权源不可取 SOURCE_UNAVAILABLE；F NOT_APPLICABLE 不得报缺 M017。下一角色：校方有权决定人/决议档案维护人；本系统只能引用。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "决定后源数据更正与版本一致",
          "requirement": "原文规则编号与阶段：R020 决定后源数据更正与版本一致 P5/P6。触发条件与来源：T=有权决定要求更正源值，F=决定维持原记录或尚未决定，U=源系统是否更新未知；SRC-001 第九、十二至十四条，F021,F024,F035,F036；M008,M017,M018；核验方法与结果：核旧版、新版、数据源操作者、时间、所据决定 ID，一一对账；可信变更一致 PASS_FACT（记录确已更新），决定与实际更新值不同 CONFLICT；明确尚待执行更正则记录源同步待办 NEEDS_HUMAN_DECISION（有权数据维护岗位执行），而非向教师报缺 M018；已有更正源但接口失联为 SOURCE_UNAVAILABLE。F NOT_APPLICABLE，不得把初核更新虚构为完成。下一角色：本科教务处/研究生院有权源数据维护者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "证据可用性与替换失效范围 P0–P6",
          "requirement": "原文规则编号与阶段：R021 证据可用性与替换失效范围 P0–P6。触发条件与来源：T=读取/替换任一所需 M 槽版本，F=某槽该阶段明确不要求，U=上传件/源状态不明；SRC-001 第九至十四、十七条，F001,F003,F024,F028,F030；M001–M020（按 07.2 的 CR/CD/LT 分阶段筛选）；核验方法与结果：核所属教师、任务/期间、来源、哈希、可读性、读取授权；有证据且可读 PASS_FACT 仅证元数据完整；当前应有但尚未提交 NEEDS_MATERIAL，不可读 UNREADABLE，校方源拒绝/断连 SOURCE_UNAVAILABLE，同槽不同归属 CONFLICT；未来 LT 为 NOT_APPLICABLE。替换仅使依赖旧哈希的事实结果 STALE（生命周期标志，非第九种结果码）。下一角色：原证据持有人/数据访问授权经办。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r022",
          "title": "本人明细告知/公示版本事实",
          "requirement": "原文规则编号与阶段：R022 本人明细告知/公示版本事实 P1/P2。触发条件与来源：T=单位主张已发布/送达某版工作量明细，F=批次尚未告知且不主张已送达，U=有无发布或接收渠道未知；SRC-002/004（岗位线索）、SRC-011/012（外校只证流程可能）；F021,F029,F039,F024；M008,M019；核验方法与结果：对比公布清单、业务范围、版本、本人可见性与校方时间戳；真实可验证公布事实 PASS_FACT（仅实际发布事实），两份通知版不一致 CONFLICT，校方发布源失联 SOURCE_UNAVAILABLE，无校本“须公示/如何送达”条文 POLICY_UNCONFIRMED，不证明期限起算。F NOT_APPLICABLE 不对未来文件报缺。下一角色：核算单位信息发布经办、制度主管。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "异议提交与正式受理状态区分",
          "requirement": "原文规则编号与阶段：R023 异议提交与正式受理状态区分 P2/P3。触发条件与来源：T=已有异议提交并主张校方受理/反馈，F=无异议或尚未提交，U=校方是否已正式受理不明；SRC-001（访问/数据治理限度）、SRC-011/012（仅外校设计参考）；F007,F025,F038,F040；M002,M010,M020；核验方法与结果：核提交日志能证明提交事实 PASS_FACT，但不能推断受理；实际有权系统形成 M020 才可核acceptedAt/acceptedBy，状态冲突 CONFLICT，学校受理系统不可查 SOURCE_UNAVAILABLE，受理制度/岗位未知 NEEDS_HUMAN_DECISION；M020 未形成不得报申请人缺件。F NOT_APPLICABLE。下一角色：校方实际受理部门/身份授权管理人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "教学环节类别与核算行口径映射",
          "requirement": "原文规则编号与阶段：R024 教学环节类别与核算行口径映射 P1/P3。触发条件与来源：T=课程/实验/实践/论文/考务等条目需分类计入，F=本次只核教师/期间无需按环节分类，U=官方环节类型不明；SRC-005（任务类别背景）、SRC-008（实践统计存在性）、SRC-010（学院核算岗位），F009,F013,F014,F020,F021,F041；M004,M008 和 M006（只有实际发生类别争议时）；核验方法与结果：比官方教学任务类别、必要时的实际发生类别与初算项目类型，同类别且同目标 PASS_FACT 只证项目映射；来源类别矛盾 CONFLICT，真正必需的校方源未取得才 SOURCE_UNAVAILABLE；某类应否计入、实验/实践折算未知始终 POLICY_UNCONFIRMED，不借相邻 T05-T07 建设审批折课时。下一角色：对应教学数据主管与制度解释者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r025",
          "title": "同一业务域内重复计列检查",
          "requirement": "原文规则编号与阶段：R025 同一业务域内重复计列检查 P1/P3。触发条件与来源：T=同一教师/期间内有两个以上疑似同一教学活动核算行，F=来源仅一行且没有重复线索，U=任务/班级/环节识别不全；SRC-001（数据治理线索）、SRC-002/005（任务与分配），F004,F009,F010,F013,F014,F017,F021,F022,F024,F041；M004,M008,M015（合授协同时才需）；核验方法与结果：用教师唯一号+域+期间+课程/教学班+环节+正式任务版本与源行 ID 逐对比；同一活动被无依据重复登记则 CONFLICT，事实能证明是两个不同环节才 PASS_FACT（只证非同一行）；多任务同名但合法分开要按源核查，跨域重复归 R013，允许多次采计的校本例外未知则 POLICY_UNCONFIRMED。下一角色：原核算单位/主管数据生产者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "policyRefs": [],
  "stages": [
    {
      "id": "intake",
      "name": "P0 业务域、主体与期间识别",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "P1–P3 任务来源、教学事实与计算依据核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "policy-review",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "policy-review",
      "name": "P4–P6 告知、异议、复核与历史决议引用核验",
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
  "templateId": "T05-T08",
  "name": "教师教学工作量核算、异议和复核审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T08.md",
  "sourceDocumentSha256": "089e4f5d95b109b852c23331cb68bed6d939ecbb0e87b495c3c9ca4866686894",
  "sourceOriginalBlobSha1": "21e7048317242731c4182003d53db1ec3a7aef0b",
  "sourceManifestBytes": 128656,
  "sourceManifestSha256": "a2baf0c12e9b7418ae1d6461144471a227f946f0ccae7ea278746a307f7cca2d",
  "sourceDocumentBytes": 128656,
  "sourceDisplayedBytes": 128655,
  "sourceIntegrityStatus": "REVIEWED_TEXT_PATCHED",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23（北京时间）",
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
    "SRC-012"
  ],
  "criteria": [
    {
      "sectionId": "rules-001-011",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-011",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-005",
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-012-025",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    }
  ]
} as const
