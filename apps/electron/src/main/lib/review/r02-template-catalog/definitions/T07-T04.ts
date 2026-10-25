import type { TemplateVersion } from '@profer/shared'

/** Local R02 research implementation. Not an official CDUT template. */
export const templateVersion: TemplateVersion = {
  "templateId": "T07-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "二级单位网站建设、二级域名申请与网站变更审核",
  "description": "本地研究模板 · 非校方正式模板。二级单位网站建设、二级域名申请与网站变更审核的事实预审、证据缺口识别和人工复核辅助；政策证据状态为 PARTIAL，校方最终签发/批准/用印/上线等决定必须由真实有权人员在权威流程中完成。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 源研究稿为非成都理工大学官方模板；源文件 docs/design/review-agent/business-templates/R02/T07-T04.md，SHA-256 203fb45d0d7291736bb1b0a241c1009ee8c701e5f29f6ac9aa01ff87e87e2e37。研究来源与学校现行授权并不等同；未经核实的政策与权限必须人工复核。",
  "objectType": "custom",
  "displayName": {
    "template": "T07-T04 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "001 · 案卷",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；源定义：caseId（string；案卷）；A/P0 系统生成；案卷元数据；研究设计；内部；系统未生成则阻止落案"
    },
    {
      "key": "f002",
      "label": "002 · 申请",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002；源定义：requestKind（enum；申请）；A/P0 APP；M001 事项描述；研究设计；普通；未知则询问，NEEDS_MATERIAL"
    },
    {
      "key": "f003",
      "label": "003 · 申请单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003；源定义：applicantOrgId（string；申请单位）；A/P0 ORG 优先，APP 待核；M001 单位栏 / 组织主数据；SRC-001 第四、七条；内部；无法核组织身份 → 人工核验"
    },
    {
      "key": "f004",
      "label": "004 · 经办人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F004；源定义：submitterActorId（string；经办人）；A/P0 IAM 优先；可信登录事件 / M014；研究设计；个人；身份源离线 → SOURCE_UNAVAILABLE"
    },
    {
      "key": "f005",
      "label": "005 · 代理授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F005；源定义：delegateGrantRef（ref；代理授权）；C/P0 IAM、单位有效授权；M014 授权范围；研究设计；内部受限；代理不明 → 停止代办动作待确认"
    },
    {
      "key": "f006",
      "label": "006 · 站点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F006；源定义：siteName（string；站点）；A/P0 APP；已建站 SITE；M001/M005 名称；SRC-001 附件 1；普通；名称缺失补明"
    },
    {
      "key": "f007",
      "label": "007 · 站点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F007；源定义：sitePurpose（text；站点）；A/P0 APP；M001/M002 业务描述；SRC-001 第十条（四）；普通或内部；缺失补明用途"
    },
    {
      "key": "f008",
      "label": "008 · 站点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008；源定义：siteCategory（enum；站点）；A/P0 APP，单位复核；M001 信息门户/宣传/其他；SRC-001 第十条（四）；普通；不能归类时人工定性"
    },
    {
      "key": "f009",
      "label": "009 · 域名申请",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F009；源定义：requestedDomain（domain；域名申请）；C/P0 APP，P2 DNS 校验；M001 的拟用域名；SRC-001 第十条（一）；普通；若域名申请未填补件；不据此认定可用"
    },
    {
      "key": "f010",
      "label": "010 · 旧站点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010；源定义：existingDomain（domain；旧站点）；C/P0 SITE/DNS；M005 旧备案/权威台账；SRC-001 第十条（一）；普通；冲突 → CONFLICT"
    },
    {
      "key": "f011",
      "label": "011 · 实施方案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F011；源定义：plannedSitePlatform（enum；实施方案）；A/P0 APP，P2 SITE；M002 站群方案；SRC-001 第十条（四）、SRC-002；内部；未说明站群路径则补明"
    },
    {
      "key": "f012",
      "label": "012 · 旧网站",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F012；源定义：existingSiteId（string；旧网站）；C/P0 SITE；M005 站点编号；SRC-002；内部；缺基线需人工核，不能认定原站"
    },
    {
      "key": "f013",
      "label": "013 · 单位意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F013；源定义：unitHeadActorId（string；单位意见）；L/P1 IAM+FORM；M003 签署栏；SRC-001 附件 1；个人；P0 不缺件，P1 核签署权"
    },
    {
      "key": "f014",
      "label": "014 · 安全责任",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F014；源定义：securityOwnerActorId（string；安全责任）；C/P1 IAM+FORM；M004/ M007 责任人；SRC-001 第四、七条；个人；负责人不实 → CONFLICT"
    },
    {
      "key": "f015",
      "label": "015 · 技术管理员",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015；源定义：technicalAdminActorId（string；技术管理员）；C/P1 IAM+FORM；M004/M007 技术管理员；SRC-001 第七条、附件 1；个人；P1 补明确认"
    },
    {
      "key": "f016",
      "label": "016 · 内容管理员",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F016；源定义：contentAdminActorId（string；内容管理员）；C/P1 单位授权；M004 内容审核责任；SRC-001 第十一条（二）、SRC-002；个人；缺角色 → 人工待办"
    },
    {
      "key": "f017",
      "label": "017 · 运行平台",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F017；源定义：hostingMode（enum；运行平台）；C/P0–P3 APP/SITE；M002/M013；SRC-001 第十条（二）（四）；内部；未明则政策/技术核定",
      "options": [
        {
          "value": "P0",
          "label": "P0"
        },
        {
          "value": "P1",
          "label": "P1"
        },
        {
          "value": "P2",
          "label": "P2"
        },
        {
          "value": "P3",
          "label": "P3"
        }
      ]
    },
    {
      "key": "f018",
      "label": "018 · 技术备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018；源定义：serverIp（IP；技术备案）；L/P3 SITE/FORM；M007 IP 字段；SRC-001 第十条（一）、附件 1；内部敏感；P0 不缺件，P3 缺则待补"
    },
    {
      "key": "f019",
      "label": "019 · 技术备案",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F019；源定义：openPorts（array<int>；技术备案）；L/P3 SITE/FORM；M007 端口字段；SRC-001 附件 1；内部敏感；P3 缺则待补"
    },
    {
      "key": "f020",
      "label": "020 · 技术备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F020；源定义：operatingSystemVersion（string；技术备案）；L/P3 FORM/技术记录；M007 系统版本；SRC-001 附件 1；内部；P3 缺则待补"
    },
    {
      "key": "f021",
      "label": "021 · 技术备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F021；源定义：databaseTypeVersion（string；技术备案）；L/P3 FORM/技术记录；M007 数据库类型/版本；SRC-001 附件 1；内部；无数据库则人工标不适用，不伪填"
    },
    {
      "key": "f022",
      "label": "022 · 开发管理",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F022；源定义：developerOrgAndContact（record；开发管理）；L/P3 FORM/合同权威；M007 开发方/负责人；SRC-001 附件 1；个人+商业内部；无外部开发方时核不适用"
    },
    {
      "key": "f023",
      "label": "023 · 方案",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F023；源定义：desiredGoLiveAt（date?；方案）；C/P0 APP；M002 排期；无校本硬期限证据；内部；非必需，未填不阻断"
    },
    {
      "key": "f024",
      "label": "024 · 管理方案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F024；源定义：plannedContentResponsibility（text/ref；管理方案）；A/P0 APP、P1 单位确认；M002/M004；SRC-001 第十一条（二）；内部；可先作意向，P1 落实"
    },
    {
      "key": "f025",
      "label": "025 · 变更对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F025；源定义：changeDescription（text；变更对象）；C/P0 APP + SITE 差异；M006 变更清单；SRC-001 第十、十一条；内部；变更案缺少则补件"
    },
    {
      "key": "f026",
      "label": "026 · 测评",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F026；源定义：securityAssessmentRef（ref；测评）；L/P3 SEC；M008 结论/适用版本；SRC-001 第十条（五）；受限；P3 缺则不得称上线门槛已满足"
    },
    {
      "key": "f027",
      "label": "027 · 备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F027；源定义：filingRecordRef（ref；备案）；L/P3 FORM/权威台账；M007 备案登记；SRC-001 第十条（一）；受限；P3 缺则待备案核实"
    },
    {
      "key": "f028",
      "label": "028 · 证据版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028；源定义：evidenceRevision（string；证据版本）；A/P0 系统记录、随补件变化；全部 M 的 sourceVersion；研究设计；内部；缺版本阻断事实结论复用"
    },
    {
      "key": "f029",
      "label": "029 · 正式决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029；源定义：finalDecisionRef（ref；正式决定）；L/P4 DEC；M010 签批记录；校本签批授权范围待核；内部受限；未产生时 NEEDS_HUMAN_DECISION"
    },
    {
      "key": "f030",
      "label": "030 · 执行/关停",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030；源定义：executionOrClosureRef（ref；执行/关停）；L/P4–P5 SITE/DNS；M011/M012 变更/关停回执；SRC-001 第十一条（七）；内部；后续无回执只记未完成，不倒填",
      "options": [
        {
          "value": "P4",
          "label": "P4"
        },
        {
          "value": "P5",
          "label": "P5"
        }
      ]
    },
    {
      "key": "f031",
      "label": "031 · 服务方式",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F031；源定义：internetExposureProfile（enum {public_mainland,restricted_campus,other,unknown}；服务方式）；C/P0 方案；P2–P3 技术岗核实；M002/M006/M013；SRC-001 第 10 条、SRC-009 第 2/5 条；只作国家备案适用事实判断；内部受限；未知先分类/人工核对，不凭 *.cdut.edu.cn 自动判 ICP 义务",
      "options": [
        {
          "value": "P2",
          "label": "P2"
        },
        {
          "value": "P3",
          "label": "P3"
        }
      ]
    },
    {
      "key": "f032",
      "label": "032 · 国家互联网备案覆盖关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F032；源定义：nationalIcpFilingCoverageRef（ref?；国家互联网备案覆盖关系）；L/P3，C=F031 已证实适用；权威备案源/校方备案统筹；M015 主办者、备案号、网站/域名覆盖、查询时点；SRC-009 第 5–9、13–15 条；内部；权威源失联 SOURCE_UNAVAILABLE；P0 不得按无 ICP 结果报缺"
    },
    {
      "key": "f033",
      "label": "033 · 网站功能",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F033；源定义：siteDataCollectionProfile（enum {none,public_form,account_login,upload,third_party_tracker,mixed,unknown}；网站功能）；C/P0（含此类功能/不明且影响分类时）；P2 技术深化，P3 安全确认；APP/数据 Owner；M001/M002/M016；SRC-003 第 2 条、SRC-001 第 2/11 条；仅作风险与路由识别；内部或敏感；缺当前应知功能描述 NEEDS_MATERIAL；专业分类待人核；不收用户明文数据",
      "options": [
        {
          "value": "`{none",
          "label": "`{none"
        },
        {
          "value": "public_form",
          "label": "public_form"
        },
        {
          "value": "account_login",
          "label": "account_login"
        },
        {
          "value": "upload",
          "label": "upload"
        },
        {
          "value": "third_party_tracker",
          "label": "third_party_tracker"
        },
        {
          "value": "mixed",
          "label": "mixed"
        },
        {
          "value": "unknown}`",
          "label": "unknown}`"
        }
      ]
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "001 · 明确网站/域名申请范围、提出单位及理由",
      "purpose": "来源研究材料槽 M001。M001；明确网站/域名申请范围、提出单位及理由；申请单位；经办申请陈述/校方表单（如有）；C01–C10 的 P0 A；可信 OA 原始申请记录可替代 PDF；F002/F003/F006–F010/F025；SRC-001（事项范围）、其余字段是模型建议；案卷当前版；关键业务目的缺失 NEEDS_MATERIAL；不可读 UNREADABLE。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M001",
        "明确网站/域名申请范围、提出单位及理由",
        "申请单位",
        "经办申请陈述/校方表单（如有）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "002 · 建站用途、站群方案、初步责任安排",
      "purpose": "来源研究材料槽 M002。M002；建站用途、站群方案、初步责任安排；申请单位；方案页/申请正文附表；C01/C02 A，C06/C09 条件 C；不要求技术备案完成件；F007/F008/F011/F017/F023/F024；SRC-001 第十、十一条与 SRC-002；按站点版本；缺站群方案补说明；若自建/例外，人工判定。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M002",
        "建站用途、站群方案、初步责任安排",
        "申请单位",
        "方案页/申请正文附表"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "003 · 单位负责人对备案/报送负责的意见",
      "purpose": "来源研究材料槽 M003。M003；单位负责人对备案/报送负责的意见；单位负责人；有可验身份的签署/可信 OA 审批记录；P1/P3 L（正式备案表中的签名存在，初申是否必须未知）；F013；SRC-001 附件 1；签名和备案版本绑定；P0 不视缺失；到所需阶段缺签须补，签名无法验真请人工。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M003",
        "单位负责人对备案/报送负责的意见",
        "单位负责人",
        "有可验身份的签署/可信 OA 审批记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "004 · 指定安全、技术及内容管理责任人员",
      "purpose": "来源研究材料槽 M004。M004；指定安全、技术及内容管理责任人员；申请单位；单位现行授权/责任名单、可核验人员记录；P1 L，C05 条件 C；可信单位授权记录优先；F014–F016/F024；SRC-001 第四、七、十一条、SRC-002；人员授权有效期；角色失效/仅自填 → NEEDS_HUMAN_DECISION，不可读复传。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M004",
        "指定安全、技术及内容管理责任人员",
        "申请单位",
        "单位现行授权/责任名单、可核验人员记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "005 · 确认原站存在、责任单位和备案基线",
      "purpose": "来源研究材料槽 M005。M005；确认原站存在、责任单位和备案基线；网信/站群权威台账；C03–C08 A/E；历史备案、可核验站群主数据替代上传截图；F006/F010/F012；SRC-001 第十条、SRC-002；旧站 siteId+版本；台账失联 SOURCE_UNAVAILABLE；只给旧 URL 不足确认责任主体。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M005",
        "确认原站存在、责任单位和备案基线",
        "网信/站群权威台账",
        "C03–C08 A/E"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "006 · 明确变更前后差异与受影响范围",
      "purpose": "来源研究材料槽 M006。M006；明确变更前后差异与受影响范围；申请单位；C03–C06/C08 A；站群可导出变更对比为合法替代；F009/F010/F017–F022/F025/F028；SRC-001 第十、十一条；按具体变更版本；缺差异清单补件；新旧两版本混杂标 CONFLICT。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M006",
        "明确变更前后差异与受影响范围",
        "申请单位",
        "C03–C06/C08 A"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "007 · 校本信息系统登记备案",
      "purpose": "来源研究材料槽 M007。M007；校本信息系统登记备案；单位+受理备案岗；P3 上线前 L；官方《信息系统登记备案表》或可核验备案台账，不要求初申已盖章；F006/F013–F015/F018–F022/F027；SRC-001 第十条（一）、附件 1；以备案号+适用站点版本；P3 无有效备案不能标门槛满足；扫描不清 UNREADABLE。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M007",
        "校本信息系统登记备案",
        "单位+受理备案岗",
        "P3 上线前 L"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "008 · 新建信息系统上线前校方安全测评通过",
      "purpose": "来源研究材料槽 M008。M008；新建信息系统上线前校方安全测评通过；网络与信息化处；P3 L，C01/C02/C06/C09 按适用范围；校方可信测评记录替代上传件；F026；SRC-001 第十条（五）；绑定站点配置/版本/测评日期；P0 不缺件；P3 未出结论 NEEDS_HUMAN_DECISION，失联 SOURCE_UNAVAILABLE。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M008",
        "新建信息系统上线前校方安全测评通过",
        "网络与信息化处",
        "P3 L，C01/C02/C06/C09 按适用范围"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "009 · 域名资源是否已占用及真实管理关系",
      "purpose": "来源研究材料槽 M009。M009；域名资源是否已占用及真实管理关系；DNS/站群管理方；C02/C03 P2 L/E；优先权威 DNS/站群台账，不要求申请人自开 DNS 权限截图；F009/F010/F012；SRC-001 第十条（一）；域名+检索时间；权威记录失联 SOURCE_UNAVAILABLE；冲突 CONFLICT；无独立审批规则不得自动裁定。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M009",
        "域名资源是否已占用及真实管理关系",
        "DNS/站群管理方",
        "C02/C03 P2 L/E"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "010 · 对本案的正式校方决定（类型、签发者、范围、时间）",
      "purpose": "来源研究材料槽 M010。M010；对本案的正式校方决定（类型、签发者、范围、时间）；有权机关；P4 L；具有签发链与身份校验的正式审批记录，不得用 AI 结论替代；F029；签发权来源待校本确认；案卷+站点+域名+变更版本；未产生属正常后续；假签章/越权 → NEEDS_HUMAN_DECISION。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M010",
        "对本案的正式校方决定（类型、签发者、范围、时间）",
        "有权机关",
        "P4 L"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "011 · 站点/DNS 建置、域名修改或关停的执行事实",
      "purpose": "来源研究材料槽 M011。M011；站点/DNS 建置、域名修改或关停的执行事实；站群/DNS 技术岗；P4–P5 L/E；校方配置操作日志、变更单、关停回执；F030；SRC-001 第十一条（七）部分适用；执行时间与旧新值；不凭截图声称生效；未执行不改状态，失联追权威来源。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M011",
        "站点/DNS 建置、域名修改或关停的执行事实",
        "站群/DNS 技术岗",
        "P4–P5 L/E"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "012 · 废弃系统已向网信处报备",
      "purpose": "来源研究材料槽 M012。M012；废弃系统已向网信处报备；关停网站责任单位；C07 P5 L；备案受理回执/正式登记记录，可引用台账；F030；SRC-001 第十一条（七）；停用对象和日期；申请初始不得索要；关停后缺回执建待办。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M012",
        "废弃系统已向网信处报备",
        "关停网站责任单位",
        "C07 P5 L"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "013 · 自建服务器/非站群例外的技术与安全理由",
      "purpose": "来源研究材料槽 M013。M013；自建服务器/非站群例外的技术与安全理由；申请单位、技术岗；C09 C；方案/托管安排，现行校方例外许可形式待核；合法替代可信项目方案；F011/F017–F022；SRC-001 第十条（二）（四）；具体部署版本；不凭“外包合同”自动认定例外；未批应 NEEDS_HUMAN_DECISION。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M013",
        "自建服务器/非站群例外的技术与安全理由",
        "申请单位、技术岗",
        "C09 C"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "014 · 代办授权、单位挂靠/经办关系",
      "purpose": "来源研究材料槽 M014。M014；代办授权、单位挂靠/经办关系；申请单位；仅 F005 代理或 C10 特殊主体 C；优先 IAM+组织授权关系，不能核取才查签署材料；F003–F005；SRC-001 各单位责任主体，授权形式待核；授权期限版本；委托关系未知停止授权动作；身份敏感内容最小保留，模糊页复核。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M014",
        "代办授权、单位挂靠/经办关系",
        "申请单位",
        "仅 F005 代理或 C10 特殊主体 C"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "015 · 国家非经营性互联网信息服务备案实际覆盖关系",
      "purpose": "来源研究材料槽 M015。M015；国家非经营性互联网信息服务备案实际覆盖关系；学校备案主体/接入方或通信管理部门权威记录持有者；X-ICP 确认适用且进入 P3 或备案变更/注销发生后的阶段 L/E；主管备案系统核验记录/依法形成的回执；不把网页底部备案号文字当唯一原件；F031/F032/F009/F010；SRC-009 第 2、5–9、13–15 条；备案主体+网站/域名+有效时点+查询版本；不将学校主备案号自动等同所有子站覆盖；源不可达 SOURCE_UNAVAILABLE；初申不缺件，截图不可读 UNREADABLE；由备案有权岗处理。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M015",
        "国家非经营性互联网信息服务备案实际覆盖关系",
        "学校备案主体/接入方或通信管理部门权威记录持有者",
        "X-ICP 确认适用且进入 P3 或备案变更/注销发生后的阶段 L/E"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "016 · 网站个人信息/数据及第三方代码的最小风险说明",
      "purpose": "来源研究材料槽 M016。M016；网站个人信息/数据及第三方代码的最小风险说明；申请单位数据/技术 Owner；X-DATA 条件触发 P0–P3 C；功能清单、数据流/承包方角色说明，及专项 Owner 真实决定的引用；绝不索取真实用户数据库、密码或私钥；F033/F017/F022/F024；SRC-001 第 2/11 条、SRC-003 第 2 条（现行性待核）；站点部署与功能版本；功能不清补说明；数据权限及个人信息合法性交专项有权者，受限结构资料不在未授权环境传播。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M016",
        "网站个人信息/数据及第三方代码的最小风险说明",
        "申请单位数据/技术 Owner",
        "X-DATA 条件触发 P0–P3 C"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "intake-and-ownership",
      "name": "申请、单位与网站基线",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "请求归类与一案一网站边界",
          "requirement": "源研究规则 R001。P0；T=申请建站/域名/变更/关停；F=纯社媒或纯稿件；U=描述含混；SRC-001 第 2、10 条及 SRC-002；F001/F002/F006/F008；M001；按申请目的和目标网站区分 C01–C10；目标 siteId 可暂空但须唯一归属；混合社媒拆路由，不拆本模板；T 且一致 PASS_FACT（仅路由事实）；F NOT_APPLICABLE 转 T07-T05 或内容归口；U NEEDS_MATERIAL → 经办人；归口争议 NEEDS_HUMAN_DECISION → 管理岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "申请二级单位真实身份",
          "requirement": "源研究规则 R002。P0；T=以校内单位名义办理；F=纯个人网站另有明确路由；U=单位资格/挂靠未知；SRC-001 第 4、7 条；F003/F004；M001/M014；E1 学校机构台账与申请单位名/身份比对；核当前及申请日资格；学段、临时机构无校本白名单，不能推出准入；一致 PASS_FACT（单位事实）；F NOT_APPLICABLE 转其他服务；E1 失联 SOURCE_UNAVAILABLE → 组织主数据管理者；U POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION → 校方受理岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "经办人与代办授权",
          "requirement": "源研究规则 R003。P0–P5 每次提交/撤回/复核前；T=真实经办或代理操作；F=无操作请求；U=代理关系不明；SRC-001 第 4、7 条及附件 1、SRC-014（仅平台服务事实）；F004/F005；M001/M014；E1 Main/Host 可信 Actor+组织授权、角色有效期、动作范围；代理时核 M014；同名/OCR 角色无效。本人经办也不当然等于负责人；角色平台加入用户组也不等于本案授予签批权；权限事实吻合 PASS_FACT；F NOT_APPLICABLE；权限材料不清 NEEDS_HUMAN_DECISION → 单位授权岗；IAM 失联 SOURCE_UNAVAILABLE → 身份管理岗；冒用冲突 CONFLICT → 安全/单位岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "既有网站基线及归属",
          "requirement": "源研究规则 R004。P0/P2；T=C03–C08/C09 依托原站；F=真实新建；U=声称原站却无站点主键；SRC-001 第 10 条、SRC-002；F003/F006/F010/F012；M005/M001；E1 站群/备案台账以 siteId、域名、单位及记录时点多键比对；旧网页访问或截图 E3 不构成所有权；机构合并要权威移交记录；同一站点归属 PASS_FACT；F NOT_APPLICABLE；权威记录失联 SOURCE_UNAVAILABLE → 网信台账岗；跨单位冲突 CONFLICT → 原/新单位和网信处。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "建站目的及站点类型",
          "requirement": "源研究规则 R005。P0/P1；T=新建或改变业务定位；F=停用且无新用途；U=门户/宣传/业务系统类别不明；SRC-001 第 2、10 条、SRC-002；F006/F007/F008/F011/F023；M001/M002；E2 单位核实的申请用途与 M002 一致；F023 仅参考排期、不设申报截止硬阈值；若业务系统夹杂交易/个人信息处理，仅识别风险，外部合规另核；事实描述一致 PASS_FACT；F NOT_APPLICABLE；无用途 NEEDS_MATERIAL → 经办人；类型无法行政归类 NEEDS_HUMAN_DECISION → 单位/网信归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "校内信息门户/宣传网站站群方案",
          "requirement": "源研究规则 R006。P0 预审/P2 主管确认；T=该类网站新建/迁移；F=确认非该类且另有制度；U=类型或例外不明；SRC-001 第 10 条（四）、SRC-002；F008/F011/F017；M002/M013；E2 建设方案与站群路径核对；站群平台技术可用不表示申请获批；自建例外不可自行认定，规范现行性由 R019 再核；使用统一站群的方案事实 PASS_FACT；F NOT_APPLICABLE；方案缺失 NEEDS_MATERIAL → 经办人；例外 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION → 网信处。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "内容管理责任方案",
          "requirement": "源研究规则 R007。P0 意向/P1 确定；T=拟运营站点；F=确认只执行关停；U=是否承载发布内容不明；SRC-001 第 11 条（二）、附件 2；F007/F016/F024；M002/M004；P0 仅核内容责任计划；P1 查单位授权的内容审核/维护人员与有效期；不得以安全测评替代逐篇审稿；对应版本责任事实 PASS_FACT；F NOT_APPLICABLE；P1 授权缺失 NEEDS_MATERIAL → 单位；权属争议 NEEDS_HUMAN_DECISION → 内容主管。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "网络安全负责人和技术管理员",
          "requirement": "源研究规则 R008。P1/P3；T=网站建设/运营/责任变更；F=纯关闭后不再运行；U=管理职责归属未知；SRC-001 第 4、7、10 条及附件 1；F014/F015/F016/F024；M004/M007；E1 人员与单位关系、授权时间、具体站点一致；技术管理员与内容管理员可不同，不默认互相代理；离任旧授权失效；一致 PASS_FACT；F NOT_APPLICABLE；到期缺新任证明 NEEDS_MATERIAL → 单位；虚假身份 CONFLICT → 单位/身份管理岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "单位负责人意见及签署真实性",
          "requirement": "源研究规则 R009。P1 的内部意见核验/P3 备案；T=该阶段需要负责人意见；F=P0 尚无签署要求；U=本申请审批链是否另有前置签批不明；SRC-001 第 4 条、附件 1；F013/F003；M003/M007；E1/E2 签名或 OA 签批与组织任职时点、单位及备案版本匹配；PDF 图片/OCR 署名 E4 不具签批证明力；有效签署事实 PASS_FACT；F NOT_APPLICABLE（P0）；签字不可读 UNREADABLE → 单位；越权 NEEDS_HUMAN_DECISION → 单位有权岗；审批链未知 POLICY_UNCONFIRMED。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "domain-and-technical-change",
      "name": "域名、技术方案与变更",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r010",
          "title": "拟域名与现有 DNS 占用/归属",
          "requirement": "源研究规则 R010。P2；T=C02/C03 或变更涉及域名；F=不涉及域名；U=域名请求不明确；SRC-001 第 10 条（一）、SRC-002；F009/F010/F012；M001/M005/M006/M009；E1 DNS/站群登记，以完整域名、查询时间、siteId 对照；仅检验“是否冲突/已关联”，不制定字符、配额或分配阈值；域名规范尚无专项政策；现状无矛盾 PASS_FACT（不等于可分配）；F NOT_APPLICABLE；台账失联 SOURCE_UNAVAILABLE → DNS 岗；占用冲突 CONFLICT → 域名主管；申请不清 NEEDS_MATERIAL。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "域名配置持有与资源授权区别",
          "requirement": "源研究规则 R011。P2–P4；T=欲取得或变更学校域名控制权；F=无域名动作；U=仅有 DNS 截图无法确定申请目的；SRC-001 第 10 条（一）、SRC-002（非分配制度）；F009/F010/F029；M009/M010/M011；现有解析技术事实、申请主体和分配批准三个层面分开：DNS 解析存在不等于有权决定；未找到域名独立签批表，禁止自动发放；仅现有资源事实可 PASS_FACT；F NOT_APPLICABLE；授权要求 POLICY_UNCONFIRMED，分配申请 NEEDS_HUMAN_DECISION → 校方域名有权人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "变更差异与影响对象",
          "requirement": "源研究规则 R012。P0/P2；T=C03–C06/C08，C07 停用也核目标；F=纯新建无旧版；U=新旧范围不清；SRC-001 第 10、11 条；F006/F010/F012/F017/F025/F028；M005/M006/M001；E1 旧台账版本 + E2 申请变更清单，比较 before/after 及站点身份；变更类型的审批阈值未证实，不能据此认定无需重审；差异一致 PASS_FACT；F NOT_APPLICABLE；缺变更说明 NEEDS_MATERIAL → 经办人；两个主从版本冲突 CONFLICT → 单位和技术岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "托管位置与非站群/自建例外",
          "requirement": "源研究规则 R013。P0 方案/P2–P3 技术确认；T=自建服务器、非站群或外包环境；F=已证实站群标准路径；U=架构不明；SRC-001 第 10 条（二）（四）；F011/F017/F022；M002/M013/M007；E2 方案和 E1 技术托管记录核匹配；外包合同的权威结论只作外引；信息门户“必须站群”与其他系统自建托管条款不能私自合成一条例外许可；平台事实匹配 PASS_FACT；F NOT_APPLICABLE；理由缺失 NEEDS_MATERIAL → 单位技术岗；能否例外 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION → 网信处。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "上线前校本登记备案记录",
          "requirement": "源研究规则 R014。P3、非 P0；T=新建/需重新备案并拟上线；F=尚处初申或已证实不触发；U=变更是否重备案不明；SRC-001 第 10 条（一）、附件 1；F006/F013/F027；M007/M003；E1 备案台账或 E2 官方登记表，校验站点/单位/备案时间与待上线版本；初申草稿不要求已生成备案号；对应版本备案事实 PASS_FACT；F NOT_APPLICABLE；P3 无可用备案材料 NEEDS_MATERIAL → 单位/网信备案岗；是否重备案 POLICY_UNCONFIRMED。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "技术备案字段一致性",
          "requirement": "源研究规则 R015。P3；T=达到应登记备案的阶段；F=P0/P1 或关停无新配置；U=非典型平台字段是否适用未知；SRC-001 第 10 条（一）、附件 1；F018–F022/F027；M007/M013；对照备案表的 IP、域名、端口、系统/数据库版本、开发单位及技术人员；E1 实际配置优先，字段不适用可由技术岗说明，不臆造数据库/供应商；逐项一致 PASS_FACT；F NOT_APPLICABLE；应填项缺失 NEEDS_MATERIAL → 技术管理员；记录与实际配置冲突 CONFLICT → 网信技术岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "上线前安全测评结果",
          "requirement": "源研究规则 R016。P3 上线门槛；T=新建信息系统拟上线；F=未到上线阶段；U=存量变更是否需重测未知；SRC-001 第 10 条（五）、附件 1；F023/F026；M008/M007；E1 网信处正式测评记录核测评主体、通过状态、目标网站、测评日期与拟上线配置；单位自测/第三方截图不能替代；无校本规定的具体提前天数不硬判；有效测评事实 PASS_FACT；F NOT_APPLICABLE；到阶段未出测评 NEEDS_HUMAN_DECISION → 网信处；源失联 SOURCE_UNAVAILABLE；重测触发 POLICY_UNCONFIRMED。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "测评与备案适用的版本范围",
          "requirement": "源研究规则 R017。P3/P5；T=域名、IP、端口、架构、功能或控制责任变化；F=权威确认无影响；U=影响范围未经专业判断；SRC-001 第 10 条、第 11 条；F010/F017–F021/F026/F027/F028；M005/M006/M007/M008；E1 测评/备案记录的配置指纹、适用 siteId 和时点与当前版本比对；“旧结论覆盖新配置”必须有权威确认；变更后重测硬阈值未知；覆盖事实可 PASS_FACT；F NOT_APPLICABLE；超范围/相互矛盾 CONFLICT → 网信技术岗；阈值未知 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "policy-decision-and-version",
      "name": "政策、正式决定与版本",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r018",
          "title": "邻接 G50/S/T 的权威决定复用",
          "requirement": "源研究规则 R018。P0–P4；T=出现账号授权、采购合同、内容发布、社媒、科研公开等外部结果；F=不涉及；U=合同权限边界不清；SRC-001 第 10、11 条及附件 2、SRC-005/012/013；F002/F004/F015/F016/F029；M001/M004/M010；已读取 G50 原始技术目录与 R02 总账，G02 三项分别数据共享/公邮/专项网络，无通用站群后台账号模板的已签批准记录。仅引用其他 Owner 真实决定的 ID、对象/权限范围、版本及有效状态；网站建置本身独立审查；引用关系一致 PASS_FACT（仅引用事实）；F NOT_APPLICABLE；越权复用 CONFLICT → 相应业务 Owner；需要新 G 能力但目录无项则 POLICY_UNCONFIRMED → 集成维护人提出范围缺口，不在本模板偷批。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "校本政策适用和现行性",
          "requirement": "源研究规则 R019。P0–P5 每次形成规范性判断前；T=本案调用安全/站群/备案/域名规则；F=单纯对象版本记录；U=新旧规范适用边界不明；SRC-001–014（按各来源实际效力区分）；F002/F008/F011/F031/F032；M001/M002/M007/M015；核学校、签发机关、适用对象、生效/废止/修订日；SRC-007/011 是外校、SRC-012/013 是非政策编目，SRC-006 只是门户入口；SRC-001/003 未取得校内现行确认，不能用网页发布时间替印发日。全国 SRC-009 适用性须独立判，不以校本时效未知抹掉上位法；仅来源/适用身份事实 PASS_FACT；F NOT_APPLICABLE；校本现行未证 POLICY_UNCONFIRMED → 网信制度管理岗；跨校错用 CONFLICT → 规则维护人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "正式决定的真伪、范围与权限",
          "requirement": "源研究规则 R020。P4（或校方确证的实际决定阶段）；T=有人主张已获批准/要求形成决定；F=仅 P0–P3 事实预审；U=审批机构或权限表未知；SRC-001 第 5、6、10 条、SRC-002/010（均不足确定日常最终审批人）；F003/F013/F029；M003/M010；必须校验 E1 决定来源、签发人授权作用域、决定对象、域名/站点版本、时间及撤销状态；备案签字、安全测评和模型摘要不能冒充批件；可信决定的存在及一致性 PASS_FACT；F NOT_APPLICABLE；无权限表 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION → 校方实际有权岗；伪造/越权 CONFLICT。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "建站、DNS 变更或关停实际执行",
          "requirement": "源研究规则 R021。P4/P5；T=已进入校方可执行阶段；F=未生效决定/未进入执行；U=只看到浏览器缓存的站点；SRC-001 第 10、11 条、SRC-002；F009/F010/F012/F029/F030；M009/M010/M011；E1 站群/DNS 操作回执对照目标、操作者权限、变更前后值与执行时点；先校验有效授权；网页可访问或自行截图不足证明合法执行；执行事实 PASS_FACT；F NOT_APPLICABLE（不得据此代执行）；系统回执失联 SOURCE_UNAVAILABLE → 技术执行岗；记录不符 CONFLICT → 有权主管。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "废弃网站关停并向网信处备案",
          "requirement": "源研究规则 R022。P5；T=C07 且网站实际废弃；F=未关停或尚为 P0 申请；U=只是短时宕机/页面不可访问；SRC-001 第 11 条（七）；F002/F012/F030；M005/M011/M012；核 E1 关停事实、对象和时间，并核网信处备案/接收回执；不自创关停后的具体天数；同站点改名不等于废弃；关停及报备事实 PASS_FACT；F NOT_APPLICABLE；关停后回执缺失 NEEDS_MATERIAL（如单位持有）或 SOURCE_UNAVAILABLE（校内台账失联）→ 单位/网信备案岗。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "文件版本、归属与定向重审",
          "requirement": "源研究规则 R023。P0–P5 任意补件、撤回后重提、复核、变更；T=目标 F/M/政策/权限或其依赖变化；F=完全同版重跑；U=无法定位被替换证据；SRC-001 第 10、11 条（业务依赖）及 SRC-002/009；F001/F002/F012/F025/F028/F031–F033；M001–M016；保留证据 hash/sourceVersion、归属 siteId 与目标时间；以第 10 节依赖表求受影响 R 的闭包，旧结果标 superseded，未变的事实可复用但须重新确认有效性；此为系统追踪设计非校本审批条文；版本和重审覆盖记录可 PASS_FACT；F NOT_APPLICABLE；版本冲突 CONFLICT、不可读 UNREADABLE → 案卷处理人；修改决定效力须 NEEDS_HUMAN_DECISION → 有权签发者。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "national-filing-data-and-closure",
      "name": "国家备案、数据风险与关停",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r024",
          "title": "国家非经营性信息服务备案的适用分类",
          "requirement": "源研究规则 R024。P0 形成服务描述、P2 技术确认；T=站点面向中国境内公众提供非经营性互联网信息服务；F=有权技术核实不属于适用范围；U=访问/托管/服务性质不明；SRC-009 第 2、5 条，SRC-008（高校统一域名）和 SRC-001 第 10 条；F008/F017/F031/F033；M001/M002/M013；仅比较申请用途、公开访问方式、服务地域与 SRC-009 的客观定义；不以教育机构身份推断豁免，也不把国内主备案号当新的行政许可。分类跨经营性或专项许可时转相应业务 Owner；事实足够时 PASS_FACT（仅“分类事实”）；F NOT_APPLICABLE；不明 NEEDS_MATERIAL→经办/技术岗，法律适用争议 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→学校备案统筹/法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "国家备案范围与网站/域名版本匹配",
          "requirement": "源研究规则 R025。P3 核准上线、P4/P5 备案变更/注销；T=R024 确认 SRC-009 适用且达到相应核验阶段；F=不适用或 P0/P1 尚未到阶段；U=学校主备案与子站责任划分未知；SRC-009 第 5–9、13–15 条；F009/F010/F031/F032；M015/M005/M006；通过权威备案记录或备案负责人核验主办者、网站/域名、备案号、状态、时点；区分学校校内 M007，不能一律要求每个二级域名独立 ICP 编号。国家备案变更/注销法定时间条款只适用法定申报主体，不设置校内 T07 申请时限；有对应有效覆盖的备案事实 PASS_FACT；F NOT_APPLICABLE；记录错配 CONFLICT→备案 Owner；权威源失联 SOURCE_UNAVAILABLE；是否需新增/变更记录待有权者 NEEDS_HUMAN_DECISION。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "站点数据收集及第三方代码风险移交",
          "requirement": "源研究规则 R026。P0 方案识别、P2/P3 方案实证；T=存在公开表单、账号、上传或第三方采集/托管；F=可信设计证实不处理此类数据；U=用途/数据流未明；SRC-001 第 2、11 条（历史校本）、SRC-003 第 2 条（现行未知）；F017/F022/F024/F033；M002/M013/M016；对照站点功能、收集字段类别、接收者/供应商及部署版本，检查风险说明是否与实际功能一致；任何合法性许可、个人信息处理/跨境或保密裁量均交相关 Owner，禁止本模板自行审批。缺校内有效政策不造数据级别硬阈值；说明一致 PASS_FACT（仅识别及转交）；F NOT_APPLICABLE；说明缺失 NEEDS_MATERIAL、图不可读 UNREADABLE；权限/政策待核 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→数据/安全主管。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "关停与域名迁移后的残余暴露核验",
          "requirement": "源研究规则 R027。P5；T=C07 真正关停，或 C03/C06 已执行域名/平台迁移；F=纯建站未执行或与旧资源无关；U=无权威执行/解析记录；SRC-001 第 11 条（七）、SRC-008 高校域名集中管理；F010/F012/F025/F030/F031；M005/M006/M009/M011；按旧/新 siteId+FQDN+时点核旧 DNS、跳转目标、历史公开入口、管理权限与新配置的差异；只确认执行是否留有旧暴露面，旧域名释放/复用属于另行有权决定；禁止自动删解析或请求第三方数据；已核无意外残留 PASS_FACT（技术事实）；F NOT_APPLICABLE；残留不符 CONFLICT→网信 DNS/站群岗；权威源失联 SOURCE_UNAVAILABLE；释放/保留策略 NEEDS_HUMAN_DECISION→域名主管。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-intake",
      "name": "P0/P1：本地申请、单位和网站基线核验（非校方受理）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-technical-review"
    },
    {
      "id": "local-technical-review",
      "name": "P2/P3：本地域名、备案、安全测评和变更事实预审（不分配域名/准予上线）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-human-gate",
      "returnToStageId": "local-intake"
    },
    {
      "id": "local-human-gate",
      "name": "P4/P5：人工复核与校方决定、执行或关停记录交接（不代执行）",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "local-fact-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "local-supplement-todos",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "local-human-handoff",
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

/** Research-source traceability only; SRC IDs are not case SourceRef values. */
export const r02Metadata = {
  "templateId": "T07-T04",
  "name": "二级单位网站建设、二级域名申请与网站变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T07-T04.md",
  "sourceDocumentSha256": "203fb45d0d7291736bb1b0a241c1009ee8c701e5f29f6ac9aa01ff87e87e2e37",
  "sourceDocumentBytes": 116171,
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T07-T04.md",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "reviewedAt": "2026-10-24",
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
    "SRC-012",
    "SRC-013",
    "SRC-014"
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
    "F033"
  ],
  "materialSlotIds": [
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
    "M016"
  ],
  "criteria": [
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "intake-and-ownership",
      "criterionId": "r009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "domain-and-technical-change",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "policy-decision-and-version",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "policy-decision-and-version",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-011",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "policy-decision-and-version",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "policy-decision-and-version",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "policy-decision-and-version",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "policy-decision-and-version",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "national-filing-data-and-closure",
      "criterionId": "r024",
      "srcIds": [
        "SRC-009",
        "SRC-008",
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "national-filing-data-and-closure",
      "criterionId": "r025",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "national-filing-data-and-closure",
      "criterionId": "r026",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "national-filing-data-and-closure",
      "criterionId": "r027",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
