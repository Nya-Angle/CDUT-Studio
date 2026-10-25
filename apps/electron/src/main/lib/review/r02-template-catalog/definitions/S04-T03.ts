import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02SourceMetadata { id: string; title: string; url?: string; sourceKind: string; evidenceStatus: R02EvidenceStatus; note: string }
export interface R02CriterionMetadata { sectionId: string; criterionId: string; ruleId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; execution: 'semantic' | 'manual' }
export interface R02TemplateMetadata { batchId: string; templateId: string; name: string; officialSchoolTemplate: false; researchStatus: string; policyEvidenceStatus: R02EvidenceStatus; researchAsOf: string; sourceSnapshot: string; sourceDocumentPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; originalSourcePath: string; originalSourceBlobSha1: string; lineEndingNormalization: string; sources: R02SourceMetadata[]; criteria: R02CriterionMetadata[]; reviewNotes: string[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S04-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "宿舍调整、调换及特殊住宿安排审核",
  "description": "本地研究模板 · 非校方正式模板。宿舍调整、调换及特殊住宿安排审核；仅核验事实、材料与分阶段流程，不产生学校正式批准/拒绝。政策证据状态：PARTIAL。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究原稿映射而来，非校方正式模板；SRC 为研究来源索引而非案卷 SourceRef；校规现行性、校区/学段范围、审批授权和办理系统未全部确认。正式决定必须由经学校确认的有权人员在真实校方流程中作出，本地 Agent 不得生成学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "宿舍调整、调换及特殊住宿安排审核（本地案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 案卷/全程；UUID，唯一申请",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F001；案卷/全程；UUID，唯一申请；可信 CaseAggregate；P；系统异常停核。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F002",
      "label": "F002 · 申请人/受理；学生 ID、学号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F002；申请人/受理；学生 ID、学号；学校学籍主数据，M001 候选；I；缺则 NEEDSMATERIAL，主数据不可达 SOURCEUNAVAILABLE。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F003",
      "label": "F003 · 申请人/受理；身份归口：本科/研究生/国际项目/其他、校区学院",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F003；申请人/受理；身份归口：本科/研究生/国际项目/其他、校区学院；学籍/项目归口，M001；I；未知转人工路由。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F004",
      "label": "F004 · 申请/受理；类型：个人、互换、学院集体、特殊协调",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F004；申请/受理；类型：个人、互换、学院集体、特殊协调；M002/M003；申请意愿；P；不明补充澄清。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F005",
      "label": "F005 · 申请/受理；理由类别+最小自由说明",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F005；申请/受理；理由类别+最小自由说明；M002/M004；S；无说明补件，不以理由关键词拒绝。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F006",
      "label": "F006 · 申请人/预审；现公寓楼寝室床位组合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F006；申请人/预审；现公寓楼寝室床位组合；M002 与住宿权威台账 M005；I；不一致 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F007",
      "label": "F007 · 申请人/预审；目标楼寝室床位或开放式协调诉求",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F007；申请人/预审；目标楼寝室床位或开放式协调诉求；M002/M004；I；特殊安排可为空，人工协调。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F008",
      "label": "F008 · 关联人/互换；学生 ID 与关联案卷/交换环编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F008；关联人/互换；学生 ID 与关联案卷/交换环编号；M006、可信身份；I；一方不明暂停联动。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F009",
      "label": "F009 · 关联人/互换；本人意愿：同意/撤回/未知、时间版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F009；关联人/互换；本人意愿：同意/撤回/未知、时间版本；各自授权确认 M006；S；未知不等于同意。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F010",
      "label": "F010 · 床位/资源核定；实际占用者、是否冻结、是否可分配",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F010；床位/资源核定；实际占用者、是否冻结、是否可分配；楼寓权威台账 M005/M007；I；来源不可达 SOURCEUNAVAILABLE。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F011",
      "label": "F011 · 床位/资源核定；台账版本、时点、锁位凭据/期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F011；床位/资源核定；台账版本、时点、锁位凭据/期限；楼寓可信服务 M007；P；无版本只可待核，不能分配。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F012",
      "label": "F012 · 学院/学院审核后；意见及岗位授权凭据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F012；学院/学院审核后；意见及岗位授权凭据；可信学院签发 M008；I；当前阶段缺则待学院办理。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F013",
      "label": "F013 · 学院/学院审核后；拟分配寝室与学院归属",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F013；学院/学院审核后；拟分配寝室与学院归属；M008/M003；I；变更则复核资源。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F014",
      "label": "F014 · 原公寓/退宿阶段；退宿单号、办理时间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F014；原公寓/退宿阶段；退宿单号、办理时间；原公寓 M009；I；前阶段 NOTAPPLICABLE。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F015",
      "label": "F015 · 楼寓/审批阶段；审批结论、决定 ID、签发者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F015；楼寓/审批阶段；审批结论、决定 ID、签发者；楼寓可信决定 M010；I；无权威决定不得宣称批准。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F016",
      "label": "F016 · 楼寓/备案阶段；台账更新结果、事务版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F016；楼寓/备案阶段；台账更新结果、事务版本；官方住宿系统 M011；I；缺则待执行，不回填假记录。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F017",
      "label": "F017 · 新公寓/入住阶段；入住记录/交接时间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F017；新公寓/入住阶段；入住记录/交接时间；新公寓 M012；I；未到阶段 NOTAPPLICABLE。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F018",
      "label": "F018 · 申请/特殊协调；功能性需要类别、紧急程度自述",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F018；申请/特殊协调；功能性需要类别、紧急程度自述；学生 M004，必要的专业意见 M013；H；最少采集，隐私保护，待人工。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F019",
      "label": "F019 · 学院/批量；批次 ID、逐人变更行、转入转出学院",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F019；学院/批量；批次 ID、逐人变更行、转入转出学院；M003、权威学籍 M001；I；逐行归属核对。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F020",
      "label": "F020 · 决定/全程；案卷状态、决定生效/撤销版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F020；决定/全程；案卷状态、决定生效/撤销版本；可信事件账 M010/M014；I；不以用户上传覆盖。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F021",
      "label": "F021 · 变更/撤回；请求人身份、请求时点、对象版本、原因",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F021；变更/撤回；请求人身份、请求时点、对象版本、原因；可信请求 M014；S；有执行动作时送人工。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F022",
      "label": "F022 · 复核/异议；争点、目标决定版本、受理状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F022；复核/异议；争点、目标决定版本、受理状态；M014/M015；S；渠道与期限政策未核。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F023",
      "label": "F023 · 安全/特殊；转介状态、最小处置结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F023；安全/特殊；转介状态、最小处置结果；有权校内部门 M013/M015；H；不可自动生成风险定性。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F024",
      "label": "F024 · 任意材料/全程；文件哈希、版本、可读性、目标主体",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原始字段字典：F024；任意材料/全程；文件哈希、版本、可读性、目标主体；受控材料索引；P；不可读 UNREADABLE。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F025",
      "label": "F025 · 学校政策/运行配置；审批路径版本、适用校区、有效区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F025；学校政策/运行配置；审批路径版本、适用校区、有效区间；学校授权配置 M016；P；未核 POLICYUNCONFIRMED。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 学籍部门；所有案受理；可信在校、学院、学段归口；授权查询结果优先，学生证仅候选",
      "purpose": "来源模板材料槽：M001；学籍部门；所有案受理；可信在校、学院、学段归口；授权查询结果优先，学生证仅候选；F002/F003/F019；R001/R002/R010；SRC-001/004；系统失联 SOURCEUNAVAILABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F002",
        "F003",
        "F019"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 学生；个人/互换受理；《学生寝室调换申请表》现用版，授权数字表单候选",
      "purpose": "来源模板材料槽：M002；学生；个人/互换受理；《学生寝室调换申请表》现用版，授权数字表单候选；F004–F007；R003/R004；SRC-001；版本未核 POLICYUNCONFIRMED、缺件 NEEDSMATERIAL。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F004",
        "F007"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 学院；批量发起；《学生寝室调整汇总表》纸质签章+电子数据，授权官方批次记录候选",
      "purpose": "来源模板材料槽：M003；学院；批量发起；《学生寝室调整汇总表》纸质签章+电子数据，授权官方批次记录候选；F004/F019/F013；R005/R010；SRC-001；逐行缺失不能以整批 PASS。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F004",
        "F019",
        "F013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 学生；特殊安排受理；最小功能需要/安排诉求声明，保密接收；具体校本专表未知",
      "purpose": "来源模板材料槽：M004；学生；特殊安排受理；最小功能需要/安排诉求声明，保密接收；具体校本专表未知；F005/F007/F018；R004/R011；SRC-004；未知材料规定 POLICYUNCONFIRMED。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F005",
        "F007",
        "F018"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 楼寓；受理预核；当前正式住宿台账只读快照",
      "purpose": "来源模板材料槽：M005；楼寓；受理预核；当前正式住宿台账只读快照；F006/F010；R003/R007；SRC-001/004；无源 SOURCEUNAVAILABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F006",
        "F010"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 互换双方各自；互换意愿核验；本人可信确认记录，书面签名只是候选",
      "purpose": "来源模板材料槽：M006；互换双方各自；互换意愿核验；本人可信确认记录，书面签名只是候选；F008/F009；R006；SRC-004；一方不可达不视作同意。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F008",
        "F009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 楼寓；资源复核/锁位；带版本的可分配床位与冻结记录",
      "purpose": "来源模板材料槽：M007；楼寓；资源复核/锁位；带版本的可分配床位与冻结记录；F010/F011/F013；R007/R008；SRC-004；缺权威版本不写床位。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F010",
        "F011",
        "F013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 学院；学院签批节点后；有权学院意见、分配房号与签章效力核验记录",
      "purpose": "来源模板材料槽：M008；学院；学院签批节点后；有权学院意见、分配房号与签章效力核验记录；F012/F013；R005/R009；SRC-001；缺签批在前阶段不报缺件。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F012",
        "F013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 原公寓；退宿完成后；退宿单/正式系统退宿记录",
      "purpose": "来源模板材料槽：M009；原公寓；退宿完成后；退宿单/正式系统退宿记录；F014；R012；SRC-001；初始申报不适用。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F014"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 楼寓；审批决定后；可追溯决定、授权与签发记录",
      "purpose": "来源模板材料槽：M010；楼寓；审批决定后；可追溯决定、授权与签发记录；F015/F020；R013/R014；SRC-001/004；印章 OCR 不证明真伪。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F015",
        "F020"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 楼寓系统；备案阶段；分配/备案变更提交回执",
      "purpose": "来源模板材料槽：M011；楼寓系统；备案阶段；分配/备案变更提交回执；F016/F020；R014；SRC-001；不可用截图假造事务。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F016",
        "F020"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 新公寓；实际入住后；正式入住、钥匙交接记录",
      "purpose": "来源模板材料槽：M012；新公寓；实际入住后；正式入住、钥匙交接记录；F017；R015；SRC-001；审批与入住分开。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F017"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 专业部门/学生；特殊情形评估阶段；经授权的最小适当便利意见、设施评估或安全转介结果",
      "purpose": "来源模板材料槽：M013；专业部门/学生；特殊情形评估阶段；经授权的最小适当便利意见、设施评估或安全转介结果；F018/F023；R011/R016；SRC-004；不能无政策索要病历全文。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F018",
        "F023"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 申请人/可信服务；撤回、变更、申诉时；有时点及版本的事件请求",
      "purpose": "来源模板材料槽：M014；申请人/可信服务；撤回、变更、申诉时；有时点及版本的事件请求；F020–F022；R017/R018；SRC-004；撤回申请不自动撤销既有决定。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F020",
        "F022"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 有权受理部门；复核/特殊处置后；正式受理回执、回复及必要转介",
      "purpose": "来源模板材料槽：M015；有权受理部门；复核/特殊处置后；正式受理回执、回复及必要转介；F022/F023；R016/R018；SRC-004；渠道未知送人工。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F022",
        "F023"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 校方制度维护者；部署前与政策更新；现行表单版次、授权岗位、校区差异、流程及有效期",
      "purpose": "来源模板材料槽：M016；校方制度维护者；部署前与政策更新；现行表单版次、授权岗位、校区差异、流程及有效期；F025；R002/R009/R013/R018；SRC-001/002/003；缺则 POLICYUNCONFIRMED。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F025"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08",
      "name": "审核规则（来源模板第08节）",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "在校身份：任意新案受理",
          "requirement": "原始规则 R001（第08节）：F002/F003；M001；SRC-004；学籍主数据比对学生 ID；T=身份匹配 PASSFACT；F=CONFLICT；U=SOURCEUNAVAILABLE；学籍主管核对。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "事项路由：受理时目标确为既有校内床位调整",
          "requirement": "原始规则 R002（第08节）：F003/F004/F025；M001/M002/M003/M016；SRC-001/005/006；对照业务目的与校区；T=PASSFACT；F=NOTAPPLICABLE 并转 S04-T02/T04/T05 或 S01；U=POLICYUNCONFIRMED，学院分流。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "原床位归属：个人或互换预审",
          "requirement": "原始规则 R003（第08节）：F006；M002/M005；SRC-001/004；申请与权威台账相互比对；T=PASSFACT；F=CONFLICT；U=SOURCEUNAVAILABLE，楼寓核实。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "申请诉求可定位：个人/特殊初报",
          "requirement": "原始规则 R004（第08节）：F004/F005/F007/F018；M002/M004；SRC-001/004；检查文字及是否需具体床位；T=PASSFACT（仅可定位）；F=NEEDSMATERIAL；特殊目标空值合法；学院补录。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "学院批次逐人可对应：批量提交时",
          "requirement": "原始规则 R005（第08节）：F013/F019；M003/M001；SRC-001；核名单、转专业注记、逐行身份与学院；T=PASSFACT；F=CONFLICT；U=NEEDSMATERIAL；学院逐行更正。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "互换本人意愿可核：双方互换且双方参与确认阶段",
          "requirement": "原始规则 R006（第08节）：F008/F009；M006；SRC-004；各人独立可信身份、同意范围、未撤回版本；T=PASSFACT（两人明确意愿）；F=CONFLICT 或撤回送人工；U=NEEDSMATERIAL；学院联络，是否学校必交同意书未知。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "目标床位占用状态：提出具体目标后",
          "requirement": "原始规则 R007（第08节）：F007/F010；M005/M007；SRC-004；按同一时点核对占用、冻结、现有决定；T=已知状态 PASSFACT；F=CONFLICT；U=SOURCEUNAVAILABLE；楼寓资源岗。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "分配资源可承诺性：学院拟分配或楼寓决定前",
          "requirement": "原始规则 R008（第08节）：F010/F011/F013；M007/M008；SRC-001/004；比较版本及锁位 CAS 状态；T=可核资源事实 PASSFACT，不自动锁位；F=CONFLICT；U=NEEDSHUMANDECISION 或 SOURCEUNAVAILABLE；楼寓决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "学院意见权威：个人申请进入学院意见完成节点",
          "requirement": "原始规则 R009（第08节）：F012/F013/F025；M008/M016；SRC-001；可信授权及签发校验；T=PASSFACT；F=CONFLICT；U=POLICYUNCONFIRMED；学院授权管理员。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "批次发起者与所涉学生范围：学院集体发起",
          "requirement": "原始规则 R010（第08节）：F003/F019；M003/M001；SRC-001；学院单位、所辖学生逐行核；T=PASSFACT；F=CONFLICT；U=SOURCEUNAVAILABLE；学院与学籍岗。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "特殊需求已送有权人工评估：特殊协调情形",
          "requirement": "原始规则 R011（第08节）：F018/F023；M004/M013；SRC-004；核转介与回执，不评诊断真假；T=转介事实 PASSFACT；F=NEEDSHUMANDECISION；U=POLICYUNCONFIRMED；楼寓及授权专业部门。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "原公寓退宿执行：进入退宿完成节点",
          "requirement": "原始规则 R012（第08节）：F014；M009；SRC-001；官方单号与学生、原床位对应；T=PASSFACT；F=CONFLICT；U=NEEDSMATERIAL；原公寓。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "楼寓审批有效来源：进入正式审批记录核对",
          "requirement": "原始规则 R013（第08节）：F015/F025；M010/M016；SRC-001/004；可信签发者与授权版本；T=仅“正式来源已核” PASSFACT；F=CONFLICT；U=POLICYUNCONFIRMED/NEEDSHUMANDECISION；楼寓有权人。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "决定与备案一致：审批之后进入备案完成节点",
          "requirement": "原始规则 R014（第08节）：F015/F016/F020；M010/M011；SRC-001；决定 ID、床位与台账事务版本匹配；T=PASSFACT；F=CONFLICT；U=SOURCEUNAVAILABLE；楼寓系统经办。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "实际入住已发生：新公寓执行后",
          "requirement": "原始规则 R015（第08节）：F017/F015；M012/M010；SRC-001；本人、决定、目标床位、入住时点比对；T=PASSFACT；F=CONFLICT；U=NEEDSMATERIAL；新公寓管理员。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "安全/便利转介是否有处理反馈：特殊风险转介受理后",
          "requirement": "原始规则 R016（第08节）：F018/F023；M013/M015；SRC-004；核记录存在与归属；T=反馈事实 PASSFACT；F=NEEDSHUMANDECISION；U=SOURCEUNAVAILABLE；安全/医务/楼寓适当人员。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "撤回/变更作用范围：收到变更请求",
          "requirement": "原始规则 R017（第08节）：F020/F021；M014/M010/M011；SRC-001/004；确认原决定和搬迁执行状态；T=已登记请求 PASSFACT，效力另由人定；F=CONFLICT；U=NEEDSHUMANDECISION；原审批机关。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "异议受理与回复真实性：提出复核或异议后",
          "requirement": "原始规则 R018（第08节）：F022/F025；M014/M015/M016；SRC-004；核原决定版次、受理回执和授权；T=受理事实 PASSFACT；F=CONFLICT；U=POLICYUNCONFIRMED；有权受理机关，不套处分申诉。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "提出请求／建案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "identity",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "identity",
      "name": "验证主体与当前住宿事实",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "routing",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "routing",
      "name": "判断调寝／组织调整／特殊申请情形",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "materials",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "materials",
      "name": "核查阶段性材料",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "human-review",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "human-review",
      "name": "按官网角色提交／补件／待人工核定资源",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "decision-evidence",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "decision-evidence",
      "name": "取得可追溯的学校决定（只核验外部决定）（仅核验外部权威决定，不由本地模板生成）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "execution-record",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "execution-record",
      "name": "记录退宿／入住／备案的后续事实",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "review-handoff",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "review-handoff",
      "name": "结束／留待复核",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "conditional-supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "human-decision-handoff",
      "kind": "item-feedback",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata: R02TemplateMetadata = {
  "batchId": "S04-A",
  "templateId": "S04-T03",
  "name": "宿舍调整、调换及特殊住宿安排审核",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-24",
  "sourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T03.md",
  "sourceDocumentSha256": "e1a904e65dcf778dd061c2a5cb2cb8f4ae3d8c04c9f4f8c80e21c560c6af2699",
  "sourceDocumentBytes": 63176,
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/S04-T03.md",
  "originalSourceBlobSha1": "4792166072fb3e4a2bbbf64be2affbc5239d30e3",
  "lineEndingNormalization": "Source snapshot had no terminal LF; one LF appended to match manifest bytes/SHA-256. No semantic text changed.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "成都理工大学“楼寓服务”中的“住宿调整”",
      "url": "https://clhq.cdut.edu.cn/fwdt1/lyfw.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 标签：CDUT-VERIFIED（官方站点的事项及索引正文已核；原站直连返回 412，附件原件未核，最新修订日期未明）。 - 机构、原文标题：成都理工大学后勤保障部／《楼寓服务》，服务事项“住宿调整”，并列“外住办理”“住宿办理”“寒、暑假留校住宿办理”等。 - URL：https://clhq.cdut.edu.cn/fwdt1/lyfw.htm - 定位：“服务事项｜住宿调整”行及其“服务"
    },
    {
      "id": "SRC-002",
      "title": "楼寓中心较早版本服务指南",
      "url": "https://clhq.cdut.edu.cn/info/1037/2344.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 标签：CURRENTITY-UNKNOWN。 - 机构、原文标题：成都理工大学后勤保障部／《楼寓中心服务指南》。 - URL：https://clhq.cdut.edu.cn/info/1037/2344.htm - 定位：“学生住宿手续办理”“学生中途退宿涉及楼寓中心手续办理”；其中提及松林二公寓 102 室。 - 发布时间/生效/废止：搜索索引约 2022–2023 时期；具体落款与修订日"
    },
    {
      "id": "SRC-003",
      "title": "2020 年楼寓服务中心服务指南",
      "url": "https://clhq.cdut.edu.cn/info/1037/2342.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 标签：CURRENTITY-UNKNOWN。 - 机构、原文标题：成都理工大学后勤保障部／《楼寓服务中心服务指南》，作者刘良清，来源集团办公室。 - URL：https://clhq.cdut.edu.cn/info/1037/2342.htm - 定位：“服务简介”“学生公寓管理”“学生住宿手续办理”“中途退宿办理”。 - 发布时间/生效/废止：2020-06-16 发布；未查询到明确废止日"
    },
    {
      "id": "SRC-004",
      "title": "四川省教育厅川教函〔2023〕140 号",
      "url": "https://www.sc.gov.cn/zfgb/2017/xiazai/2023-15.pdf",
      "sourceKind": "national-law-or-policy",
      "evidenceStatus": "VERIFIED",
      "note": "- 标签：GENERAL-RESEARCH（省级正式规范，直接适用的上位依据；不是成都理工大学个别审批规则）。 - 机构、原文标题：四川省教育厅／《关于印发〈四川省普通高等学校学生公寓管理办法〉的通知》（川教函〔2023〕140 号）及所附《四川省普通高等学校学生公寓管理办法》。 - URL（政府公报原始刊载）：https://www.sc.gov.cn/zfgb/2017/xiazai/2023"
    },
    {
      "id": "SRC-005",
      "title": "国际学生 2025 年报到指南",
      "url": "https://cie.cdut.edu.cn/info/1048/1595.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "PARTIAL",
      "note": "- 标签：CDUT-VERIFIED（官网原文可检索；仅适用对应国际学生）。 - 机构、原文标题：成都理工大学国际教育学院／《成都理工大学国际学生新生入学报到指南 Registration Guide for 2025 International Freshmen》。 - URL：https://cie.cdut.edu.cn/info/1048/1595.htm - 定位：“住宿、住宿费、留学生"
    },
    {
      "id": "SRC-006",
      "title": "国际学生 2026 年本科项目住宿信息",
      "url": "https://cie.cdut.edu.cn/info/1048/1697.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 标签：CDUT-VERIFIED（学校国际教育学院官方招生信息，非本事项细则）。 - 机构、原文标题：成都理工大学国际教育学院／《成都理工大学2026年国际学生本科生项目招生简章 2026 Chengdu University of Technology Admissions Guide for International Applicants (Undergraduate Programs)"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学 2017 年学生违纪处分文件",
      "url": "https://cmp.cdut.edu.cn/__local/E/9E/B2/A24C5F25F51D1084D062B3C50F9_65A2D748_7C693.pdf",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 标签：CURRENTITY-UNKNOWN。 - 机构、原文标题：成都理工大学／《成都理工大学学生违纪处分办法（试行）》，成理校学〔2017〕85 号。 - URL：https://cmp.cdut.edu.cn/local/E/9E/B2/A24C5F25F51D1084D062B3C50F965A2D7487C693.pdf - 定位：PDF 第 9 页第三十条“学生公寓管理制度”及第 1"
    },
    {
      "id": "SRC-008",
      "title": "外校特殊身体需要住宿安排反例",
      "url": "https://www.sctu.edu.cn/houqin/info/1102/2526.htm",
      "sourceKind": "other",
      "evidenceStatus": "PARTIAL",
      "note": "- 标签：CROSS-SCHOOL-REFERENCE。 - 机构、原文标题：四川旅游学院基建后勤部／《四川旅游学院学生公寓管理办法》。 - URL：https://www.sctu.edu.cn/houqin/info/1102/2526.htm - 定位：第十条（调宿须申请、审批后入住、搬离期限），第十三条（临时“爱心”宿舍）。 - 发布时间/生效/废止：2026 年公开，确切落款和效力以外校"
    },
    {
      "id": "SRC-009",
      "title": "G50 既有技术候选目录",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "sourceKind": "other",
      "evidenceStatus": "PARTIAL",
      "note": "- 标签：GENERAL-RESEARCH（技术来源，非校本政策）。 - 机构、原文标题：Fuck-GH-Admin/cdut-studio-review-agent／docs/design/review-agent/acceptance/d4-unified-r01/catalog.json，catalogId=D4-G01-G08-UNIFIED-R01。 - URL：https://gith"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08",
      "criterionId": "r001",
      "ruleId": "R001",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r002",
      "ruleId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r003",
      "ruleId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r004",
      "ruleId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r005",
      "ruleId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r006",
      "ruleId": "R006",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r007",
      "ruleId": "R007",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r008",
      "ruleId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r009",
      "ruleId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r010",
      "ruleId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r011",
      "ruleId": "R011",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r012",
      "ruleId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r013",
      "ruleId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r014",
      "ruleId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r015",
      "ruleId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r016",
      "ruleId": "R016",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r017",
      "ruleId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "r018",
      "ruleId": "R018",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "execution": "manual"
    }
  ],
  "reviewNotes": [
    "SRC IDs are research metadata, not case-material SourceRef values.",
    "Criteria use semantic/manual only; unknown policy, authority and current forms never auto-pass or auto-reject.",
    "Template stays draft with empty policyVersionIds and autoPassPolicy.enabled=false; shared registration belongs to integration owner."
  ]
}
