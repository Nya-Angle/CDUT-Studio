import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion }

export type R02EvidenceStatus = 'verified' | 'partial' | 'unconfirmed'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; fieldIds: string[]; materialIds: string[] }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; officialSchoolTemplate: false; researchAsOf: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; sourceIds: string[]; fieldIds: string[]; materialIds: string[]; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S03-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "校院及专项奖学金（含研究生学业奖学金）评审",
  "description": "本地研究模板 · 非校方正式模板。用于校院及专项奖学金（含研究生学业奖学金）评审的材料核验和人工审阅建议；政策/授权未确认时不得形成正式通过或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本定义由 R02 研究交接稿转换，不是成都理工大学正式发布模板；SRC 为研究来源索引，不是案卷材料 SourceRef；未确认政策由有权人员人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "S03-T04 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · 奖项项目标识 / enum+文本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001。奖项项目标识 / enum+文本；B；P0—P5；学校/设奖方正式批次 M001/002（001/002/008）；M002 项目名称/类别段；公；PU，不按关键词猜项目。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f002",
      "label": "F002 · 奖项子轨道与学段适用类 / enum",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002。奖项子轨道与学段适用类 / enum；B；P0/P1；同上、学院 M003（001/002/012）；M001/002/003 适用范围；公；PU；奖学金/助学金不明则 HD 路由。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f003",
      "label": "F003 · 参评学年/成果起止期 / date-range",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003。参评学年/成果起止期 / date-range；B；P0—P3；学校批次/学院办法 M002/003；M002 学年、M003 成果时限；公；PU，不继承旧年度。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f004",
      "label": "F004 · 批次唯一号/届别 / string",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F004。批次唯一号/届别 / string；B/A；P0—P5；主管部门发布的 M002，且申请 M004 匹配；M002 标题/批次索引；内；PU，禁止跨批共用决定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f005",
      "label": "F005 · 基本制度 ID/有效性版本 / ref+date",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F005。基本制度 ID/有效性版本 / ref+date；B；P0—P5；校正式文件 M001（001/002）+最新版本确认；M001 文号/印发/废止条款；公；PU；仅查到旧版不等于现行。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f006",
      "label": "F006 · 学院/专项细则版本及公示/备案 / ref+date",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F006。学院/专项细则版本及公示/备案 / ref+date；B；P0—P3；学院/设奖方 M003（001 第19条、012）；M003 文号、发布与备案凭据；内；PU，不能自动套其他学院。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f007",
      "label": "F007 · 归属学院/培养单位 / org-id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F007。归属学院/培养单位 / org-id；B/S/A；P0—P5；学校学籍/培养单位名册 M005 和批次 M002；M005 学院/专业、M002 指标分配；敏；SU/CONFLICT 时主管确认。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f008",
      "label": "F008 · 当前业务阶段 / enum P0—P5",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F008。当前业务阶段 / enum P0—P5；A/W；全程；有权阶段写入事件、学校/申请阶段记录 M004/018/024/026（001/002）；M004 收件、M018 初核、M024 正式决定、M026 变更事件的签发时间；内；SU/HD，不用页面状态自证。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f009",
      "label": "F009 · 申请/公示/异议截止节点 / deadline map",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F009。申请/公示/异议截止节点 / deadline map；B/W；P0/P3/P4；本批 M002/003、公示 M020/025（001/002）；通知日程、公告时间戳；内；PU，未知不得自动判逾期。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f010",
      "label": "F010 · 当期指标/等级配置 / struct",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F010。当期指标/等级配置 / struct；B；P0/P3/P4；学校分配记录 M002、学院细则 M003（001 第13—14条、012）；M002 名额、M003 分类段；内；PU/HD；2020/2022 历史值禁默认。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f011",
      "label": "F011 · 学生唯一身份键/学号 / ID",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F011。学生唯一身份键/学号 / ID；S/A；P1—P5；官方在籍/学籍记录 M005；本人 M004 供比对；M005 学号、M004 身份栏；敏；SU；同名不能代替。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f012",
      "label": "F012 · 法定姓名及变更链 / string+refs",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F012。法定姓名及变更链 / string+refs；S/A；P1—P5；学校主数据/有效更名证明 M005；M005 姓名/变更历史、M004 签名；敏；SU/CONFLICT，不能模糊合并。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f013",
      "label": "F013 · 当前在籍、注册状态及效期 / enum+range",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F013。当前在籍、注册状态及效期 / enum+range；S；P1/P2/P5；学籍部门 M005（001 第5、12条）；M005 学籍状态、生效起止；高；SU，不强求自证无异常。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f014",
      "label": "F014 · 国籍/招生适格身份 / enum",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F014。国籍/招生适格身份 / enum；S；P1/P2；官方学籍/招生登记 M005（001 第6条、012）；M005 学生基本信息有效字段；敏；SU；无权查时 HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f015",
      "label": "F015 · 研究生硕/博、本科层次 / enum",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F015。研究生硕/博、本科层次 / enum；S；P1—P3；官方培养/学籍记录 M005/006（001 第5条）；M005 层次、M006 转段生效；敏；SU/CONFLICT，则暂缓资格判断。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f016",
      "label": "F016 · 全日制/非定向与培养属性 / enum",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F016。全日制/非定向与培养属性 / enum；S；P1/P2；官方招生录取/学籍 M005/008（001/002）；M008 录取性质、M005 注册属性；敏；SU，不能只用申请自选。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f017",
      "label": "F017 · 学科专业/学科代码 / code+name",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F017。学科专业/学科代码 / code+name；S/B；P1/P2；学籍/招生专业 M005/008、当年项目 M002（002 学科附件）；M005 专业、M002 当年学科分类；敏；SU/PU，旧专业代码不得硬匹配。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f018",
      "label": "F018 · 入学年月、年级 / date+year",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F018。入学年月、年级 / date+year；S；P1—P3；学籍/招生登记 M005/008；M005 入学年月、M008 录取届别；敏；SU，影响新生/高年级材料分流。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f019",
      "label": "F019 · 硕博连读/直博课程转段事实 / struct+date",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F019。硕博连读/直博课程转段事实 / struct+date；S；P1/P2；学籍与培养部门转段记录 M006（001 第5条、012）；M006 注册博士/资格考试/课程阶段；高；SU/HD，不能按当前显示层次倒推。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f020",
      "label": "F020 · 基本修业年限与实际经过时长 / dates",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F020。基本修业年限与实际经过时长 / dates；S；P1/P2；学籍/培养文件 M005/006（001 第11—12条、002）；M006 学制、延期/实际在学；高；SU/HD，不机械裁量。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f021",
      "label": "F021 · 休学、保留、离校等状态与原因区间 / events",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F021。休学、保留、离校等状态与原因区间 / events；S；P1/P2/P5；学籍/经授权的管理部门 M005/028（001 第11—12、25条）；M005 变更事件/效期；高；SU/HD；仅限必要摘要。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f022",
      "label": "F022 · 学费缴纳、缓缴与学年注册 / enum+period",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F022。学费缴纳、缓缴与学年注册 / enum+period；S；P1/P2；财务/注册部门 M007（001 第12条、006/007 待核）；M007 缴费/缓办/注册状态；高；SU；不可直接视缺钱为违纪。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f023",
      "label": "F023 · 推免/考试录取类别与入学成绩 / struct",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F023。推免/考试录取类别与入学成绩 / struct；S；P1/P2；招生录取机构 M008（002 第4条、012 第12条）；M008 录取方式、总成绩/排序依据；敏；SU；无当期算法时 PU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f024",
      "label": "F024 · 课程成绩与不及格记录 / transcript+period",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F024。课程成绩与不及格记录 / transcript+period；S；P1/P2；教务/研究生培养成绩记录 M009（001 第12条）；M009 课程、考核、学年；敏；SU；上传截图需核原源。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f025",
      "label": "F025 · 培养方案环节/必修考核完成 / struct",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F025。培养方案环节/必修考核完成 / struct；S；P1/P2；培养方案执行记录 M010（001 第12条）；M010 规定环节/完成时点；敏；SU，不让模型自行推算合格。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f026",
      "label": "F026 · 申报成果唯一标识及类型 / list(ref+enum)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F026。申报成果唯一标识及类型 / list(ref+enum)；E/A；P1—P3；学生列举 M004，期刊/专利/项目/赛事原件 M011—M013；成果原始编号/DOI/专利号/项目号；敏；确实主张计分则 NM；新生不适用时 NA。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f027",
      "label": "F027 · 成果形成/发表/授权日期 / date+kind",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027。成果形成/发表/授权日期 / date+kind；E；P1—P3；原签发机构 M011—M013、当年窗口 M003；文献见刊/证书落款/批准日期；敏；NM 或 SU，不能用上传日期代替。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f028",
      "label": "F028 · 作者、完成单位及排名/贡献 / struct",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F028。作者、完成单位及排名/贡献 / struct；E；P1—P3；原始成果署名及正式核验 M011—M013（012 评分示例仅历史）；论文题页、证书、项目清单；敏；NM/CONFLICT，争议 HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f029",
      "label": "F029 · 成果证据校验状态及来源版本 / provenance",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F029。成果证据校验状态及来源版本 / provenance；E；P2/P3；原件、发布机构校核、M011—M013；原机构 URI/页码/材料哈希；内；SU/UNREADABLE，勿仅据 OCR 评分。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f030",
      "label": "F030 · 成果曾用于其他奖项的效力 / crossref-list",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F030。成果曾用于其他奖项的效力 / crossref-list；E/A；P2/P3；先前奖项权威使用记录 M015、学生申明 M004（001 第9—10条）；M015 具体 award/年/成果用途/生效；高；SU/HD，不能据重复文件推定违规。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f031",
      "label": "F031 · 学院评分、排名及计算依据 / score+version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F031。学院评分、排名及计算依据 / score+version；W；P3；学院有权评审组织 M018/019，规则 M003；M018 评分表/确认、M019 推荐理由；高；HD；无当期细则 PU，不自动评先。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f032",
      "label": "F032 · 申请人声明、意愿、签署及提交时间 / record",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F032。申请人声明、意愿、签署及提交时间 / record；A；P1/P2；本人申请/校可信受理记录 M004（001 第20条、002 第7条）；M004 申请/签名/接收时间；敏；NM；真实身份不以 Renderer 自报为准。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f033",
      "label": "F033 · 导师/成果核实意见 / signed-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F033。导师/成果核实意见 / signed-ref；A/E；P1—P3 条件；获授权导师 M014、当批学院规则 M003（006/007）；M014 意见、签署时点/关联成果；敏；当批明确要求才 NM，否则 NA。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f034",
      "label": "F034 · 委托确认授权及范围 / signed-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F034。委托确认授权及范围 / signed-ref；X/A；P2 条件；真实双方签字/受理学院 M017（012 第10条）；M017 授权人、被授权人、范围、期限；高；代确认才 NM/HD；普通本人申报 NA。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f035",
      "label": "F035 · 学院初核与集体初评结论 / stage-decision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F035。学院初核与集体初评结论 / stage-decision；W；P2/P3；学院有权评审委员会 M018（001/012）；M018 会议/核验结果/回避记录；内；本阶段未生成 NA；应生成未得 SU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f036",
      "label": "F036 · 学院公示时间与异议窗口 / timespan",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F036。学院公示时间与异议窗口 / timespan；W；P3；学院公告 M020（001 第21、24条）；M020 公示页、起止时间；内；未公示 NA；应公示未得 SU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f037",
      "label": "F037 · 学院拟推荐汇总与奖项等级 / list+status",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F037。学院拟推荐汇总与奖项等级 / list+status；W；P3；学院委员会、盖章汇总 M019（001 第22条、013）；M019 学号/学院/等级、签发栏；敏；本阶段未形成 NA；候选≠终审。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f038",
      "label": "F038 · 学校级审核/专家意见 / stage-decision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F038。学校级审核/专家意见 / stage-decision；W；P4；相应校级委员会/研究生院 M023（001/002）；M023 审核记录/专家评审；内；P4 前 NA；缺签发 SU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f039",
      "label": "F039 · 审批决定、后置公示及最终生效状态 / decision-ref+stage",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F039。审批决定、后置公示及最终生效状态 / decision-ref+stage；W；P4/P5；对应有权机构 M024，按各奖项顺序并核 M025/M022（001 第23—24条、002 第9—10条）；M024 文号/签章/审批时间；M025 公示时间和异议；M022 裁决与最终版关联；高；已批准但校公示未终结记 APPROVED_PENDING_PUBLICITY，不能标 FINAL_EFFECTIVE；SU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f040",
      "label": "F040 · 校级公示窗口及结果 / timespan+status",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F040。校级公示窗口及结果 / timespan+status；W；P4/P5；学校正式公示 M025（001 第23条、002 第10条）；M025 公示正文/起止与异议处理；内；P4 前 NA；应有未得 SU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f041",
      "label": "F041 · 书面异议/申诉请求与提交时点 / record",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F041。书面异议/申诉请求与提交时点 / record；X；P3/P4；本人/正式收件组织 M021（001 第24条、012）；M021 申请书、收件戳、公示期；高；未申诉 NA；提出但材料缺 NM。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f042",
      "label": "F042 · 学院答复或学校裁决及效力 / decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F042。学院答复或学校裁决及效力 / decision-ref；X/W；P3/P4；对应评审委员会 M022（001 第24条）；M022 答复/裁决签发、适用案卷；高；未到该阶段 NA；已申请未答 SU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f043",
      "label": "F043 · 补件、撤回、改报及取代记录 / event-list",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F043。补件、撤回、改报及取代记录 / event-list；X/A；P1—P4；本人意思/学院受理 M026 与申请版本 M004；M026 请求书、受理时间/状态；高；未发生 NA；发生未得 NM/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f044",
      "label": "F044 · 批准后的暂缓、撤销、追回等指令 / event-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F044。批准后的暂缓、撤销、追回等指令 / event-ref；W/X；P5；原有权部门及资金部门 M028（001 第25—26条、002）；M028 正式处理文件/时间/支付分离记录；高；未发生 NA；有变动无原件 SU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f045",
      "label": "F045 · 当前操作人/委员的可信授权与回避 / org-authority-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F045。当前操作人/委员的可信授权与回避 / org-authority-ref；Auth；P2—P5；宿主/Main 核实身份、任职授权 M029；学院委员来源 [001/002/012]；M029 授权名册/会话审计/回避事件；高；SU/HD，客户端 actor 字段无效。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f046",
      "label": "F046 · 专项要求的家庭经济困难认定结论及有效学年 / decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F046。专项要求的家庭经济困难认定结论及有效学年 / decision-ref；S/A；D3 P1/P2 条件；学校家庭经济困难认定有权管理部门 M030（016），仅引用既有正式认定；M030 认定 ID、学年、有效性及必要结论，不取家庭调查明细；高；学校源失联 SU；未认定/不适格需有权确认，不在此模板重认。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f047",
      "label": "F047 · 专项要求的国家助学贷款承办行和历史获贷事实 / issuer+decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F047。专项要求的国家助学贷款承办行和历史获贷事实 / issuer+decision-ref；S/A；D3 P1/P2 条件；学生资助/贷款办理权威信息或银行 M031（016）；M031 合同/放款事实的最少必要认证编号与时间、承办行；高；SU/NM（由确需提供的合法替代补充），不可抓取全量银行卡流水。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f048",
      "label": "F048 · 专业年级课程成绩、综合测评相对名次与统计基数 / rank-struct",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F048。专业年级课程成绩、综合测评相对名次与统计基数 / rank-struct；S/A；D3 P1/P2 条件；教务/综测原决定部门 M032、M009，既有 S03-T01 权威综测结果（016）；M032 学年、专业年级、总人数、排名/比例、签发版本；高；SU/CONFLICT；2025 阈值不默认延续至 2026。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f049",
      "label": "F049 · 参评学年国家奖学金和国家励志奖学金生效记录 / external-decision-list",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F049。参评学年国家奖学金和国家励志奖学金生效记录 / external-decision-list；A；D3 P1/P2 条件；S03-T02/T03 对应有权部门 M015（016）；M015 学年、项目、获奖决定 ID/效力，不用拟名单代替；高；SU；未能确认无获奖不等于断言不存在，交人工。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f050",
      "label": "F050 · 特定合作培养/项目成员资格及生效时点 / program-enrollment-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F050。特定合作培养/项目成员资格及生效时点 / program-enrollment-ref；S/A；D4 P1 条件；学校项目主管和合作培养单位 M033（018）；M033 菁英班/项目、年级、成员身份、注册/退出日；敏；SU/PU；检索线索不等于当期资格规则。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f051",
      "label": "F051 · 设奖方、学校推荐方与最终决定方的授权界限 / authority-graph",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F051。设奖方、学校推荐方与最终决定方的授权界限 / authority-graph；B/W；D1—D4 P0—P5；设奖协议、当批通知 M001/002/034、真实委员会授权 M029（016/018/019/022）；M034 有效协议/基金章程、M002 评审流程、M024 原决定机关；内；PU/HD；只有校内推荐时不得记校内终审。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "奖项授权、基本资格与流程",
      "purpose": "奖项授权、基本资格与流程；校主管部门；奖项授权、基本资格与流程；校主管部门；正式制度 PDF/发文；P0 当·校；后续正式修订/现行文件可取代旧版；网页转载无原签发证明不得升格；F001/002/005；001/002；文号、印发/施行/废止、签发者、适用项目；未能确认有效→POLICY_UNCONFIRMED；原件失联→SOURCE_UNAVAILABLE",
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
        "奖项授权、基本资格与流程",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "当批项目、学年、名额、奖等、时限",
      "purpose": "当批项目、学年、名额、奖等、时限；校主管部门/专项组织者；当批项目、学年、名额、奖等、时限；校主管部门/专项组织者；当期通知+名额分配/审议文件；P0 当·校；原发布者补充通知/有签发依据的正式更正；F001—004/007/009/010；001/002、008；batchId、版本、批准机构与对应学院、发布时间；2026 未取得→POLICY_UNCONFIRMED；PDF 扫描不清→UNREADABLE",
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
        "当批项目、学年、名额、奖等、时限",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "各学院/专项的计分细则、备案与适用人群",
      "purpose": "各学院/专项的计分细则、备案与适用人群；学院/设奖方；各学院/专项的计分细则、备案与适用人群；学院/设奖方；细则、公告、备案/公示记录；P0 当·校（仅该学院实际采用时）；该学院后续经权威批准细则；不得用别院旧表代替；F002/003/006/009/010/017/031；001/012/014；学院、学段、规则版本、评审年度及备案阶段；缺现行性→POLICY_UNCONFIRMED；失联→SOURCE_UNAVAILABLE",
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
        "各学院/专项的计分细则、备案与适用人群",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "本人自愿申请及申报项目/成果清单",
      "purpose": "本人自愿申请及申报项目/成果清单；本人；本人自愿申请及申报项目/成果清单；本人；《学业奖学金申请审批表》或对应校/专项受理表、实名申报记录；P1 当·本人，具体格式由批次定；学校接受的电子申报记录可替纸件；2022 规定有此表名但样表字段未全文核 [001/015]；F001/004/011/012/026/030/032；001/002/015；本人签名/电子实名凭据、受理时点、申请版本、奖项；未申请→NEEDS_MATERIAL；重名/错人→CONFLICT；扫描签名不可读→UNREADABLE",
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
        "本人自愿申请及申报项目/成果清单",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "学号、姓名、在籍/学段/学院及历史变更",
      "purpose": "学号、姓名、在籍/学段/学院及历史变更；学校学籍/研究生管理；学号、姓名、在籍/学段/学院及历史变更；学校学籍/研究生管理；官方学籍登记、身份/注册状态；P1 当·校；原学籍部门签发记录/可校验校内证明；不默认存在 API，不强迫本人交完整身份证；F007/011—018/020/021；001/002/012；学号、事实有效区间、原部门、变更版本；校源取不到→SOURCE_UNAVAILABLE；申请书冲突→CONFLICT",
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
        "学号、姓名、在籍/学段/学院及历史变更",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "硕博转段、直博课程阶段及修业年限",
      "purpose": "硕博转段、直博课程阶段及修业年限；研究生培养/学籍部门；硕博转段、直博课程阶段及修业年限；研究生培养/学籍部门；资格考试/注册/课程阶段或延期批文；A5/A6 条·校；同部门正式阶段认定；本人自述不替代；F015/017/019—021；001 第5/11/12条、012；转段有效日、原/新层次、批次参评时点；应用而无记录→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION",
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
        "硕博转段、直博课程阶段及修业年限",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "缴费、暂缓注册、学年注册事实",
      "purpose": "缴费、暂缓注册、学年注册事实；财务/注册部门；缴费、暂缓注册、学年注册事实；财务/注册部门；缴费/贷款安排/缓缴及注册状态核验；学业奖 A3/A4/A6 条·校，新生按批次；原财务/注册出具可验证证明；不能因系统没接口强迫提供不必要流水；F022/013；001 第12条、006/007（全文待核）；状态、学年、办理人、批准缓缴期限；源失联→SOURCE_UNAVAILABLE；理由/裁量→NEEDS_HUMAN_DECISION",
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
        "缴费、暂缓注册、学年注册事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "录取类别、推免、入学分数/排名",
      "purpose": "录取类别、推免、入学分数/排名；招生部门；录取类别、推免、入学分数/排名；招生部门；录取系统/签发成绩与录取档案；A1/A2/B1/B2 当·校；主管招生办正式成绩/名册；学生考试截图只辅助比对；F016—018/023；002 第4条、012 第12条、014；录取批次、考核结构、专业排序依据版本；无权威录取源→SOURCE_UNAVAILABLE；当年算法不明→POLICY_UNCONFIRMED",
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
        "录取类别、推免、入学分数/排名",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "已修课程与成绩事实",
      "purpose": "已修课程与成绩事实；研究生培养/教务部门；已修课程与成绩事实；研究生培养/教务部门；官方成绩单/成绩记录；A3/A4 当·校，A1/A2 按批次；能经学校验证的成绩截屏/加章件；不无理由强制重复上传；F024/031；001 第12条、006/007/012；参评学年、课程代码、成绩修订版本、学生；源失联→SOURCE_UNAVAILABLE；成绩版本冲突→CONFLICT",
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
        "已修课程与成绩事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "培养方案必修环节完成情况",
      "purpose": "培养方案必修环节完成情况；研究生培养部门；培养方案必修环节完成情况；研究生培养部门；培养进度/环节考核官方记录；A3/A4 当·校，特殊年级条件；主管部门同效力出具记录；缺少电子接口不等于学生应出证明；F025；001 第12条；所属培养方案版本、环节、考核时间；SOURCE_UNAVAILABLE；未形成环节按条件 NOT_APPLICABLE",
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
        "培养方案必修环节完成情况",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学术论文、专著等成果及署名",
      "purpose": "学术论文、专著等成果及署名；本人/原出版机构；学术论文、专著等成果及署名；本人/原出版机构；论文首页、DOI/出版信息、检索页、专著版权页；A3/A4/C1/D 条·本人；可由期刊/出版社权威库验证的记录；录用通知≠见刊，需当批规则判定；F026—030/031；001 第18条、012 第13条；标题/DOI、作者序、学校归属、发表日、原链接版本；申报此成果缺证→NEEDS_MATERIAL；真伪不明→NEEDS_HUMAN_DECISION",
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
        "学术论文、专著等成果及署名",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "专利、竞赛、课题与获奖成果",
      "purpose": "专利、竞赛、课题与获奖成果；本人/颁奖或项目主管机构；专利、竞赛、课题与获奖成果；本人/颁奖或项目主管机构；授权证书、立项/结题、获奖原件、人员清单；A3/A4/C1/D 条·本人；官方公告、可校验项目/专利数据库或签发证明；参评分值非软件估定；F026—031；001 第18条、012 第13条；项目/证书号、位次、颁发日期、授予机构；NEEDS_MATERIAL/UNREADABLE；位次冲突→CONFLICT",
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
        "专利、竞赛、课题与获奖成果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "社会实践、服务、学生工作等活动事实",
      "purpose": "社会实践、服务、学生工作等活动事实；本人/活动发证方；社会实践、服务、学生工作等活动事实；本人/活动发证方；活动证明、工作任职记录、实践成果；批次确实采纳时 条·本人；学校团学/活动组织权威记录；未经规则授权不能无限加分；F026—031；012 第13条、008 待核；活动名称、时间、出具人、学生参与角色；条件不触发→NOT_APPLICABLE；触发缺证→NEEDS_MATERIAL",
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
        "社会实践、服务、学生工作等活动事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "导师核实意见/成果签注",
      "purpose": "导师核实意见/成果签注；有权导师；导师核实意见/成果签注；有权导师；签字加分申请表/意见、业务留痕；指定学院 条·导师/学院；经学校确认导师身份的电子签批；不是全校一律必交；F028/033；006/007/012；导师身份、所核成果、签署时间、权限；由导师/学院应签而未得→SOURCE_UNAVAILABLE；若当批明确由学生提交已签表且未交→NEEDS_MATERIAL；权限失效→CONFLICT",
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
        "导师核实意见/成果签注",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "既有奖项正式结论及成果使用历史",
      "purpose": "既有奖项正式结论及成果使用历史；其他奖项权威经办方；既有奖项正式结论及成果使用历史；其他奖项权威经办方；S03-T02/T03、此前 S03-T04 决定/成果计奖记录；发现跨奖项使用时 条·校；可校验的正式决定 ID/生效名单及成果关联；单独上传同文件不证明重复计奖；F030/039；001 第9—10条、002；各奖项、学年、原决定号、成果 ID、使用/撤销状态；缺历史→SOURCE_UNAVAILABLE/人工核；不自动否决",
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
        "既有奖项正式结论及成果使用历史",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "社会/院专项独有资格、文章或项目测评",
      "purpose": "社会/院专项独有资格、文章或项目测评；本人+专项主办方；社会/院专项独有资格、文章或项目测评；本人+专项主办方；当批专用奖学金申请表及明确列明的内容；D1/D2 条（须有 M002）；官方专用表/主办方认可电子记录；不能以“助学金”表替代奖学金表 [008]；F001/002/026/031/032；008（摘要待核）；项目、届别、材料题目、查重/考试文件如当批确需；未核专项政策先 POLICY_UNCONFIRMED；确定必交才 NEEDS_MATERIAL",
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
        "社会/院专项独有资格、文章或项目测评",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "不能现场确认时的委托事实",
      "purpose": "不能现场确认时的委托事实；双方与学院；不能现场确认时的委托事实；双方与学院；双方签字的授权书；仅核自院 2023 特殊确认时 条·本人 [012]；当年受理学院认可的电子/书面同效授权；无证据不扩大到代理申报或裁决；F034/045；012 第10条；授权人/受托人、任务范围、期限、签名；条件未触发 NOT_APPLICABLE；触发缺签→NEEDS_MATERIAL/人工确认",
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
        "不能现场确认时的委托事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "申报材料初核、本人确认与学院评分",
      "purpose": "申报材料初核、本人确认与学院评分；学院委员会；申报材料初核、本人确认与学院评分；学院委员会；有权核验记录、分项评分/会议留痕；P2/P3 后·校；已签发/可验的委员会电子初核记录；不可用模型评分替代；F031/035/045；001 第21条、012 第9条；评审委员/回避、申请版本、结果/确认时间；P1 NOT_APPLICABLE；P3 应有未得 SOURCE_UNAVAILABLE",
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
        "申报材料初核、本人确认与学院评分",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "学院拟推荐人与等级汇总",
      "purpose": "学院拟推荐人与等级汇总；学院委员会；学院拟推荐人与等级汇总；学院委员会；汇总表、经核签字/学院章的推荐名册；P3 后·校；学院权威电子签发清单；2024 模板含公章/主任签字栏 [013]；F031/035/037；001 第22条、013；学院/批次、候选等级、签发者与对应审核版本；P1 NOT_APPLICABLE；候选≠最终，缺签人工",
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
        "学院拟推荐人与等级汇总",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "学院公示及异议期间",
      "purpose": "学院公示及异议期间；学院发布部门；学院公示及异议期间；学院发布部门；官网/公告栏原件与起止、变更/异议记录；P3 后·校；可验证原始公告档案，截图须能追溯发布日期/公示范围；F036/037/041；001 第21、24条、012；公示人、起止、公告版本及替换记录；P1 NOT_APPLICABLE；应有未得 SOURCE_UNAVAILABLE",
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
        "学院公示及异议期间",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "学生书面异议/申诉",
      "purpose": "学生书面异议/申诉；本人/受理委员会；学生书面异议/申诉；本人/受理委员会；正式申诉书、受理回执；X3/X4 条·本人；校方允许的书面/可信电子渠道；不可用讨论帖替代；F041；001 第24条、012 第11条；原拟结论、异议事项/证据、收件时刻；未申诉 NOT_APPLICABLE；已主张缺件 NEEDS_MATERIAL",
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
        "学生书面异议/申诉",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "学院答复、学校裁决",
      "purpose": "学院答复、学校裁决；有权委员会；学院答复、学校裁决；有权委员会；书面答复与校级裁决、送达记录；X3/X4 后·校；只有原有权机关签发的处理书能替代；不能以 AI 复核意见冒充；F042；001 第24条、012 第11条；申诉 ID、作出主体、时点、关联证据与效力；尚未处理 NOT_APPLICABLE；应答未得 SOURCE_UNAVAILABLE",
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
        "学院答复、学校裁决",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "学校层级的材料审核/专家评审",
      "purpose": "学校层级的材料审核/专家评审；研究生院/相应委员会；学校层级的材料审核/专家评审；研究生院/相应委员会；专家审查意见、复核/审议记录；P4 后·校；相应制度授权的签发意见，不得沿用其他奖项委员会；F038/045；001 第16、23条、002 第9—10条；评委资格、回避、审议版本、签署；P1 NOT_APPLICABLE；应有失联 SOURCE_UNAVAILABLE",
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
        "学校层级的材料审核/专家评审",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "学校/外部真正有权人的审批/审议确定、最终名单与后续修订",
      "purpose": "学校/外部真正有权人的审批/审议确定、最终名单与后续修订；有权机构；学校/外部真正有权人的审批/审议确定、最终名单与后续修订；有权机构；审批文件、决定 ID、被异议纠正后的有效版本；P4/P5 后·校。A 学业奖先审批后校公示，C 珠峰先校公示后审批；经校方确认的原决定编号及签发档案；候选 PDF [003/004]、单独的 M025 公告都不替代；F039/040/044/045/051；001 第23—24、26条、002 第9—11条；奖项、批次、批准单位、签发时间、决定版本、是否待公示/异议闭合；未决定 NOT_APPLICABLE；欲声称已批准而无件 SOURCE_UNAVAILABLE；有审批未公示不称终局",
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
        "学校/外部真正有权人的审批/审议确定、最终名单与后续修订",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "学校范围的公示及处理结果",
      "purpose": "学校范围的公示及处理结果；学校发布者；学校范围的公示及处理结果；学校发布者；校公示正文、起止、异议处理信息；P4 后·校；可追溯原官网公告；不能只以社媒转发认定结束；F040/041；001 第23—24条、002 第10条；公示期、发布组织、变更与异议版本；P1 NOT_APPLICABLE；应有失联 SOURCE_UNAVAILABLE",
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
        "学校范围的公示及处理结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "补件、换件、撤回与改报真实请求",
      "purpose": "补件、换件、撤回与改报真实请求；本人/受理学院；补件、换件、撤回与改报真实请求；本人/受理学院；有时间戳的书面/可信电子请求+受理回执；X1/X2 条；批次认可的变更渠道；不能倒填成截止前首次提交；F032/043；SRC-001 第20条/SRC-002 第7条仅证自主申报、不构成通用撤回授权，本批撤回原文待核；原 M004、替代材料号、新旧证据版本、提出/受理时间；未发生 NOT_APPLICABLE；发生缺意愿 NEEDS_MATERIAL，法律效力 HD",
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
        "补件、换件、撤回与改报真实请求",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "珠峰奖对应毕业/授位事实",
      "purpose": "珠峰奖对应毕业/授位事实；学位/学籍部门；珠峰奖对应毕业/授位事实；学位/学籍部门；预计毕业进度、最终授位决定/证明；C1 P1 可先核可得状态，正式授予文件 后·校；学位主管机构原签发记录；申请阶段不能强求未发生的授位事实；F020/021/039；002 第5条、004；毕业年度、学位决议生效日、版本；尚未形成 NOT_APPLICABLE/人工待办，不作为 P1 缺件",
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
        "珠峰奖对应毕业/授位事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "事后暂缓、撤销、追回等权威处理",
      "purpose": "事后暂缓、撤销、追回等权威处理；原认定/审批/财务部门；事后暂缓、撤销、追回等权威处理；原认定/审批/财务部门；正式处分/资格认定、处理决定和资金办理摘要；P5 后·校；有权部门授权最小化查询结果，禁止学生交完整敏感档案；F021/044；001 第25—26条、002 第11条；原获奖 ID、事实生效日、处理机关/效力；未发生 NOT_APPLICABLE；发生而无源 SOURCE_UNAVAILABLE/HD",
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
        "事后暂缓、撤销、追回等权威处理",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "经办/委员真实任职授权与回避",
      "purpose": "经办/委员真实任职授权与回避；学校/学院权威管理方；经办/委员真实任职授权与回避；学校/学院权威管理方；当前批次授权名册、委任/回避记录、可信会话校验；P0/P2—P5 当·校；有权管理部门即时核验；Renderer 任意 Actor 字段绝非合法替代；F045；001 第15—17条、002 第8—10条、012；委任范围、项目、有效期、签发组织、操作审计；SOURCE_UNAVAILABLE→禁止写正式决定并转人工",
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
        "经办/委员真实任职授权与回避",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M030",
      "name": "2025 筑梦等明确以困难认定为前提时，核正式认定事实",
      "purpose": "2025 筑梦等明确以困难认定为前提时，核正式认定事实；学校困难认定有权部门；2025 筑梦等明确以困难认定为前提时，核正式认定事实；学校困难认定有权部门；已形成的学年困难生认定生效记录/最小证明；D3 P1/P2 条·校；由有权部门安全查询结论，禁止重做困难认定或强制上传家庭完整财务信息；F046；016；学生 ID、参评学年、原决定 ID、生效/撤销状态；权威源失联 SOURCE_UNAVAILABLE；无当年认定不得生成伪结论；OCR 不清 UNREADABLE",
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
        "2025 筑梦等明确以困难认定为前提时，核正式认定事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "2025 筑梦专项历史国家开发银行助学贷款事实",
      "purpose": "2025 筑梦专项历史国家开发银行助学贷款事实；银行/校资助贷款办理部门；2025 筑梦专项历史国家开发银行助学贷款事实；银行/校资助贷款办理部门；可核原承办行及实际获贷记录；D3 P1/P2 条·校；本人合法合同概要/主管部门签发核验说明；须最小化银行/借贷隐私；F047；016；合同摘要标识、出具方、贷款期间、是否确属指定承办行；源失联 SOURCE_UNAVAILABLE；当批明确可补但本人缺件 NEEDS_MATERIAL；不清 UNREADABLE",
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
        "2025 筑梦专项历史国家开发银行助学贷款事实",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M032",
      "name": "2025 筑梦申报学年专业成绩、综测排名和母数",
      "purpose": "2025 筑梦申报学年专业成绩、综测排名和母数；教务/综测有权部门；2025 筑梦申报学年专业成绩、综测排名和母数；教务/综测有权部门；有权成绩/综测排名记录；D3 P1/P2 条·校；经授权查 S03-T01 生效综测结果及官方教务年级排名，不要求重复评分；F024/048；016；学年、专业年级、名次/人数、同分口径、结果版本和原主管；校源失联 SOURCE_UNAVAILABLE；年份/母数冲突 CONFLICT，扫描不清 UNREADABLE",
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
        "2025 筑梦申报学年专业成绩、综测排名和母数",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M033",
      "name": "核特定培养项目成员身份与生效日期",
      "purpose": "核特定培养项目成员身份与生效日期；学校项目主管/合作单位；核特定培养项目成员身份与生效日期；学校项目主管/合作单位；菁英班录取/注册名册或退出记录；D4 P1 条·校；同授权机构签发的可验项目成员证明，申请人口述不能替代；F050；018；项目届别、学生 ID、加入/退出日、负责组织与有效版本；权威源缺 SOURCE_UNAVAILABLE，申报批次政策未取得 POLICY_UNCONFIRMED",
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
        "核特定培养项目成员身份与生效日期",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M034",
      "name": "设奖权、校内推荐与最终授予界限",
      "purpose": "设奖权、校内推荐与最终授予界限；学校/设奖方/外部基金组织；设奖权、校内推荐与最终授予界限；学校/设奖方/外部基金组织；项目章程、合作/捐赠协议之授权摘要、当批联合评审书；D1—D4 P0 条·校；同等效力原签发协议或正式项目通知，不能以学院新闻代替外部基金会章程；F001/051/045；016/018/019/022；项目、授权人、决定权、有效期、盖章、是否仅学校推荐；未见原件 POLICY_UNCONFIRMED；有权签发者失联 SOURCE_UNAVAILABLE；终审权不清 NEEDS_HUMAN_DECISION",
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
        "设奖权、校内推荐与最终授予界限",
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
          "title": "R001 · 奖项唯一识别、路由",
          "requirement": "原件 R001：奖项唯一识别、路由；P0；T: M002 确有奖学金项目，用签发者+项目+年度比对 F001/002；F: 仅荣誉称号/助学金/教师奖励，按 E0 排除；U: 名称含奖助或未见项目文件；001/002/005/008/016/019/020/023 → F001/002/051 → M001/002/034；同一项目 PASS_FACT；错路由 NOT_APPLICABLE 并送相邻模板；政策多义 POLICY_UNCONFIRMED→校主管部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 现行政策及批次时效",
          "requirement": "原件 R002：现行政策及批次时效；P0；T: M001 生效/废止状态及 M002 当期届别确证，比对 F003/004/005/009；F: 无该类批次、明确不在范围；U: 仅旧版规则、检索摘要、通知变更或 2026 未发布；001/002/016/017/018/021 → F003/004/005/009 → M001/002；有效期完整则 PASS_FACT；未核 POLICY_UNCONFIRMED→发布机关；正文失联 SOURCE_UNAVAILABLE，不沿用上年名额。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 学院细则及项目组织授权",
          "requirement": "原件 R003：学院细则及项目组织授权；P0；T: 指定学院需 M003，核发布、至少适用学年、备案/公示、F006；F: 该项目制度明确无学院附加细则；U: 跨院或 2025 修订未取原件；001 第18—19条/012/021 → F006/007/010 → M002/003/029；有效细则 PASS_FACT；冲突 CONFLICT；不明 POLICY_UNCONFIRMED→学院及研工部审核，不能拿核自院细则替其他学院。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · 本人真实申请、归属批次与有效提交",
          "requirement": "原件 R004：本人真实申请、归属批次与有效提交；P1；T: 当前项目要求申报，M004 或当批允许的 M016 专项表中学号/项目/届别/接收时点对 F004/011/032；F: 当批明示免个人申请且学校可证录取分配流程；U: 受理截止或受理形式未知；001 第20条/002 第7条/012/015/016 → F004/009/032 → M002/004/008/016；一致 PASS_FACT；确需的 M004/M016 未得 NEEDS_MATERIAL→本人；超过期限是否受理 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→学院。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · 申请人唯一身份与合法改名",
          "requirement": "原件 R005：申请人唯一身份与合法改名；P1/P2；T: 已有申请/校方登记，比 F011 学号、F012 更名链及 M004/M005；F: 本模板已在 E0 路由排除；U: 同名不同学号或校源失联；001/002/016 → F011/012 → M004/005；同一人 PASS_FACT；不一致 CONFLICT，校学籍核；权威源失联 SOURCE_UNAVAILABLE；OCR 不清 UNREADABLE。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · 学业奖国籍、研究生在籍/学制属性",
          "requirement": "原件 R006：学业奖国籍、研究生在籍/学制属性；A 类 P1；T: F001 为学业奖，比 F013—F016 与 M005/008 有效区间、学校制度具体类；F: B/C/D，不挪用学业奖中国国籍条件；U: 学籍状态/政策新版不明；001 第5—6/11—12条、012 → F013/014/015/016 → M001/005/008；一致 PASS_FACT；源失联 SOURCE_UNAVAILABLE→学籍部门；当年不合适用门槛由主管人工按有效政策处理，不由模型签拒绝。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · 励志/珠峰身份与基本年限",
          "requirement": "原件 R007：励志/珠峰身份与基本年限；B/C P1；T: F001 为 B/C，核全日制、非定向、入学/毕业阶段、F016/020；F: A/D；U: 毕业资格、非定向性质或 2020 办法现行性不明；002 第3—6条/004/017 → F015/016/018/020 → M001/005/006/027；身份事实 PASS_FACT；SOURCE_UNAVAILABLE→招生/培养；2026 规则未知 POLICY_UNCONFIRMED；毕业后产证不算 P1 缺件。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · 研一/高年级、硕博转段身份时点",
          "requirement": "原件 R008：研一/高年级、硕博转段身份时点；A/B P1；T: 有层次/年度判定需要，用 M005/006/008 的生效日映射 F015/018/019；F: 学段不存在变化，不索 M006；U: 转段日期或修课阶段冲突；001 第5条、002 第4条、012 第1/12条、014 → F015/018/019/023 → M005/006/008；有效分组 PASS_FACT；无法确定 CONFLICT/SOURCE_UNAVAILABLE→研究生院；禁止旧截屏覆盖转段时点。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · 基本修业年限与例外在学时段",
          "requirement": "原件 R009：基本修业年限与例外在学时段；A/B/C P2；T: 当批有年限限制，核 F020/021 及官方 M005/006 的参评时区间；F: 明确不以此为条件的专项 D；U: 延长年限、复学、累计时长及“原则上”条款裁量；001 第11—12条、002 第3/5条、012 → F020/021 → M001/005/006/028；数值事实 PASS_FACT；时效缺源 SOURCE_UNAVAILABLE；资格效果 NEEDS_HUMAN_DECISION→研究生培养/评审委员会。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · 正式课程成绩、必修环节及更正",
          "requirement": "原件 R010：正式课程成绩、必修环节及更正；A3/A4 P2；T: 高年级且当批采成绩/培养环节，M009/010 的学年/课程/修订版对 F024/025；F: 新生尚无本学年成绩且规则不要求；U: 成绩异议正在复核；001 第12/18条、012 第12条、016（D3 成绩参照） → F024/025/031 → M003/009/010/032；源一致 PASS_FACT；旧截图与新成绩 CONFLICT→教务；源缺 SOURCE_UNAVAILABLE；不据 OCR 认定不及格处分。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · 缴费、缓缴与注册事实",
          "requirement": "原件 R011：缴费、缓缴与注册事实；A 类 P2；T: 有当批缴费注册条件，按 M007 的年度和批准缓办区间核 F022；F: 特定项目规则不要求、或新生尚未到此核验阶段；U: 贷款/缓缴证明在办理中、2026 口径不清；001 第12条、006/007（正文待核）、012 → F013/022 → M002/005/007；可核事实 PASS_FACT；源失联 SOURCE_UNAVAILABLE→财务/注册；“无故”判断 NEEDS_HUMAN_DECISION，不能把贫困等同违纪。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · 休学、违纪与学术不端正式状态",
          "requirement": "原件 R012：休学、违纪与学术不端正式状态；A/P5；T: 当批明确相关排除/后续处理，限权读 F021/044 的官方生效事实与期间；F: 无合法触发及已核不存在相关认定；U: 举报、AI 推断、处分尚在申诉；001 第11—12/25—26条、002 第11条 → F013/021/044 → M005/028；有效状态仅 PASS_FACT（事实），合法性/例外 NEEDS_HUMAN_DECISION→原认定机关；未经原机关核实 SOURCE_UNAVAILABLE。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · 招生录取类别与专业映射",
          "requirement": "原件 R013：招生录取类别与专业映射；A1/A2/B1/B2 P2；T: 新生档次依推免/统考/专业分类，取校招生 M008 与有效 M002/003 绑定 F017/023；F: 高年级与无新生录取分组之专项；U: 跨年专业代码变化、排序算法缺当批原文；002 第4条及学科附件、012 第12—13条、014 → F017/018/023 → M002/003/008；录取事实 PASS_FACT；算法 POLICY_UNCONFIRMED→招生/学院，绝不固化 2020 等次和金额。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · 申报成果真实性及类型",
          "requirement": "原件 R014：申报成果真实性及类型；A3/A4/C/D 条件 P2；T: F026 主张计分，按 M011/012/013 原签发编号/期刊/颁奖组织校验 F029；F: 没有申报该类型，不要求零成果证明；U: 原平台故障或 OCR 断页；001 第18条、012 第13条、002 第6条 → F026/029 → M004/011/012/013；真有来源 PASS_FACT；需交的附件无 NEEDS_MATERIAL，模糊 UNREADABLE，原机构失联 SOURCE_UNAVAILABLE→成果核验人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · 成果日期、学生署名、排名与参评年",
          "requirement": "原件 R015：成果日期、学生署名、排名与参评年；条件 P2；T: 已识别成果，核 F027/028 的正式发表/授权日期、作者署名和 M003 有效起止；F: 成果未参加该奖计分；U: “录用≠见刊”、版本更正、贡献争议；001 第18条、012 第13条 → F003/026/027/028 → M003/011/012/013/014；明确一致 PASS_FACT；不同原证据 CONFLICT；贡献裁量 NEEDS_HUMAN_DECISION→导师/学院；不能用上传日冒充成果日。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · 已获奖成果跨批/跨项目使用",
          "requirement": "原件 R016：已获奖成果跨批/跨项目使用；A/B/C/D P2；T: 同一成果已关联另一有效已发/拟发奖项，分项目比较 F030 与 M015 具体规则；F: 未有重用迹象，无须要求“一概未用”证明；U: 只有相同 PDF、缺历史决定或禁重条文；001 第9—10条、012 第5—6条、002（若对应奖另有规定） → F026/030/049 → M004/015/011/012；使用事实 PASS_FACT；事实相悖 CONFLICT；是否违规 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→原奖项批准机关；共享文件≠重复计奖。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · 导师意见/委托现场确认的适用性",
          "requirement": "原件 R017：导师意见/委托现场确认的适用性；P1/P2；T: 指定学院当批要求导师签注或本人确有不可抗力委托现场确认，查 M014/017 身份签名/范围；F: 本人正常确认或没有当批附加要求；U: 授权人身份、可代理范围或签名不符；012 第9—10条、006/007 待核 → F033/034/045 → M003/014/017/029；合法材料 PASS_FACT；确需缺件 NEEDS_MATERIAL；越权 CONFLICT/NEEDS_HUMAN_DECISION→学院，不授代理审批权。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · 专项是否要求已有困难生认定",
          "requirement": "原件 R018：专项是否要求已有困难生认定；D3 P1/P2；T: 2025 筑梦或其他当批明确条件，比较 F046 的认定届别/效力与 M030；F: 一般学业奖或无困难认定条件的专项，不读取家庭信息；U: 只有学生自述/2026 批次未核；016 “一、（六）” → F002/003/046 → M002/030；引用权威认定 PASS_FACT；源失联 SOURCE_UNAVAILABLE→原困难认定部门；从不在本规则重新认定困难等级。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · 专项助学贷款指定承办行历史",
          "requirement": "原件 R019：专项助学贷款指定承办行历史；D3 P2；T: 2025 筑梦明确要求国开行曾办理，核 F047 与 M031 承办行/获贷事实；F: 非该专项或无此条件；U: 同名银行/贷款申请≠实际获贷、权威记录未得；016 “一、（七）” → F047 → M002/031；原源一致 PASS_FACT；缺合法来源 SOURCE_UNAVAILABLE，可补本人概要时 NEEDS_MATERIAL→校资助/贷款部门；不索全量还款流水。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · 专项排名/综测事实与算法",
          "requirement": "原件 R020：专项排名/综测事实与算法；D3 P2；T: 2025 筑梦需上学年课程和专业年级排名，核 F024/048、M032 的统计基数与参评学年；F: 无排名条件项目；U: 同分/跨专业统计口径不清、2026 新批尚无规则；016 “一、（五）” → F003/024/048 → M002/009/032；已核数值 PASS_FACT；排名源冲突 CONFLICT；当批阈值未证 POLICY_UNCONFIRMED→原教务/综测签发者和校资助部门。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · 专项与国家两奖既有结果互斥",
          "requirement": "原件 R021：专项与国家两奖既有结果互斥；D3 P2；T: 2025 筑梦明确禁止同年度获某两类国家奖，按 F049 对学校正式 M015 的学年/奖项/状态核；F: 其他无排他条件项目；U: 只见候选名单、未核历史决定或状态被撤销；016 “一、（八）” → F049/039 → M002/015/024；已证事实 PASS_FACT；无法确定 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION→学生资助中心；不让 S03-T04 重审 S03-T02/T03 决定。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 菁英班/合作项目成员及授奖边界",
          "requirement": "原件 R022：菁英班/合作项目成员及授奖边界；D4 P0/P1；T: 对应已授权班级/项目，核 F050/051 与 M033/034 的届别和双方职权；F: 普通非项目奖学金，不索合作名册；U: 只有 2026 页面摘要、没有合作协议或权责细则；018/019/022（不同示例） → F002/050/051 → M001/002/003/033/034；成员事实 PASS_FACT；授权不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→校方与设奖方，学校推荐不能冒充外部基金终审。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 学院分项评分、排名与名额建议",
          "requirement": "原件 R023：学院分项评分、排名与名额建议；P3；T: 已受理且该项目确有评分/指标，核 M018/019 对 F010/031 的逐项来源、名额及回避；F: 本项目不设学院分项/名单、按规则转其他组织；U: 当批细则缺页、规则变更或分值有争议；001 第13—14/18—22条、012、016（D3 须区分） → F006/010/031/037 → M002/003/018/019；原数值校核 PASS_FACT，评分/名次与破格 NEEDS_HUMAN_DECISION→学院委员会；无有效细则 POLICY_UNCONFIRMED。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 学院委员会权限和拟推荐签发",
          "requirement": "原件 R024：学院委员会权限和拟推荐签发；P2/P3；T: 学院拟名单/初核已形成，核 M018/019 的委员权限、院章、案卷证据版本；F: P1 尚未初评，不索 M018/019；U: 只有未签字表格、Renderer 角色声称；001 第17/21—22条、002 第8条、013、016 → F035/037/045 → M018/019/029；合法推荐事实 PASS_FACT；签发/授权缺 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION→学院；绝非校级批准。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 学院公示的真实发布与窗口",
          "requirement": "原件 R025：学院公示的真实发布与窗口；P3；T: 制度规定学院公示且拟名单已出，核 M020 原公告/实际起止及 5 工作日（仅 A、B/C 各自已核历史规则）；F: 尚未 P3 或有证据表明无院公示环节；U: 删除/重发公告、其他专项未核期限；001 第21条、002 第8条、012、017（2026单院索引） → F008/009/036/037 → M002/019/020；公示发生 PASS_FACT；原链接丢失 SOURCE_UNAVAILABLE；窗口冲突 CONFLICT→学院，旧时长不硬套 D 类。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · 学院书面异议与答复",
          "requirement": "原件 R026：学院书面异议与答复；X3/P3；T: 学业奖学生在学院公示阶段提出 M021，核 F041 收件时点/对象；F: 未提出或其他项目没有该申诉步骤；U: 申诉时戳、公示版本或受理权限不明；001 第24条、012 第11条 → F009/036/041/042 → M020/021/022；提交事实 PASS_FACT；缺书面本人材料 NEEDS_MATERIAL；未答复 SOURCE_UNAVAILABLE→学院委员会；答复文本后产。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · 学校研工/专家层级审核",
          "requirement": "原件 R027：学校研工/专家层级审核；P4；T: 已由有权学院报送，A 核校研究生评审委员会；B/C 分别核研究生院审核或专家评审 M023；F: 尚未完成学院推荐或该项目无学校专家流程；U: 他奖委员会签署、审核证据缺；001 第16/23条、002 第9—10条 → F038/045/051 → M019/023/029/034；审核发生 PASS_FACT；错授权 CONFLICT/NEEDS_HUMAN_DECISION→项目主管部门；无权威源 SOURCE_UNAVAILABLE。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · 学校公示及升级异议",
          "requirement": "原件 R028：学校公示及升级异议；X4/P4；T: A 学业奖校公示，且对院答复仍不服时经 M025/021/022 核申诉；C 珠峰按其学校公示要求分别核；F: B 不当然套 A 校公示异议路径，未到 P4 不索；U: 公告版本/他奖异议规则不明；001 第23—24条、002 第10条 → F009/040/041/042 → M020/021/022/025；公示/申诉事实 PASS_FACT；旧公告 CONFLICT；校裁决 NEEDS_HUMAN_DECISION→相应学校委员会；没有 M022 时不能说“申诉已处理”。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · 批准真值、程序先后与最终生效分离",
          "requirement": "原件 R029：批准真值、程序先后与最终生效分离；P4/P5；T: 欲显示“已批准”或“最终有效”，核 M024 签发主体/版本、M029 权限、M025 公示、M022 异议裁决及实际顺序；A：校领导小组审批→校公示→无异议上报；C：研究生院拟名单校公示→领导小组审定。F: 仅预审/学院建议，不运行“已批准”检查；U: 只见名单、公示仍进行、申诉未决、外部终审缺；001 第15—17/23—24条、002 第9—10条、016、022 → F039/040/042/045/051 → M019/022/023/024/025/029/034；原件能证明审批存在仅 PASS_FACT（审批事实），另以程序状态显示 APPROVED_PENDING_PUBLICITY / FINAL_EFFECTIVE_VERIFIED，不是 R 自动授奖；公示/异议未闭合转 NEEDS_HUMAN_DECISION，无原审批 SOURCE_UNAVAILABLE→有权机构。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 · 正式发奖后变化及有权处置",
          "requirement": "原件 R030：正式发奖后变化及有权处置；P5；T: 原 M024 已批准、出现已核学籍/纪律/学术变更，按效期核 M028 与 F044；F: 未获奖或无变更，不造追回待办；U: 只有举报、付款记录或申请人要求“撤销”；001 第25—26条、002 第11条 → F013/021/039/044 → M005/024/027/028；事后变更事实 PASS_FACT；是否暂缓/撤销/追回 NEEDS_HUMAN_DECISION→原批准机构/财务；不由学生上传处分终审文书。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031 · 补件/更正与有向版本失效",
          "requirement": "原件 R031：补件/更正与有向版本失效；X1/P1—P4；T: 有新 M026 或原权威记录更正，核 F043、受影响 M 的 supersedes/sha/时点；F: 无修改事件，仍沿原证据；U: 旧/新版本谁生效不明或超过当批补件期；001/012（期限仅历史） → F008/024/029/031/032/043 → M004/009/011/018/026；版本链 PASS_FACT；冲突 CONFLICT；时限 POLICY_UNCONFIRMED→收件单位；仅受影响 R 重跑，旧核验失效。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032 · 主动撤回、改报与再次申请",
          "requirement": "原件 R032：主动撤回、改报与再次申请；X2/P1—P5；T: 本人请求 M026，核 F043 原案/批次/时点及是否已批准；F: 无真实请求；U: 撤回许可、复提期限或 P3 后效果未见校本依据；无直接校本通用撤回条款，002 第7条仅能证明自愿申请 → F004/008/032/043 → M002/004/024/026；意愿事实 PASS_FACT；有效撤回/重新受理需 POLICY_UNCONFIRMED+人工办理→学院/主管；P5 不得撤销 M024。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "R033 · 经办、代理与审批签名可信性",
          "requirement": "原件 R033：经办、代理与审批签名可信性；P0—P5；T: 人工评定/公示/裁决/签发动作，核会话主体+M029 授权/回避+M017 代理范围；F: 纯读取/AI 事实预审不需要委员角色；U: Renderer 自报 admin/过期委任/代理超限；001 第15—17/24条、002 第8—10条、012 第10条 → F034/035/039/042/045 → M017/018/022/024/029；授权真实 PASS_FACT；假身份/失联 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION→Main 与有权组织，阻断任何行政写操作。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "R034 · 校外基金/省级奖学金的校内推荐界限",
          "requirement": "原件 R034：校外基金/省级奖学金的校内推荐界限；P0/P4；T: M034/002 指向外部主办终审，学校最多核申报及推荐，不写外部获奖；F: 学校制度明确校内终审；U: 国际学生奖项、省级政府奖、外部基金权责未见现行章程；022（2017典型）/023（2025摘要）/018 → F001/002/014/051 → M001/002/004/023/024/034；校内推荐 PASS_FACT，外部决定缺 SOURCE_UNAVAILABLE；权责不明 POLICY_UNCONFIRMED→设奖方及学校，必要时 CATALOG-CHANGE-REQUEST。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
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
      "name": "批次规则生效前核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "初核与补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "学院初评",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "学校审查、批准与后置公示/申诉",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "公示/异议闭合后的有效名单与后续",
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
  "templateId": "S03-T04",
  "name": "校院及专项奖学金（含研究生学业奖学金）评审",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T04.md",
  "sourceDocumentSha256": "a9950cfcb68265a527f6e6a18d569518083fda5f78e33500a4e61d27c06acd7f",
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
    "SRC-013",
    "SRC-014",
    "SRC-015",
    "SRC-016",
    "SRC-017",
    "SRC-018",
    "SRC-019",
    "SRC-020",
    "SRC-021",
    "SRC-022",
    "SRC-023"
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
    "F042",
    "F043",
    "F044",
    "F045",
    "F046",
    "F047",
    "F048",
    "F049",
    "F050",
    "F051"
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
    "M028",
    "M029",
    "M030",
    "M031",
    "M032",
    "M033",
    "M034"
  ],
  "criteria": [
    {
      "sectionId": "rule-review",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-008",
        "SRC-016",
        "SRC-019",
        "SRC-020",
        "SRC-023"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001"
      ],
      "materialIds": [
        "M002",
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-016",
        "SRC-017",
        "SRC-018",
        "SRC-021"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003"
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
        "SRC-001",
        "SRC-012",
        "SRC-021"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F006"
      ],
      "materialIds": [
        "M003",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F004"
      ],
      "materialIds": [
        "M004",
        "M016",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F011",
        "F012"
      ],
      "materialIds": [
        "M004",
        "M005"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F013",
        "F014",
        "F015",
        "F016",
        "F001"
      ],
      "materialIds": [
        "M005",
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-017"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F016",
        "F015"
      ],
      "materialIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F015"
      ],
      "materialIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F020"
      ],
      "materialIds": [
        "M005",
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001",
        "SRC-012",
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F024"
      ],
      "materialIds": [
        "M009",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F022",
        "F013"
      ],
      "materialIds": [
        "M007",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F021",
        "F013"
      ],
      "materialIds": [
        "M005"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-002",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F017"
      ],
      "materialIds": [
        "M008",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001",
        "SRC-012",
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F026",
        "F029"
      ],
      "materialIds": [
        "M011",
        "M004"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F027",
        "F003"
      ],
      "materialIds": [
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001",
        "SRC-012",
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F030",
        "F026"
      ],
      "materialIds": [
        "M015",
        "M004"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-012",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F033"
      ],
      "materialIds": [
        "M014",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F046",
        "F002"
      ],
      "materialIds": [
        "M030",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F047"
      ],
      "materialIds": [
        "M031",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F024",
        "F003"
      ],
      "materialIds": [
        "M032",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F049"
      ],
      "materialIds": [
        "M015",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-018",
        "SRC-019",
        "SRC-022"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F050",
        "F002"
      ],
      "materialIds": [
        "M033",
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001",
        "SRC-012",
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F010",
        "F006"
      ],
      "materialIds": [
        "M018",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-013",
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F035"
      ],
      "materialIds": [
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012",
        "SRC-017"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F008"
      ],
      "materialIds": [
        "M020",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F041",
        "F009"
      ],
      "materialIds": [
        "M021",
        "M020"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F038"
      ],
      "materialIds": [
        "M023",
        "M019"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F009"
      ],
      "materialIds": [
        "M025",
        "M020",
        "M022"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-016",
        "SRC-022"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F039"
      ],
      "materialIds": [
        "M024",
        "M029",
        "M025",
        "M022",
        "M019"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F044",
        "F013"
      ],
      "materialIds": [
        "M024",
        "M028",
        "M005"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F043",
        "F008"
      ],
      "materialIds": [
        "M026",
        "M004"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F043",
        "F004"
      ],
      "materialIds": [
        "M026",
        "M002",
        "M024"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F034"
      ],
      "materialIds": [
        "M029",
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-022",
        "SRC-023",
        "SRC-018"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001"
      ],
      "materialIds": [
        "M034",
        "M001"
      ]
    }
  ]
}

export default templateVersion
