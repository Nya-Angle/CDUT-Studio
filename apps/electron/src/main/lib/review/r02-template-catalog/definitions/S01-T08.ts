import type { TemplateVersion } from '@profer/shared'

/** V3-native, non-official R02 research template. Policy-sensitive checks stay manual. */
export const templateVersion: TemplateVersion = {
  "templateId": "S01-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "提前毕业、延期毕业与修业年限调整审核",
  "description": "本地研究模板 · 非校方正式模板。将研究原件中的事实预审、材料核验和人工复核要求转为 V3 检查项；不得替代学校现行制度、授权审批或学籍写入。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: S01-T08 为独立研究交接稿，非成都理工大学校方正式模板；政策证据状态为 PARTIAL，最终决定与学籍变更须由有权人员人工完成。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T08 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · caseId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001；caseId：string；Case；P0；案卷正式创建事件 M001.caseId，本应用本地创建的仅为待校方受理草案；P1；不存在则先建草案，不得伪造校方受理号"
    },
    {
      "key": "f002",
      "label": "F002 · studentAuthorityId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F002；studentAuthorityId：string；Student；P0；校方身份/学籍主键 M002.studentKey，与可信认证上下文绑定；P3；SOURCE_UNAVAILABLE；不能凭姓名合并主体"
    },
    {
      "key": "f003",
      "label": "F003 · legalName",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F003；legalName：string；Student；P0；学籍姓名 M002.name；曾更名需 G01 正式映射 M024；P2；不匹配 CONFLICT，待身份业务处理"
    },
    {
      "key": "f004",
      "label": "F004 · idMatchToken",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F004；idMatchToken：string；Student；P0/核验；M002.identityMatch 的不可逆/掩码匹配令牌，不保留证件明文到通用输出；P3；主系统不能验证则人工核验，不要求公开完整证号"
    },
    {
      "key": "f005",
      "label": "F005 · educationCategory",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F005；educationCategory：enum；Student；P0；M002.category：普通本科/研究生/来华留学/继续教育等；P2；无法定位政策，POLICY_UNCONFIRMED"
    },
    {
      "key": "f006",
      "label": "F006 · degreeLevel",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F006；degreeLevel：enum；Student；P0；M002.level：本科/硕士/博士/直博/专科/专升本/高起本等；P2；不推定学段或最长年限"
    },
    {
      "key": "f007",
      "label": "F007 · studyMode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F007；studyMode：enum；Student；P0；M002.studyMode：全日制/非全日制/其他；P2；必要时人工核校，不跨用规则"
    },
    {
      "key": "f008",
      "label": "F008 · campus",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F008；campus：string；Student；P0；M002.campus，含宜宾校区；P2；不臆造校区审批节点"
    },
    {
      "key": "f009",
      "label": "F009 · collegeUnit",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F009；collegeUnit：string；Student；P0；M002.unit 与校内组织关系；P2；学院不明则不路由到假定院领导"
    },
    {
      "key": "f010",
      "label": "F010 · programCode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F010；programCode：string；Study；P0；M002.program 与 M003.programCode 对照；P2；两者冲突待学院确认培养方案"
    },
    {
      "key": "f011",
      "label": "F011 · admissionCohort",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F011；admissionCohort：string；Student；P0；M002.cohort，保留原入学类别/学籍延续关系；P2；不以当前班级号猜入学年"
    },
    {
      "key": "f012",
      "label": "F012 · registrationState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F012；registrationState：enum；Student；P0；有权学籍登记 M002.status 及状态时点；P2；失联 SOURCE_UNAVAILABLE；不把未注册自动认定退学"
    },
    {
      "key": "f013",
      "label": "F013 · enrollmentStart",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F013；enrollmentStart：date；Student；P1；学籍生效日期 M002.enrolledAt，非用户手填报到日；P2；不计算期限，留人工核查"
    },
    {
      "key": "f014",
      "label": "F014 · nominalProgramYears",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F014；nominalProgramYears：decimal；Study；P1；适用培养方案/招生批次 M003.normalYears 与 SRC-002；P1；未核时不使用“所有本科四年”默认值"
    },
    {
      "key": "f015",
      "label": "F015 · basicStudyYears",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F015；basicStudyYears：decimal；Study；P1；相应研究生现行规范及培养方案 M003.basicYears/M004.policy；P1；2024 版缺正文，研究生值 POLICY_UNCONFIRMED"
    },
    {
      "key": "f016",
      "label": "F016 · maxStudyDuration",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F016；maxStudyDuration：object；Study；P1；适用规则版本和特殊例外 M004.maxTerm，不得直接沿用旧 SRC-005；P1；规则冲突或未取得正本不计算最终期限"
    },
    {
      "key": "f017",
      "label": "F017 · trainingPlanVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F017；trainingPlanVersion：string；Study；P1；M003.planId/edition/effectiveDate；P1；无法核对计划时停止学分门槛判断"
    },
    {
      "key": "f018",
      "label": "F018 · requiredNonFinalCredits",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F018；requiredNonFinalCredits：decimal；Study；P1（A 必查）；有效方案 M003.requiredCreditsExcludingFinal，普通本科提前申请依据 SRC-002 第 9 条；P2；不知道毕业环节剔除口径则不可比值"
    },
    {
      "key": "f019",
      "label": "F019 · earnedNonFinalCredits",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F019；earnedNonFinalCredits：decimal；Study；P1（A 必查）；学校成绩档案 M005.creditsExcludingFinal，匹配 F017；P3；成绩缺项/转化未批准标 NEEDS_HUMAN_DECISION"
    },
    {
      "key": "f020",
      "label": "F020 · earnedCreditRatio",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F020；earnedCreditRatio：decimal；Study；P3；可审计派生 F019÷F018，M012 记录计算方法与 SRC-002 的申请阶段口径；P2；分母未知或为零则 POLICY_UNCONFIRMED，不得硬判 95%"
    },
    {
      "key": "f021",
      "label": "F021 · remainingCurriculumItems",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F021；remainingCurriculumItems：object；Study；P1；M003 与 M005/M006 对照的未完成课程/毕业环节；P3；方案或记录不全列待查，不要求申请人自证全部成绩"
    },
    {
      "key": "f022",
      "label": "F022 · trainingCompletionEvidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F022；trainingCompletionEvidence：enum；Study；P3/P4（D）；校方培养记录 M006.completion；研究生导师实际确认来自 M014（SRC-004）；P2；缺导师确认仅在需确认的流程节点待办"
    },
    {
      "key": "f023",
      "label": "F023 · advisorAuthorityRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F023；advisorAuthorityRef：ref；Study；P3/P4（D/E）；学校导师关系 M008.advisorAssignment，时间点须覆盖审核；P2；自报导师不可信；无源则待人工核验"
    },
    {
      "key": "f024",
      "label": "F024 · priorQualificationRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F024；priorQualificationRef：ref[]；Study；P2（D 的 2025 批次）；申请人前置学历证书与有权学历核验记录 M010（SRC-004）；P3；按当期要求核验；不可向不相关本科生索取"
    },
    {
      "key": "f025",
      "label": "F025 · academicAchievementRefs",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F025；academicAchievementRefs：ref[]；Study；P2（D 的 2025 批次）；M009 论文检索、专利原件等及核验入口（SRC-004）；P2；仅证明成果真实性，是否达标待实施细则原文"
    },
    {
      "key": "f026",
      "label": "F026 · approvedStatusEventRefs",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F026；approvedStatusEventRefs：ref[]；StatusEvent；P1（H）；邻接 S01 已生效决定或学校档案 M011/M024；P2；未取得不能按学生陈述改变期限"
    },
    {
      "key": "f027",
      "label": "F027 · statusEventPeriods",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F027；statusEventPeriods：period[]；StatusEvent；P1（H）；有效异动决定与学籍记录 M011.periods，保留事件类别；P3；起讫冲突或空缺待原决定机构查证"
    },
    {
      "key": "f028",
      "label": "F028 · durationCalculationTrace",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F028；durationCalculationTrace：object；Study；P3（B/E/F/G/H）；M012，按 F013/F014/F015/F016/F027/F037 计算并记来源；P2；任何政策例外未知即只给区间候选，不给超限结论"
    },
    {
      "key": "f029",
      "label": "F029 · requestedAction",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F029；requestedAction：enum；Application；P0；学生本人申请 M007.action：提前/延长期限/延后资格审查；P2；多义词“延期毕业”先询真实目标，不自动归类"
    },
    {
      "key": "f030",
      "label": "F030 · requestedEffectivePeriod",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F030；requestedEffectivePeriod：object；Application；P1；M007.requestedPeriod，需要实际有效期限的情形才填；P2；不得自动填满允许最大值"
    },
    {
      "key": "f031",
      "label": "F031 · requestedFinishOrReviewDate",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F031；requestedFinishOrReviewDate：date；Application；P1；M007.targetDate，区分拟毕业/拟审查日期；P2；未填可补诉求；不能用预计日期作正式毕业日期"
    },
    {
      "key": "f032",
      "label": "F032 · applicationReason",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F032；applicationReason：string；Application；P1；本人书面陈述 M007.reason，医学等敏感附件按最小化处理；P3；无通用法定理由清单时不自动判“理由不成立”"
    },
    {
      "key": "f033",
      "label": "F033 · submittedAt",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F033；submittedAt：datetime；Application；P2；受理事件 M001.submissionTimestamp/M007.receivedAt；P1；只保存有依据的提交/签收时间，网络草稿时间非等价"
    },
    {
      "key": "f034",
      "label": "F034 · batchNoticeAndDeadline",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F034；batchNoticeAndDeadline：object；Application；P0/P2；适用年度校本通知 M004.batchWindow，含时区、截止及补件例外；P1；当年通知缺失标 POLICY_UNCONFIRMED；不得套 2025 截止"
    },
    {
      "key": "f035",
      "label": "F035 · proxyIdentityRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F035；proxyIdentityRef：ref；Application；P1（条件）；代理人校验记录 M013.agent，仅合法代办情形；P3；代理合法性未核时不可代签本人"
    },
    {
      "key": "f036",
      "label": "F036 · proxyAuthorizationRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F036；proxyAuthorizationRef：ref；Application；P1（条件）；M013.mandate、范围/日期/撤销状态；P3；未授权不执行代办动作，学生本人正常申请不索取"
    },
    {
      "key": "f037",
      "label": "F037 · applicablePolicyRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F037；applicablePolicyRef：ref；Application；P0/P3；M004.ruleVersion：SRC-001/002/004/007/008 等及版本/效力区间；P0；研究生当前条款不全 POLICY_UNCONFIRMED"
    },
    {
      "key": "f038",
      "label": "F038 · collegeReviewRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F038；collegeReviewRef：ref；Review；P4；学院正式审签记录 M015；P1；尚未审核不算申请人缺件"
    },
    {
      "key": "f039",
      "label": "F039 · collegeLeaderOpinionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F039；collegeLeaderOpinionRef：ref；Review；P4（A）；本科院长/分管教学领导签意见 M016（SRC-002）；P1；P1/P2 不要求；授权不清人工核"
    },
    {
      "key": "f040",
      "label": "F040 · advisorOpinionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F040；advisorOpinionRef：ref；Review；P2/P4（D）；对应导师签认 M014（SRC-004 的 2025 申请表要求）；P1；草稿可空；正式报送按当期具体节点处理"
    },
    {
      "key": "f041",
      "label": "F041 · subcommitteeOpinionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F041；subcommitteeOpinionRef：ref；Review；P4（D）；学院学位评定分委员会初审 M017（SRC-004）；P1；不把初审意见当批准文书"
    },
    {
      "key": "f042",
      "label": "F042 · officeHandoffRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F042；officeHandoffRef：ref；Review；P4；接收材料的研究生院/教务处受理记录 M018，按学段；P1；无法查到只标待流转，不等于否决"
    },
    {
      "key": "f043",
      "label": "F043 · formalDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F043；formalDecisionRef：ref；Decision；P5；有权机关正式批文 M019；C 的特定批文 M025；P1；任何上传照片须核来源，不能拼造正式决定号"
    },
    {
      "key": "f044",
      "label": "F044 · formalDecisionOutcome",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F044；formalDecisionOutcome：enum；Decision；P5；M019/M025.decision 及签发权限；P1；无效/未见原件 = NEEDS_HUMAN_DECISION"
    },
    {
      "key": "f045",
      "label": "F045 · decisionEffectivePeriod",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F045；decisionEffectivePeriod：object；Decision；P5；M019/M025.effectivePeriod，区分颁发日和生效区间；P1；无明示不擅自推算至最长年限"
    },
    {
      "key": "f046",
      "label": "F046 · executionReceiptRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F046；executionReceiptRef：ref；Decision；P6；学籍/培养权威系统实际变更回执 M020；P2；已批准但未执行保留“待实施”待办"
    },
    {
      "key": "f047",
      "label": "F047 · withdrawalOrAppealRequestRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F047；withdrawalOrAppealRequestRef：ref；Application；P7；本人正式撤回/申诉记录 M021；P2；未核救济条件只记录提交意愿，不标“已撤回/已受理”"
    },
    {
      "key": "f048",
      "label": "F048 · appealReviewDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F048；appealReviewDecisionRef：ref；Decision；P7；学校法定申诉处理机关结论 M022（SRC-001/002）；P2；不能以再次 AI 预审填此项"
    },
    {
      "key": "f049",
      "label": "F049 · evidenceVersionLedgerRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F049；evidenceVersionLedgerRef：ref；Evidence；P1–P7；每次 SRC/M/F 的证据版本与原哈希 M023；P1；缺版本禁止重用旧结论；重建可追溯链"
    },
    {
      "key": "f050",
      "label": "F050 · upstreamAuthorityRefs",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F050；upstreamAuthorityRefs：ref[]；Link；P1/P3（条件）；G50/S/T 正式事实或决定 M024，携带权威 ID/版本/效力；P2；原决定失效/不可达，停止复用而非重做其业务决定"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "案卷/提交时间与受理痕迹",
      "purpose": "本应用/正式受理机关；事件元数据、受理回执；当前事实必需；学生不应上传“系统记录”；若未受理保留草案号；F001/F033；设计记录，非政策条款；caseId、学生主键、事件时点、提交者、回执号、修订序号；SU→待受理核实；日志损坏 UR→重建痕迹不可伪造受理",
      "requiredElements": [
        "案卷/提交时间与受理痕迹",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "学生主体、学段、校区与在籍状态",
      "purpose": "学籍主管部门；主数据/正式在籍证明；当前事实必需；优先校方受控查询，合法纸质盖章证明可人工替代，不能单靠用户填写；F002–F013；SRC-002/005/007/008；学校学生主键、权威系统版本、查询时点、姓名变更映射、状态生效时段；SU→人工查验；UR→要求出具部门重出；匹配冲突 CONFLICT",
      "requiredElements": [
        "学生主体、学段、校区与在籍状态",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "确认招生学制及有效培养方案",
      "purpose": "教务处/研究生院/学院；培养方案和对应批次版本；A/B/D/E/F 按适用当前事实必需；C/G 依办理条件；可接受校方出具经核计划摘录；F010/F014/F015/F017/F018/F021；SRC-002/004/007；学段、专业、招生年级、计划 ID、生效日、毕业环节边界；SU→停用学分判断；UR→向方案持有单位取可读版",
      "requiredElements": [
        "确认招生学制及有效培养方案",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "政策现行性、当期受理窗口、授权阈值",
      "purpose": "学校相关主管部门；规范、通知、受理指南、受控配置；当前规则事实必需，不是申请人材料；无可核政策只能 PU；不得以外校文件替代；F016/F034/F037；SRC-001/002/003/004/005/007/008/011；正本文号、发布日期、生效/废止、适用身份/学段/批次、链接；SU/PU→人工政策核定；截图模糊 UR 不反推原文",
      "requiredElements": [
        "政策现行性、当期受理窗口、授权阈值",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "证明已修学分、成绩、课程认定",
      "purpose": "教务/研究生培养管理；正式成绩记录或盖章成绩单；A/B/D/E 的相应学业事实当前必需；其他依需要；校方可取得则不重复上传；F019/F020/F021；SRC-002/004；学生 ID、计划版本、课程/成绩批次、补考重修与替代决定 ID；SU→待校方查验；UR→重出记录；不同方案 CONFLICT",
      "requiredElements": [
        "证明已修学分、成绩、课程认定",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "证明个人计划完成与未完事项",
      "purpose": "学生与培养单位；培养系统环节记录、个人培养计划执行单；A/B/D/E 视事项当前事实必需；导师确认另在 M014；合法替代为校方认证的完整环节清单；F021/F022；SRC-002/004/011；学生、导师/学院、计划版本、环节、审核时点；SU→人工核；UR→重取；不可用“毕业证”代替培养过程",
      "requiredElements": [
        "证明个人计划完成与未完事项",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "载明本人真实申请诉求",
      "purpose": "学生本人；书面申请、当期学校申请表或有签收的校方提交记录；A 本科提前、D 2025 研究生提前为当前提交必需；B/C/E/F/G 表单和受理方式待校方确认；草稿可先陈述；F029–F033；SRC-002/003/004；申请人权威 ID、事项码、表单版本、提交时间、签署/签收页；NM（适用且已明确要求）/UR；校方未规定表单则 PU，不要求虚构附件",
      "requiredElements": [
        "载明本人真实申请诉求",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "研究生培养单位；师生关系主数据/授权名册",
      "purpose": "研究生培养单位；师生关系主数据/授权名册；D 当前核验条件必需；E 是否需导师签意见待校方核；学生无需自己“证明导师身份”；F023；SRC-004；导师主键、受聘部门、指导关系起讫、查询版本；SU→人工核导师；自填姓名不采信",
      "requiredElements": [
        "研究生培养单位；师生关系主数据/授权名册",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "研究生提前毕业的学术成果",
      "purpose": "研究生/期刊专利权威登记方；论文检索证明、专利等；D 2025 公告个人提交时条件必需；其他批次按当期细则，不普适；F025；SRC-004；作者归属、成果编号、检索日期、签发平台、文件页/哈希；NM/UR；真实性通过仍不能判定达到未取得的细则门槛",
      "requiredElements": [
        "研究生提前毕业的学术成果",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "研究生前置学历与学位材料",
      "purpose": "学生/学历登记部门；毕业、学位证复印件/正式核验回执；D 2025 公告条件必需；若校方明确认可在线核验可用其合法替代，不擅自免原件；F024；SRC-004；证书颁发机构/号、学生关联、核验日期、证照遮盖策略；NM/UR；证书和学籍冲突 CONFLICT",
      "requiredElements": [
        "研究生前置学历与学位材料",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "既有休复学/保留/退役/转专业/降级等正式决定",
      "purpose": "原学籍异动主管机关或邻接 S01 业务；有权签发文书与正式异动记录；H 触发时条件必需；优先校方已存决定，学生陈述及非正式截图不得替代；F026/F027/F050；SRC-001/002/007；原业务 ID、签发者、文号、生效起讫、撤销/修订状态、学生主键；SU/UR→停用期限算法；冲突转原决定机构确认",
      "requiredElements": [
        "既有休复学/保留/退役/转专业/降级等正式决定",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "修业年限和学分比例计算可追溯底稿",
      "purpose": "本模板预审与有权审核人；派生公式、参数与来源快照；A 比例、B/E/F/G/H 年限需要时条件必需；不是申请人上传件；F020/F028；SRC-001/002/005/007/008；原 F 值、政策版本、算式、误差/日期口径、预审时间；关键输入缺失→PU/SU；人工改公式须留痕，不给凭空结果",
      "requiredElements": [
        "修业年限和学分比例计算可追溯底稿",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "代办真实性",
      "purpose": "申请人/代理人及学校有权核验单位；授权书与代理身份；仅实际代理时条件必需；是否准代办本身待校方确认；本人申请无需；F035/F036；SRC-001 一般权益，校本代理制度未获；授权人学生主键、被授权者、权限范围、期限、撤销记录；NM/UR；代理合法性 PU 时只能本人重新确认",
      "requiredElements": [
        "代办真实性",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "导师对研究生提前毕业的审核签认",
      "purpose": "学校真实导师；2025 公告申请表导师签字/可验证审核记录；D 2025 批次 P2 正式报送条件必需，P1 草稿为后续；其他研究生延期是否需要待核；F022/F040；SRC-004；导师 F023、签署时点、表单版本、对应学生/申请 ID；P1 不报缺；P2 需而未签 NM/HD；签字不可验 HD",
      "requiredElements": [
        "导师对研究生提前毕业的审核签认",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "学院受理与审核意见",
      "purpose": "申请人所在学院；院级受理单、审核表/正式审批流；P4 后续才产生；A/C/D 有已知环节，B/E/F/G 具体权限待校本核；F038；SRC-002/003/004；学院组织 ID、经办权限、意见时间、材料批次、签署校验；当前缺失不 NM；节点到达无效签章 HD/SU",
      "requiredElements": [
        "学院受理与审核意见",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "本科提前毕业院长/分管教学领导意见",
      "purpose": "学院有权领导；对应签署/批件；A P4 后续才产生，其他情形不一律要求；F039；SRC-002 第 9 条；签发人身份/岗位、学生、申请、结论、签署时间；未到 P4 不 NM；越权或不可读 HD/UR",
      "requiredElements": [
        "本科提前毕业院长/分管教学领导意见",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "研究生提前毕业学位评定分委员会初审",
      "purpose": "学院分委员会；会议/审核决议及清单；D P4 后续才产生（2025 通知有此环节）；F041；SRC-004；分委会身份、会议时间/决议、申请批次、成员权限；未到节点不 NM；正文缺失 SU，虚签 HD",
      "requiredElements": [
        "研究生提前毕业学位评定分委员会初审",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "受理部门/培养办公室交接凭据",
      "purpose": "教务处/研究生院培养办公室等；送达签收、受理流水；相关情形 P4 后续才产生；D 2025 批次有学院集中报送；F042；SRC-002/004；经办部门、交接时点、文件清单和版本、受理流水；缺失为“待流转”不是学生缺件；机构失联 SU",
      "requiredElements": [
        "受理部门/培养办公室交接凭据",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "正式学校决定",
      "purpose": "事项对应有权批准机关；批准/不批准决定或权威电子审批单；P5 后续才产生；不能申请起点要求；F043/F044/F045；SRC-001/002/004；文号、签发机构、签署认证、学生/申请 ID、决定效力/生效期；未发生为 HD；照片不可验 HD/UR；不能 AI 补签",
      "requiredElements": [
        "正式学校决定",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "决定执行与学籍回执",
      "purpose": "有权学籍/培养系统；执行日志、变更回执或主管部门确认；P6 后续才产生；已有 M019 不自动生成本件；F046；SRC-002/003/006；执行事件 ID、系统版本、前后状态、实际生效时间；未执行记待办；SU 不得推断已生效",
      "requiredElements": [
        "决定执行与学籍回执",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "提交后撤回请求/校方接收记录",
      "purpose": "学生及受理单位；正式撤回申请、签收；仅 P7 条件必需；不能证明校方必然准许撤回；F047；SRC-001/002（一般权利，具体校本程序待核）；申请主键、原决定/原提交版本、请求时间、回复；无需撤回则不适用；代办未授权 HD，UR 重提交",
      "requiredElements": [
        "提交后撤回请求/校方接收记录",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "学校申诉与复查结论",
      "purpose": "学校学生申诉处理委员会等；正式复查文书；仅发生法定申诉时 P7 后续才产生，不是本模板“二次 AI 复核”；F048；SRC-001/002；原决定 ID、受理日、复查日、送达信息、效力及后续程序；未决保持“复核中”；SU/UR 不能补写结论",
      "requiredElements": [
        "学校申诉与复查结论",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "来源与证据版本账",
      "purpose": "本案事实预审服务；源索引、原文件哈希、受影响事实依赖；当前必需的审计记录；不是申请人材料，任何变更均更新；F049；设计约束/SRC-010 仅技术参考；evidenceId/sourceOwner/version/fileHash/validAt/replaces，保留不可变旧快照；缺失则拒绝复用旧结论；不可读取应重建可审计关系",
      "requiredElements": [
        "来源与证据版本账",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "已有 G50/S/T 的权威事实或决定",
      "purpose": "原业务有权机关；跨案权威决定/核验引用；H、改名、成绩替代、年级变更等触发时条件必需；不要求学生重复上传；F003/F026/F050；SRC-002/010，原业务政策另查；sourceCaseId/decisionId/sourceVersion/effectiveAt，保留原 Owner；SU→提示源失联；被撤销→旧派生结论失效；不得自行重批",
      "requiredElements": [
        "已有 G50/S/T 的权威事实或决定",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "延后毕业资格审查专项批准件",
      "purpose": "教务处；与教通字〔2026〕12 号同类的有权批准和个体关联记录；仅 C 的 P5 后续才产生；公告名册不是新的申请人个人批件；F043/F044/F045；SRC-003；学生主键、批准批次、教务处文号、是否关联年限决定、学籍执行回执；未批准 HD；不能把公开名册直接当身份证明或年限延期批件",
      "requiredElements": [
        "延后毕业资格审查专项批准件",
        "主体与案卷归属",
        "来源版本与证据时点"
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
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-set-03",
      "name": "08.2 基础身份、政策、提交（R001–R009）",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001｜适用政策版本；P0/P3",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R001 适用政策版本；P0/P3；T=某申请的身份、学段、年份需选择规范；F=仅测试无申请对象；U=身份/批次不明；SRC-001/002/004/005/006/007/008/012；F005–F007/F011/F034/F037；M002/M004；比规范签发者、生效/废止区间、适用群体、当期通知及新旧过渡；2021 研究生文本不取代 2024 版；外校不替代校本；真=PF(已定位有效规则)，假=PF(已证明不适用该版本)并重新路由；U=PU，学段源失联 SU；下一角色教务处/研究生院/国际或继续教育主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002｜事项意图分流；P0/P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R002 事项意图分流；P0/P1；T=诉求含提前、延长、延后资格审查；F=仅换证/毕业资格终审/学籍更正；U=“延期”歧义；SRC-002/003/011；F029–F031；M007/M004；比请求原文和资格审查/年限变更两种效力；已有结业换证转 S07-T08，降级不冒领；真=PF(明确动作 A–G)，假=NA 并建议原 Owner；U=HD（向本人澄清，不自动选 B/C）；下一角色学生/受理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003｜身份与案卷归属；P0/P3",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R003 身份与案卷归属；P0/P3；T=案卷绑定校方学生主体；F=无当前学生申请；U=权威主键取不到；SRC-001/002；F001–F004/F011；M001/M002/M024；主键比对姓名、学号、入学批次和申请表；改名仅消费 G01 有效映射，不按拼音合并，证件只存比对令牌；真=PF(同一主体)，假=CF（证据指向不同主体）；U=SU/UR；下一角色学籍管理者/G01 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004｜相关时点在籍状态；P0/P3",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R004 相关时点在籍状态；P0/P3；T=需确认申请资格所依在籍状态；F=完全无本校学籍事项；U=状态源不可得；SRC-001/002/005/007/008；F012/F013/F026；M002/M011；比提交时与拟生效时权威状态及历史异动；未按时注册≠已经由学校完成退学处理；真=PF(在籍/具体权威状态)，假=PF(权威状态不符合)但不得自动退学；U=SU/CF；下一角色学籍主管/校方受理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005｜学段、方案和批次归属；P1/P3",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R005 学段、方案和批次归属；P1/P3；T=要用学制/学分/年限判断；F=仅记录诉求未评价学业；U=专业或批次不明；SRC-002/004/007；F005–F011/F014/F015/F017；M002/M003/M011；对照招生类别、专业、方案版本及异动生效时间；采用生效方案而非最新上传方案；真=PF(方案对应)，假=CF（学籍/方案不一致）；U=SU/PU（过渡政策未知）；下一角色学院教务/培养管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006｜代理的合法提交权限；P1/P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R006 代理的合法提交权限；P1/P2；T=申报者与学生本人不同；F=学校本人确认提交；U=代理关系/制度未证；SRC-001/002（只作一般边界）；F002/F035/F036；M002/M013；查授权原件、期限、撤销状态、代理范围和校方准代办规定；OCR 签名不是认证；真=PF(授权核实且校方允许)，假=HD（不能代签/代决定）；U=PU/UR/NM（仅校本明确应交授权时）；下一角色学生本人及校方受理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007｜申请目的与目标期限表达；P1/P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R007 申请目的与目标期限表达；P1/P2；T=学生提交本事项诉求；F=仅后台事实查询；U=本人真实意思表示无法确认；SRC-002/003/004；F029–F032；M007；对照请求动作、拟起止/毕业或审查日期、理由与当期申请表；不得替学生填最长允许年限；真=PF(诉求清晰)，假=PF(诉求明确但期限/动作不一致)并请澄清；U=NM（已明确要求的书面申请缺）/UR/HD；下一角色学生",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008｜正式提交与受理时点；P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R008 正式提交与受理时点；P2；T=申请声明“已提交/已受理”；F=P1 未提交；U=受理记录不可得；SRC-002/004；F001/F033；M001/M007；查签收流水、学生身份、表单版本和提交时间；草稿保存、拍照、机器人消息不能等价正式受理；真=PF(已提交时间和受理证据)，假=PF(尚未正式提交)；U=SU/UR，受理权不明 PU；下一角色受理机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009｜申报批次/截止时间；P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R009 申报批次/截止时间；P2；T=该学段当期有已确认的提交窗口；F=无窗口型事项或非该批次；U=当期通知未取得；SRC-002/004/011；F005–F007/F033/F034/F037；M001/M004/M007；比北京时间、签收证据及当前政策；本科 2019 文本“3 月”与 2025 研究生具体截止分开；SRC-011 学位节点不得倒灌到申请；真/假均 PF(按有效窗口按时/超时事实)，是否例外由人工；U=PU（2026 通知不明）/SU；下一角色教务处或研究生培养办",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rule-set-04",
      "name": "08.3 普通本科提前、延长与延后资格审查（R010–R017）",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r010",
          "title": "R010｜本科提前毕业学制与拟提前幅度；P3/A",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R010 本科提前毕业学制与拟提前幅度；P3/A；T=普通全日制本科申请提前毕业；F=其他诉求/非适用本科；U=学制/类别不明；SRC-002 第 8–9 条；F005/F006/F011/F014/F029/F031；M002/M003/M004/M007；比招生年制、已在校年限和“提前一年”目标；四/五年制及适用过渡应看原政策和方案；真/假均 PF(符合/不符合提前幅度的事实)，不能自动允拒；U=SU/PU；下一角色本科学院教务员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011｜本科提前申请时非毕业环节学分比例；P3/A",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R011 本科提前申请时非毕业环节学分比例；P3/A；T=A 且 SRC-002 第 9 条适用版本已核；F=非 A；U=方案口径/现行增补未知；SRC-002 第 9 条；F017–F020/F037；M003/M004/M005/M012；校方确认“毕业要求总学分不含毕业环节”为分母、对应已得学分为分子，十进制精确比较 ≥0.95；重修/替代须先由原业务认定，零分母不可比较；真=PF(比例≥95%)、假=PF(比例<95%) 并给人工资格审查待办；U=SU/UR/CF/PU；下一角色学院教务与教务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012｜提前申请时课程进度与毕业环节分隔；P3/A",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R012 提前申请时课程进度与毕业环节分隔；P3/A；T=A 且核培养安排；F=非 A；U=课程所属环节不明；SRC-002 第 9/49 条；F017/F021/F022；M003/M005/M006；比已修课程与个人培养计划；“申请资格”与“最终毕业条件”分开；毕业设计/答辩未到时不索要其结论；真/假均 PF(已完成/未完成具体要求)；毕业环节未来待办不算 NM；U=SU/UR/CF；下一角色学院教务/后续毕业资格业务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013｜本科提前学院领导签署；P4/A",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R013 本科提前学院领导签署；P4/A；T=A 且确到院领导审核节点；F=P1–P3 或非 A；U=节点是否到达不明；SRC-002 第 9 条；F038/F039；M015/M016；核学院院长/主管教学领导当时岗位、签署对象和意见版本；单有学生扫描签名不证明授权；真=PF(有已核院领导意见)，假=HD（已到节点但无有效意见，非学生缺件）；U=SU/UR/HD；下一角色学院领导与教务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014｜本科延长时标准学制/最长年限事实；P3/B",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R014 本科延长时标准学制/最长年限事实；P3/B；T=B 且本科有效年限规则已确认；F=非 B；U=适用上限或异动计时未确；SRC-001/002 第 8–9、38–40、49 条；F013/F014/F016/F027/F028/F030；M002/M004/M011/M012；按四年制 3–6、五年制 4–7（仅适用当前政策身份），计算已修业区间与拟延长区间；法定例外须 M011，不能只做日历相减；真/假均 PF(在限/超限事实)并由学校裁量后果；U=PU/SU/CF；下一角色教务处/学籍主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015｜本科延长的剩余学业与方案版本；P3/B",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R015 本科延长的剩余学业与方案版本；P3/B；T=B 且核未完成事项；F=非 B；U=最新方案/成绩不可确定；SRC-002 第 9/18/49 条；F017/F019/F021；M003/M005/M006/M024；对照原方案、正式转换/替代决定及剩余课程；不把未修完自动视为延长已获批准；真/假均 PF(缺少哪些环节/已满足哪些)，不做延长合法性决定；U=SU/UR/CF；下一角色学院教务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016｜延后资格审查与延长年限分流；P1/P3/C",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R016 延后资格审查与延长年限分流；P1/P3/C；T=申请仅要求延后毕业资格审查；F=明确要求年限延长 B；U=两种目的混写；SRC-002/003；F029–F031/F037；M004/M007/M025；2026 教通字〔2026〕12 号证明有个案，不证明一般受理条件及“降入班级”由本案决定；必须对应本人/批次；真=PF(属 C 诉求但适格尚待校本核)，假=NA 并转 B；U=PU/HD；下一角色学生及教务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017｜延后资格审查的院级流转事实；P4/C",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R017 延后资格审查的院级流转事实；P4/C；T=C 且该批次院级审核节点存在；F=未进入 P4/非 C；U=当期流程未确；SRC-003；F008/F009/F038/F043；M015/M018/M025；对照校区/学院意见的有权签发与具体申请关联；公开 36 人名单不能代替个人审批核验；真=PF(已核院级流转)，假=HD（待有权审核，不判学生缺件）；U=PU/SU/UR；下一角色学院、宜宾校区或教务处",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rule-set-05",
      "name": "08.4 研究生提前与延期、特殊身份（R018–R027）",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r018",
          "title": "R018｜研究生导师与指导关系；P2/P3/D",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R018 研究生导师与指导关系；P2/P3/D；T=D 且 2025 申请要求导师确认；F=非 D；U=学段/当前导师关系未核；SRC-004；F005/F006/F023；M002/M008；通过培养单位名册按学生、导师、学期与有效期核对；姓名相同/手写签名不能证明导师身份；真=PF(指导关系有效)，假=CF（签署者非有效导师）；U=SU/UR；下一角色学院研究生秘书/导师管理部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019｜研究生已完成培养计划的事实；P3/D",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R019 研究生已完成培养计划的事实；P3/D；T=D 且评价提前毕业申请条件；F=非 D；U=适用计划或完成记录缺；SRC-004/011（011 仅下游分界）；F017/F021/F022；M003/M005/M006/M014；核本人学科/专业学位领域及个人培养计划的课程、环节完成与导师陈述的一致性；论文送审与学位申请不能前置；真/假均 PF(培养环节实际完成与否)，尚不能据此单独批准提前毕业；U=SU/UR/CF；下一角色导师、学院培养管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020｜研究生科研成果真实性；P2/P3/D",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R020 研究生科研成果真实性；P2/P3/D；T=D 且当期正式通知确要求成果材料（SRC-004 仅 2025）；F=非 D/无此要求；U=实施细则或批次不明；SRC-004；F025/F034/F037；M004/M009；比作者、成果编号、期刊/专利官方记录、检索时间及归属；只判断真实性，不发明成果篇数/级别/达标值；真=PF(可核实成果)，假=CF（身份/成果来源冲突）或 PF(无此项成果)；U=NM（2025 明确应交而未交）/UR/PU；下一角色研究生院培养办及学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021｜研究生前置学历学位证真实性；P2/D",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R021 研究生前置学历学位证真实性；P2/D；T=D 且该年度要求前置证书（2025 公告）；F=非适用批次；U=证书清单/取数权限不明；SRC-004；F024/F034；M004/M010；对照学生权威主键、证书号码、颁发机构及正式在线核验；合法替代须获校本认可；真=PF(证书匹配)，假=CF（不同主体/不一致）；U=NM（已明确本人应交）/UR/SU/PU；下一角色学生、研究生培养办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022｜研究生导师在正式报送表签认；P2/D",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R022 研究生导师在正式报送表签认；P2/D；T=D 且2025批次正式提交节点；F=P1草稿、非该批次；U=当期表单要求不明；SRC-004；F023/F040/F033；M007/M008/M014；以正式导师核验关系、同一表单版本、申请批次及签字日期核对；上传手写签图不可直接当“已签”；真=PF(导师签认已核)，假=HD（节点应形成但未核到有效签认，转导师）；U=UR/SU/PU；下一角色导师/学院受理人，不直接要求学生伪补签",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023｜研究生分委员会初审与交接；P4/D",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R023 研究生分委员会初审与交接；P4/D；T=D 且学院审核到此节点；F=P1–P3 或非 D；U=学院会签流程版本不明；SRC-004；F038/F041/F042；M015/M017/M018；依据当期分委会会议/决议、签章、申请批次、报送清单及接收流水验证；2025 3 月节点不能转移至 2026；真=PF(院级意见及交接事实)，假=HD（待补真实审核节点），绝非学校最终批准；U=SU/UR/PU；下一角色学院分委会/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024｜研究生适用基本/最长修业年限；P3/E",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R024 研究生适用基本/最长修业年限；P3/E；T=研究生延期或年限调整；F=非 E；U=2024 版正文/例外缺；SRC-004/005/006；F005–F007/F011/F013/F015/F016/F028/F037；M002/M003/M004/M011/M012；必须先取得成理校研〔2024〕29 号及当期适用版本，再按硕/博/直博、入学批次与异动计时；2021 年值禁止进入自动判定；真/假仅在现行源齐备时 PF(在限/超限事实)，学校决定仍待人工；当前 U=PU；学院资料源失联 SU；下一角色研究生院学籍管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025｜研究生延期的未完成培养事项；P3/E",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R025 研究生延期的未完成培养事项；P3/E；T=E 且校本允许此类申请；F=非 E；U=申请程序是否合法未证；SRC-001/005/006（005 仅旧版参考）；F017/F021/F022/F032；M003/M005/M006/M007；比当期计划与课程/环节事实和本人理由，导师意见是否必需不得由 2021 旧版直接推定；真/假均 PF(剩余培养事实)，但程序 U=PU 时不得作资格肯定；资料缺 SU/UR；下一角色学院、研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026｜来华留学生等专项规定及共签主体；P0/P3/F",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R026 来华留学生等专项规定及共签主体；P0/P3/F；T=F 特殊身份本科/研究生提前或延期；F=普通身份；U=身份政策冲突/试行文续效不明；SRC-002/005/007；F005–F008/F014–F017/F037；M002/M003/M004；2022 试行规定适用对象与普通规则“参照”关系须按现行授权确认；国际交流与合作处与培养部门不得互相冒签；真=PF(已确定现行专项适用及权属)，假=PF(该专项不适用，重新核正确政策)；当前 U=PU/HD；下一角色国际交流与合作处/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027｜继续教育申请是否有现行依据；P0/P3/G",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R027 继续教育申请是否有现行依据；P0/P3/G；T=继续教育学生主张延期或要求解释超限预警；F=非继续教育；U=专项规定第7条正本及申请入口未获；SRC-008/009；F005/F006/F011/F013/F016/F028/F029/F037；M002/M004/M007/M012；2026 预警可作为支撑事实记录于 comparedValues，但本 R 的结论对象是延期程序是否有现行授权；退学处理为另一法定程序；真=PF(已证可受理/不可受理的现行程序事实)，假=NA（非 G）；本轮 U=PU，不同时在同一 R 输出 PF 和 PU；下一角色继续教育学院/学校有权机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rule-set-06",
      "name": "08.5 异动、冲突、复用和版本（R028–R034）",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r028",
          "title": "R028｜上游学籍异动决定真实性；P1/P3/H",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R028 上游学籍异动决定真实性；P1/P3/H；T=有休复学、服役、转专业、降级或跨校培养等有效异动主张；F=从无异动且可信核实；U=原决定不可达；SRC-001/002/007；F026/F027/F050；M011/M024；查原决定 Owner、学生主键、文号、签发与撤销/修订历史；不由本规则重新审批异动；真=PF(有效异动)，假=CF（自报与权威冲突）或 PF(原决定无效事实)；U=SU/UR/HD；下一角色原 S01 Owner/学籍部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029｜异动占用修业时段计算；P3/H及B/E/F",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R029 异动占用修业时段计算；P3/H及B/E/F；T=期限计算确受已批准异动影响；F=无影响事件；U=异动类别或日期/计时政策未知；SRC-002 第38–40条/SRC-007（效力待核）；F013–F016/F027/F028；M002/M004/M011/M012；本科休学计入、服役保留学籍不计入、跨校联合培养计入，只对相应政策确认适用时计算；去重与半开区间仅是工程候选，日期端点按学校正式口径核定；研究生旧版不跨用；真/假均 PF(具体计入/不计入时段及算式)，不是批准延期；U=PU/SU/CF；下一角色学籍部门及校方政策解释人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030｜异动后培养方案、课程认定；P3/H",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R030 异动后培养方案、课程认定；P3/H；T=已生效转专业、降级等导致方案更换；F=方案无变化；U=原决定/新旧方案不全；SRC-002 第18–19条；F010/F017–F021/F026/F050；M002/M003/M005/M011/M024；对照新方案和原成绩，课程替代/抵认取有权部门正式结论；即使规范有计算条款，也不由本模板重新认定学分；真=PF(已确认新方案与认定结果)，假=CF（不同方案混算）；U=SU/UR/HD；下一角色学院教务/课程替代 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031｜同一事实跨材料一致性；P3及补件后",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R031 同一事实跨材料一致性；P3及补件后；T=至少两权威来源声明同一主体/课程/时间/身份事实；F=只有唯一合法源且无冲突；U=来源可用性不足；SRC-002/004/010（010 非政策）；F002/F003/F010/F017/F019/F021/F026/F050；M002/M003/M005/M011/M024；比学生主键、事件时间、签发者、适用方案、数据版本；冲突不能靠文件上传时刻排序，允许更名映射；真=PF(一致)，假=CF（列双证据/双版本和分歧字段）；U=SU/UR；下一角色各源数据 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032｜应采证据可读性和权威源可达性；P1–P7",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R032 应采证据可读性和权威源可达性；P1–P7；T=当前阶段实际激活某个 M 证据槽；F=该 M 非本阶段要求；U=持有人或实际义务不明；SRC-002/004/007（以具体材料相应来源为准）；F001/F049及目标 F；M001–M025中被激活的槽；按 slotId→持有人→文件位置/页码→取数方式 分别判断：本人法定应交未交 NM；已得不可读 UR；学校源失联 SU；清单未证 PU；未来节点 F 不触发；真=PF(可供相应事实核验)，假按 NM/UR/SU/PU 实际原因；U=PU/HD；下一角色材料持有人，不把学校失联派给学生",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "R033｜G50/相邻 S/T 权威决定复用；P1/P3/H或身份更正",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R033 G50/相邻 S/T 权威决定复用；P1/P3/H或身份更正；T=已有上游有效决定/事实需用于本案；F=该案不依赖上游决定；U=上游 Owner/效力不明；SRC-002/010（010 只支持技术目录）；F003/F026/F027/F050；M011/M024；校验源案 ID、决定 ID、版本、适用学生和时点；只能读取 G01/课程认定/异动等原 Owner 的真值，不用此处替代其审批；真=PF(可复用事实)，假=CF（已撤销/失配）并停止派生；U=SU/HD；下一角色原业务 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "R034｜证据版本替换与定向重审；P1–P7",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R034 证据版本替换与定向重审；P1–P7；T=被审材料内容/来源版本或有效政策版本变化；F=哈希和权威版本均未变；U=缺证据版本账；SRC-002/010（版本传播为设计约束）；F017–F021/F026–F028/F037/F049/F050；M003/M004/M005/M011/M012/M023/M024及被替换 M；从源账保留 replaces、原哈希/新哈希与 F/R 依赖图，仅令依赖者旧 finding 失效；正式学校决定不能因本案重新算分而自动撤销；真=PF(检测到版本变化事实)+RECHECK_REQUIRED 任务，假=PF(版本未变)不重审；U=HD（禁止复用无源旧结论）；下一角色本案核验员/受影响的源 Owner",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rule-set-07",
      "name": "08.6 分级意见、正式决定、执行和救济（R035–R041）",
      "order": 4,
      "required": true,
      "criteria": [
        {
          "id": "r035",
          "title": "R035｜分支到达学院审核的真实权限；P4/A–G",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R035 分支到达学院审核的真实权限；P4/A–G；T=适用事项已进入有校本授权的学院审核环节；F=尚在 P1–P3 或无此节点；U=该类学院权限/环节未证；SRC-002/003/004/007；F009/F038–F042；M004/M015–M018；以当期授权、机构实名与申请版本验意见，A 的院领导/ D 的分委会由 R013/R023 专核，不重复制作第二份决定；真=PF(有权院级意见)，假=HD（待有权审核），U=PU/SU/UR；下一角色学院真实审核人/主管部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "R036｜学校正式决定的真实性与签发权限；P5/A–G",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R036 学校正式决定的真实性与签发权限；P5/A–G；T=已有声称正式批准/不批准文书；F=尚未决策；U=决定来源/权限未核；SRC-001/002/003/004；F002/F029/F037/F043/F044；M002/M004/M019/M025；比决定事项、案号、学生 ID、文号、签发机关、当时权限与撤销史；2026 公示名册、院内意见和上传签名不等同校方决定；真=PF(可验证正式决定存在)，假=CF/HD（伪签或越权待核）；U=SU/PU/UR/HD；下一角色有权签发机关，AI 不产生决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "R037｜决定内容、范围和效力区间；P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R037 决定内容、范围和效力区间；P5；T=R036 已核到真实决定；F=无有效决定；U=效力范围未明；SRC-001/002/003；F029–F031/F043–F045；M007/M019/M025；逐字段比批准的是“提前安排/期限延长/延后资格审查”哪一种、起止范围及生效条件；院系无法推导不存在的终止日；真=PF(范围与申请/实际记录对应)，假=CF（批准与拟执行对象不同）或 PF(批准范围更窄)；U=HD/SU；下一角色签发机关/学籍执行人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "R038｜决定实施回执；P6",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R038 决定实施回执；P6；T=真实有效决定需实际更改权威学籍/培养数据；F=尚无待执行决定或决定不需本类变更；U=执行部门接口/记录不可得；SRC-002/003/006；F043–F046；M019/M020/M025；比申请 ID、文号、被改变字段、执行前后值、回执时点；有决定未见回执就是“待实施”，不是“已生效”；真=PF(权威实施已发生)，假=HD（待学校实施，不能自动执行）；U=SU/CF；下一角色学籍系统有权写入人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r039",
          "title": "R039｜提交后撤回的有效性；P7",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R039 提交后撤回的有效性；P7；T=学生提出正式撤回/停止申请；F=无撤回请求；U=受理、授权或可撤回阶段不明；SRC-001/002（仅一般权益）；F002/F033/F035–F036/F043/F047；M001/M007/M013/M019/M021；区分草稿关闭、已提交待校方处理、已有正式决定需另行变更/撤销；只记录本人请求及学校回应，不自行回滚；真=PF(撤回请求及真实学校处置事实)，假=NA（无请求），若校方尚未处理为 HD；U=PU/SU/UR；下一角色原受理机关/学生",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r040",
          "title": "R040｜独立申诉复查的权威结论；P7",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R040 独立申诉复查的权威结论；P7；T=学生就有适格的学校决定提出申诉/复查；F=无申诉；U=可申诉性/时限或机构未核；SRC-001 第55–64条/SRC-002 第59–62条；F043/F044/F047/F048；M019/M021/M022；比原决定、送达、受理时间、申诉主体与学校有权处理机构的签发文书；模型重新跑一次不是复查决定；真=PF(确有正式受理/复查结果)，假=HD（申诉仍待机构处理）；U=PU/SU/UR；下一角色学生申诉处理机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r041",
          "title": "R041｜毕业资格、答辩、学位及结业后换证的下游隔离；P6及后续",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R041 毕业资格、答辩、学位及结业后换证的下游隔离；P6及后续；T=本案出现“已准提前/延期”并要求推导毕业、授位或换证；F=无此下游要求；U=下游业务结论未取；SRC-001/002/011；F021/F022/F043–F046/F050；M006/M019/M020/M024；延期/提前安排只是本事项决定；毕业资格审查、论文预审/答辩、授位、学历注册和 S07-T08 换证由各自有权 Owner 形成独立结论；真=PF(已有独立可验证的下游结论引用)；假=HD（未有下游决定，不得由 S01-T08 批准）；U=SU/HD；下一角色毕业资格/学位/证书原业务 Owner",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0-policy-routing",
      "name": "P0_POLICY_ROUTING｜适用政策路由",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "p1-draft",
      "workflowOwner": "local"
    },
    {
      "id": "p1-draft",
      "name": "P1_DRAFT｜申请草案",
      "kind": "manual-review",
      "executorRole": "student",
      "nextStageId": "p2-submitted",
      "workflowOwner": "local"
    },
    {
      "id": "p2-submitted",
      "name": "P2_SUBMITTED｜正式提交与材料初核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "p1-draft",
      "nextStageId": "p3-evidence-verified",
      "workflowOwner": "local"
    },
    {
      "id": "p3-evidence-verified",
      "name": "P3_EVIDENCE_VERIFIED｜事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "p2-submitted",
      "nextStageId": "p4-unit-review",
      "workflowOwner": "local"
    },
    {
      "id": "p4-unit-review",
      "name": "P4_UNIT_REVIEW｜校内分级核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "p3-evidence-verified",
      "nextStageId": "p5-formal-decision",
      "workflowOwner": "local"
    },
    {
      "id": "p5-formal-decision",
      "name": "P5_FORMAL_DECISION｜正式人工决定",
      "kind": "manual-review",
      "executorRole": "teacher",
      "returnToStageId": "p4-unit-review",
      "nextStageId": "p6-effective-execution",
      "workflowOwner": "local"
    },
    {
      "id": "p6-effective-execution",
      "name": "P6_EFFECTIVE_EXECUTION｜决定生效与后续执行",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p7-withdraw-review",
      "workflowOwner": "local"
    },
    {
      "id": "p7-withdraw-review",
      "name": "P7_WITHDRAW_REVIEW｜撤回、异议/复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "skippableReason": "跨阶段事件；仅在撤回、变更、异议或复核实际触发时进入，常规办理可跳过。",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** Research provenance is separate from case-material SourceRef values. */
export const r02Metadata = {
  "templateId": "S01-T08",
  "name": "提前毕业、延期毕业与修业年限调整审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T08.md",
  "sourceDocumentSha256": "c335a07a6dc2b0ad55e009c0d8f95bc896b056f81af8292cd84bed75c4c33348",
  "sourceDocumentManifestBytes": 153312,
  "sourceDocumentGitBlobSha": "e1755ff4367c3423240037de4a37edd7bd147798",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "rule-set-03",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-04",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-004",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-05",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r030",
      "sourceRuleId": "R030",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r031",
      "sourceRuleId": "R031",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r032",
      "sourceRuleId": "R032",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r033",
      "sourceRuleId": "R033",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-06",
      "criterionId": "r034",
      "sourceRuleId": "R034",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r035",
      "sourceRuleId": "R035",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r036",
      "sourceRuleId": "R036",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r037",
      "sourceRuleId": "R037",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r038",
      "sourceRuleId": "R038",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r039",
      "sourceRuleId": "R039",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r040",
      "sourceRuleId": "R040",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-07",
      "criterionId": "r041",
      "sourceRuleId": "R041",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
