import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion }

export type R02EvidenceStatus = 'verified' | 'partial' | 'unconfirmed'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; fieldIds: string[]; materialIds: string[] }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; officialSchoolTemplate: false; researchAsOf: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; sourceIds: string[]; fieldIds: string[]; materialIds: string[]; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S03-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "国家奖学金（含研究生对应情形）申报审核",
  "description": "本地研究模板 · 非校方正式模板。用于国家奖学金（含研究生对应情形）申报审核的材料核验和人工审阅建议；政策/授权未确认时不得形成正式通过或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本定义由 R02 研究交接稿转换，不是成都理工大学正式发布模板；SRC 为研究来源索引，不是案卷材料 SourceRef；未确认政策由有权人员人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "S03-T02 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · string 案卷 P1–P6：Case ID",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001。string 案卷 P1–P6：Case ID；后端/M；未绑定禁止审查。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f002",
      "label": "F002 · string 批次 P0–P6：年度、批次",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002。string 批次 P0–P6：年度、批次；当期校通知 SRC-012/M；POLICY_UNCONFIRMED。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f003",
      "label": "F003 · enum 学生 P1：本科/硕士/博士/转段未知",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003。enum 学生 P1：本科/硕士/博士/转段未知；学籍系统 SRC-001/007/H；交学籍主管。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f004",
      "label": "F004 · string 学生 P1：实名主体和学号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F004。string 学生 P1：实名主体和学号；可信身份服务/H；不采信表单自报。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f005",
      "label": "F005 · enum 学生 P1：国籍核验状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F005。enum 学生 P1：国籍核验状态；法定身份源 SRC-001/007/H；SOURCE_UNAVAILABLE。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f006",
      "label": "F006 · object 学生 P1：全日制、注册、休学、在校状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F006。object 学生 P1：全日制、注册、休学、在校状态；学籍/注册源 SRC-001/H；待权威核。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f007",
      "label": "F007 · object 学生 P1：学院专业年级与变更史",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F007。object 学生 P1：学院专业年级与变更史；学籍源/M；冲突交主管。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f008",
      "label": "F008 · object 批次 P0：校院文件与版本、发布日期",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F008。object 批次 P0：校院文件与版本、发布日期；当期签发通知 SRC-002/012/M；政策未知。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f009",
      "label": "F009 · object 批次 P0：校院分配名额及审批",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F009。object 批次 P0：校院分配名额及审批；当年校级配额 SRC-001 §12–14/M；不复用往年。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f010",
      "label": "F010 · range 批次 P0：申报/补件/异议窗口",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F010。range 批次 P0：申报/补件/异议窗口；当期通知 SRC-012/M；不硬判超期。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f011",
      "label": "F011 · object 申请 P1：申请表版本/受理回执",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F011。object 申请 P1：申请表版本/受理回执；官方受理渠道 SRC-001 §20/M；待补件。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f012",
      "label": "F012 · object 本科 P1：成绩、排名、排名母数",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F012。object 本科 P1：成绩、排名、排名母数；教务权威源 SRC-007/H；截图非决定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f013",
      "label": "F013 · object 本科 P1：综测分数排名及口径",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F013。object 本科 P1：综测分数排名及口径；S03-T01 已签结果/M；不自行加分。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f014",
      "label": "F014 · object 研究生 P1：课程与环节成绩",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F014。object 研究生 P1：课程与环节成绩；研究生培养部门 SRC-001 §11/H；待核。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f015",
      "label": "F015 · object 研究生 P1：转博注册/考试/课程阶段",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F015。object 研究生 P1：转博注册/考试/课程阶段；研究生院 SRC-001 §5/H；人工消歧。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f016",
      "label": "F016 · array 学生 P1：成果 ID、日期、作者、第一单位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F016。array 学生 P1：成果 ID、日期、作者、第一单位；证书源/出版或专利权威源 SRC-001 §6/H；原件线索需查验。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f017",
      "label": "F017 · array 学生 P2：既往获奖及成果使用历史",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F017。array 学生 P2：既往获奖及成果使用历史；校奖助业务台账 SRC-001 §7–8/H；源不可用。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f018",
      "label": "F018 · enum 学生 P2：纪律和学术诚信正式认定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F018。enum 学生 P2：纪律和学术诚信正式认定；有权主管决定 SRC-001 §11/26/H；举报非事实。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f019",
      "label": "F019 · object 研究生 P2：缴费、贷款/缓缴与注册",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F019。object 研究生 P2：缴费、贷款/缓缴与注册；财务、学籍源 SRC-001 §11/H；合法替代可受理。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f020",
      "label": "F020 · object 学院 P3：细则、公示、备案版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F020。object 学院 P3：细则、公示、备案版本；学院/研究生院 SRC-001 §18–19/M；后置。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f021",
      "label": "F021 · object 学院 P3：答辩、回避、评分、推荐",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F021。object 学院 P3：答辩、回避、评分、推荐；学院委员会 SRC-001 §21/M；人工决定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f022",
      "label": "F022 · object 学院 P3：公示、异议及答复",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F022。object 学院 P3：公示、异议及答复；学院可信归档 SRC-001 §21–24/M；后置。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f023",
      "label": "F023 · object 学校 P4：审定、学校公示",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F023。object 学校 P4：审定、学校公示；校级有权组织 SRC-001/007/M；后置。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f024",
      "label": "F024 · object 结果 P5：上报回执与最终结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F024。object 结果 P5：上报回执与最终结果；校级/省级回执 SRC-001 §23/M；后置。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f025",
      "label": "F025 · object 请求 P6：撤回及受理状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F025。object 请求 P6：撤回及受理状态；可信申请+校方决定 SRC-012/H；程序待核。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f026",
      "label": "F026 · object 请求 P6：书面异议、院答复、校裁决",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F026。object 请求 P6：书面异议、院答复、校裁决；有权评审组织 SRC-001 §24/H；本科待核。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f027",
      "label": "F027 · object 证据 all：材料版本、哈希、归属",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027。object 证据 all：材料版本、哈希、归属；后端证据账/M；不可错绑。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f028",
      "label": "F028 · object 审计 all：规则指纹、Run、决定引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F028。object 审计 all：规则指纹、Run、决定引用；后端事件账/M；不冒充正式 Run。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "P1 申请",
      "purpose": "P1 申请；P1 申请；学生官方申请表/系统受理回执；F001/002/004/011; SRC-001/012",
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
        "P1 申请",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "P1 身份学籍",
      "purpose": "P1 身份学籍；P1 身份学籍；学籍部门可信接口/正式证明；F003–F007; SRC-001/007",
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
        "P1 身份学籍",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "P1 本科成绩排名",
      "purpose": "P1 本科成绩排名；P1 本科成绩排名；教务成绩排名签发/可信查询；F012; SRC-007",
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
        "P1 本科成绩排名",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "P1 本科综测",
      "purpose": "P1 本科综测；P1 本科综测；S03-T01 正式结果及版本；F013; SRC-003/007",
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
        "P1 本科综测",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "P1 研究生培养成绩",
      "purpose": "P1 研究生培养成绩；P1 研究生培养成绩；研究生院成绩和环节结果；F014; SRC-001",
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
        "P1 研究生培养成绩",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "P1 转段条件",
      "purpose": "P1 转段条件；P1 转段条件；研究生院注册、资格考或课程阶段证明；F015; SRC-001",
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
        "P1 转段条件",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "P1 成果条件",
      "purpose": "P1 成果条件；P1 成果条件；学生证书线索+出版/专利/颁奖权威核查；F016; SRC-001/003",
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
        "P1 成果条件",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "P2 既往获奖使用",
      "purpose": "P2 既往获奖使用；P2 既往获奖使用；奖助部门成果使用记录；F017; SRC-001",
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
        "P2 既往获奖使用",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "P2 纪律诚信",
      "purpose": "P2 纪律诚信；P2 纪律诚信；学生管理/学术主管正式处理决定；F018; SRC-001",
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
        "P2 纪律诚信",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "P2 研究生注册缴费",
      "purpose": "P2 研究生注册缴费；P2 研究生注册缴费；财务/注册证明；已批准缓缴、有效贷款手续替代；F006/019; SRC-001",
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
        "P2 研究生注册缴费",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "P0 当年批次",
      "purpose": "P0 当年批次；P0 当年批次；学校/学院正式通知、配额、窗口；F002/008–010; SRC-012",
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
        "P0 当年批次",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "P3 研究生学院细则",
      "purpose": "P3 研究生学院细则；P3 研究生学院细则；学院公示及主管备案记录；F020; SRC-001",
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
        "P3 研究生学院细则",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "P3 研究生答辩推荐",
      "purpose": "P3 研究生答辩推荐；P3 研究生答辩推荐；学院签发答辩、回避、推荐记录；F021; SRC-001",
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
        "P3 研究生答辩推荐",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "P3 学院公示",
      "purpose": "P3 学院公示；P3 学院公示；学院归档公示、异议答复；F022; SRC-001",
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
        "P3 学院公示",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "P4 学校审定公示",
      "purpose": "P4 学校审定公示；P4 学校审定公示；校级已签决定和学校公示；F023; SRC-001/007",
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
        "P4 学校审定公示",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "P5 报送与结果",
      "purpose": "P5 报送与结果；P5 报送与结果；正式报送/回执和结果归档；F024; SRC-001",
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
        "P5 报送与结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "P6 撤回",
      "purpose": "P6 撤回；P6 撤回；本人可信请求、学校受理/决定；F025; SRC-012",
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
        "P6 撤回",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "P6 复核申诉",
      "purpose": "P6 复核申诉；P6 复核申诉；书面申请、学院答复、学校裁决；F026; SRC-001",
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
        "P6 复核申诉",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "P2/P6 重传",
      "purpose": "P2/P6 重传；P2/P6 重传；新版原件与旧版差异、权威重签；F027/028; SRC-001/012",
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
        "P2/P6 重传",
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
          "title": "R001 · 当期正式批次及申请窗口是否可确认",
          "requirement": "原件 R001：P0 当期正式批次及申请窗口是否可确认；SRC-012; F002/008/010; M011；缺当期签发 POLICY_UNCONFIRMED→资助中心/研工部。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 学段学院配额是否有当期决定",
          "requirement": "原件 R002：P0 学段学院配额是否有当期决定；SRC-001 §12–14/012; F003/007/009; M011；无配额不排序→校级主管。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 申请表是否属当前案卷、本人、批次",
          "requirement": "原件 R003：P1 申请表是否属当前案卷、本人、批次；SRC-001 §20/012; F001/002/004/011/027; M001；归属冲突→申请人+业务受理人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · 申请身份与学籍记录一致",
          "requirement": "原件 R004：P1 申请身份与学籍记录一致；SRC-001 §5/007; F003/004/006/007; M002；不一致 CONFLICT→学籍部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · 国籍是否经可信记录满足适用条件",
          "requirement": "原件 R005：P1 国籍是否经可信记录满足适用条件；SRC-001 §6/007; F005; M002；无授权源→身份核验岗位。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · 研究生全日制、参评状态核对",
          "requirement": "原件 R006：P1 研究生全日制、参评状态核对；SRC-001 §5/9/11; F003/006; M002；状态例外→研究生院人工。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · 转段以资格考/注册/课程阶段判硕博参评层次",
          "requirement": "原件 R007：P1 转段以资格考/注册/课程阶段判硕博参评层次；SRC-001 §5; F003/015; M006；规则条件并列冲突→研究生院。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · 本科年级与参评范围核对",
          "requirement": "原件 R008：P1 本科年级与参评范围核对；SRC-007 §6–7/002; F003/007/008; M002/M011；校级细则缺失→本科资助管理部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · 本科成绩排名与权威成绩一致",
          "requirement": "原件 R009：P1 本科成绩排名与权威成绩一致；SRC-007 §7; F012; M003；母数或成绩异议→教务/S02。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · 本科综测排名是否来自已签结果",
          "requirement": "原件 R010：P1 本科综测排名是否来自已签结果；SRC-007 §7/003; F013; M004；不重算，异议→S03-T01。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · 本科突出表现例外是否具可验证事实",
          "requirement": "原件 R011：P1 本科突出表现例外是否具可验证事实；SRC-007 §7; F012/013/016; M003/M004/M007；例外准入及优秀程度→有权评审会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · 研究生课程、环节是否符合已签培养状态",
          "requirement": "原件 R012：P1 研究生课程、环节是否符合已签培养状态；SRC-001 §11; F014; M005；课程争议→培养部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · 研究生成果署名与第一单位真实性",
          "requirement": "原件 R013：P1 研究生成果署名与第一单位真实性；SRC-001 §6; F016; M007；质量评价→学院评审会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · 同一成果是否被过往国奖重复使用",
          "requirement": "原件 R014：P2 同一成果是否被过往国奖重复使用；SRC-001 §7–8; F016/017; M007/M008；使用记录冲突→奖助主管人工。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · 纪律处分或学术失范是否有正式认定",
          "requirement": "原件 R015：P2 纪律处分或学术失范是否有正式认定；SRC-001 §11/26; F018; M009；举报不足以否决→有权纪检/学术主管。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · 研究生注册缴费/合法暂缓手续事实",
          "requirement": "原件 R016：P2 研究生注册缴费/合法暂缓手续事实；SRC-001 §11; F006/019; M002/M010；贷款或缓缴冲突→财务/注册部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · 研究生学院细则公示及备案事实",
          "requirement": "原件 R017：P3 研究生学院细则公示及备案事实；SRC-001 §18–19; F020; M012；3 工作日须据可核日期→学院/研工部。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · 研究生公开答辩、回避记录是否齐备",
          "requirement": "原件 R018：P3 研究生公开答辩、回避记录是否齐备；SRC-001 §21; F021; M013；缺真实会议记录→学院委员会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · 研究生院级推荐及至少 5 工作日公示",
          "requirement": "原件 R019：P3 研究生院级推荐及至少 5 工作日公示；SRC-001 §21–22; F021/022; M013/M014；异议未结→学院委员会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · 学校审定、公示记录是否为可信签发且满适用期",
          "requirement": "原件 R020：P4 学校审定、公示记录是否为可信签发且满适用期；SRC-001 §23/007 §9; F023; M015；校院决定层级不一致→校级委员会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · 正式上报回执与当批次关联是否一致",
          "requirement": "原件 R021：P5 正式上报回执与当批次关联是否一致；SRC-001 §23; F024; M016；未上报不冒充最终获奖→业务归档岗。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 研究生书面申诉是否按院级答复/校级裁决层级记录",
          "requirement": "原件 R022：P6 研究生书面申诉是否按院级答复/校级裁决层级记录；SRC-001 §24; F022/026; M014/M018；仍需裁决→对应评审委员会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 撤回申请是否有正式受理及决定",
          "requirement": "原件 R023：P6 撤回申请是否有正式受理及决定；SRC-012; F025; M017；程序未知 POLICY_UNCONFIRMED→学校归口。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · /P6 新材料是否与正确人、批次和旧版建立链",
          "requirement": "原件 R024：P2/P6 新材料是否与正确人、批次和旧版建立链；SRC-001 §20/26; F001/002/027/028; M019；错案或旧哈希冲突→案卷负责人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 评后造假纠错是否已有有权认定及正式取消决定",
          "requirement": "原件 R025：P6 评后造假纠错是否已有有权认定及正式取消决定；SRC-001 §26; F018/024/026; M009/M016/M018；不能自动撤奖追回→学校有权机构。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "批次与规则生效确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "本人申请与初始资格事实",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "初核、补件与质疑",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "学院正式初评",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "校级审核、审定与公示",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "上报、结果归档与支付（仅只读核对；不执行校方写回）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "申诉、撤回或事后纠错",
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
  "templateId": "S03-T02",
  "name": "国家奖学金（含研究生对应情形）申报审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T02.md",
  "sourceDocumentSha256": "a7e54f29484ddca35dcd8625e991be91f167324a38acf273caede8c870fe9054",
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
    "SRC-012"
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
    "F028"
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
    "M019"
  ],
  "criteria": [
    {
      "sectionId": "rule-review",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002"
      ],
      "materialIds": [
        "M011"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003"
      ],
      "materialIds": [
        "M011"
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
        "F001"
      ],
      "materialIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003"
      ],
      "materialIds": [
        "M002"
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
        "F005"
      ],
      "materialIds": [
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003"
      ],
      "materialIds": [
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003"
      ],
      "materialIds": [
        "M006"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003"
      ],
      "materialIds": [
        "M002",
        "M011"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F012"
      ],
      "materialIds": [
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F013"
      ],
      "materialIds": [
        "M004"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F012"
      ],
      "materialIds": [
        "M003",
        "M004",
        "M007"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F014"
      ],
      "materialIds": [
        "M005"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F016"
      ],
      "materialIds": [
        "M007"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F016"
      ],
      "materialIds": [
        "M007",
        "M008"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F018"
      ],
      "materialIds": [
        "M009"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F006"
      ],
      "materialIds": [
        "M002",
        "M010"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F020"
      ],
      "materialIds": [
        "M012"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F021"
      ],
      "materialIds": [
        "M013"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F021"
      ],
      "materialIds": [
        "M013",
        "M014"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F023"
      ],
      "materialIds": [
        "M015"
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
        "F024"
      ],
      "materialIds": [
        "M016"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F022"
      ],
      "materialIds": [
        "M014",
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F025"
      ],
      "materialIds": [
        "M017"
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
        "F001"
      ],
      "materialIds": [
        "M019"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F018"
      ],
      "materialIds": [
        "M009",
        "M016",
        "M018"
      ]
    }
  ]
}

export default templateVersion
