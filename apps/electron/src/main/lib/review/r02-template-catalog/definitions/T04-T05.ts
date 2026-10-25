import type { TemplateVersion } from '@profer/shared'

/** SRC IDs below are research-source metadata, never case SourceRef values. */
export const r02Metadata = {
  "templateId": "T04-T05",
  "name": "国有资产调拨、借用与保管责任变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T05.md",
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T04-T05.md",
  "sourceDocumentSha256": "cc1c7c7e4f380a00a3e94c66856aefe7e3c0e8311696db69676dd0a14772eec4",
  "originalSourceSha256": "cc1c7c7e4f380a00a3e94c66856aefe7e3c0e8311696db69676dd0a14772eec4",
  "originalGitBlobSha": "3a87a0b1fa2262818f82e705fa664177aa7dfad1",
  "sourceIntegrityNote": "LINE_ENDING_DRIFT_ONE_LF: Git blob plus one LF matches authoritative manifest bytes/SHA-256; reviewed source follows that convention.",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "School-specific current rules, authorization matrix and current forms remain incomplete; unresolved policy branches stay manual and cannot produce official pass/reject.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "学校原始 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/__local/7/BF/5C/359363FECC36DD8F19D78A72F13_250F0B0E_72048.pdf"
      ],
      "description": "| SRC-001 | **CDUT-VERIFIED**；成都理工大学：《关于印发〈成都理工大学国有资产管理办法〉的通知》，成理校发〔2021〕19号 | [学校原始 PDF](https://gz.cdut.edu.cn/__local/7/BF/5C/359363FECC36DD8F19D78A72F13_250F0B0E_72048.pdf)，PDF 第1、4–11、12–13、16–17页；第5–10、14–15、21–22、27–28、31–35、47–48、53–55条 | 2021-06-16 印发且当日起施行，废止成理校发〔2018〕1号；适用于学校及资产使用单位；是否后有新规：待主管部门确认 | **已核 18 页正文**，核心主依据；2026 现行性待最终确认 |"
    },
    {
      "id": "SRC-002",
      "title": "学校原始 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/__local/1/EA/62/7B206289331D78F762E6FE56335_4E829938_7B22B.pdf"
      ],
      "description": "| SRC-002 | **CDUT-VERIFIED**；成都理工大学：《关于印发〈成都理工大学行政办公设备配置管理办法〉的通知》，成理校发〔2021〕22号 | [学校原始 PDF](https://gz.cdut.edu.cn/__local/1/EA/62/7B206289331D78F762E6FE56335_4E829938_7B22B.pdf)，PDF 第1–4、8页；第2–4、9、11、16–17条及附件2 | 2021-06-16 印发当日施行，废止成理校发〔2018〕13号；限行政办公设备配置场景 | **已核 10 页正文**；第九条的借用只适用特定借调／临时机构，附件2是“配置申请表”，不可充当通用调拨表 |"
    },
    {
      "id": "SRC-003",
      "title": "校级政策目录",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gz.cdut.edu.cn/zcfg/xjzc.htm"
      ],
      "description": "| SRC-003 | **CURRENTITY-UNKNOWN**；成都理工大学国资与实验室管理处：“校级政策”目录所列《成都理工大学国有资产出租出借管理办法》（成理校发〔2021〕20号） | [校级政策目录](https://gz.cdut.edu.cn/zcfg/xjzc.htm)，目录日期 2025-01-03；**专项原文页、条号、附件待获取** | 目录显示 2021 文件于 2025-01-03 上架／更新；学校适用，但至 2026 是否修订未知 | **只核到目录与名称，未取得 20 号正文**；绝不据此臆测程序、阈值或上级审批机关 |"
    },
    {
      "id": "SRC-004",
      "title": "学校部门页",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gz.cdut.edu.cn/jgsehz.htm"
      ],
      "description": "| SRC-004 | **CURRENTITY-UNKNOWN**；成都理工大学国资与实验室管理处：“机构设置／部门职责” | [学校部门页](https://gz.cdut.edu.cn/jgsehz.htm)，页面分项（一）（二）（八）（九） | 官网搜索索引近期抓取，页面明确发布时间不详；现校内机构适用 | 官方搜索索引可见职责段，直接访问遇 HTTP 412；组织现行性待核 |"
    },
    {
      "id": "SRC-005",
      "title": "学校科室页",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm"
      ],
      "description": "| SRC-005 | **CURRENTITY-UNKNOWN**；成都理工大学国资与实验室管理处：“内设机构及职责” | [学校科室页](https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm)，第（二）项资产与产业监管科 | 网页年月／任职期不详；仅学校机构分工 | 官方索引可见“登记、调拨、资产系统”描述；直接访问 HTTP 412，签批授权链未核 |"
    },
    {
      "id": "SRC-006",
      "title": "学校通知",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/info/1043/2055.htm"
      ],
      "description": "| SRC-006 | **CDUT-VERIFIED**；成都理工大学国有资产管理处：《关于加强学校大型仪器设备开放共享工作的通知》 | [学校通知](https://gz.cdut.edu.cn/info/1043/2055.htm)，正文第一、二、四项 | 网页发布 2021-09-16，落款 2021-09-14；当时面向国家重点实验室和相关学院；历史通知，2026 平台规则现行性未知 | **已核正文**：大型仪器平台预约登记说明“使用预约”和“责任移交”性质不同；当年 40 万元与机时数字不可作本模板现行阈值 |"
    },
    {
      "id": "SRC-007",
      "title": "学校通知",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/info/1012/2615.htm"
      ],
      "description": "| SRC-007 | **CDUT-VERIFIED**；成都理工大学财务处（采购与招标管理中心）：《关于2025年年终财务决算及相关事项的通知》 | [学校通知](https://jcc.cdut.edu.cn/info/1012/2615.htm)，第五部分（一）（二） | 发布 2025-09-30，落款 2025-09-29；只适用于 2025 年终财务／资产清查作业，截止日均已过 | **已核正文**：支持财务／国资对账职责边界；绝不转写 2025 截止日作常态调拨时限 |"
    },
    {
      "id": "SRC-008",
      "title": "学校通知",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/info/1043/2535.htm"
      ],
      "description": "| SRC-008 | **CDUT-VERIFIED**；中共成都理工大学党委巡察信息：《校党委第三巡察组巡察国资与实验室管理处党组织反馈意见会召开》 | [学校通知](https://gz.cdut.edu.cn/info/1043/2535.htm)，2024-11-13 正文 | 2024-11-13 发布，反映历史巡察风险，不是授权规范 | **已核正文**：资产盘点／规范性、信息化等曾被指出问题；仅用来提示账实核验风险，不形成否决条件 |"
    },
    {
      "id": "SRC-009",
      "title": "指定 SHA 文件",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
      ],
      "description": "| SRC-009 | **GENERAL-RESEARCH**；GitHub `Fuck-GH-Admin/cdut-studio-review-agent`：D4 G50 技术目录 `catalog.json` | [指定 SHA 文件](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json)，顶层 `templateCount/domainCounts/publicationAllowed` | 固定技术 SHA；不是学校发布或施行政策；面向技术范围去重 | **保留第三轮已核结构主张**：50 套、G07 7 套、`publicationAllowed=false`；本轮直接获取 Raw 链接受阻，未重"
    },
    {
      "id": "SRC-010",
      "title": "本次实读 Library 整合包 CDUT-ST-R02-Partial-Integration-20261023-FINAL.zip 的 00_R02原始范围与规范/，目录主表 T04 行、审计 T 类旧项归宿和四轮合同",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "description": "| SRC-010 | **GENERAL-RESEARCH**；R02 内部目录 `ST-CANDIDATE-MASTER-CATALOG-R02.md`、`ST-CATALOG-AUDIT-R02.md`、`RESEARCH-TO-BUSINESS-MD-PROMPTS-R02.md` | **本次实读** Library 整合包 `CDUT-ST-R02-Partial-Integration-20261023-FINAL.zip` 的 `00_R02原始范围与规范/`，目录主表 T04 行、审计 T 类旧项归宿和四轮合同 | 2026-10-22 R02 目录，S72+T72+G50；项目研究范围规定，不是学校发布法规 | **已核正文**：精确 T04-T01–T04-T09、`g07-t03/t04` 及若干 G01/G03/G04/G06 邻项；仍不是对 G50 全部 workspace 的逐条源代码审计 |"
    },
    {
      "id": "SRC-011",
      "title": "生态环境部转载国务院原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mee.gov.cn/zcwj/gwywj/202103/t20210318_825096.shtml"
      ],
      "description": "| SRC-011 | **GENERAL-RESEARCH（国家权威原文）**；国务院：《行政事业性国有资产管理条例》（国务院令第738号） | [生态环境部转载国务院原文](https://www.mee.gov.cn/zcwj/gwywj/202103/t20210318_825096.shtml)，第9、11、14–15、18–19、22、30条 | 2021-02-01公布、2021-04-01施行；全国行政事业性国资基础规则，后续修订状态仍以法规库为准 | **2026-10-23 已核全文可访问正文**：使用人／管理人变动及时交接（第15条），配置优先调剂（第11条）；不设校内签批岗位 |"
    },
    {
      "id": "SRC-012",
      "title": "四川省人民政府原始 PDF",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.sc.gov.cn/10462/zfwjts/2023/7/10/1e37bd94c54349bfb6839bf162196694/files/4b73b07aee2443d0af06be7672c12f10.pdf"
      ],
      "description": "| SRC-012 | **GENERAL-RESEARCH（四川省权威原文）**；四川省政府办公厅：川办发〔2023〕20号所附《四川省行政事业性国有资产管理办法》《四川省省直行政事业单位国有资产管理办法》 | [四川省人民政府原始 PDF](https://www.sc.gov.cn/10462/zfwjts/2023/7/10/1e37bd94c54349bfb6839bf162196694/files/4b73b07aee2443d0af06be7672c12f10.pdf)，全省办法第2、15、21、23、75条（PDF约2–15页）；省直办法第18、23、25、73–74、80条（PDF约18–33页） | 2023-07-06印发，2023-08-01施行；全省综合办法适用于执行政府会计制度的事业单位；**省直办法第74条对省属高校具体办法另有主管部门制定安排** | **2026-10-23 已下载并核读33页正文**：全省办法第23条要求对外出借集体决策及审批；省直一般"
    },
    {
      "id": "SRC-013",
      "title": "乐山师范学院托管的教育厅签发 PDF",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gzc.lsnu.edu.cn/__local/C/34/41/65F19153A1C32297B55BBB3F97D_30E0EBE9_44EDD.pdf"
      ],
      "description": "| SRC-013 | **CURRENTITY-UNKNOWN（四川省教育厅历史专项原始文本）**；四川省教育厅：《四川省教育厅所属事业单位国有资产出租出借管理办法》，川教函〔2016〕370号 | [乐山师范学院托管的教育厅签发 PDF](https://gzc.lsnu.edu.cn/__local/C/34/41/65F19153A1C32297B55BBB3F97D_30E0EBE9_44EDD.pdf)，第2、9–10、17–18、23–25条、附件（PDF 1–10页） | 2016-07-11印发当日起施行，当时适用于厅属高校；其依据含旧省级制度，**2023新规后的废改和授权衔接未知** | **2026-10-23 已读10页原文**，能证明历史上设过阈值、明细表及集体研究；不得把500万元、6个月、10工作日和签批级次作为2026校本硬规则 |"
    },
    {
      "id": "SRC-014",
      "title": "校级政策目录",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gz.cdut.edu.cn/zcfg/xjzc.htm"
      ],
      "description": "| SRC-014 | **CURRENTITY-UNKNOWN**；成都理工大学国资与实验室管理处“校级政策”目录列《成都理工大学大型仪器设备开放共享管理办法》（成理校发〔2023〕13号） | [校级政策目录](https://gz.cdut.edu.cn/zcfg/xjzc.htm)，2023-06-08列表项；完整正文附件未取得 | 2023文件的存在性可核，但对2026预约权限及开放细则的现行性未证 | 2026-10-23 仅核**目录**；用于提示 SRC-006 的2021共享通知可能不是最新依据，不用于资产调拨或机时阈值 | ### 4.2 实际检索路径与失败留痕 2026-10-22 分别检索：`site:cdut.edu.cn 成都理工大学 国有资产 调拨 借用`、`site:gz.cdut.edu.cn \"资产调拨\" \"流程\"`、`\"成都理工大学国有资产出租出借管理办法\" PDF`、`\"成都理工大学\" \"资产调拨单\"`、`site:gz.cdut.edu.cn \""
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-8-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T04-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "国有资产调拨、借用与保管责任变更审核",
  "description": "国有资产调拨、借用与保管责任变更审核。本地研究模板 · 非校方正式模板。只用于事实与证据预审，未知制度、权限和正式结论由有权人员人工核定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T04-T05 是本地研究/预审定义，非成都理工大学校方正式模板；不得据此宣称校方批准、正式通过、正式拒绝或已接入校方系统。",
  "objectType": "transaction",
  "displayName": {
    "template": "T04-T05 · {{caseOrAssetId}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "Case／string 案卷 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001；Case／string 案卷 ID；A–F；受信任 Case 标识，M021/M022引用；P1；未建案 H"
    },
    {
      "key": "F002",
      "label": "Case／enum 当前阶段",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F002；Case／enum 当前阶段；A–F；受信任案例状态事件；P1；状态不明 H"
    },
    {
      "key": "F003",
      "label": "Case／enum C01–C09 情形",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F003；Case／enum C01–C09 情形；B/C；M003 意图加单位差异核验；P1；分类不明 P/H"
    },
    {
      "key": "F004",
      "label": "Case／datetime 提交时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F004；Case／datetime 提交时点；B/F；受信任接收事件、M003；P1；来源断 S"
    },
    {
      "key": "F005",
      "label": "Actor／ref 真实提交者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005；Actor／ref 真实提交者；B/D/F；校内真实身份、M002；P2；S/H"
    },
    {
      "key": "F006",
      "label": "Actor／ref 所属单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006；Actor／ref 所属单位；B/D/F；单位主数据、M002；P2；S；与申报不同 C"
    },
    {
      "key": "F007",
      "label": "Actor／ref 角色／委托范围与有效期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007；Actor／ref 角色／委托范围与有效期；B/D/F；校方授权记录、M002；P3；未核授权 H"
    },
    {
      "key": "F008",
      "label": "AssetItem／ref 校方资产主键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008；AssetItem／ref 校方资产主键；A–E；国资系统、M001/M019；P1；S/H，不凭 OCR 创造"
    },
    {
      "key": "F009",
      "label": "AssetItem／string 资产编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009；AssetItem／string 资产编号；A–E；台账与实物标签、M001/M004；P1；不能定位 H，差异 C"
    },
    {
      "key": "F010",
      "label": "AssetItem／enum 类型和归口",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010；AssetItem／enum 类型和归口；A/B；校本归口台账 M001 [SRC-001，第9条]；P1；S/P"
    },
    {
      "key": "F011",
      "label": "AssetItem／string 名称规格型号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011；AssetItem／string 名称规格型号；A/C；台账/现场 M001/M004；P1；不一致 C"
    },
    {
      "key": "F012",
      "label": "AssetItem／ref 原使用单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012；AssetItem／ref 原使用单位；A–E；国资权威快照 M001；P1；S/C"
    },
    {
      "key": "F013",
      "label": "AssetItem／ref 原使用人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013；AssetItem／ref 原使用人；A/C；国资和人员主数据 M001；P2；S/C"
    },
    {
      "key": "F014",
      "label": "AssetItem／ref 原保管责任人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014；AssetItem／ref 原保管责任人；A/C；资产登记／交接链 M001/M007；P2；S/H"
    },
    {
      "key": "F015",
      "label": "AssetItem／string 原存放地点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015；AssetItem／string 原存放地点；A/C；资产台账／现场 M001/M004；P2；S/C"
    },
    {
      "key": "F016",
      "label": "AssetItem／enum 当前状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016；AssetItem／enum 当前状态；A/C/D；资产系统 M001，状态枚举待校本核；P1；S，不能默认为正常"
    },
    {
      "key": "F017",
      "label": "AssetItem／string 资产快照版本及时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017；AssetItem／string 资产快照版本及时间；A/C/D/E；受信任台账变更日志 M001/M010；P1；S，过期重查"
    },
    {
      "key": "F018",
      "label": "ChangeProposal／ref 拟接收单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018；ChangeProposal／ref 拟接收单位；B/C02/C08；M003 意图、组织主数据/M005；P1；条件 N/S"
    },
    {
      "key": "F019",
      "label": "ChangeProposal／ref 拟使用人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019；ChangeProposal／ref 拟使用人；B/C01/C02；M003/M005与人员身份核对；P2；条件 N/S，不仅按姓名"
    },
    {
      "key": "F020",
      "label": "ChangeProposal／ref 拟保管责任人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020；ChangeProposal／ref 拟保管责任人；B/C01/C03；M003/M007与岗位授权核；P2；条件 N/H"
    },
    {
      "key": "F021",
      "label": "ChangeProposal／string 新存放地",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021；ChangeProposal／string 新存放地；B/C04/C08；M003，必要时 M004；P2；地点变更 N"
    },
    {
      "key": "F022",
      "label": "ChangeProposal／string 原因及任务",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022；ChangeProposal／string 原因及任务；B/C；申请说明 M003、M013；P1；N"
    },
    {
      "key": "F023",
      "label": "ChangeProposal／enum 人员／机构／任务触发",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023；ChangeProposal／enum 人员／机构／任务触发；B/C；M003及已有 HR/组织事件 M006；P2；不可确认 P/H"
    },
    {
      "key": "F024",
      "label": "ChangeProposal／object 盘点事实和时点",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024；ChangeProposal／object 盘点事实和时点；C/E条件；有权盘点 M004/M012；P2；有争议 N，否则 Ø"
    },
    {
      "key": "F025",
      "label": "ChangeProposal／bool? 标签账物一致",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025；ChangeProposal／bool? 标签账物一致；C/E条件；M001与M004核对 [SRC-001，第10条]；P1；未查则未知，不填 true；C/H"
    },
    {
      "key": "F026",
      "label": "ChangeProposal／enum 借用类型",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026；ChangeProposal／enum 借用类型；B/C05/C06；M003/M013/M016、专项政策；P1；P/H"
    },
    {
      "key": "F027",
      "label": "ChangeProposal／ref 挂靠／借用相对单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027；ChangeProposal／ref 挂靠／借用相对单位；B/C05/C06；M013/M016及校内组织／法人核；P2；N/H"
    },
    {
      "key": "F028",
      "label": "ChangeProposal／event/date 任务结束或拟归还节点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028；ChangeProposal／event/date 任务结束或拟归还节点；B/C05/C06；M003/M013；批准内容后见M014/M017；P1；时间阈值未知 P"
    },
    {
      "key": "F029",
      "label": "DecisionEvent／ref 单位分管领导同意",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029；DecisionEvent／ref 单位分管领导同意；D/C03；真实签署 M008 [SRC-001，第21条]；P3；B时Ø；D无事件H"
    },
    {
      "key": "F030",
      "label": "DecisionEvent／ref 国资审核／调剂决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030；DecisionEvent／ref 国资审核／调剂决定；D/C02/C05；授权事件 M009/M014；P3；B时Ø；D无事件H"
    },
    {
      "key": "F031",
      "label": "HandoverEvent／ref 资产系统变更",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031；HandoverEvent／ref 资产系统变更；E/C01/C02/C04；学校国资正式记录 M010；P1；B时Ø，源断S"
    },
    {
      "key": "F032",
      "label": "HandoverEvent／ref 备案事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032；HandoverEvent／ref 备案事件；E/C03；国资委办公室真实记录 M011；P2；B时Ø，源断S/H"
    },
    {
      "key": "F033",
      "label": "HandoverEvent／ref 实物交接确认",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033；HandoverEvent／ref 实物交接确认；**D前/C03；E/C01–C02**；有权交接 M012；C03 调动之前的完成时间必须可与真实人事调动时点比较；P3；B时Ø；C03 D核证时缺/源断H或S，其他情形 E 才核"
    },
    {
      "key": "F034",
      "label": "HandoverEvent／ref 归还验收",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034；HandoverEvent／ref 归还验收；E/C05/C06；授权归还记录 M015；P2；未归还时Ø，后续H"
    },
    {
      "key": "F035",
      "label": "DecisionEvent／ref 跨模板/专项既有结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035；DecisionEvent／ref 跨模板/专项既有结论；A/C/D/F条件；人事/资产处置/G50/S/T受信任引用 M018/M020；P3；不适用Ø；无法验证S/H"
    },
    {
      "key": "F036",
      "label": "EvidenceRevision／string 版本和归属",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036；EvidenceRevision／string 版本和归属；B–F；M003/M021等原件的issuer、hash、时间；P1；缺版本N，归属冲突C"
    },
    {
      "key": "F037",
      "label": "EvidenceRevision／enum 冲突/失联/不可读状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037；EvidenceRevision／enum 冲突/失联/不可读状态；C–F；校验记录，M001/M004/M021；P2；无异常Ø；未知不作通过"
    },
    {
      "key": "F038",
      "label": "Case／ref 撤回/补件/复核请求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F038；Case／ref 撤回/补件/复核请求；F或B–D；真实请求 M021/M022；P3；无请求Ø；权限不明H"
    },
    {
      "key": "F039",
      "label": "RouteContext／object 校区/批次/资产映射",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039；RouteContext／object 校区/批次/资产映射；A/B/C08；校方组织主数据及 M019；P1；批量映射N，校区政策P"
    },
    {
      "key": "F040",
      "label": "RouteContext／ref 政策版本与核验日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040；RouteContext／ref 政策版本与核验日；A/D/F；SRC-001–SRC-003、SRC-011–SRC-014及政策配置，非申请人附件；P0；现行性/新旧衔接未确认P"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "校方资产主键、标签号、原单位／人／地点／状态；持有人＝国资系统或归口资产管理机构；权威资产条目快照",
      "purpose": "M001；校方资产主键、标签号、原单位／人／地点／状态；持有人＝国资系统或归口资产管理机构；权威资产条目快照；A/B **基础当前，优先校方取数**；归口部门可核验的盖章记录／授权导出，仅作同权威来源替代；F008–F017、F024–F025；SRC-001；绑定逐件资产、查询时点与版本；源断 S，副本 OCR 不能直接 PASS_FACT，文本不可读 UNREADABLE",
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
        "校方资产主键、标签号、原单位／人／地点／状态；持有人＝国资系统或归口资产管理机构；权威资产条目快照"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "申请经办人及授权范围；持有人＝校方身份／组织／授权机构；登录身份及正式委托记录",
      "purpose": "M002；申请经办人及授权范围；持有人＝校方身份／组织／授权机构；登录身份及正式委托记录；B **基础当前，但不要求申请人上传工牌**；学校真正可验签的授权书或指定经办记录；F005–F007；SRC-001/004/005；按人员、单位、有效期版本；授权不可核 H，材料不可读 UNREADABLE",
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
        "申请经办人及授权范围；持有人＝校方身份／组织／授权机构；登录身份及正式委托记录"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "申请目的、类型、逐资产拟变更值和原因；持有人＝发起单位；校内申请单／单位说明",
      "purpose": "M003；申请目的、类型、逐资产拟变更值和原因；持有人＝发起单位；校内申请单／单位说明；B **基础当前**；校方业务系统提交记录或正式单位说明，不能伪称学校统一表格；F003–F004、F018–F023、F026–F028、F036；SRC-001/002；申请版本与资产归属逐项绑定；未陈述 N，不可读 UNREADABLE",
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
        "申请目的、类型、逐资产拟变更值和原因；持有人＝发起单位；校内申请单／单位说明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "标签与实物、使用人、地点及状况核对；持有人＝实际盘点人／使用单位；现场盘点／核对记录",
      "purpose": "M004；标签与实物、使用人、地点及状况核对；持有人＝实际盘点人／使用单位；现场盘点／核对记录；C **条件当前**（冲突、稽核、移交需要）；学校认可的实际盘点签认或现场可验证记录；F009–F011、F015、F024–F025、F037；SRC-001/008；核对时间、盘点角色、资产号；无疑点不硬要照片，触发后缺 N，照片不清 UNREADABLE",
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
        "标签与实物、使用人、地点及状况核对；持有人＝实际盘点人／使用单位；现场盘点／核对记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "交出／接收双方的已有意向和承接对象；持有人＝相关单位／接收人；真实意向确认",
      "purpose": "M005；交出／接收双方的已有意向和承接对象；持有人＝相关单位／接收人；真实意向确认；B/C **条件当前**，并非一律需要完成签章；校内可信协作记录、可核验单位确认；非正式决定；F018–F020；SRC-001；双方、资产集合和时间；意向尚未形成不冒充批准，必核时 N/H",
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
        "交出／接收双方的已有意向和承接对象；持有人＝相关单位／接收人；真实意向确认"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "管理员／使用人岗位变动、机构调整的事实；持有人＝学校人事／组织部门；已有通知或可信事件",
      "purpose": "M006；管理员／使用人岗位变动、机构调整的事实；持有人＝学校人事／组织部门；已有通知或可信事件；B/C03 **条件当前**；可核验的人事／机构正式决定，不接受自行填写的调离日期；F023、F035；SRC-001；对应人员、岗位、有效时点；源断 S，不可读 UNREADABLE",
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
        "管理员／使用人岗位变动、机构调整的事实；持有人＝学校人事／组织部门；已有通知或可信事件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "管理员调动前的预交接范围和拟继任对象；持有人＝原单位管理员及使用单位；预清单／资产映射",
      "purpose": "M007；管理员调动前的预交接范围和拟继任对象；持有人＝原单位管理员及使用单位；预清单／资产映射；B/C03 **条件当前**；学校国资系统导出的待交接清单或单位可核记录；F014、F020、F023、F033；SRC-001；每资产明细、清单版本；缺清单 N，尚未完成交接不判失败",
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
        "管理员调动前的预交接范围和拟继任对象；持有人＝原单位管理员及使用单位；预清单／资产映射"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "资产管理员调动前单位分管领导同意；持有人＝单位真实有权领导；签署审批事件",
      "purpose": "M008；资产管理员调动前单位分管领导同意；持有人＝单位真实有权领导；签署审批事件；D/C03 **调动手续前形成**；校内有效电子审批或可向单位核验的原签署；F029、F035；SRC-001/011/012；领导角色有效区间、签时与对象；B时不要求，D核时须与调动办理时间比较，源断S／签权不清H",
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
        "资产管理员调动前单位分管领导同意；持有人＝单位真实有权领导；签署审批事件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "跨部门调拨国资处正式审核；持有人＝国资归口有权岗位；审核事件／批复",
      "purpose": "M009；跨部门调拨国资处正式审核；持有人＝国资归口有权岗位；审核事件／批复；D/C02 **后续形成**；同一国资机关可核验的正式审批文书；F030、F035；SRC-001/004/005；记录具体资产和版本；申请初始不得要求，D源断 S/H",
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
        "跨部门调拨国资处正式审核；持有人＝国资归口有权岗位；审核事件／批复"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "内部交接／跨部门调拨／地点变动后的系统更新；持有人＝国资管理系统；版本化变更事件",
      "purpose": "M010；内部交接／跨部门调拨／地点变动后的系统更新；持有人＝国资管理系统；版本化变更事件；E/C01/C02/C04 **后续形成**；归口机构确认的系统变更记录；F017、F031；SRC-001；old→new、时间、操作者、资产号；B阶段Ø，E源断 S",
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
        "内部交接／跨部门调拨／地点变动后的系统更新；持有人＝国资管理系统；版本化变更事件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "管理员变动及交接向国资委办公室备案；持有人＝办公室；真实备案回执",
      "purpose": "M011；管理员变动及交接向国资委办公室备案；持有人＝办公室；真实备案回执；E/C03 **后续备案追踪**；办公室可核验的备案登记；F032；SRC-001；对应交接事件与日期；B阶段Ø，E缺失 S/H；不得当调动前必备既有回执",
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
        "管理员变动及交接向国资委办公室备案；持有人＝办公室；真实备案回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "实物交接完成与接收责任；持有人＝原新管理／使用单位；系统交接或真实签收记录",
      "purpose": "M012；实物交接完成与接收责任；持有人＝原新管理／使用单位；系统交接或真实签收记录；**C03：D 核证调动前已完成；C01/C02：E 后续形成**；校内真实交接事件或单位可核验签收；F024、F033；SRC-001/011/012；逐件、交接双方、完成时点、资产版本；B时Ø，C03 D时未完成应 `NEEDS_HUMAN_DECISION` 并转原单位，不以事后补件冒充前置；源断S",
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
        "实物交接完成与接收责任；持有人＝原新管理／使用单位；系统交接或真实签收记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "特定行政办公设备借调／临时机构工作需求及挂靠关系；持有人＝挂靠单位；已有任务与调剂借用申请",
      "purpose": "M013；特定行政办公设备借调／临时机构工作需求及挂靠关系；持有人＝挂靠单位；已有任务与调剂借用申请；B/C05 **条件当前**；挂靠单位真实任务凭据加已提交的申请记录；F022、F026–F028；SRC-002；任务、人员、设备范围；不适用普通共享预约，缺 N",
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
        "特定行政办公设备借调／临时机构工作需求及挂靠关系；持有人＝挂靠单位；已有任务与调剂借用申请"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "国资处实际调剂借用决定／出库事件；持有人＝国资归口岗位",
      "purpose": "M014；国资处实际调剂借用决定／出库事件；持有人＝国资归口岗位；D/C05 **后续形成**；同一国资机构可核验的借用授权记录；F028、F030；SRC-002；决定、设备与任务绑定；B时Ø，D未形成 H",
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
        "国资处实际调剂借用决定／出库事件；持有人＝国资归口岗位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "任务完成后的归还、验收／接收；持有人＝国资或实际接收管理人",
      "purpose": "M015；任务完成后的归还、验收／接收；持有人＝国资或实际接收管理人；E/C05（及合法 C06）**后续形成**；同一出借管理机构可核验的归还记录；F028、F034；SRC-001/002；逐件归还、验收日期；未到归还节点Ø，到期无据 H",
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
        "任务完成后的归还、验收／接收；持有人＝国资或实际接收管理人"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "对外无偿出借专项事实、受借单位资质及按现行校规所需论证／评估／集体决策线索；持有人＝国资与申请单位／有权部门",
      "purpose": "M016；对外无偿出借专项事实、受借单位资质及按现行校规所需论证／评估／集体决策线索；持有人＝国资与申请单位／有权部门；C06 **条件当前，内容未冻结**；集体决策或协议如果尚未形成则不可提前索取；只能由当前有权专项办法允许的校内申请、论证、会议纪要、协议等可核记录替代；2016附件只能做字段参考；F026–F028、F040；SRC-001/003/012/013；20号未读且新旧衔接未知，具体必需项 P；已有文件不可读 UNREADABLE，绝不套内部表或旧阈值",
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
        "对外无偿出借专项事实、受借单位资质及按现行校规所需论证／评估／集体决策线索；持有人＝国资与申请单位／有权部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "校外出借专项有效批准及相关上级程序；持有人＝学校／有权主管",
      "purpose": "M017；校外出借专项有效批准及相关上级程序；持有人＝学校／有权主管；D/C06 **后续形成**；同一有权机关可核验的正式决定；F028、F035；SRC-001/003；资产范围、受借方、期限、签发机关版本；B时Ø，不能验权 H",
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
        "校外出借专项有效批准及相关上级程序；持有人＝学校／有权主管"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "产权划转／报废／报损／争议处置等已有权威结论；持有人＝专项资产归口",
      "purpose": "M018；产权划转／报废／报损／争议处置等已有权威结论；持有人＝专项资产归口；C07 **既有引用**（若已经形成）；同一有权处置记录或部门核验结论；F010、F035；SRC-001；仅路由和事实引用，非本模板审批；不存在Ø，来源断 S",
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
        "产权划转／报废／报损／争议处置等已有权威结论；持有人＝专项资产归口"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "批量逐件映射：资产号、原拟单位／人、对应子情形；持有人＝发起单位",
      "purpose": "M019；批量逐件映射：资产号、原拟单位／人、对应子情形；持有人＝发起单位；B/C08 **条件当前**；国资系统批量清单或可逐行校验的正式单位清单；F008–F009、F018–F020、F039；SRC-001；每行单独 assetId 和版本；混用资产号 C，无法读行 UNREADABLE",
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
        "批量逐件映射：资产号、原拟单位／人、对应子情形；持有人＝发起单位"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "相邻 G50/S/T／人事既有有效决定引用；持有人＝其权威业务系统或归口部门",
      "purpose": "M020；相邻 G50/S/T／人事既有有效决定引用；持有人＝其权威业务系统或归口部门；A/C/F **既有引用**（需要时）；带源、签署、对象、版本、有效状态的正式决定；F023、F035；SRC-009/010；不能以“某模板 PASS”代替学校批准；无相关案Ø，源断 S",
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
        "相邻 G50/S/T／人事既有有效决定引用；持有人＝其权威业务系统或归口部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "补充、替换材料及受影响事实清单；持有人＝原有权提交者／可信源",
      "purpose": "M021；补充、替换材料及受影响事实清单；持有人＝原有权提交者／可信源；C/F **条件当前**；同一事实的新版本权威记录／有归属的补件；F001、F036–F038；SRC-001/009；保留旧 hash 与变更 diff、归属资产；旧结论转待重审，无法读 UNREADABLE",
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
        "补充、替换材料及受影响事实清单；持有人＝原有权提交者／可信源"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "撤回、异议或复核请求及已有受理回执；持有人＝申请人及校方受理机构",
      "purpose": "M022；撤回、异议或复核请求及已有受理回执；持有人＝申请人及校方受理机构；F，或 B–D 提出时 **条件当前**；受理回执后续；可核授权的系统请求；学校受理决定只有形成后能引用；F001、F005、F007、F038；SRC-001/010；版本记录请求人与针对的决定；无机制 P/H，不能自动撤销",
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
        "撤回、异议或复核请求及已有受理回执；持有人＝申请人及校方受理机构"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-8-2",
      "name": "8.2 R001–R027 独立规则（逐项独立事实／门禁）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "业务性质与范围，A/B",
          "requirement": "**R001** 业务性质与范围，A/B；T：申请改变已登记国资占用／责任／地点或特定借用；F：仅开放预约、采购入账、经费付款；U：意图不清；SRC-001/002/006/009；F003、F010、F022、F026；M001/M003/M013；将申请意图与资产归口、预约事实作语义+原始证据核对；以提交时适用场景判断，T2 意图可分类但不授权；处置争议另交 R019；分类可证 `PASS_FACT`，分类相冲 `CONFLICT`；F `NOT_APPLICABLE` 并建议相邻路由；U `NEEDS_MATERIAL`／`POLICY_UNCONFIRMED` → 申请单位／国资路由岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "申请人及代理授权，B/D/F",
          "requirement": "**R002** 申请人及代理授权，B/D/F；T：正式提交、委托、撤回／复核请求；F：仅匿名咨询／尚未建案；U：会话和授权不可信；SRC-001/004/005；F001、F004–F007、F038；M002/M022；校内 T0 身份、单位与授权生效区间互相匹配，先核受托范围及提交时间；截图、Renderer role、相同姓名不替代授权；一致 `PASS_FACT`；身份或授权冲突 `CONFLICT`／权限裁量 `NEEDS_HUMAN_DECISION`；U 校方授权源不可取 `SOURCE_UNAVAILABLE` → 单位授权核验人／可信身份管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "资产唯一定位，A–E",
          "requirement": "**R003** 资产唯一定位，A–E；T：有可核资产编号／主键；F：已确证完全非资产事项；U：资产身份不足；SRC-001 第10、48条；F008–F011、F017；M001/M004/M019；以 T0 资产主键和快照时点比对标签号、型号及实物；照片/T2 不新建权威资产；历史编号须经归口核旧新映射；同一物 `PASS_FACT`；编号指向不同物 `CONFLICT`；U 权威源断 `SOURCE_UNAVAILABLE` 或经办漏号 `NEEDS_MATERIAL` → 国资台账岗／使用单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "原占用／资产状态与旧版本，A/C/D",
          "requirement": "**R004** 原占用／资产状态与旧版本，A/C/D；T：进入交接或调拨事实核对；F：C07 仅分类且无需确认原占用；U：无版本／状态；SRC-001 第10、22、48条；F012–F017、F023、F035；M001/M018/M020；T0 快照与原单位、人、地点、占用/待处置状态、查询时点比对；冻结来源版本；其他业务“在借”“待报废”是冲突线索不是未经政策确认的一票否决；一致 `PASS_FACT`；前后版本互斥 `CONFLICT`；U `SOURCE_UNAVAILABLE`／`NEEDS_HUMAN_DECISION` → 资产归口核账岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "申请变更意图完整性，B/C",
          "requirement": "**R005** 申请变更意图完整性，B/C；T：实际提出本模板变更；F：仅查看旧案；U：申报文件缺页或意图空白；SRC-001 第10、22条、SRC-002 第9条；F003、F018–F023、F026–F028、F036；M003；核资产逐项的变更前后目标、原因、接收对象及证据归属；条件字段按 C01–C06 而非全体强制；B 时不要求 D/E 文件；可读且能定位 `PASS_FACT`；同案不同版本矛盾 `CONFLICT`；U 可补说明 `NEEDS_MATERIAL`、缺页 `UNREADABLE` → 发起单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "接收人／保管人真实对应，B/C/E",
          "requirement": "**R006** 接收人／保管人真实对应，B/C/E；T：拟变更使用／保管责任人；F：纯地点、外借仅归还等不涉及人员变更；U：人名可见但唯一人员身份不能核；SRC-001 第10、21–22条；F013–F014、F019–F020；M001/M003/M005/M007/M012；比对校方人员 ID、单位与接收意向范围；T2 签字是事实线索非正式同意；查签署时在岗及对象是否属于当前资产；一致 `PASS_FACT`；同名异人、单位不符 `CONFLICT`；U `SOURCE_UNAVAILABLE`／`NEEDS_HUMAN_DECISION` → 接收单位和校内身份核验岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "账物与盘点一致性，C/E",
          "requirement": "**R007** 账物与盘点一致性，C/E；T：发生账物矛盾、交接现场核查或有权盘点；F：无触发且权威账内自洽；U：现场核对不可得；SRC-001 第10、48条，SRC-008仅风险背景；F009–F011、F015、F024–F025；M001/M004/M012；比较资产号、物品、位置、盘点日与盘点人权限；现场晚于台账时需标明变化原因；不能用巡察历史问题推定本案违规；一致 `PASS_FACT`；账物抵触 `CONFLICT`；U 条件应盘未给 `NEEDS_MATERIAL`、照片糊 `UNREADABLE` → 使用单位盘点人／国资岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "同单位交接边界，B/C/E",
          "requirement": "**R008** 同单位交接边界，B/C/E；T：C01 且原拟使用单位相同、责任人变；F：跨单位／仅位置变；U：单位编码无法核；SRC-001 第22条；F012、F018–F020、F031、F033；M001/M003/M005/M010/M012；以 T0 单位主键比对而非简称，确认内部交接为学校资产系统事务；E 时才比对系统完成事件；类型事实 `PASS_FACT`；申报内部但实际跨单位 `CONFLICT`→改路 R009；U `SOURCE_UNAVAILABLE` → 两单位资产管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "跨单位调拨及国资审核，B/D/E",
          "requirement": "**R009** 跨单位调拨及国资审核，B/D/E；T：C02 且 T0 原拟单位不同；F：同单位或非国资调拨；U：单位归属不明；SRC-001 第15、22条，SRC-004/005仅机构线索；F012、F018、F030–F031、F033；M001/M003/M009/M010/M012；B 核双方与转移意图；D 才检国资有权岗位真实审核，E 才检登记/交接；不把 M005 意向当国资批复；具体审批顺序待校方；B 事实 `PASS_FACT` 并转 D；D/E 有权事件真实 `PASS_FACT`仅代表“决定存在”事实；签权不明 `NEEDS_HUMAN_DECISION`；U `SOURCE_UNAVAILABLE` → 国资正式审核岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "资产管理员岗位变化，B/C03",
          "requirement": "**R010** 资产管理员岗位变化，B/C03；T：C03 有真实岗位调动／离岗；F：一般使用人更换且管理员岗位未变；U：仅自述将离岗；SRC-001 第21条；F014、F020、F023、F035；M003/M006/M020；对校方人事岗位事件的人员 ID、生效日及所属单位作可核对引用；尚未签发的人事决定不得要求作为现有附件；已核变动 `PASS_FACT`；事件归属冲突 `CONFLICT`；U `SOURCE_UNAVAILABLE`（有权记录不可达）／`NEEDS_HUMAN_DECISION`（人事尚未决定） → 人事归口／单位分管岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "管理员拟交接范围，B/C03",
          "requirement": "**R011** 管理员拟交接范围，B/C03；T：C03 准备离岗资产交接；F：不涉及资产管理员调动；U：应列资产却无法逐项映射；SRC-001 第21条；F008–F009、F014、F020、F023–F024；M001/M007；比对待交清单与当前管理范围、接替对象、清单生成时点；仅核预清单，不要求交接已完成；范围可核 `PASS_FACT`；漏物或混入别单位资产 `CONFLICT`；U `NEEDS_MATERIAL`／权威范围断 `SOURCE_UNAVAILABLE` → 原单位管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "管理员调动前领导同意，D/C03",
          "requirement": "**R012** 管理员调动前领导同意，D/C03；T：C03 到**拟办理调动手续的前置核证点**；F：非 C03 或尚在 B/C 材料准备；U：签权或调动办理节点未知；SRC-001 第21条、SRC-011第15条、SRC-012第21条；F002、F007、F023、F029；M002/M006/M008；真实分管领导在授权期同意、签署事件和对象、**签署时刻须早于实际办理调动**；不假定与 M012 谁先谁后。已完成的人事调动不能由本模板撤销；同意与时间可证 `PASS_FACT`；签发人/时序抵触 `CONFLICT`；F `NOT_APPLICABLE`；U `SOURCE_UNAVAILABLE`／`NEEDS_HUMAN_DECISION` → 单位分管领导／人事归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "管理员调动前资产交接完成，D/C03",
          "requirement": "**R013** 管理员调动前资产交接完成，D/C03；T：C03 到拟办理调动手续前置核证点，需证明所管理资产交接**已完成**；F：其他情形或 B/C 预清单阶段；U：交接记录或调动办理时点不明；SRC-001 第21条、SRC-011第15条、SRC-012第21条；F008–F009、F017、F023–F024、F033；M001/M006/M007/M012；每资产比对原新保管对象、实物／台账、交接完成事件与真实调动办理时刻；M007 预清单不能替代 M012；发现调动后补签只记录时序风险，不宣告人事手续无效；完成交接且时序可证 `PASS_FACT`；对象/时序互斥 `CONFLICT`；U 权威源断 `SOURCE_UNAVAILABLE`、未完成转 `NEEDS_HUMAN_DECISION` → 原单位／资产管理员／人事归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "纯地点变更与台账回写，B/C/E",
          "requirement": "**R014** 纯地点变更与台账回写，B/C/E；T：C04 原单位及保管责任人未变而地点变；F：单位或责任人变化转 C01/C02；U：新地点不明；SRC-001 第10、48条；F012、F014–F015、F021、F031；M001/M003/M004/M010；B/C 核新旧地点和实物一致性，E 才核系统位置更新；“是否需事前批准”目前 `POLICY_UNCONFIRMED`，不能因材料齐全放行执行；地点事实 `PASS_FACT`；含责任变更却称纯地点 `CONFLICT`；U `NEEDS_MATERIAL`／`SOURCE_UNAVAILABLE`，批准问题 `POLICY_UNCONFIRMED` → 使用单位／国资岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "临时行政办公设备借用适用性，B/C05",
          "requirement": "**R015** 临时行政办公设备借用适用性，B/C05；T：借调人员/临时机构由挂靠部门提出办公设备需求；F：一般科研设备短借／大型仪器预约；U：设备性质与挂靠关系不明；SRC-002 第2、4、9条，SRC-006；F010、F022、F026–F028；M001/M003/M013；核行政办公设备类型、真实任务与挂靠单位；不能把 22 号附件2“配置申请表”假装“借用批准表”；任务是否确属条文情形需原件；适用事实 `PASS_FACT`；错误借用类型 `CONFLICT`→重路；U `NEEDS_MATERIAL`／`POLICY_UNCONFIRMED` → 挂靠单位／国资调剂岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "特定办公借用调剂与归还，D/E/C05",
          "requirement": "**R016** 特定办公借用调剂与归还，D/E/C05；T：C05 已到调剂决定 D 或任务结束后归还 E；F：申请初期 B/C 或非 C05；U：国资事件、实际任务结束时间未知；SRC-002 第9条；F028、F030、F034；M013/M014/M015；D 核国资归口可验调剂事件；E 在真实任务完成后核逐件归还；续借期限规则未取得，不能编定天数；事实相符 `PASS_FACT`；时间或资产不符 `CONFLICT`；U `SOURCE_UNAVAILABLE`／续期规则 `POLICY_UNCONFIRMED`／`NEEDS_HUMAN_DECISION` → 国资调剂／接收保管岗",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "对外出借专项路由，B/C06",
          "requirement": "**R017** 对外出借专项路由，B/C06；T：相对方为校外、拟无偿转交一定期间使用；F：校内交接或共享平台使用；U：相对方法人性质／政策版本不明；SRC-001 第27–28条，SRC-003待正文，SRC-012第23条，SRC-013历史参考；F010、F026–F028、F040；M001/M003/M016；19号定义对其他行政事业单位无偿出借，2023全省办法明确集体决策及审批；2016教育厅文件历史上有协议、会议纪要、明细表与期限要求，但未证现行，**不可直接据旧阈值拒绝**；只识别外借并移交真实专项审批；“外借意图”可 `PASS_FACT`，现行细项 `POLICY_UNCONFIRMED`／需签批 `NEEDS_HUMAN_DECISION`；U 同样转人工 → 国资专项岗／主管机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "对外出借正式决定与归还，D/E/C06",
          "requirement": "**R018** 对外出借正式决定与归还，D/E/C06；T：收到已存在专项批复或进入归还核对；F：仅 B/C 起始申请；U：决定来源/权限无法核；SRC-001 第27–28条，SRC-003；F028、F034–F035、F040；M016/M017/M015；校方/上级有权签署事件、受借方、资产清单、有效期与回收逐件核；20号未读不得以审批表外观宣称批准；权威事件存在且一致仅 `PASS_FACT`（存在事实）；权限/效力 `NEEDS_HUMAN_DECISION`；U `SOURCE_UNAVAILABLE`／`POLICY_UNCONFIRMED` → 国资专项及上级有权机构",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "资产处置／产权争议排除，A/B/C07",
          "requirement": "**R019** 资产处置／产权争议排除，A/B/C07；T：无偿划转产权、报废、报损、损失责任或产权争议；F：仅校内单位调配；U：用词“调拨”但对象不清；SRC-001 第31–40条；F003、F010、F016、F035；M001/M003/M018；按“使用管理关系变更”与“产权/处置行为”区分；已有正式处置批复只引用，不做价格、损失或责任认定；排除事实 `PASS_FACT`＋转专门事项（本模板其他业务规则 `NOT_APPLICABLE`）；U `POLICY_UNCONFIRMED`／`NEEDS_HUMAN_DECISION` → 专项资产处置岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "批次逐件授权范围，B/C08/D",
          "requirement": "**R020** 批次逐件授权范围，B/C08/D；T：C08 多资产／跨单位／跨校区；F：真实单件；U：清单缺行或主键重复；SRC-001 第10、22条，SRC-005仅科室线索；F007–F009、F018–F020、F039；M001/M002/M003/M019；为每行固定 assetId、原拟单位、subcase、来源版本和签署人作用范围；不得以一单位签署覆盖另一单位；特殊校区程序未核；明细映射 `PASS_FACT`；重复、签权错配 `CONFLICT`；U `NEEDS_MATERIAL`／`UNREADABLE`，跨校区规则 `POLICY_UNCONFIRMED` → 批次经办／各单位资产管理员",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "相邻决定复用而不重复裁决，C/D/F条件",
          "requirement": "**R021** 相邻决定复用而不重复裁决，C/D/F条件；T：案件依赖已有采购验收入账、人事调动、处置/G50/S/T结论；F：独立且无此依赖；U：仅上传“某模板已通过”截图；SRC-001/006/009/010；F016、F023、F035；M006/M018/M020；仅取原有权业务的签发机关、对象、范围、有效状态、版本与签署事件；G50技术 PASS 不等于校方决定；不得重判资金、人事资格或产权处置；引用可证 `PASS_FACT`；同对象不同状态 `CONFLICT`；U `SOURCE_UNAVAILABLE`／`NEEDS_HUMAN_DECISION` → 对应权威业务 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "后续执行事实与签署绑定，D/E",
          "requirement": "**R022** 后续执行事实与签署绑定，D/E；T：该子情形到了真实决定／交接／登记节点；F：B/C 尚未到后续阶段或 C07 仅转办；U：源事件存在但角色/资产范围不明；SRC-001 第21–22、48条，SRC-002 第9条；F002、F007、F017、F029–F035；M008–M012/M014/M017；按不同 issuer、签时、资产 ID 和版本独立核，不允许“领导同意＝国资批复＝系统完成”；更新必须跟随真实有权事务；已形成且绑定一致 `PASS_FACT`（**非代签**）；签名、资产、顺序相冲 `CONFLICT`；U `SOURCE_UNAVAILABLE`／`NEEDS_HUMAN_DECISION` → 国资有权岗／备案执行岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "文档可读性和原件归属，B–F",
          "requirement": "**R023** 文档可读性和原件归属，B–F；T：某 M 本阶段实需且由文件/扫描件承载；F：可信结构化源直接供值或尚未到形成期；U：文件存在却区域无法识别；SRC-001的真实性原则、SRC-009仅技术；F009、F036–F037；M003/M004/M007/M013/M016/M019/M021；原件页码、表格单元和文件 hash 定位；对照 OCR 与原件；不可识读就只标不可读，不把“没识别到”当没提交；可读、归属可证 `PASS_FACT`；异物串案 `CONFLICT`；U `UNREADABLE` → 材料提交者／人工识读岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "材料换版的定向重审，C/F",
          "requirement": "**R024** 材料换版的定向重审，C/F；T：有新材料覆盖旧材料或权威快照变更；F：无版本变化；U：新旧关系/hash 未知；SRC-001 第10、48条、SRC-009技术线索；F001、F008、F017、F036–F037；M001/M003/M010/M021；对材料、资产、字段及规则依赖做 diff；旧事实运行结论 superseded，只重审关联 R；保留有权已签决定原样，除非原机关发布新决定；依赖可追 `PASS_FACT`（仅表示版本链完整）；串案覆盖 `CONFLICT`；U `NEEDS_MATERIAL`／`NEEDS_HUMAN_DECISION` → 资料管理员／受影响规则核验岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "撤回、重提、异议和复核请求，B–F",
          "requirement": "**R025** 撤回、重提、异议和复核请求，B–F；T：已提交可信请求；F：无请求；U：申请人／所针对原案、决定或权限未知；SRC-001的审批分权，SRC-010目录技术参考；F001–F007、F035–F038；M002/M020/M022；记录案卷及决定版本、请求人身份、请求时间与受理状态；当前校本撤回节点、复核机关/时限未知；重提生成新申请版本关联旧案，不篡改旧决定；请求存在 `PASS_FACT`（**非学校已受理或准许**）；冒名／目标错配 `CONFLICT`；U 对校本程序取 `POLICY_UNCONFIRMED`，另由 R002核身份、R026生成正式人工待办 → 校方指定受理／复核岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "规则现行性与裁量门禁，A/D/F",
          "requirement": "**R026** 规则现行性与裁量门禁，A/D/F；T：将作任何制度性“必需/权限/阈值/可批准”判断；F：仅按原样提取可读事实；U：校规是否现行或专项授权不明；SRC-001–SRC-005、SRC-007/009/010仅边界、SRC-011–SRC-014；F002、F035、F040；M008/M009/M014/M016/M017/M022；核法源层级、施行废止、适用主体/当期校本接口；2023省直办法第74条指主管部门校属高校具体办法，2016教育厅文件权限／期限未证续效，不得套旧阈值或学校外其他规则；2025决算/G50也不作硬依据；**政策来源存在**可核实≠“具体校本审批权已确定”；后者无证则 `POLICY_UNCONFIRMED`，需签批另建 `NEEDS_HUMAN_DECISION` 待办 → 国资法规管理／主管机构／正式签批岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "管理员交接备案事实，E/C03",
          "requirement": "**R027** 管理员交接备案事实，E/C03；T：C03 已有人员变动及交接，进入办公室备案状态核证；F：非C03或尚未到备案核证节点；U：备案源无法访问或对应范围未知；SRC-001 第21条；F001–F002、F017、F023、F032–F033；M006/M011/M012；向学校国资委办公室核报送及受理/备案记录，关联人员、资产范围、原交接事件、版本、日期；“及时”没有确证数值天数，备案不能倒置替代交接或领导同意；已有备案记录且对象匹配 `PASS_FACT`；编号/对象相冲 `CONFLICT`；U `SOURCE_UNAVAILABLE`／`POLICY_UNCONFIRMED` → 国资委办公室／原单位",
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
      "name": "发起前资产定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "b",
      "workflowOwner": "local"
    },
    {
      "id": "b",
      "name": "申请与原因说明",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "c",
      "workflowOwner": "local"
    },
    {
      "id": "c",
      "name": "事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "d",
      "workflowOwner": "local"
    },
    {
      "id": "d",
      "name": "有权部门处理／特定前置交接",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "e",
      "workflowOwner": "local"
    },
    {
      "id": "e",
      "name": "执行／登记／备案后对账",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "f",
      "workflowOwner": "local"
    },
    {
      "id": "f",
      "name": "后续异议、补正、撤回、复核",
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
