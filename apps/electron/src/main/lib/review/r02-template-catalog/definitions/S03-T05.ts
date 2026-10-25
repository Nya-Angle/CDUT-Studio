import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion }

export type R02EvidenceStatus = 'verified' | 'partial' | 'unconfirmed'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; fieldIds: string[]; materialIds: string[] }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; officialSchoolTemplate: false; researchAsOf: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; sourceIds: string[]; fieldIds: string[]; materialIds: string[]; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S03-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生先进个人、荣誉称号及评优资格审核",
  "description": "本地研究模板 · 非校方正式模板。用于学生先进个人、荣誉称号及评优资格审核的材料核验和人工审阅建议；政策/授权未确认时不得形成正式通过或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本定义由 R02 研究交接稿转换，不是成都理工大学正式发布模板；SRC 为研究来源索引，不是案卷材料 SourceRef；未确认政策由有权人员人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "S03-T05 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · string；Case：不可变申请/案件键",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001。string；Case：不可变申请/案件键；B–H；可信主业务服务生成；案件记录键，不由上传文件名生成；P1；缺则无法关联，需服务修复；SRC-012（技术线索非实现证明）。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f002",
      "label": "F002 · string；Batch：评选学年、批次、学段",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002。string；Batch：评选学年、批次、学段；A–H；校方当期通知标题、发文号及签发时间；P0；未知 POLICY_UNCONFIRMED；SRC-003/004/005/006/011。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f003",
      "label": "F003 · object；Batch：政策标识、版本、学院细则及效力时间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003。object；Batch：政策标识、版本、学院细则及效力时间；A–H；校级办法、当期通知和学院细则的原件页/条款；P0；未得校级原文 POLICY_UNCONFIRMED；SRC-003/004/005/009/010/011。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f004",
      "label": "F004 · enum+string；Case：拟申报荣誉名称及校/院层级",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F004。enum+string；Case：拟申报荣誉名称及校/院层级；A–H；学校正式荣誉目录、当期通知的类别段；P1；类别未授权需人工路由；SRC-003/004/005/006。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f005",
      "label": "F005 · string；Applicant：学号/校内身份键",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F005。string；Applicant：学号/校内身份键；B–H；校方学籍身份索引、权威注册记录 ID；P2；无法匹配为 NEEDS_HUMAN_DECISION；SRC-007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f006",
      "label": "F006 · string；Applicant：姓名及可信姓名版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F006。string；Applicant：姓名及可信姓名版本；B–H；校方学籍姓名字段/已核身份证明；保留姓名变更史；P2；同名不等于同一人，冲突 CONFLICT；SRC-007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f007",
      "label": "F007 · enum；Applicant：本科/硕士/博士学段",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F007。enum；Applicant：本科/硕士/博士学段；B–H；校方招生学籍记录、学段字段；P2；不明则 POLICY_UNCONFIRMED；SRC-001/003/004/005/006。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f008",
      "label": "F008 · enum；Applicant：全日制、普通本科等学习类型",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F008。enum；Applicant：全日制、普通本科等学习类型；B/C；学籍记录内培养类型字段；P2；不能凭成绩单标题判断；SRC-003/004/005/007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f009",
      "label": "F009 · enum+日期区间；Applicant：在籍、休学、保留、退学等状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F009。enum+日期区间；Applicant：在籍、休学、保留、退学等状态；B/C/H；校方学籍状态历史及各状态生效日；P2；缺源 SOURCE_UNAVAILABLE、矛盾 CONFLICT；SRC-007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f010",
      "label": "F010 · enum+term；Applicant：参评学期是否注册",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F010。enum+term；Applicant：参评学期是否注册；B/C；校方注册记录与有效学期；P2；不能凭本人声明替代；SRC-003/004/005/007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f011",
      "label": "F011 · object；Applicant：年级/班级、评选年度归属",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F011。object；Applicant：年级/班级、评选年度归属；B/C；学籍班级、所在年级历史与变更时间；P2；记录不符则 CONFLICT；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f012",
      "label": "F012 · object；Applicant：现学院、专业及班级",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F012。object；Applicant：现学院、专业及班级；B/C；学籍归口记录；院/专业代码与生效时间；P2；缺归口人工待办；SRC-003/004/005/007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f013",
      "label": "F013 · list+日期；Applicant：参评期间原学院/原专业/转入转出履历",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F013。list+日期；Applicant：参评期间原学院/原专业/转入转出履历；B/C/H（仅跨院等）；学籍变更发文/学籍历史链记录键；P2；无变更可 NOT_APPLICABLE；变更但记录失联 SOURCE_UNAVAILABLE；SRC-003/007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f014",
      "label": "F014 · object；Case：本人申请意愿、申报日期、声明版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F014。object；Case：本人申请意愿、申报日期、声明版本；B/H；本人签名或经可信身份提交的申请原文位置；P2；确需本人申报而无申请 NEEDS_MATERIAL；SRC-003/004/005/006。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f015",
      "label": "F015 · object；Case：提交主体身份与代理授权状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F015。object；Case：提交主体身份与代理授权状态；B/H；可信会话及代理委托权威核定，记录操作时刻；P2；代理规则不明 POLICY_UNCONFIRMED；SRC-003/006（本人申请例证）。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f016",
      "label": "F016 · interval；Eligibility：参评事实统计起止日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F016。interval；Eligibility：参评事实统计起止日；A–H；当期政策对成绩、综测、任职、纪律的统计范围；P1；不能用当前系统日期猜测；SRC-003/004/005/009/010/011。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f017",
      "label": "F017 · decimal+范围；Eligibility：平均学分绩点及算法/计算期",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F017。decimal+范围；Eligibility：平均学分绩点及算法/计算期；C，奖项要求时；有权教务/培养单位签发成绩记录键、表格字段；P2；来源失联 SOURCE_UNAVAILABLE，门槛未知 POLICY_UNCONFIRMED；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f018",
      "label": "F018 · object；Eligibility：排名、所在班级/专业年级、分母与发布时间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F018。object；Eligibility：排名、所在班级/专业年级、分母与发布时间；C，奖项要求时；成绩排名权威报表及总体 ID；P2；只有名次无分母或总体未知需人工；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f019",
      "label": "F019 · list；Eligibility：不合格课、补考、重修各自记录与日期",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F019。list；Eligibility：不合格课、补考、重修各自记录与日期；C，适用政策要求时；教务/培养部门课程成绩与考试状态原始记录；P2；概念不混同；材料差异 CONFLICT；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f020",
      "label": "F020 · object；Eligibility：综测成绩/名次/班级或专业总体/最终版号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F020。object；Eligibility：综测成绩/名次/班级或专业总体/最终版号；C，适用本科评优时；S03-T01 权威结果 ID、排名表版本和确认机关；P2；仅截图不够，待权威结果 SOURCE_UNAVAILABLE；SRC-003/004/005/012。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f021",
      "label": "F021 · object；Eligibility：体测评级、日期、免测/缓测有效结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F021。object；Eligibility：体测评级、日期、免测/缓测有效结论；C，政策要求时；体育测试主管部门成绩及免测决定键；P2；等级/分数条文疑义转人工；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f022",
      "label": "F022 · list+interval；Eligibility：干部职务、组织、任期与聘任状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F022。list+interval；Eligibility：干部职务、组织、任期与聘任状态；C，干部称号适用；学生组织/学院任职名单或正式任命文件位置；P2；无职位记录 SOURCE_UNAVAILABLE，未证岗位不能自动否决；SRC-003/004/005/010。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f023",
      "label": "F023 · object；Eligibility：干部考核、岗位表现及评议事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F023。object；Eligibility：干部考核、岗位表现及评议事实；C/D，干部称号适用；任职单位、指导教师/组织签发的履职评价位置；P2；突出表现由组织判断 NEEDS_HUMAN_DECISION；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f024",
      "label": "F024 · list；Achievement：事迹/竞赛/论文/专利等声明与期间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F024。list；Achievement：事迹/竞赛/论文/专利等声明与期间；B/C，申报特定称号时；本人申报表条目、获奖证明页、成果编号；P2；本人所持凭证缺失 NEEDS_MATERIAL；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f025",
      "label": "F025 · object；Achievement：成果归属、位次、署名、真假与重复使用核验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F025。object；Achievement：成果归属、位次、署名、真假与重复使用核验；C/D，事迹有要求时；主办方公示、专利登记、期刊或学校认证条目；P2；真伪不明 NEEDS_HUMAN_DECISION、来源失联 SOURCE_UNAVAILABLE；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f026",
      "label": "F026 · list+interval；Eligibility：处分、处分期、解除/撤销记录及生效日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F026。list+interval；Eligibility：处分、处分期、解除/撤销记录及生效日；C/H，纪律条件适用时；有权处分与解除部门权威记录/决定书；P3；学生自述不可当定论，冲突 CONFLICT；SRC-001/003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f027",
      "label": "F027 · list；Eligibility：通报批评、晚归/寝室违规等适用事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027。list；Eligibility：通报批评、晚归/寝室违规等适用事实；C，仅当批次明确要求；有权住宿/学生管理部门实际通报及日期；P3；不能以传闻否决；SRC-003/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f028",
      "label": "F028 · list；Achievement：既有个人荣誉称号、颁发机关与文号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F028。list；Achievement：既有个人荣誉称号、颁发机关与文号；C，十佳等要求时；学校正式表彰记录或可验荣誉证书；P2；奖状图片不等于发文；SRC-004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f029",
      "label": "F029 · list+version；Eligibility：邻接 G50/S/T 权威决定引用及效力",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F029。list+version；Eligibility：邻接 G50/S/T 权威决定引用及效力；C/H，在复用事实时；原案源 ID、签发者、有效范围、决定状态；P2/P3 随源；原决定失联 SOURCE_UNAVAILABLE；SRC-012（仅目录线索）。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f030",
      "label": "F030 · object；Review：班级/年级民主评议与推荐记录",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F030。object；Review：班级/年级民主评议与推荐记录；D 后；有权组织会议纪要、推荐表及名单中的本人行；P2/P3；B/C 不要求，D 后未形成则工作待办；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f031",
      "label": "F031 · object；Review：辅导员/班主任核验意见",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F031。object；Review：辅导员/班主任核验意见；D 后；有权辅导员核验记录、签名或系统审核事件；P2；身份不可验则 NEEDS_HUMAN_DECISION；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f032",
      "label": "F032 · object；Review：学院审议/推荐结论及表决记录",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F032。object；Review：学院审议/推荐结论及表决记录；E 后；学院有权工作组审议记录、推荐文书；P2；不应提前向学生索取；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f033",
      "label": "F033 · object；Review：学院公示区间、内容版本与异议状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F033。object；Review：学院公示区间、内容版本与异议状态；E 后；学院正式公示发布页、异议受理登记；P2/P3；未公示不可伪造为无异议；SRC-003/004/005。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f034",
      "label": "F034 · object；Review：本科/研究生归口部门复核结论",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F034。object；Review：本科/研究生归口部门复核结论；F 后；学工部/研工部原始审核记录、单位和时点；P2；未受理时 NOT_APPLICABLE、已受理但材料失联 SOURCE_UNAVAILABLE；SRC-002/003/004/005/006。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f035",
      "label": "F035 · object；Review：学校公示及异议处置阶段",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F035。object；Review：学校公示及异议处置阶段；F 后；学校正式公示页面/异议登记与处理记录；P2/P3；仅推荐公示时不等于审批通过；SRC-003/004/005/006。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f036",
      "label": "F036 · object；Decision：学校正式荣誉审批/表彰文号、签发主体、生效与撤销状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F036。object；Decision：学校正式荣誉审批/表彰文号、签发主体、生效与撤销状态；F/G 后；学校真实审批文书、表彰通知与归档引用；P2；未发文为“待决定”而非“不合格/已通过”；SRC-003/004/005/006（流程线索）。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f037",
      "label": "F037 · object；Decision：档案存档、奖章/附带奖金只读关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037。object；Decision：档案存档、奖章/附带奖金只读关联；G 后；学校档案正式登记号、支付部门已有权威决定引用；P2；不收银行卡；无正式决定不建立获奖事实；SRC-001/004/005/008。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f038",
      "label": "F038 · object；Change：补件/替换、被影响 F/M、源版本及重审状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F038。object；Change：补件/替换、被影响 F/M、源版本及重审状态；H 发生时；原文件版本、新材料及授权修改记录；P2/P3 继承；新旧事实冲突 CONFLICT，旧结论失效；SRC-003/004/005（程序线索）。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f039",
      "label": "F039 · object；Change：撤回意愿、请求时间、受理机关及处理结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F039。object；Change：撤回意愿、请求时间、受理机关及处理结果；H 发生时；本人请求与有权受理机构的实际处理回执；P2；仅收到请求不得标记撤回完成；当期撤回规则未知 POLICY_UNCONFIRMED；SRC-011。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f040",
      "label": "F040 · object；Change：公示异议、申诉、复核及最终处理依据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F040。object；Change：公示异议、申诉、复核及最终处理依据；E/F/H 发生时；正式异议材料、受理号、回复或复核决定；P3；事实未经核实不作为处分，法定申诉路径另核；SRC-001/003/004/005/006/007。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f041",
      "label": "F041 · object；Review：执行人可信认证、组织授权、签名及审计序列",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F041。object；Review：执行人可信认证、组织授权、签名及审计序列；B–H 每个写操作；主进程/可信服务授权证据、日志事件键；P3；不能验证则禁止写正式状态；SRC-012（技术参考，不证明已有实现）。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f042",
      "label": "F042 · object；Batch：本次申报/评议/公示/复核的阶段截止节点及来源",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F042。object；Batch：本次申报/评议/公示/复核的阶段截止节点及来源；A–H；当期正式公告具体条款、签发机关、时区与版本；P0；缺现行公告 POLICY_UNCONFIRMED，不用历史日期替代；SRC-003/004/005/006/009/010/011。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "确认本批次政策适用",
      "purpose": "确认本批次政策适用；本科学工部/研究生院；确认本批次政策适用；本科学工部/研究生院；校级通知、正式办法及附件；校方现行签发登记可替代扫描件；C/A；F002–F004/F016/F042；SRC-003/004/005/006/009/010/011；发布单位、发文号、效力起止、适用学段、原始 PDF/HTML 版本；批次级共享；无当期文件 POLICY_UNCONFIRMED，坏 PDF UNREADABLE；不能退回学生补交校方政策",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "确认本批次政策适用",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "确认学院细则、名额、特殊程序",
      "purpose": "确认学院细则、名额、特殊程序；学院；确认学院细则、名额、特殊程序；学院；当期学院实施细则/正式公告；被授权的学院原始系统记录可替代；T/A，学院发布时必需；F003/F004/F042；SRC-003/004/005/009；限定学院+学年+层级，不能跨院复用；修订后原核验版本失效；缺失 POLICY_UNCONFIRMED 或 SOURCE_UNAVAILABLE，不能用其他学院标准替代",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "确认学院细则、名额、特殊程序",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "锁定学生身份、学籍、注册、学段和所属学院",
      "purpose": "锁定学生身份、学籍、注册、学段和所属学院；本/研学籍管理部门；锁定学生身份、学籍、注册、学段和所属学院；本/研学籍管理部门；学籍及注册权威记录；经签发成绩/在读证明只作离线可验替代，不强制证件照片；C/B；F005–F013/F015；SRC-003/004/005/006/007；主键学号+学籍版本+有效时点，关联本人；变动另取 M015；学生漏填学号可补正，校方来源失联 SOURCE_UNAVAILABLE，姓名冲突 CONFLICT，不索取无必要身份证复印件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "锁定学生身份、学籍、注册、学段和所属学院",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "本人申请荣誉及申报事实",
      "purpose": "本人申请荣誉及申报事实；申请学生；本人申请荣誉及申报事实；申请学生；当期本人申报表/签名自评或已认证申请记录；仅在学校允许时用等效表单；C/B（本人申请已见历史）；F004/F014/F015/F024；SRC-003/004/005/006；本人、荣誉种类、提交时间、原表页/栏，修改生成新版本；真正未申请 NEEDS_MATERIAL；扫描件不可读 UNREADABLE；代理签名真实性不明 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "本人申请荣誉及申报事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "核学年成绩、GPA、排名及范围",
      "purpose": "核学年成绩、GPA、排名及范围；教务/培养部门；核学年成绩、GPA、排名及范围；教务/培养部门；权威成绩单、成绩计算报表；可核验电子成绩记录为首选；T/C，当期该称号要求时；F016–F018；SRC-003/004/005；学籍+学年/学期+算法+签发日期，旧成绩版与新成绩版分存；源失联 SOURCE_UNAVAILABLE；学生截图与权威成绩冲突 CONFLICT；OCR 不清 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核学年成绩、GPA、排名及范围",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "区分不及格、补考与重修事实",
      "purpose": "区分不及格、补考与重修事实；教务/培养部门；区分不及格、补考与重修事实；教务/培养部门；教务考试/课程状态明细；M005 仅在涵盖全部所需事实时可替代；T/C；F019；SRC-003/004/005；课程代码、考试类型、发生及记载时点、签发部门；缺源 SOURCE_UNAVAILABLE；不能将无补考等同无不合格；语义冲突 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "区分不及格、补考与重修事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "核综合素质测评最终得分/排序",
      "purpose": "核综合素质测评最终得分/排序；综测有权部门；核综合素质测评最终得分/排序；综测有权部门；S03-T01 权威结果引用、确认榜/申诉后最终版；正式签发报表可替代接口；T/C，相关本科个人称号；F020/F029；SRC-003/004/005/012；本人学号、排名总体、测评周期、原结果 ID/版本/效力；无结果 SOURCE_UNAVAILABLE；排名总体不明需人工；不能重评或让学生交全部加分证明",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核综合素质测评最终得分/排序",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "核体育测试等级与依法有效免测例外",
      "purpose": "核体育测试等级与依法有效免测例外；体育/学生管理部门；核体育测试等级与依法有效免测例外；体育/学生管理部门；体测权威记录及免测决定；正式查询/证明书替代；T/C；F021；SRC-003/004/005；测试学期与校验版本、免测有效期、本人归属；未取得等级 SOURCE_UNAVAILABLE；“良好（60分）”文字冲突转 POLICY_UNCONFIRMED/人工，不能猜测",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核体育测试等级与依法有效免测例外",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "核干部岗位、任职组织与期限",
      "purpose": "核干部岗位、任职组织与期限；任职单位；核干部岗位、任职组织与期限；任职单位；正式任职/换届文件、组织名册、聘任系统记录；T/C，优秀干部类；F022；SRC-003/004/005/010；职位、起止日、机构、学生主键、发布版本；岗位证明未知先部门核验；任职是否达标待政策版本，不自动拒绝",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核干部岗位、任职组织与期限",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "核干部履职、组织评价、考核",
      "purpose": "核干部履职、组织评价、考核；任职组织/指导教师；核干部履职、组织评价、考核；任职组织/指导教师；正式工作考核记录、经授权推荐意见；不能用个人总结自动替代；T/C–D，干部类；F023；SRC-003/004/005/010；工作周期、签发单位、评价人授权及具体可审业绩；尚未出评语时可待评议；缺真实评价 NEEDS_HUMAN_DECISION；图片不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核干部履职、组织评价、考核",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "佐证申报的事迹、科研成果、竞赛/志愿事实",
      "purpose": "佐证申报的事迹、科研成果、竞赛/志愿事实；申请者或成果主管机关；佐证申报的事迹、科研成果、竞赛/志愿事实；申请者或成果主管机关；获奖证书、作品、专利登记、期刊、活动证明；可验证官方链接优先；T/B–C，申报特定事迹或十佳时；F024–F025；SRC-003/004/005；每件成果独立材料版本、姓名署名、位次、日期与可查询编号；申请人应有而缺 NEEDS_MATERIAL；证书不可验 NEEDS_HUMAN_DECISION；OCR 不清 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "佐证申报的事迹、科研成果、竞赛/志愿事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "核处分、处分期及解除/撤销效力",
      "purpose": "核处分、处分期及解除/撤销效力；校方纪律主管部门；核处分、处分期及解除/撤销效力；校方纪律主管部门；正式处分/解除决定、权威纪律状态记录；学生自述不能替代；T/C，当期相关资格条文触发；F026；SRC-001/003/004/005；发文号、决定日/生效日/解除日、权限、本人归属；P3 严格隔离；源失联 SOURCE_UNAVAILABLE；两份有效文书冲突 CONFLICT；非必要不得公开处分全文",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核处分、处分期及解除/撤销效力",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "核违纪通报/住宿事实",
      "purpose": "核违纪通报/住宿事实；住宿/学生管理单位；核违纪通报/住宿事实；住宿/学生管理单位；正式通报批评或核查记录；发布部门盖章/可信系统记录；T/C，本批次明确列此条件才用；F027；SRC-003/005；时点、事件分类、撤回/更正记录、被评人 ID；未查到非自动“无记录”，需要权威无记录或查询确认；源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核违纪通报/住宿事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "核以往荣誉/十佳资格线索",
      "purpose": "核以往荣誉/十佳资格线索；原授予机关；核以往荣誉/十佳资格线索；原授予机关；正式表彰文、荣誉登记、可验荣誉证书；个人照片仅辅助；T/C，十佳或明确要求时；F028；SRC-004/005；原批次、文号、是否撤销、本人信息与归属；历史证书不可核 NEEDS_HUMAN_DECISION；与正式表彰冲突 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核以往荣誉/十佳资格线索",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "核转专业、复学、保留学籍等期间归属",
      "purpose": "核转专业、复学、保留学籍等期间归属；学籍主管部门；核转专业、复学、保留学籍等期间归属；学籍主管部门；学籍变更发文/变更日志；校方正式在籍历史可替代；T/B–C，U9；F009–F013；SRC-003/007；转出/转入学院、前后学籍、动作生效时点，保留版本链；有变动却缺记录 SOURCE_UNAVAILABLE；不让学生自证原学院名额归属",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核转专业、复学、保留学籍等期间归属",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "民主评议、班级/年级推荐",
      "purpose": "民主评议、班级/年级推荐；评议组织；民主评议、班级/年级推荐；评议组织；有授权的评议会议纪要、投票/推荐记录、拟推荐名单中本人行；L/D；F030/F041；SRC-003/004/005；组织、学年、与会/签署权限、个人行及版本；B 初申时不存在属正常；D 后未形成出人工待办，不能要求学生补签",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "民主评议、班级/年级推荐",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "辅导员/班主任审核",
      "purpose": "辅导员/班主任审核；辅导员/班主任；辅导员/班主任审核；辅导员/班主任；原始审核意见或校方系统中的签发动作；L/D；F031/F041；SRC-003/004/005；签发者职位、单位、签发时点、与案卷绑定；学生上传同名签章不可代替授权；未签发停留待审核",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "辅导员/班主任审核",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "学院审议与推荐结果",
      "purpose": "学院审议与推荐结果；学院工作组/党政联席会；学院审议与推荐结果；学院工作组/党政联席会；学院审议记录、正式推荐意见和报送记录；L/E；F032/F041；SRC-003/004/005；集体审议事项、授权主体、学院推荐版次、报送时间；不能提前要求申请人提供；未形成不得伪造推荐通过",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学院审议与推荐结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "学院公示及本级异议结果",
      "purpose": "学院公示及本级异议结果；学院发布部门；学院公示及本级异议结果；学院发布部门；学院公示公告、本人所在行与异议处理决定；L/E；F033/F040；SRC-003/004/005；URL/公告编号、公示时段、修改版、受理单位；未到公示阶段不视缺件；网页失联 SOURCE_UNAVAILABLE，反对意见未定需人工",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学院公示及本级异议结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "校级归口审核",
      "purpose": "校级归口审核；学工部/研工部；校级归口审核；学工部/研工部；有权部门复核记录与审定推荐清单本人行；L/F；F034/F041；SRC-002/003/004/005/006；审核人授权、文书/系统记录号、时间与本人归属；未审核则待办；扫描签字缺授权不能视通过",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "校级归口审核",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "校级拟名单公示、意见处理",
      "purpose": "校级拟名单公示、意见处理；校级发布机构；校级拟名单公示、意见处理；校级发布机构；学校正式公示记录与异议结果，如研究生院 SRC-006；L/F；F035/F040；SRC-003/004/005/006；发布时间、有效公示窗、名单版本、异议受理状态；网页链接失效 SOURCE_UNAVAILABLE；“无异议”须有官方状态而非推断",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "校级拟名单公示、意见处理",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "学校正式授荣誉、取消荣誉或更新档案的有效文书",
      "purpose": "学校正式授荣誉、取消荣誉或更新档案的有效文书；学校有权机关；学校正式授荣誉、取消荣誉或更新档案的有效文书；学校有权机关；审批文书、正式表彰文件或校方权威档案登记；L/F–G；F036–F037；SRC-001/003/004/005；发文号、机关、生效/撤销日、荣誉层级、本人及档案版本；没有不能输出已获奖；仅推介/公示文件不合法替代；不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学校正式授荣誉、取消荣誉或更新档案的有效文书",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "本人撤回意愿、受理处理",
      "purpose": "本人撤回意愿、受理处理；申请人/有权受理人；本人撤回意愿、受理处理；申请人/有权受理人；申请人签名撤回请求、认证流程记录及后续受理回执；T/H，U8a；F039/F041；SRC-011（规则未得）；原申请 ID、提出/受理时点、撤回前后状态；请求不等于被批准撤回；无当期制度 POLICY_UNCONFIRMED，未签名或不可读 NEEDS_MATERIAL/UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "本人撤回意愿、受理处理",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "补交、替换、成绩修改和重审触发",
      "purpose": "补交、替换、成绩修改和重审触发；实际资料持有人；补交、替换、成绩修改和重审触发；实际资料持有人；新证据、来源版本变更通知、受影响旧证据引用；T/H，U7；F038/F041；SRC-003/004/005（程序线索）；new/old 版本号、替换原因、受影响字段/规则、发起者；真缺件 NEEDS_MATERIAL；源不可读 UNREADABLE；期限不明 POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "补交、替换、成绩修改和重审触发",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "公示异议、学校申诉或正式复核结果",
      "purpose": "公示异议、学校申诉或正式复核结果；异议人/受理机关；公示异议、学校申诉或正式复核结果；异议人/受理机关；异议书、受理编号、答复/复查决定，分类型保存；T/E/F/H，U8b/U8c；F040/F041；SRC-001/003/004/005/006/007；受理单位、异议时点、证据、反驳机会、处理版本；P3；未经调查不得当作纪律事实；无受理渠道 POLICY_UNCONFIRMED；源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "公示异议、学校申诉或正式复核结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "验证操作人与签发权限",
      "purpose": "验证操作人与签发权限；校方认证和授权服务；验证操作人与签发权限；校方认证和授权服务；岗位授权、有效会话、签名/审批事件审计（不收凭据明文）；C/B–H，写操作均需；F015/F041；SRC-012（仅技术要求）；可信主体、组织、动作、caseID、日志时点、撤权版本；没有可验证授权时不允许产生正式写动作 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "验证操作人与签发权限",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "复用其他 G50/S/T 已决定事实",
      "purpose": "复用其他 G50/S/T 已决定事实；原业务有权机关；复用其他 G50/S/T 已决定事实；原业务有权机关；签发决定 ID、状态、有效范围、版本及最小事实视图；T/C/H，U10 或综测等引用；F020/F029/F041；SRC-012（待对表）；原系统/原案 ID、源版本、签发人及是否撤销；未能核源 SOURCE_UNAVAILABLE；与新源冲突 CONFLICT；严禁本模板双写决定",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "复用其他 G50/S/T 已决定事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "十佳大学生申报审批表及推荐汇总表",
      "purpose": "十佳大学生申报审批表及推荐汇总表；申请人/学院/学校分阶段填写；十佳大学生申报审批表及推荐汇总表；申请人/学院/学校分阶段填写；SRC-004 所列“成都理工大学‘十佳大学生’审批表”及第十三届参评情况汇总表；仅核到附件标题，正文未读；T/B–F，U4；F004/F014/F024–F025/F028/F030–F036；SRC-004；申请栏归本人，学院推荐和学校签批栏必须后续生成；表单版本绑定年度；当期是否仍使用 U；B 只核当期要求的申请部分，绝不要求空白申请时已有审批签章",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "十佳大学生申报审批表及推荐汇总表",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-review",
      "name": "审核规则逐条清单",
      "description": "逐条映射原件第 08 节规则；只生成本地事实核验、证据差异与人工复核建议。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · H 当期批次及校级依据",
          "requirement": "原件 R001：；A–H 当期批次及校级依据；T：有该荣誉当期有效校级通知；F：不存在此批次的有权发布（须正式查实）；U：是否已发布不明；F002/F003/F016/F042；M001；SRC-002/003/004/005/006/009/010/011。核发文机关、适用学年/学段/类型、生效及取证位置；P1 校方正式通知；历史细则只定位结构；当期修订需处理新旧效力；T→PASS_FACT（仅“有效政策已定位”）；F/U→POLICY_UNCONFIRMED，不自动认定申报失败；下一人本科学生工作部或研工部政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · H 学院实施细则与校院层级",
          "requirement": "原件 R002：；A–H 学院实施细则与校院层级；T：当期适用学院确有合法细化要求；F：校级明确不要求学院细则；U：授权范围不明；F003/F004/F012/F042；M001/M002；SRC-003/004/005/009/011。核院名、荣誉层级、细则条款与校级授权对应；P1/P2 原始发布；学院换届/文件修订不可继承；校级干部与院级干部不得混用；T→PASS_FACT；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED；矛盾 CONFLICT；学院政策管理员/学工部。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · C 荣誉类型、个人对象与办案路由",
          "requirement": "原件 R003：；A–C 荣誉类型、个人对象与办案路由；T：类型属于当期授权个人荣誉；F：明确为集体、国奖、经济资助、其他独立授予目的；U：十佳/团学专项归属尚未证实；F001/F002/F004/F029；M001/M002/M027/M028；SRC-001/003/004/005/006/008/012。对荣誉类别、授予机关、R02 邻接对象核名与原决定；以当期奖项目录 P1 为准；G50/R02 未取得，不从名称推断同一决定；T→PASS_FACT；F→NOT_APPLICABLE 并建议有权业务路由；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一人模板业务 Owner 与学工/研工归口。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · H 申请人与材料归属一致",
          "requirement": "原件 R004：；B–H 申请人与材料归属一致；T：申请存在并含可定位身份；F：仅阶段 A 未开案；U：身份键缺失；F001/F005/F006/F014；M003/M004；SRC-003/004/005/006/007。用校方学生主键匹配姓名历史、附件归属、本人行；P1 校内学籍；P3 表单只能辅证；同名不同人绝不合并；相符事实→PASS_FACT；申请人漏填可补 NEEDS_MATERIAL；两有效身份矛盾 CONFLICT；校方身份源断 SOURCE_UNAVAILABLE；下一人学生/学籍员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · /C 学段与培养类型",
          "requirement": "原件 R005：；B/C 学段与培养类型；T：荣誉要求某学段/培养方式；F：奖项合法不区分；U：政策或记录不明；F007/F008/F004；M001/M003；SRC-001/003/004/005/006/007/010。比学籍学段、培养性质和公告适用对象；P1 学籍/政策；研究生不套本科门槛；特殊身份以当期办法解释；T 且身份值可证→PASS_FACT（记录正/反）；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED 或 SOURCE_UNAVAILABLE；学籍部门/归口部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · /C 评选期间在籍与注册",
          "requirement": "原件 R006：；B/C 评选期间在籍与注册；T：当期要求在籍/注册；F：公告确认为无需该条件；U：身份有效期不明；F009/F010/F016；M001/M003；SRC-003/004/005/007/009/011。按学年逐段核注册与休学/保留/退学生效日；P1 原始学籍历史；不能由上传在读截图作“全期注册”；T 且状态可证→PASS_FACT（记录是否满足具体事实）；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；学籍员、评优人工审核者。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · /C 年级、班级及排名总体",
          "requirement": "原件 R007：；B/C 年级、班级及排名总体；T：荣誉有年级/班级范围；F：明确不分；U：当前范围不明；F011/F012/F016；M001/M003；SRC-003/004/005/007/009/011。核年度年级和班级唯一归属，不用当前班级反推往年；P1 学籍历史；入学、留级、降级等需按生效期；确定→PASS_FACT；不适用→NOT_APPLICABLE；源断 SOURCE_UNAVAILABLE，政策未知 POLICY_UNCONFIRMED，两个归属冲突 CONFLICT；学院学籍/评优经办人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · /C/H 跨院、转专业、复学及归口",
          "requirement": "原件 R008：；B/C/H 跨院、转专业、复学及归口；T：发生过有效状态/学院变更；F：权威记录确认未发生；U：变更史未知；F009–F013/F016/F038；M001/M002/M003/M015；SRC-003/007/009/011。逐时间段核原/现学院与归口规则；P1 变更生效文书；数学学院历史“原学院评优”不能跨年继承；T→PASS_FACT（仅变更事实），归口政策未明 POLICY_UNCONFIRMED/人工；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE；学籍员、当期评优负责人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · 申报意愿、提交者与代理",
          "requirement": "原件 R009：；B 申报意愿、提交者与代理；T：本次实行个人申请；F：有权规则明确组织推荐不需本人申请；U：允许谁代办不明；F014/F015/F041；M004/M026；SRC-003/004/005/006/011/012。核本人真实声明、可信提交身份、代理授权凭证；P1 认证事件+P3 本人签表；必须区分学生申请和组织代填；有权本人提交→PASS_FACT；F→NOT_APPLICABLE；真正缺本人申请 NEEDS_MATERIAL；代办授权不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；申请人/身份管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · F 本阶段受理截止",
          "requirement": "原件 R010：；B–F 本阶段受理截止；T：当期已明示该阶段截止；F：有权规定明确无时限；U：期限文件未得；F002/F014/F038–F042；M001/M002/M004/M023/M024/M025；SRC-003/004/005/006/009/010/011。比事件时间、公告时区、受理阶段；P1 公告及可信事件时间；历史日期绝不用于当年；逾期可否例外属裁量；T→PASS_FACT（早/晚事实），逾期如何处理 NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED；当期受理机构。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · 各资格指标统计周期",
          "requirement": "原件 R011：；C 各资格指标统计周期；T：当期规定统计学期/学年；F：指标不使用期间；U：时间窗未知；F016/F017–F028；M001/M002/M005–M014；SRC-003/004/005/009/010/011。对成绩/综测/任职/处分/成果统一核各自时间窗；P1 适用当期政策+P1 指标记录；申报时间≠统计期间；T→PASS_FACT（区间匹配与否）；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；归口政策管理员及各数据机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · GPA 数值、算法和校院标准",
          "requirement": "原件 R012：；C GPA 数值、算法和校院标准；T：该荣誉当期明确 GPA 条件；F：明确不需要 GPA；U：阈值/算法不明；F017/F003/F004/F016；M001/M002/M005；SRC-003/004/005/009/010/011。按同一时段/算法核 GPA 事实；数值门槛只能由已核准配置读入；P1 成绩报表；2025 校优干部 2.5、院优干部 2.0 仅历史结构例证；分数真值 PASS_FACT（含低于经核准门槛之事实），无政策时 POLICY_UNCONFIRMED，不适用 NOT_APPLICABLE；成绩断源 SOURCE_UNAVAILABLE；教务/政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · 成绩排名、分母及统计总体",
          "requirement": "原件 R013：；C 成绩排名、分母及统计总体；T：当期规定成绩排名/百分位；F：无此条件；U：总体或阈值不明；F018/F011/F016；M001/M005；SRC-003/004/005/009/010/011。以权威排名及人数分母核同一班/专业/年级、有效时点；P1 成绩排名原表；名次无分母不可自算百分比；并列规则需当期解释；完整事实→PASS_FACT；F→NOT_APPLICABLE；总体冲突 CONFLICT、缺官方总体 SOURCE_UNAVAILABLE、政策疑义 POLICY_UNCONFIRMED；教务/政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · 课程不合格、补考与重修区分",
          "requirement": "原件 R014：；C 课程不合格、补考与重修区分；T：当期规定对应课程状态限制；F：明确不使用；U：原文术语不明确；F019/F016；M001/M005/M006；SRC-003/004/005/009/011。逐课程代码、考试类别、原始与补后成绩核事实；P1 教务考核记录；“不合格”“重修”“补考”各是不同命题；机电旧文疑笔误不由模型修正；已核各种记录→PASS_FACT（含不利事实）；F→NOT_APPLICABLE；术语不明 POLICY_UNCONFIRMED，记录矛盾 CONFLICT；教务/政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · 综测最终分与有效排名",
          "requirement": "原件 R015：；C 综测最终分与有效排名；T：当期本科荣誉要求综测；F：研究生或当期明确不用；U：综测排名总体/决定版本不明；F020/F029/F016；M001/M007/M027；SRC-003/004/005/012。比 S03-T01 原决定 ID、本人排名总体、有效版号；P1 综测权威确认结果；不得二次计算加分，公示后申诉改分重取版本；来源真确→PASS_FACT；F→NOT_APPLICABLE；源断 SOURCE_UNAVAILABLE，版本对立 CONFLICT，门槛不明 POLICY_UNCONFIRMED；S03-T01 结果机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · 体育测试及有效免测处理",
          "requirement": "原件 R016：；C 体育测试及有效免测处理；T：当期明确体测条件；F：明确不适用；U：等级或例外边界不明；F021/F016；M001/M008；SRC-003/004/005/009/011。核成绩、等级、测试时间及有权免测决定；P1 体育主管机关；数学旧文“良好（60分）”疑义不自解释；免测不等于未参加且不合格；事实可证→PASS_FACT；F→NOT_APPLICABLE；政策歧义 POLICY_UNCONFIRMED、源断 SOURCE_UNAVAILABLE；体育主管部门/政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · 学生干部任职事实",
          "requirement": "原件 R017：；C 学生干部任职事实；T：U2/U3 干部/U6；F：非干部荣誉且无此条件；U：岗位目录或任期不明；F022/F016/F004；M001/M002/M009；SRC-003/004/005/010/011。核任命机关、组织、岗位及有效任期交集；P1 任命/换届文件；岗位相似名不当然等同有效职务，研究生不套本科任期；任职事实可证→PASS_FACT；F→NOT_APPLICABLE；规定不明 POLICY_UNCONFIRMED，任命记录断链 SOURCE_UNAVAILABLE；任职单位/学工研工。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · /D 干部实际履职与考核",
          "requirement": "原件 R018：；C/D 干部实际履职与考核；T：适用干部称号且考核已达形成阶段；F：非干部称号；U：评价制度/阶段是否到达不明；F023/F030/F031；M009/M010/M016/M017；SRC-003/004/005/010/011。比评价对象、周期与签发单位，不以自述替代考核；P1/P2 签发评价；D 前尚未形成评议不记漏件；突出业绩是组织裁量；评价存在与归属 PASS_FACT；F→NOT_APPLICABLE；应由组织评价而未作→NEEDS_HUMAN_DECISION；政策未知 POLICY_UNCONFIRMED；任职组织/辅导员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · /C 申报事迹是否有对应材料",
          "requirement": "原件 R019：；B/C 申报事迹是否有对应材料；T：U4 或本批次要求事迹清单；F：非事迹型且当期不要求；U：表单/类别未知；F024/F014；M004/M011/M028；SRC-003/004/005/009/011。逐申报事迹核证书/记录对应的本人页栏及编号；P3 候选材料可确认已提供，真正事实真伪另用 R020；十佳表仅得标题；已提供对应材料→PASS_FACT（仅提交事实）；缺本人应交→NEEDS_MATERIAL；坏页 UNREADABLE；F→NOT_APPLICABLE；本人/辅导员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · /D 事迹归属、真实性及署名",
          "requirement": "原件 R020：；C/D 事迹归属、真实性及署名；T：提交成绩/竞赛/论文/专利等成果；F：无成果申报且无条件；U：成果主体不明；F024/F025/F005/F016；M003/M011；SRC-003/004/005。核主办机构、证书号、时间、申请人署名/位次与原发布位置；P1/P2 官方成果源高于 P3 证书；“突出”不能靠证书真伪推出；可证归属→PASS_FACT；F→NOT_APPLICABLE；权威源断 SOURCE_UNAVAILABLE；无法验真/综合价值→NEEDS_HUMAN_DECISION；成果权威机关/学院评委。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · /H 处分及解除/撤销状态",
          "requirement": "原件 R021：；C/H 处分及解除/撤销状态；T：当期对有效处分设置资格条件或异议涉及处分；F：无适用性且无争议；U：规则或处分状态未明；F026/F016/F040；M001/M012/M025；SRC-001/003/004/005/009/011。核本人处分文号、事件/生效/解除/撤销日及政策统计期；P1 处分与解除决定；SRC-001 第 57 条要求正视解除后的权益，不将历史处分永久化；法定事实可证→PASS_FACT（记录含解除状态）；F→NOT_APPLICABLE；两有效文书抵牾 CONFLICT；影响资格须人工解释 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；处分机关/学工。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 通报、住宿违规等事实",
          "requirement": "原件 R022：；C 通报、住宿违规等事实；T：当期细则明列此类条件；F：当期未列且无相关证据义务；U：是否列入不明；F027/F016；M001/M002/M013；SRC-003/005/009/011。核有权部门通报、事件日期及撤销/纠正情况；P1 正式通报；学生被传闻或评论不能定为违规；无记录须有覆盖期足够的权威查询；有效通报或明确无记录→PASS_FACT；F→NOT_APPLICABLE；校方源断 SOURCE_UNAVAILABLE，未经核实举报 NEEDS_HUMAN_DECISION；学生管理部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 已获荣誉与十佳既往条件",
          "requirement": "原件 R023：；C 已获荣誉与十佳既往条件；T：U4 或现行类型明确要核既有荣誉；F：无此条件；U：当期附加资格未明；F028/F036/F004；M001/M014/M022/M028；SRC-004/005/009/011。查原学校表彰文件、颁发单位、荣誉等级、撤销状态；P1 正式获奖记录优先 P3 奖状；过往一次推荐不等于曾经获奖；事实确证→PASS_FACT；F→NOT_APPLICABLE；证书与正式文相矛盾 CONFLICT、源断 SOURCE_UNAVAILABLE；档案/政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · /H 邻接 S03-T01 / G50 等引用效力",
          "requirement": "原件 R024：；C/H 邻接 S03-T01 / G50 等引用效力；T：本事项需要引用其他业务权威结果；F：此荣誉及事实并不要求引用；U：是否需要及对应业务不明；F020/F029/F038；M007/M027；SRC-001/003/004/005/012。核源案、被批准事项、签发者、终态、源版本和允许的效力范围；可信源决定 P1；原模板版本更新须重取；国奖决定不等于校优决定；引用完整且有效→PASS_FACT；F→NOT_APPLICABLE；T 但所需结果不存在或无法取回 SOURCE_UNAVAILABLE、两个原源矛盾 CONFLICT、目录未核 POLICY_UNCONFIRMED；原业务 Owner。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · F 十佳表单分阶段内容",
          "requirement": "原件 R025：；B–F 十佳表单分阶段内容；T：U4 且当期确采用此表；F：其他荣誉；U：当期表/正文未得；F004/F014/F024/F025/F028/F030–F036；M004/M028/M016–M022；SRC-004/009/011。按“本人填报—学院签审—学校审批”分栏核已有版本；P1 正式现用表；只有旧附件标题，无正文，当前所有“必填栏”都待确认；后续签章不能作 B 必交；B 阶段已有合法申请部分→PASS_FACT；F→NOT_APPLICABLE；表单依据未明 POLICY_UNCONFIRMED；已到相关签批阶段尚未办理→NEEDS_HUMAN_DECISION；学院/学工部。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · 本科民主评议/推荐",
          "requirement": "原件 R026：；D 本科民主评议/推荐；T：进入且有授权的 D 评议流程；F：尚在 A–C 或当期不设此步；U：研究生组织层级尚未确认；F030/F041；M016/M026；SRC-003/004/005/006/010。核评议组织、会议/投票版本、候选本人行、时间及签名；P1/P2 有权组织签发；不能要求 B 阶段申请人交 M016；票数择优由组织决定；完成记录存在→PASS_FACT（存在性）；F→NOT_APPLICABLE；授权不明 NEEDS_HUMAN_DECISION；应办理未办→目标评议组织待办。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · 辅导员/班主任事实核验签发",
          "requirement": "原件 R027：；D 辅导员/班主任事实核验签发；T：当期此角色审核且已到 D；F：尚未到 D 或当期不设；U：岗位/代理权限未证；F031/F041；M017/M026；SRC-003/004/005/012。核签发者身份、组织、有效授权、本人意见栏；P1 可信审核事件+P2 原始签名；学生上传同名图片不作审批；有权签发事实→PASS_FACT；F→NOT_APPLICABLE；身份/授权不实 NEEDS_HUMAN_DECISION；下一人辅导员/授权负责人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · 学院审议与推荐",
          "requirement": "原件 R028：；E 学院审议与推荐；T：正式进入学院审核；F：未到 E 或该层级政策不设；U：研究生/院级独立权限不明；F032/F041/F004；M018/M026；SRC-003/004/005/006/010。核学院有权组织/议事记录、本人行、推荐结果与版本；P1 审议记录；“推荐通过”只写学院意见，不得晋级为校方授予；存在合法推荐记录→PASS_FACT；F→NOT_APPLICABLE；授权/名额择优 NEEDS_HUMAN_DECISION；下一人学院评议组。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · 学院公示及异议受理事实",
          "requirement": "原件 R029：；E 学院公示及异议受理事实；T：该类型/阶段确须学院公示且已经进入 E；F：未进入或正式取消此步；U：时长/渠道不明；F033/F040/F042；M019/M025；SRC-003/004/005/010/011。核公告发布部门、本人行、公示起止及有无登记异议；P1/P2 公告+受理台账；历史“3 工作日”不得跨批次启用；未有答复不等于无异议；有证据→PASS_FACT（公示状态）；F→NOT_APPLICABLE；渠道未知 POLICY_UNCONFIRMED、来源断 SOURCE_UNAVAILABLE、异议待裁决 NEEDS_HUMAN_DECISION；学院公示机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 · 校级归口审查/推荐状态",
          "requirement": "原件 R030：；F 校级归口审查/推荐状态；T：正式移送学工/研工校级环节；F：尚未移送；U：院级荣誉是否独立签发未明；F034/F041/F004；M020/M026；SRC-002/003/004/005/006/010。核真实签发身份、接收文号/本人行和所审对象；P1 学工/研工原始审定；截图“审核通过”不等于有权校级结论；签发记录可证→PASS_FACT；F→NOT_APPLICABLE；角色/是否应移送疑义 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；校级归口部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031 · 校级拟名单公示与处理",
          "requirement": "原件 R031：；F 校级拟名单公示与处理；T：当期规定发布校级公示且已到 F；F：尚未到 F 或有权政策免除；U：时限及受理口径未知；F035/F040/F042；M021/M025；SRC-003/004/005/006/010/011。核学校公示页、名单版本、本人行、异议受理及处理记录；P1/P2 正式公示；SRC-006 只验证 2025 研究生拟推荐名单，不验证最终奖项；可核公示状态→PASS_FACT；F→NOT_APPLICABLE；异议未处理 NEEDS_HUMAN_DECISION、网页断 SOURCE_UNAVAILABLE；学校发布/受理机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032 · /G 正式荣誉授予决定",
          "requirement": "原件 R032：；F/G 正式荣誉授予决定；T：相应机关正式做出决定且需确认其生效；F：尚在推荐或公示、正式决定尚未发生；U：最终签发权未核；F036/F004/F005/F041；M022/M026；SRC-001/002/003/004/005/006/010。核文号、授权、本人、称号、层级、生效与撤销状态；校级以学校有权机关 P1 正式文件/可验档案为准；院级是否允许学院独立签发须现行制度证明；正式决定由对应有权机关产生；本 R 只记录 PASS_FACT（“是否存在且可验”）或 NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE（未到此阶段），不可把推荐名单变成批准；有权授予/档案机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "R033 · 档案与附带物质奖励只读关联",
          "requirement": "原件 R033：；G 档案与附带物质奖励只读关联；T：正式荣誉已生效并进入归档/奖项关联；F：无奖励/尚未生效；U：奖额/支付对象不明；F036/F037/F029；M022/M027；SRC-001/004/005/008/012。仅核荣誉正式档案索引、另项有权奖励决定引用；P1 有效表彰及财务决定；不存银行卡、不将历史金额赋默认值；荣誉档案/关联存在→PASS_FACT；F→NOT_APPLICABLE；财务来源断 SOURCE_UNAVAILABLE；支付/金额不由本模板决定；学校档案/财务。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "R034 · 补件或权威源材料换版",
          "requirement": "原件 R034：；H 补件或权威源材料换版；T：新证据替代同对象同事实旧证据；F：无修订事件；U：新旧归属/生效时间不明；F038/F017–F029/F041；M024 与被修改的原 M；SRC-003/004/005/009/011/012。比旧/新 hash、源版本、事实有效期，按依赖图失效受影响 R；P1 原机关修订优先；上传新版不能覆盖未撤销的权威版；E/F/G 后须原权责机关介入；变更可定位→PASS_FACT（事件事实）并定向重审；F→NOT_APPLICABLE；互斥有效版 CONFLICT；逾期受理 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；原审核者。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "R035 · 主动撤回请求与受理",
          "requirement": "原件 R035：；H 主动撤回请求与受理；T：提出本人撤回请求；F：未提出；U：受理权限/能否撤回不明；F039/F014/F041；M023/M003/M026；SRC-003/006/011/012。核请求本人、原案、受理号、申请阶段、处理动作签发者；P1 已认证本人请求及有权受理回执；接收请求不等于准予撤回；G 后撤销荣誉非撤回；已收到请求的事实→PASS_FACT，但状态保持待受理；F→NOT_APPLICABLE；处理权限未知 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；原受理机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "R036 · /F/H 异议、申诉与复核路径",
          "requirement": "原件 R036：；E/F/H 异议、申诉与复核路径；T：有正式公示异议或申诉/复核请求；F：无请求；U：具体路径/时限未知；F040/F033/F035/F041/F042；M019/M021/M025/M026；SRC-001/003/004/005/006/007/010/011。核原决定对象、受理机关、实名材料及处理签发版本；P1 正式受理/复核记录；公示异议与法定学生申诉两种程序不得合流；指控非已证事实；请求已证→PASS_FACT（受理存在），实体复核 NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；期限/管辖未知 POLICY_UNCONFIRMED；受理/复核机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "R037 · /H 正式荣誉撤销或纠正效力",
          "requirement": "原件 R037：；G/H 正式荣誉撤销或纠正效力；T：已有有效授予文件且学校启动正式撤销/更正；F：无正式授予或只有举报；U：撤销权限、适用规定不明；F036/F037/F040/F026/F041；M012/M022/M025/M026；SRC-001/003/004/005/010/011。核原决定、调查处置、撤销文号、签发机关与生效时点；P1 撤销/更正文书；举报、AI 判定、个人请求均不构成撤销；正式更正存在且可验→PASS_FACT（登记新效力）；F→NOT_APPLICABLE；权限或事实裁量 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；学校原有权机关。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "R038 · H 每次写操作的可信主体与范围",
          "requirement": "原件 R038：；B–H 每次写操作的可信主体与范围；T：即将提交/核验/推荐/公示/批准/撤销/复核等写动作；F：纯只读研究；U：会话/岗位授权无法核实；F015/F041/F001；M026/M004/M016–M025；SRC-002/003/004/005/006/012。检验服务端身份、岗位/组织、动作权限、案卷绑定、阶段和审计链；P1 后端认证授权与原文书；Renderer actor、图片“章”均为 P4；实际接口目前未审；授权可证→PASS_FACT（仅准许申请该动作）；F→NOT_APPLICABLE；U/冒名→NEEDS_HUMAN_DECISION 并拒绝正式状态写入；可信身份服务/对应主管。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "a",
      "name": "批次公布及参评条件配置",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "b"
    },
    {
      "id": "b",
      "name": "个人申报/自评",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "c"
    },
    {
      "id": "c",
      "name": "材料事实预审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "d"
    },
    {
      "id": "d",
      "name": "民主评议与推荐",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "e"
    },
    {
      "id": "e",
      "name": "学院审核、公示及异议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "f"
    },
    {
      "id": "f",
      "name": "校级复核、公示及审批",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "g"
    },
    {
      "id": "g",
      "name": "生效记录、档案及附带奖励",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "h"
    },
    {
      "id": "h",
      "name": "后续补正、异议复核、撤回/撤销",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
      "kind": "item-feedback",
      "audience": "student"
    },
    {
      "id": "human-review-todo",
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

export const r02Metadata: R02Metadata = {
  "templateId": "S03-T05",
  "name": "学生先进个人、荣誉称号及评优资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T05.md",
  "sourceDocumentSha256": "6374543295c0ecd3d689235e196d667ca2d040889b6fea1fb778cf12083a7f83",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
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
    "SRC-013"
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
    "F042"
  ],
  "materialIds": [
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
    "M022",
    "M023",
    "M024",
    "M025",
    "M026",
    "M027",
    "M028"
  ],
  "criteria": [
    {
      "sectionId": "rule-review",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F003",
        "F016",
        "F042"
      ],
      "materialIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003",
        "F004",
        "F012",
        "F042"
      ],
      "materialIds": [
        "M001",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F004",
        "F029"
      ],
      "materialIds": [
        "M001",
        "M002",
        "M027",
        "M028"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F005",
        "F006",
        "F014"
      ],
      "materialIds": [
        "M003",
        "M004"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F007",
        "F008",
        "F004"
      ],
      "materialIds": [
        "M001",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F009",
        "F010",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F011",
        "F012",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F016",
        "F038"
      ],
      "materialIds": [
        "M001",
        "M002",
        "M003",
        "M015"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F014",
        "F015",
        "F041"
      ],
      "materialIds": [
        "M004",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F038",
        "F039",
        "F040",
        "F041",
        "F042",
        "F002",
        "F014"
      ],
      "materialIds": [
        "M001",
        "M002",
        "M004",
        "M023",
        "M024",
        "M025"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
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
        "F016"
      ],
      "materialIds": [
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
        "M001",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F017",
        "F003",
        "F004",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M002",
        "M005"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F018",
        "F011",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M005"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F019",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F020",
        "F029",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M007",
        "M027"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F021",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M008"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F022",
        "F016",
        "F004"
      ],
      "materialIds": [
        "M001",
        "M002",
        "M009"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F023",
        "F030",
        "F031"
      ],
      "materialIds": [
        "M009",
        "M010",
        "M016",
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F024",
        "F014"
      ],
      "materialIds": [
        "M004",
        "M011",
        "M028"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F024",
        "F025",
        "F005",
        "F016"
      ],
      "materialIds": [
        "M003",
        "M011"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F026",
        "F016",
        "F040"
      ],
      "materialIds": [
        "M001",
        "M012",
        "M025"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F027",
        "F016"
      ],
      "materialIds": [
        "M001",
        "M002",
        "M013"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F028",
        "F036",
        "F004"
      ],
      "materialIds": [
        "M001",
        "M014",
        "M022",
        "M028"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F020",
        "F029",
        "F038"
      ],
      "materialIds": [
        "M007",
        "M027"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F030",
        "F031",
        "F032",
        "F033",
        "F034",
        "F035",
        "F036",
        "F004",
        "F014",
        "F024",
        "F025",
        "F028"
      ],
      "materialIds": [
        "M016",
        "M017",
        "M018",
        "M019",
        "M020",
        "M021",
        "M022",
        "M004",
        "M028"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F030",
        "F041"
      ],
      "materialIds": [
        "M016",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F031",
        "F041"
      ],
      "materialIds": [
        "M017",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F032",
        "F041",
        "F004"
      ],
      "materialIds": [
        "M018",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F033",
        "F040",
        "F042"
      ],
      "materialIds": [
        "M019",
        "M025"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F034",
        "F041",
        "F004"
      ],
      "materialIds": [
        "M020",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-003",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F035",
        "F040",
        "F042"
      ],
      "materialIds": [
        "M021",
        "M025"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F036",
        "F004",
        "F005",
        "F041"
      ],
      "materialIds": [
        "M022",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F036",
        "F037",
        "F029"
      ],
      "materialIds": [
        "M022",
        "M027"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
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
        "F038",
        "F041"
      ],
      "materialIds": [
        "M024"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F039",
        "F014",
        "F041"
      ],
      "materialIds": [
        "M023",
        "M003",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F040",
        "F033",
        "F035",
        "F041",
        "F042"
      ],
      "materialIds": [
        "M019",
        "M021",
        "M025",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r037",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F036",
        "F037",
        "F040",
        "F026",
        "F041"
      ],
      "materialIds": [
        "M012",
        "M022",
        "M025",
        "M026"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r038",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F015",
        "F041",
        "F001"
      ],
      "materialIds": [
        "M016",
        "M017",
        "M018",
        "M019",
        "M020",
        "M021",
        "M022",
        "M023",
        "M024",
        "M025",
        "M026",
        "M004"
      ]
    }
  ]
}

export default templateVersion
