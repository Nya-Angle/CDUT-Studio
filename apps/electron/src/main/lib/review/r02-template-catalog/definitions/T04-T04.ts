import type { TemplateVersion } from '@profer/shared'

/** SRC IDs below are research-source metadata, never case SourceRef values. */
export const r02Metadata = {
  "templateId": "T04-T04",
  "name": "设备物资接收验收与国有资产入账审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T04.md",
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T04-T04.md",
  "sourceDocumentSha256": "74e844930c290ad4f8f9ba78479fd6128dd61f835f0469aee05cfb204ef13c68",
  "originalSourceSha256": "74e844930c290ad4f8f9ba78479fd6128dd61f835f0469aee05cfb204ef13c68",
  "originalGitBlobSha": "747be67e8aa914032bb46d94cb83ddd4e00b4d95",
  "sourceIntegrityNote": "LINE_ENDING_DRIFT_ONE_LF: Git blob plus one LF matches authoritative manifest bytes/SHA-256; reviewed source follows that convention.",
  "officialSchoolTemplate": false,
  "researchStatus": "ROUND3_DRAFT",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "School-specific current rules, authorization matrix and current forms remain incomplete; unresolved policy branches stay manual and cannot produce official pass/reject.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "《成都理工大学采购验收管理办法》（成理校发〔2023〕11号），原始 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/__local/2/CC/13/647DE095C814922158068435485_A6347BE6_67024.pdf"
      ],
      "description": "| **SRC-001** | 成都理工大学（校长办公室），`CDUT-VERIFIED` | [《成都理工大学采购验收管理办法》（成理校发〔2023〕11号），原始 PDF](https://gz.cdut.edu.cn/__local/2/CC/13/647DE095C814922158068435485_A6347BE6_67024.pdf) | PDF 第 1–6 页第 2–17 条；第 7–10 页附件 1–4；范围、三层验收、合同整体、金额角色、整改和签名 | 2023-05-16 印发并施行（第 17 条）；废止 2016 年《设备验收、登记管理办法》（成理校发〔2016〕19号）；未确认 2026 后续修订 | **已读原文**；集中组织采购货物直接适用，自购/图书/工程/服务按第 2 条分流；是否后修订待确认 |"
    },
    {
      "id": "SRC-002",
      "title": "《成都理工大学国有资产管理办法》（成理校发〔2021〕19号），原始 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/__local/7/BF/5C/359363FECC36DD8F19D78A72F13_250F0B0E_72048.pdf"
      ],
      "description": "| **SRC-002** | 成都理工大学（校长办公室），`CDUT-VERIFIED` | [《成都理工大学国有资产管理办法》（成理校发〔2021〕19号），原始 PDF](https://gz.cdut.edu.cn/__local/7/BF/5C/359363FECC36DD8F19D78A72F13_250F0B0E_72048.pdf) | PDF 第 2–10、16–17 页：第 3、5、7–10、16–17、21–22、48、53–55 条，分类、使用单位责任、登记、系统变动 | 2021-06-16 印发并施行（第 54 条）；废止 2018 年《国有资产管理规程》（成理校发〔2018〕1 号）；后修订未获确认 | **已读原文**；学校各单位国有资产管理，非学生学段政策；当前系统操作口径待确认 |"
    },
    {
      "id": "SRC-003",
      "title": "机构设置／部门职责",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/jgsehz.htm"
      ],
      "description": "| **SRC-003** | 成都理工大学国资与实验室管理处，`CDUT-VERIFIED` | [机构设置／部门职责](https://gz.cdut.edu.cn/jgsehz.htm) | 部门职责第（一）、（八）、（九）项：固定资产管理、国资委办公室、组织采购物资/服务验收 | 网页未显示原始发布日期、生效/废止日期；搜索抓取约 2026 年内 | **官方网页正文由站内搜索索引可见**；名称为当前部门，未查到校发文件中的更名授权正文 |"
    },
    {
      "id": "SRC-004",
      "title": "内设机构及职责",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm"
      ],
      "description": "| **SRC-004** | 成都理工大学国资与实验室管理处，`CDUT-VERIFIED` | [内设机构及职责](https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm) | “资产与产业监管科”：资产登记、调拨、资产系统维护；综合科有验收组织职责 | 网页发布日期及效力期未载；搜索抓取约 2026 年内 | **官网职责文字可核**；具体岗位签批权、账号角色矩阵未核实 |"
    },
    {
      "id": "SRC-005",
      "title": "科研经费—国内设备购置报销事项标准流程",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/info/1016/2227.htm"
      ],
      "description": "| **SRC-005** | 成都理工大学财务处，`CDUT-VERIFIED` | [科研经费—国内设备购置报销事项标准流程](https://jcc.cdut.edu.cn/info/1016/2227.htm) | 网页“办理流程／所需材料”：先固定资产入账，后报销预约；固定资产入账单及合同/验收报告作为报销证据 | 页面发布日期 2024-04-19；办理流程而非新校规，未载废止日 | **已读正文**；科研经费国内设备情形；财务报账不属本模板决定 |"
    },
    {
      "id": "SRC-006",
      "title": "关于2025年年终财务决算及相关事项的通知",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/info/1012/2615.htm"
      ],
      "description": "| **SRC-006** | 成都理工大学财务处（采购与招标管理中心），`CDUT-VERIFIED` | [关于2025年年终财务决算及相关事项的通知](https://jcc.cdut.edu.cn/info/1012/2615.htm) | 第五部分：资产登记、材料出入库与财务入账、年终账实核对分项；2025 年 12 月时限 | 网页发布 2025-09-30，正文署期 2025-09-29；2025 年度特定通知，**不能当作永久截止日** | **已读正文**；说明财务入账与实物登记关联，但不证明当期日常系统审批阈值 |"
    },
    {
      "id": "SRC-007",
      "title": "政策法规／校级政策索引",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/zcfg/xjzc.htm"
      ],
      "description": "| **SRC-007** | 成都理工大学国资与实验室管理处，`CDUT-VERIFIED` | [政策法规／校级政策索引](https://gz.cdut.edu.cn/zcfg/xjzc.htm) | 列出 2025-01-03 上网发布的《采购验收管理办法》与《国有资产管理办法》 | 2025-01-03 为网页刊载日，不是两份原制度生效日；不能排除之后发新规 | **官网索引可核**；仅佐证公开目录，不能以目录代替原文 |"
    },
    {
      "id": "SRC-008",
      "title": "科研经费—进口设备购置报销事项标准流程",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://jcc.cdut.edu.cn/info/1016/2228.htm"
      ],
      "description": "| **SRC-008** | 成都理工大学财务处，`CURRENTITY-UNKNOWN` | [科研经费—进口设备购置报销事项标准流程](https://jcc.cdut.edu.cn/info/1016/2228.htm) | 官方检索摘要列有报关单、免税证明、双语合同、汇率计算单、固定资产入账单；正文重开报错 | 检索指示 2024-04-19 发布；适用及是否仍沿用待核 | **仅官方搜索摘要，完整网页本轮无法打开**；不把费用报销材料全部设为验收前必备 |"
    },
    {
      "id": "SRC-009",
      "title": "官网首页／资料下载索引：“关于验收结论材料的说明”",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gz.cdut.edu.cn/index.htm"
      ],
      "description": "| **SRC-009** | 成都理工大学国资与实验室管理处，`CURRENTITY-UNKNOWN` | [官网首页／资料下载索引：“关于验收结论材料的说明”](https://gz.cdut.edu.cn/index.htm) | 资料下载列表有 2026-03-16 标题；**正文与附件未取得** | 列表日期 2026-03-16；效力、内容、是否调整签章/材料口径未知 | **官方目录存在已核，原文未核**；上线前高优先级追查 |"
    },
    {
      "id": "SRC-010",
      "title": "官网首页／资料下载索引：“成都理工大学设备验收单”",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gz.cdut.edu.cn/index.htm"
      ],
      "description": "| **SRC-010** | 成都理工大学国资与实验室管理处，`CURRENTITY-UNKNOWN` | [官网首页／资料下载索引：“成都理工大学设备验收单”](https://gz.cdut.edu.cn/index.htm) | 资料下载列表有 2025-04-01 标题；**表格正文、适用情形与版本未取得** | 列表日期 2025-04-01；是否替代 SRC-001 附件表单未知 | **官方目录存在已核，原文未核**；不得猜测其字段或替代关系 |"
    },
    {
      "id": "SRC-011",
      "title": "《成都理工大学“只跑一次”财务事项清单》2025年4月 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf"
      ],
      "description": "| **SRC-011** | 成都理工大学财务处（采购与招标管理中心），`CDUT-VERIFIED` | [《成都理工大学“只跑一次”财务事项清单》2025年4月 PDF](https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf) | 封面及 PDF 第 6–7 页：清单第 9 项材料费含材料清单、条件性出入库单和免登记固定资产申请表；第 12 项设备购置费先办固定资产入账、再报销，并列国内/进口差异 | 封面“二〇二五年四月”；无独立生效/废止条款；是否被 2026 新版替代待核 | **已读原 PDF**；仅证明财务办事材料和流程，不自动移植为 P0–P4 采购验收硬条件 | ### 04.3 证据冲突与适用原则 1. 原始政策对**集中采购**设置三级验收；对**自购货物**仅说“参照自行组织”，不能由系统把前者的金额阈值和组织程序扩展到后者 [SRC-001]"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-002",
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-002",
        "SRC-006",
        "SRC-011"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T04-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "设备物资接收验收与国有资产入账审核",
  "description": "设备物资接收验收与国有资产入账审核。本地研究模板 · 非校方正式模板。只用于事实与证据预审，未知制度、权限和正式结论由有权人员人工核定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T04-T04 是本地研究/预审定义，非成都理工大学校方正式模板；不得据此宣称校方批准、正式通过、正式拒绝或已接入校方系统。",
  "objectType": "transaction",
  "displayName": {
    "template": "T04-T04 · {{caseOrAssetId}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "采购/资产形成类型 enum：集中、自购、捐赠、外调、未知；O1",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F001；采购/资产形成类型 enum：集中、自购、捐赠、外调、未知；O1；P0 全情形；采购来源 M001，捐赠 M021，SRC-001/002；L1；N/S/P；未知不默认集中"
    },
    {
      "key": "F002",
      "label": "采购项目/形成来源编号 string/null；O1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002；采购项目/形成来源编号 string/null；O1；P0 有项目才用；学校采购决定 M001／来源 M021；L1；有项目却缺 N/S；合法无项目不适用"
    },
    {
      "key": "F003",
      "label": "有效合同编号 string/null；O2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003；有效合同编号 string/null；O2；P0 集中采购；自购有合同才用；正式合同 M002；L3；集中缺 N/S；捐赠合法为空"
    },
    {
      "key": "F004",
      "label": "合同版本号、批准时间和指纹 object；O2",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004；合同版本号、批准时间和指纹 object；O2；P0、合同变更后；有权合同管理记录 M002；L3；N/S/C；旧版不能充现行版"
    },
    {
      "key": "F005",
      "label": "使用/接收单位 ID string；O1/O6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005；使用/接收单位 ID string；O1/O6；P0 全情形；校方目录+M001/M021/M023；L1；N/S/C；不只信公章图"
    },
    {
      "key": "F006",
      "label": "实际提交人身份 ID string；O6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006；实际提交人身份 ID string；O6；P0 及每次操作；可信身份会话 M023，非 Renderer；L2；S/H；不匹配冻结动作"
    },
    {
      "key": "F007",
      "label": "经办岗位及有效授权区间 object；O6",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007；经办岗位及有效授权区间 object；O6；P0、P3–P5、复核；授权目录/任命 M023；L2；S/H；姓名相似不等于授权"
    },
    {
      "key": "F008",
      "label": "合同供应商 ID/名称 string；O2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008；合同供应商 ID/名称 string；O2；P0 集中/有合同自购；合同 M002、采购 M001；L1；N/C；不拿代理商替供应商"
    },
    {
      "key": "F009",
      "label": "合同价与币种 decimal+enum；O2",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009；合同价与币种 decimal+enum；O2；P0 有合同，P3 分型；合同 M002；L3；N/C/P；不以发票改合同"
    },
    {
      "key": "F010",
      "label": "合同货物条目 array[行号,品名,规格,数量]；O2/O3",
      "kind": "rows",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010；合同货物条目 array[行号,品名,规格,数量]；O2/O3；P0 有合同、P1/P4 比对；合同附件 M002/M003；L3；N/C；需逐行定位"
    },
    {
      "key": "F011",
      "label": "合同验收标准/技术参数 object；O2",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011；合同验收标准/技术参数 object；O2；P0/P2/P4 有合同；M002/M003、技术附件 M007；L3；N/C；广告不替合同"
    },
    {
      "key": "F012",
      "label": "通用/专用货物分类 enum/unknown；O3",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012；通用/专用货物分类 enum/unknown；O3；P3 组长分型；合同和归口分类 M003/M016；L1；P/H；不由 AI 选组长"
    },
    {
      "key": "F013",
      "label": "单项合同单价 decimal；O3",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013；单项合同单价 decimal；O3；P0/P3/P5 条件性；合同明细 M003/M002；L3；N/C；含税口径人工核"
    },
    {
      "key": "F014",
      "label": "同类同型号批量金额 decimal+groupKey；O3",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014；同类同型号批量金额 decimal+groupKey；O3；P3 金额分型；M003、校方确认分组口径；L3；P/H；不按发票拆单"
    },
    {
      "key": "F015",
      "label": "货物实例临时标识 string；O3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015；货物实例临时标识 string；O3；P1 建立，P5 对账；现场 M004/M005，非资产号；L1；N/C；同型号多台不合并"
    },
    {
      "key": "F016",
      "label": "到货批次号 string；O3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016；到货批次号 string；O3；P1 每批；M004 交货/收货记录；L1；N；批次不得覆盖"
    },
    {
      "key": "F017",
      "label": "到货/开箱时间 datetime；O3/O4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017；到货/开箱时间 datetime；O3/O4；P1；M004/M005 现场确认；L1；N/C；对照签署时间"
    },
    {
      "key": "F018",
      "label": "接收方与签收事实 object；O3",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018；接收方与签收事实 object；O3；P1；M004 与授权 M023；L2；N/H；签收不等于验收"
    },
    {
      "key": "F019",
      "label": "实收数量与单位 decimal+unit；O3",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019；实收数量与单位 decimal+unit；O3；P1；M004/M005 清点；L1；N/C；合同不自动更改"
    },
    {
      "key": "F020",
      "label": "实收型号、规格、厂家 object；O3",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020；实收型号、规格、厂家 object；O3；P1；M005 铭牌/现场记录、M004；L1；N/C/UNREADABLE；定位实例"
    },
    {
      "key": "F021",
      "label": "包装/残损及异常详情 enum+text；O4",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021；包装/残损及异常详情 enum+text；O4；P1，异常时补细节；M005、M006 照片；L1；正常事实缺 N，异常无留证 N"
    },
    {
      "key": "F022",
      "label": "附件/合格证/说明书齐备状态 object；O4",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022；附件/合格证/说明书齐备状态 object；O4；P1/P2；M005、产品资料 M007；L1；N/C；逐件标缺项"
    },
    {
      "key": "F023",
      "label": "开箱小组人员及身份 array；O4/O6",
      "kind": "rows",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023；开箱小组人员及身份 array；O4/O6；P1；M005/M011、授权 M023；L2；N/H；署名须验人"
    },
    {
      "key": "F024",
      "label": "开箱结论 enum+签署状态；O4",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024；开箱结论 enum+签署状态；O4；P1，P3 汇总；M005，正式 M011；L2；N/H；失败不自动进技术"
    },
    {
      "key": "F025",
      "label": "安装调试完成时间 datetime；O4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025；安装调试完成时间 datetime；O4；P2 需调试货物；M008 试运行记录；L1；到期 N；无需安装 H 判断"
    },
    {
      "key": "F026",
      "label": "技术指标实测与合同映射 array；O4",
      "kind": "rows",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026；技术指标实测与合同映射 array；O4；P2；M008 测试+M007/M002；L3；N/C/UNREADABLE；人工作判断"
    },
    {
      "key": "F027",
      "label": "技术小组成员/岗位 array；O4/O6",
      "kind": "rows",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027；技术小组成员/岗位 array；O4/O6；P2；M009/M011、M023；L2；N/H；打印名字不等于本人"
    },
    {
      "key": "F028",
      "label": "技术结果及签署状态 enum；O4",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028；技术结果及签署状态 enum；O4；P2；P3 汇总；M009/M011 人工结论；L2；N/H；失败进入整改"
    },
    {
      "key": "F029",
      "label": "延期批准及新期限 object/null；O4",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029；延期批准及新期限 object/null；O4；P2 超时且主张延期；M010 国资同意记录；L2；条件 N/H；不能自批"
    },
    {
      "key": "F030",
      "label": "综合验收提请时间 datetime；O4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030；综合验收提请时间 datetime；O4；P3；M012/正式受理；L1；N/S；节点偏差人工核"
    },
    {
      "key": "F031",
      "label": "综合小组、组长、监督参与 object；O4/O6",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031；综合小组、组长、监督参与 object；O4/O6；P3 方案，P4 核实；M012/M013/M023；L2；N/P/H；界值争议转人工"
    },
    {
      "key": "F032",
      "label": "综合结果、签署人、日期、事件 ID object；O4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032；综合结果、签署人、日期、事件 ID object；O4；P4 完成后；正式 M013；L2；尚未举行 T；称完成无证 N/S"
    },
    {
      "key": "F033",
      "label": "整改次数、通知、复验事件 array；O4",
      "kind": "rows",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033；整改次数、通知、复验事件 array；O4；E 不合格后；M014 问题/复验；L3；条件 N/H；保留失败历史"
    },
    {
      "key": "F034",
      "label": "进口通关/商检状态 object；O3",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034；进口通关/商检状态 object；O3；D 进口 P1 之前；代理/机关凭证 M015；L3；条件 N/H；进口不等于通关"
    },
    {
      "key": "F035",
      "label": "捐赠/外调来源 object；O2",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035；捐赠/外调来源 object；O2；G P0；权属/调入 M021；L3；条件 N/H；不要求假采购合同"
    },
    {
      "key": "F036",
      "label": "资产/存货分类 enum；O5",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036；资产/存货分类 enum；O5；P5，P0 只作候选；校方归口目录 M016；L1；P/H；现行阈值待核"
    },
    {
      "key": "F037",
      "label": "正式资产号 string/null；O5",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037；正式资产号 string/null；O5；P5 登记完成后；国资系统 M017；L1；登记中 T；声称已登无号 N/S"
    },
    {
      "key": "F038",
      "label": "登记状态、时间、流水、版本 object；O5",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F038；登记状态、时间、流水、版本 object；O5；P5；授权资产系统 M017；L1；S/C；截图不替正式状态"
    },
    {
      "key": "F039",
      "label": "保管人、单位、地点 object；O5/O6",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039；保管人、单位、地点 object；O5/O6；P5、变更时；M017/M018、授权 M023；L2；N/C；身份要核实"
    },
    {
      "key": "F040",
      "label": "存货出入库流水及状态 object；O5",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040；存货出入库流水及状态 object；O5；H 存货 P5；仓储/财务 M019；L1；条件 N/S/P；报销免单条件不可泛化"
    },
    {
      "key": "F041",
      "label": "免登记申请及正式决定 object；O5",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F041；免登记申请及正式决定 object；O5；H P5 条件触发；砚湖易办等 M020；L2；条件 N/S/P；不得自认材料"
    },
    {
      "key": "F042",
      "label": "交接/调拨事件、原新保管人 object；O5",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F042；交接/调拨事件、原新保管人 object；O5；I 变更；初次 P5；M018/M026 正式记录；L2；条件 N/S/H；不改原验收"
    },
    {
      "key": "F043",
      "label": "G07/T04/财务外部决定 ID、版本、用途 object；O7",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F043；G07/T04/财务外部决定 ID、版本、用途 object；O7；P0 引来源，P6 只读；M025 正式决定，M022 旁证；L3；S/C；不伪装外部已批准"
    },
    {
      "key": "F044",
      "label": "证据版本链、替换、操作人与复核请求 object；O7",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F044；证据版本链、替换、操作人与复核请求 object；O7；每次补件/撤回/替换；可信审计事件 M024 和各 M 原件；L2；N/H；旧证据不可删除"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "采购来源、组织方式、使用单位；采购中心/使用单位；立项或正式采购记录",
      "purpose": "M001；**采购来源、组织方式、使用单位**；采购中心/使用单位；立项或正式采购记录；P0：集中/自购当期必；捐赠不适用；正式采购系统决定或校方批准文书；F001,002,005,008；SRC-001/003；项目与单位、决定版归属；缺 N/S，无法辨别组织类型 P",
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
      "requiredElements": [
        "采购来源、组织方式、使用单位；采购中心/使用单位；立项或正式采购记录"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "有效采购合同/批准变更；合同管理方；正式盖章合同及版本",
      "purpose": "M002；**有效采购合同/批准变更**；合同管理方；正式盖章合同及版本；P0：集中必，自购有合同条件必，捐赠不适用；权威合同系统引用可替上传；F003,004,008–011；SRC-001；保留原合同及变更链；缺 N/S，扫描不可读 UNREADABLE；旧版 C",
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
      "requiredElements": [
        "有效采购合同/批准变更；合同管理方；正式盖章合同及版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "采购货物分项、数量、价款及技术附件；使用单位/采购档案",
      "purpose": "M003；**采购货物分项、数量、价款及技术附件**；使用单位/采购档案；P0 有合同且明细不在 M002 时条件必；P1/P3 对照；合同有效附表/采购系统货物清单；F010–014；SRC-001；行号+合同版归属；不足以映射实体时 N/C，不强求重交重复附件",
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
      "requiredElements": [
        "采购货物分项、数量、价款及技术附件；使用单位/采购档案"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "交货与接收事实；供应商交货、使用单位确认签收",
      "purpose": "M004；**交货与接收事实**；供应商交货、使用单位确认签收；P1 到货当期必；未到货时 T；校内受控收货记录；F015–020；SRC-001 第 8 条；到货批次、实例、签收时点；缺 N，无法识别签名 UNREADABLE",
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
      "requiredElements": [
        "交货与接收事实；供应商交货、使用单位确认签收"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "开箱清点、包装/附件和现场检查；使用单位开箱小组",
      "purpose": "M005；**开箱清点、包装/附件和现场检查**；使用单位开箱小组；P1 当期事实必；不是另行创造的校方官方表单；当次开箱记录，P3 由正式 M011 汇总承接；F017,019–024；SRC-001 第 7–8 条；批次/成员/现场时间绑定；无记录 N，身份不清 H",
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
      "requiredElements": [
        "开箱清点、包装/附件和现场检查；使用单位开箱小组"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "损伤、错发、短缺留证；使用单位拍摄/登记",
      "purpose": "M006；**损伤、错发、短缺留证**；使用单位拍摄/登记；P1 有异常才条件必；正常无需照片；同时形成的校方书面异常和照片；F020,021；SRC-001 第 8 条；照片与实例/时间绑定；缺 N，关键部位模糊 UNREADABLE",
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
      "requiredElements": [
        "损伤、错发、短缺留证；使用单位拍摄/登记"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "技术标准及产品资料；供应商/使用单位",
      "purpose": "M007；**技术标准及产品资料**；供应商/使用单位；P1 附件清点，P2 技术验收条件必；已在 M002/M003 的合同标准和原厂说明、合格证；F011,022,026；SRC-001 第 8–9 条；合同版+厂家型号归属；宣传材料不替代标准，缺 N/C",
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
      "requiredElements": [
        "技术标准及产品资料；供应商/使用单位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "安装调试、试运行与实测；使用单位/技术人员",
      "purpose": "M008；**安装调试、试运行与实测**；使用单位/技术人员；P2 对需技术试验设备当期必，P1 阶段 T；经小组确认的原始测试数据/现场记录；F025,026；SRC-001 第 9 条；设备/日期/参数源绑定；缺 N，曲线难读 UNREADABLE，裁量 H",
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
      "requiredElements": [
        "安装调试、试运行与实测；使用单位/技术人员"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "技术验收小组意见及结果；使用单位技术小组",
      "purpose": "M009；**技术验收小组意见及结果**；使用单位技术小组；P2 完成后当期必；P1 时 T；校方技术验收记录，最终可在 M011 同步体现；F027,028；SRC-001 第 7、9 条；人员/结论/版本与当次事件绑定；缺 N，签章真实性 H",
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
      "requiredElements": [
        "技术验收小组意见及结果；使用单位技术小组"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "技术验收延期同意；有权国资管理部门",
      "purpose": "M010；**技术验收延期同意**；有权国资管理部门；P2 超出规定期限且主张获延期时条件必；有权部门正式审批记录/函；F029；SRC-001 第 9 条；原期限、新期限、审批时点绑定；缺 N/H，不能自认批准",
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
      "requiredElements": [
        "技术验收延期同意；有权国资管理部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "《成都理工大学货物开箱及技术验收表》；使用单位及小组",
      "purpose": "M011；**《成都理工大学货物开箱及技术验收表》**；使用单位及小组；**P3 提请时**当期必，P1/P2 未完成前 T；SRC-001 附件 2 或校方核定现行等效版；F023,024,027,028；SRC-001/010；合同版/小组签署版归属；2025 新版关系未核 P；缺 N/UNREADABLE",
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
      "requiredElements": [
        "《成都理工大学货物开箱及技术验收表》；使用单位及小组"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "《成都理工大学货物验收工作方案》；使用单位提请",
      "purpose": "M012；**《成都理工大学货物验收工作方案》**；使用单位提请；P3 当期必；P0–P2 时 T；SRC-001 附件 3 或校方核定等效版；F030,031；SRC-001；组长成员/分工/合同编号/方案版对应；缺 N，角色争议 H",
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
      "requiredElements": [
        "《成都理工大学货物验收工作方案》；使用单位提请"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "《成都理工大学货物综合验收表》正式签署结论；国资处组织的综合小组",
      "purpose": "M013；**《成都理工大学货物综合验收表》正式签署结论**；国资处组织的综合小组；**P4 会议完成后**才产生；P3 时 T；已称完成则必核；SRC-001 附件 4 或正式等效结果；F031,032；SRC-001/009/010；小组身份、合同/事件版；供应商自签无效 H；缺 N/S",
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
      "requiredElements": [
        "《成都理工大学货物综合验收表》正式签署结论；国资处组织的综合小组"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "问题通知、整改及复验记录；使用单位、国资处、供应商",
      "purpose": "M014；**问题通知、整改及复验记录**；使用单位、国资处、供应商；E 发生不合格/整改时条件必；原始书面通知、整改凭证与新验收事件；F033；SRC-001 第 9、12 条；原失败与复验独立版本，不覆写；缺 N/H，模糊 UNREADABLE",
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
      "requiredElements": [
        "问题通知、整改及复验记录；使用单位、国资处、供应商"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "进口报关/检验前置材料；外贸代理/有权机关",
      "purpose": "M015；**进口报关/检验前置材料**；外贸代理/有权机关；D 进口 P1 之前按适用法律条件必；合法核验的电子海关/商检记录；F034；SRC-001 第 11 条、SRC-011；进口批次/报关号与合同绑定；缺 N/S；不把全部报销票据前移",
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
      "requiredElements": [
        "进口报关/检验前置材料；外贸代理/有权机关"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "资产或物资分类依据；资产归口岗位/使用单位",
      "purpose": "M016；**资产或物资分类依据**；资产归口岗位/使用单位；P5 分类时当期必，可为权威目录判定而非单独文件；国资系统分类决定、当期校本目录；F012,013,036；SRC-002；目录版本、分类人和实例；口径不明 P/H",
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
      "requiredElements": [
        "资产或物资分类依据；资产归口岗位/使用单位"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "资产正式登记流水、资产编号/入账单；国资系统和授权岗位",
      "purpose": "M017；**资产正式登记流水、资产编号/入账单**；国资系统和授权岗位；P5 **登记完成后**才可核完成；申请登记中 T；受控资产系统记录或学校固定资产入账单；F015,037–039；SRC-002/005/011；一物一号/版本/状态，截图仅辅助；声称完成无权威 S/C",
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
      "requiredElements": [
        "资产正式登记流水、资产编号/入账单；国资系统和授权岗位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "初次保管责任接收与地点；使用单位/资产管理员",
      "purpose": "M018；**初次保管责任接收与地点**；使用单位/资产管理员；P5 初次接管当期必；未接管时 T；校国资系统保管关系或校方交接单；F039,042；SRC-002 第 10、21 条；人员 ID/单位/地点/时间；缺 N/H，签名无法确认 H",
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
      "requiredElements": [
        "初次保管责任接收与地点；使用单位/资产管理员"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "存货入库/出库记录；使用单位仓储/归口/财务",
      "purpose": "M019；**存货入库/出库记录**；使用单位仓储/归口/财务；H 认定存货 P5 条件必；固定资产不适用；学校存货系统或正式出入库单；F040；SRC-002/006/011；物品/数量/批次/仓库流水；2025 报销免单不能泛化，缺 S/P",
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
      "requiredElements": [
        "存货入库/出库记录；使用单位仓储/归口/财务"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "免登记固定资产申请及获批意见；单位/国资有权部门",
      "purpose": "M020；**免登记固定资产申请及获批意见**；单位/国资有权部门；H 材料分类存争议时 P5 条件必；砚湖易办正式审批及盖章表，现行性待核；F041；SRC-011；申请与决定分离，清单/单价/审批版；缺 N/P/H，不能自主免登",
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
      "requiredElements": [
        "免登记固定资产申请及获批意见；单位/国资有权部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "捐赠/校外调入权属或接收依据；捐赠/调出方与校内单位",
      "purpose": "M021；**捐赠/校外调入权属或接收依据**；捐赠/调出方与校内单位；G P0 当期必，P1 需接收事实；捐赠协议、调拨决定、接收记录；F001,002,005,035；SRC-002 第 16 条；权属/实例/日期与单位关联；缺 N/H，不要求虚构合同",
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
      "requiredElements": [
        "捐赠/校外调入权属或接收依据；捐赠/调出方与校内单位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "发票、付款预约/财务凭证；财务处、经费负责人",
      "purpose": "M022；**发票、付款预约/财务凭证**；财务处、经费负责人；**P6 G07/财务后续**；本模板 P0–P5 均 T 或旁证；2025 财务清单国内/进口票据；F043；SRC-005/008/011；只读外部报销编号及版，不能替验收/资产账；不可读反馈 G07",
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
      "requiredElements": [
        "发票、付款预约/财务凭证；财务处、经费负责人"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "人员身份、岗位授权、任职时段；学校身份/人事/授权系统",
      "purpose": "M023；**人员身份、岗位授权、任职时段**；学校身份/人事/授权系统；P0 受理，各签署阶段按角色当期必；可信登录、岗位授权快照、正式任命；F005–007,018,023,027,031,039；SRC-001–004；会话/岗位/时段，名片不等效；系统失联 S/H",
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
      "requiredElements": [
        "人员身份、岗位授权、任职时段；学校身份/人事/授权系统"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M024",
      "name": "材料替换、补件、撤回与复核事件；经办人/有权人员",
      "purpose": "M024；**材料替换、补件、撤回与复核事件**；经办人/有权人员；任一阶段发生变更时条件必；产品可信审计日志与学校正式决定（若存在）；F044；SRC-001/002（无统一线上复核制度）；旧新证据不覆盖；缺日志 H，请求不等于批准",
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
      "requiredElements": [
        "材料替换、补件、撤回与复核事件；经办人/有权人员"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "T04/G07/其他 S/T 权威决定引用；相邻流程业务 Owner",
      "purpose": "M025；**T04/G07/其他 S/T 权威决定引用**；相邻流程业务 Owner；P0 有邻接决定时应引用；P6 只读交付；有权限源系统决定 ID/版本/状态；F001–004,043；SRC-001/002/005（接口未核）；保留 ID/版本/状态/来源；失联 S，旧决定失效 C",
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
      "requiredElements": [
        "T04/G07/其他 S/T 权威决定引用；相邻流程业务 Owner"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "登记后责任变更/跨单位调拨；单位资产管理员、国资部门",
      "purpose": "M026；**登记后责任变更/跨单位调拨**；单位资产管理员、国资部门；I 人员/单位变动时条件必；P0–P4 T；国资系统单位内交接、跨单位审核；F039,042；SRC-002 第 21–22 条；前后人员/单位/时间/流水；缺 N/S/H，原验收不改",
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
      "requiredElements": [
        "登记后责任变更/跨单位调拨；单位资产管理员、国资部门"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 连续逐条规则（R001–R028）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "P0 来源与范围，O1/O2",
          "requirement": "**R001 P0 来源与范围**，O1/O2；T=集中采购货物；F=确属工程/服务/图书，或捐赠转 R019；U=组织性质未可查；SRC-001 第2条、SRC-002 第16条、SRC-007（目录非现行证明）；F001/F002/F005；M001/M021/M025；校方采购组织决定/形成来源与合同标的交叉，L-A/B；当期有效版。自购转 R018，合法无合同不作缺件；正/差/缺/源/策；F 为不适用 → 使用单位采购经办／事项路由岗位；不把工程服务转为本规则验收",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "P0–P5 经办与签署授权，O6",
          "requirement": "**R002 P0–P5 经办与签署授权**，O6；T=当前操作或各阶段签署；F=仅普通材料提供者不执行审批动作；U=原岗位授权未见；SRC-001 第7–10条、SRC-002 第10条、SRC-003、SRC-004；F005–F007/F018；M023；可信会话ID、单位、岗位、授权时段、签署事件逐项核对 L-A/B；历史签名按历史任职核，不以当前职务追认；Renderer/同姓名排除；正/差/读/源/裁 → 校方身份与授权管理员、阶段相应领导/国资岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "P0 有效合同基准，O2",
          "requirement": "**R003 P0 有效合同基准**，O2；T=集中/有合同自购；F=捐赠或合法无合同自购；U=合同状态或变更未核；SRC-001 第3、5条；F003/F004/F008–F011/F043；M002/M003/M025；合同号、供应商、有效版本、条目、附件与 T04-T03 决定 ID 核对 L-A/B；按签约/变更生效时点而非扫描上传日；货物清单含于合同可替 M003；正/差/缺/读/源/裁 → 合同管理/T04-T03 Owner、使用单位；不改合同",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "进口前置 P0→P1，O3",
          "requirement": "**R004 进口前置 P0→P1**，O3；T=进口货物；F=非进口；U=进口性质不明；SRC-001 第11条、SRC-011；F003/F016/F034；M002/M015；进口批次、合同、外贸代理、报关/依法适用商检事项与先后时点 L-A/B；是否需具体商检项目需有权岗位核；P6 财务译件 M022 不前置；正/差/缺/读/源/裁 → 外贸代理提供原凭证、使用单位与国资岗位核验",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "P1 到货与接收归属，O3",
          "requirement": "**R005 P1 到货与接收归属**，O3；T=实际到货；F=货未到（仍 P0）；U=到货与仓储状态不明；SRC-001 第8条；F015–F018；M004/M005/M023；按收货批次、单件临时ID、到货时间和接收方核实 L-B/C，签收≠验收；“未到货”合法未生成 M004，不能报缺件；正/差/缺/读/裁 → 使用单位收货/资产管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "P1 合同数量与规格清点，O3",
          "requirement": "**R006 P1 合同数量与规格清点**，O3；T=集中货物到货/有合同自购到货；F=捐赠无合同转 R019；U=合同明细版本未定；SRC-001 第8条；F004/F010/F015/F016/F019/F020；M002/M003/M004/M005；合同每行数量/厂家/型号对同一批次实收，单位换算可追溯、逐件清点 L-B/C；分批事实保留，合同全部交齐另由 R016 核；正/差/缺/读/源 → 使用单位开箱小组；规格变更交 T04-T03",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "P1 包装异常与附件，O3/O4",
          "requirement": "**R007 P1 包装异常与附件**，O3/O4；T=开箱检查；F=尚未开箱；U=有损失声明而证据不明；SRC-001 第8条；F020–F022；M005/M006/M007；包装损伤、附件/证书实物清单，与异常照片按实例和拍摄时点 L-C；正常无需 M006；不以照片清晰代替技术检验；正/差/缺/读/裁 → 开箱小组/使用单位；异常先留证与处理",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "P1 开箱小组与结论，O4/O6",
          "requirement": "**R008 P1 开箱小组与结论**，O4/O6；T=开箱完成并主张合格/不合格；F=待开箱；U=结论签署状态不明；SRC-001 第7–8条；F023/F024；M005/M011/M023；三人成员身份/角色与开箱结果 L-B/C 加校方授权；P1 先查现场证据，M011 到 P3 才成为提交要求；开箱失败不得进入技术验收；正/差/缺/读/源/裁 → 使用单位分管领导或实验室主任与小组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "P2 技术验收时序/延期，O4",
          "requirement": "**R009 P2 技术验收时序/延期**，O4；T=开箱合格且进入技术验收；F=开箱失败或技术尚未启动；U=开箱签署时点不明；SRC-001 第9条；F017/F024/F025/F029；M005/M008/M010；对照开箱日、安装调试完成日及2023原则上1个月的时点 L-B/C；超过且主张批准延期才索 M010 L-A/B；期限计算/现行细则疑义不自动认定逾期处罚；正/差/缺/源/策/裁 → 使用单位技术小组／有权国资岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "P2 技术指标与试运行事实，O4",
          "requirement": "**R010 P2 技术指标与试运行事实**，O4；T=需技术测试且正在验；F=学校确认无需该项技术测试；U=测试范围未核；SRC-001 第9条；F011/F022/F025/F026；M002/M007/M008；有效合同标准逐项映射原始实测、试运行条件及厂家资料 L-B/C；原值与阈值出处分别保留；技术是否达标由有权技术组认定；正/差/缺/读/裁 → 技术验收小组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "P2 技术小组结果/签署，O4/O6",
          "requirement": "**R011 P2 技术小组结果/签署**，O4/O6；T=技术阶段已结束；F=仍在调试；U=是否举行技术验收不明；SRC-001 第7、9条；F027/F028；M009/M011/M023；成员时点授权、测试事件与小组书面意见核实 L-A/B；M009 完整纳入 M011 时可同证复用；供应商自测不替代学校小组结论；正/差/缺/读/裁 → 使用单位技术小组和资产管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "P1/P2/P4 整改与复验链，O4",
          "requirement": "**R012 P1/P2/P4 整改与复验链**，O4；T=开箱/技术/综合不合格已形成；F=本事件从未不合格；U=失败结论不可核；SRC-001 第9、12条；F024/F028/F032/F033；M005/M009/M013/M014；失败事件→书面通知→供应商整改→独立复验事件 L-B/C；2023规定整改以一次为限，第二次失败须交法定/校方机构；原失败不可覆盖，整改不等于自动合格；正/差/缺/读/策/裁 → 使用单位、国资处；再失败交规定单位和学校有权法律岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "P3 综合提请前置/时点，O4",
          "requirement": "**R013 P3 综合提请前置/时点**，O4；T=开箱及技术均已合格而申请综合验收；F=前阶段未齐/不合格；U=前次结论失联；SRC-001 第10条、SRC-010；F024/F028/F030；M009/M011/M012；两阶段合格与提请日对照2023一周要求 L-A/B；P3 才需要 M011/M012；2025新表适用不清＝策，超期是否可受理由部门裁，P3 不索 M013；正/差/缺/读/源/策/裁 → 使用单位提请人、国资验收组织岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "P3/P4 综合小组组构/监督，O4/O6",
          "requirement": "**R014 P3/P4 综合小组组构/监督**，O4/O6；T=集中采购综合验收；F=自购/捐赠不硬套；U=通专用、金额分组或本期制度未核；SRC-001 第7条、SRC-009；F009/F012–F014/F031；M002/M003/M012/M023；3人名单、通用/专用组长、校工会监督与有效合同单价/同类同型号批量核对 L-A/B；10万/50万文义保留，等于边界、组类归口、修订未确认前**不自动裁定组构合法**；正(名单事实)/差/缺/读/源/策/裁 → 国资组织人/使用单位/经费部门/工会核实",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "P4 正式综合结论真实性，O4",
          "requirement": "**R015 P4 正式综合结论真实性**，O4；T=主张综合已完成；F=P3 未召开；U=正式结论未可查；SRC-001 第10条及附件4、SRC-009、SRC-010；F003/F031/F032；M012/M013/M023；合同/事件ID、验收货物、签署人、日期、结论及正式版本 L-A/B；图片/OCR签字、供应商自签仅 L-D，不转正式；学校现行验收证明形式仍策；正(正式来源可核)/差/缺/读/源/策/裁 → 有权综合验收小组、国资组织岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "P3/P4 合同整体验收/分批例外，O2–O4",
          "requirement": "**R016 P3/P4 合同整体验收/分批例外**，O2–O4；T=集中采购货物合同进入综合；F=合法无采购合同；U=变更、分批履约或部分验收批准未明；SRC-001 第5、10条；F003/F004/F010/F015/F016/F032；M002/M003/M004/M013；按有效合同完整条目与交付批次汇总逐项定位 L-A/B/C；原则上合同整体，不能按每台出具自动“部分合格”；经校方正式批准的例外方可另核；正/差/缺/源/策/裁 → 使用单位与国资综合验收小组",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "P4 结论与技术实测一致性，O4",
          "requirement": "**R017 P4 结论与技术实测一致性**，O4；T=综合结论与技术记录皆已形成；F=未到P4或技术依法不适用；U=无法定位对应事件；SRC-001 第9–10条；F026/F028/F032；M008/M009/M013；对同一合同/实例/验收轮次看实测、技术组意见与正式综合结论 L-B/C；若冲突留问题，不由模型改写已签结论；正/差/读/源/裁 → 技术小组和综合验收小组复核",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "P0/P1 自购货物合法分流，O1/O4",
          "requirement": "**R018 P0/P1 自购货物合法分流**，O1/O4；T=学校单位自购；F=集中采购或赠与；U=组织方式未证实；SRC-001 第2条、SRC-002 第10条；F001/F002/F005/F007/F018；M001/M004/M005/M023；自购单位“参照自行组织”，可核收货与授权经办事实 L-B/C；不据 SRC-001 的3人/期限/国资小组阈值认定自购正式结论；缺自购细则＝策；正(已证收货事实)/差/缺/源/策/裁 → 自购单位负责人／资产归口岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "P0/P1 捐赠或校外调入来源，O1/O2/O3",
          "requirement": "**R019 P0/P1 捐赠或校外调入来源**，O1/O2/O3；T=受赠/调入；F=购买；U=合法来源与权属不明；SRC-002 第2、11、16条；F001/F002/F005/F015/F035；M021/M004/M023；捐赠协议/调拨决定、接收单位及具体物品事实 L-B/C；无采购合同/供应商/综合验收表合法不适用；作价/权属争议人工核；正/差/缺/读/策/裁 → 接收单位资产管理员／归口国资岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "P5 资产类别/入账口径，O5",
          "requirement": "**R020 P5 资产类别/入账口径**，O5；T=需认定资产/存货；F=仅进行 P0–P4 验收；U=现行分类目录未核；SRC-002 第3条、SRC-011 第9/12项；F009/F012/F013/F036；M002/M003/M016；物性、年限、品类、同批金额与正式分类记录 L-A/B；2021价值标准可作为历史依据但2026现行有效性未签核，不以财务报销免单金额直接分类；正(分类来源事实)/差/缺/源/策/裁 → 国资分类岗位／使用单位资产管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "P5 固定资产正式登记，O5",
          "requirement": "**R021 P5 固定资产正式登记**，O5；T=经有权分类为应登记固定资产且主张已登记；F=明确属存货/另有合规免登决定；U=分类/申请状态未定；SRC-002 第16–17、48条、SRC-005、SRC-011；F015/F036–F038；M016/M017；权威资产号、登记流水、实例、完成状态、版本与来源合同/捐赠事件对照 L-A，原件登记单 L-B佐证；正在申请未生成号码属后续，不能当拒绝或已完成；正/差/缺/读/源/策/裁 → 校方国资资产登记岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "P5 保管与首次接收责任，O5/O6",
          "requirement": "**R022 P5 保管与首次接收责任**，O5/O6；T=资产完成接收并配置保管关系；F=未进入保管配置阶段；U=人事授权不可核；SRC-002 第10、21、48条；F005/F007/F037/F039/F042；M017/M018/M023；资产号/实物临时ID、保管人稳定身份、单位地点和交接时点 L-A/B；同名不同人、无权代签转裁；系统与纸单不同标差；正/差/缺/读/源/裁 → 使用单位资产管理员／校方资产岗位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "P5 存货出入库状态，O5",
          "requirement": "**R023 P5 存货出入库状态**，O5；T=有权分类为存货且当前实际有入/出库事件；F=固定资产或尚未发生出库；U=当期存货/免单口径未核；SRC-002 第3、48条、SRC-006、SRC-011；F036/F040；M016/M019；品类/批次/仓库/数量与正式流水版本 L-A/B；2025年末时限仅属2025情形，2025财务报销免单不等于免管理；正/差/缺/读/源/策 → 仓储/使用单位资产管理员；财务仅管其报销",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "P5 免登记申请与批准，O5",
          "requirement": "**R024 P5 免登记申请与批准**，O5；T=有免登记主张或豁免争议；F=无豁免主张且按正常分类；U=2025表单/许可范围不明；SRC-002 第3条、SRC-011 第9项；F036/F041；M016/M020；申请人与最终有权批准记录分别核，不用“填表”推定“同意” L-A/B；砚湖易办渠道可用性、2026现行表单/门槛未知＝策；正(有权决定事实可查)/差/缺/源/策/裁 → 国资主管岗位；G07仅接收决定",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "P5 后续保管变动，O5/O6",
          "requirement": "**R025 P5 后续保管变动**，O5/O6；T=有单位内移交/跨单位调拨事件；F=无变动；U=原资产或新单位授权不明；SRC-002 第21–22、48条；F037–F039/F042；M017/M018/M023/M026；原/新人员单位、交接签署、跨单位有权审核与系统变动流水 L-A/B；新保管人与旧验收小组人名不同不构成冲突；正/差/缺/读/源/裁 → 双方资产管理员/跨单位国资审核岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "P6 对外事实引用与G07隔离，O7",
          "requirement": "**R026 P6 对外事实引用与G07隔离**，O7；T=正式验收/资产证据拟被外部流程引用；F=本案尚未到对外交付；U=外部决定状态不明；SRC-001 第4条、SRC-005、SRC-006、SRC-008、SRC-011；F032/F038/F040/F043；M013/M017/M019/M022/M025；验收、资产登记、财务入账、支付各自单独状态与 ID/版本 L-A/B；M022 仅G07/财务当期证据，不能反向填“已验收/已付”；正(引用事实)/差/源/策/裁 → G07/财务业务 Owner；本模板无付款写权",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "任意阶段证据归属/版本失效，O7",
          "requirement": "**R027 任意阶段证据归属/版本失效**，O7；T=材料变更、合同/登记源版本变化；F=版本未变；U=缺新旧指纹或审计链；SRC-001 第5、10条、SRC-002 第48条；F004/F010/F038/F044；M002/M017/M024；精确到合同→条目→实例→验收事件、证据哈希/来源版/页行 L-A/B/C；只使依赖旧版本的机器事实变 stale，不撤销校方正式决定；正/差/缺/源/裁 → 原经办人及受影响规则的下一角色",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "任意阶段补件/撤回/复核权限，O6/O7",
          "requirement": "**R028 任意阶段补件/撤回/复核权限**，O6/O7；T=发出补件、撤回、复核或重提请求；F=无此操作；U=已签决定能否撤销及合法申请路径未知；SRC-001 第9、12、15–16条、SRC-002 第21–22条；F006/F007/F044；M023/M024；请求者可信身份、案卷/决定版本、理由、时点和目标部门 L-A/B；源政策不建立普遍线上复核机制，补件仅更新证据；重签/撤销须额外正式授权；正(请求已收事实)/差/缺/源/策/裁 → 使用单位、原签发小组或资产归口岗位按事项人工受理",
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
      "name": "立案与合同/来源确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p1",
      "workflowOwner": "local"
    },
    {
      "id": "p1",
      "name": "到货接收与开箱",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p2",
      "workflowOwner": "local"
    },
    {
      "id": "p2",
      "name": "安装调试、技术验收",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p3",
      "workflowOwner": "local"
    },
    {
      "id": "p3",
      "name": "申请综合验收",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p4",
      "workflowOwner": "local"
    },
    {
      "id": "p4",
      "name": "现场综合验收及正式结论",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p5",
      "workflowOwner": "local"
    },
    {
      "id": "p5",
      "name": "资产登记与责任落位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p6",
      "workflowOwner": "local"
    },
    {
      "id": "p6",
      "name": "交付外部流程与后续维护",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "human-review-todo",
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

export default templateVersion
