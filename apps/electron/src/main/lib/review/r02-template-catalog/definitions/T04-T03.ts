import type { TemplateVersion } from '@profer/shared'

/** SRC IDs below are research-source metadata, never case SourceRef values. */
export const r02Metadata = {
  "templateId": "T04-T03",
  "name": "采购合同订立、变更与采购合规性审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T03.md",
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T04-T03.md",
  "sourceDocumentSha256": "60c133f0c85aac8937fee7878c6a0864c63ce6011e783abfb21f0eff90ad1183",
  "originalSourceSha256": "c8b8d6994e8118d8c0b8c60fbe1d7d0c5c01d386e916c55546d4fe37f85eed79",
  "originalGitBlobSha": "5e07eeaf9b0a50e53178071c67530e9a504d598d",
  "sourceIntegrityNote": "LINE_ENDING_DRIFT_ONE_LF: Git blob plus one LF matches authoritative manifest bytes/SHA-256; reviewed source follows that convention.",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "School-specific current rules, authorization matrix and current forms remain incomplete; unresolved policy branches stay manual and cannot produce official pass/reject.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "成都理工大学党委办公室、校长办公室依法治校办公室：《成都理工大学合同管理办法（2024修订版）》解读；https://dbxb.cdut.edu.cn/info/1063/4726.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/info/1063/4726.htm"
      ],
      "description": "| SRC-001 | `CDUT-VERIFIED`；校内解读正文已核，所解读的制度完整正文未取 | 成都理工大学党委办公室、校长办公室依法治校办公室：《成都理工大学合同管理办法（2024修订版）》解读；https://dbxb.cdut.edu.cn/info/1063/4726.htm | 解释成理校发〔2024〕8号，列九章53条；援引第11、14、15、40、41、46、47、49条；涉及合同签前程序、归口、变更解除上报、责任及重大合同概念 | 网页 **2024-04-07**，称新办法 **2024-03-15** 印发；原办法生效、后续修订／废止信息**待查**；适用于成都理工大学合同管理，但不是原始全文；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-002",
      "title": "成都理工大学信息公开办公室：《成都理工大学2025年信息公开年度报告》；https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm"
      ],
      "description": "| SRC-002 | `CDUT-VERIFIED`；已核年度报告正文，仅证明 2025 年情况 | 成都理工大学信息公开办公室：《成都理工大学2025年信息公开年度报告》；https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm | “推进财务信息公开”“加强基建项目信息公开”部分：政府采购合同公示、非政采细则的实际使用和工程采购组织方式 | **2025-10-31**；年报无规范性生效／废止日；学校层面且所述为 2025 年业务，不作 2026 采购门槛；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学财务处（采购与招标管理中心）：《关于开展2025年度采购工作的通知》；https://cg.cdut.edu.cn/info/1008/4398.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/4398.htm"
      ],
      "description": "| SRC-003 | `CDUT-VERIFIED`；正文已核，仅限 2025 年度 | 成都理工大学财务处（采购与招标管理中心）：《关于开展2025年度采购工作的通知》；https://cg.cdut.edu.cn/info/1008/4398.htm | 第1–4项：各单位责任领导／经办人、采购计划项目包及方式确认、需求论证表和意向公告等前置资料 | **2025-05-08**；年度通知，期限及 2026 替代通知**未查到**；适用该校 2025 采购工作；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-004",
      "title": "成都理工大学信息公开办公室：《成都理工大学关于2024年信息公开工作的报告》；https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm"
      ],
      "description": "| SRC-004 | `CDUT-VERIFIED`；2024 年报告正文已核，时间性有限 | 成都理工大学信息公开办公室：《成都理工大学关于2024年信息公开工作的报告》；https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm | “规范基建信息公开”“严格执行招采规定”部分：指称 2024 非政采实施细则成理校发〔2024〕1号及当年公开机制 | **2024-10-30**；年度披露非规范文本，2024 情况；成都理工大学；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-005",
      "title": "成都理工大学采购与招标管理中心：《成都理工大学2025年展览服务采购项目政府采购合同公告（合同编号 N5100012025001771-1）》；https://cg.cdut.edu.cn/info/1009/4542.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1009/4542.htm"
      ],
      "description": "| SRC-005 | `CDUT-VERIFIED`；特定合同公示已核，非模板通用审批结论 | 成都理工大学采购与招标管理中心：《成都理工大学2025年展览服务采购项目政府采购合同公告（合同编号 N5100012025001771-1）》；https://cg.cdut.edu.cn/info/1009/4542.htm | 具体合同编号与四川政府采购网外链，证明公开的政府采购合同实例；不代表该合同审签流程适用于所有合同 | **2025-08-04**；公告性文件，无生效／废止规范时间；特定政府采购项目；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-006",
      "title": "成都理工大学党委办公室、校长办公室：《成都理工大学合同管理系统第一期上线培训会顺利举行》；https://dbxb.cdut.edu.cn/info/1063/3484.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/info/1063/3484.htm"
      ],
      "description": "| SRC-006 | `CDUT-VERIFIED`；历史运营报道已核，现有系统版本未核 | 成都理工大学党委办公室、校长办公室：《成都理工大学合同管理系统第一期上线培训会顺利举行》；https://dbxb.cdut.edu.cn/info/1063/3484.htm | 记述 2021 年合同系统的合同类别、填报、送审、进度、后续管理和人员权限培训；只能证明**历史上存在系统** | **2021-03-09**；新闻报道，无制度生效／废止日；学校历史业务，不证明 2026 系统权限／接口；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学采购与招标管理中心：《关于〈成都理工大学采购管理办法(试行)〉的补充说明》；https://cg.cdut.edu.cn/info/1008/3280.htm",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/3280.htm"
      ],
      "description": "| SRC-007 | `CURRENTITY-UNKNOWN`；2023 正文可检索，但现行效力不明 | 成都理工大学采购与招标管理中心：《关于〈成都理工大学采购管理办法(试行)〉的补充说明》；https://cg.cdut.edu.cn/info/1008/3280.htm | 对成理校发〔2021〕12号第11条的补充；包含自主采购方式、响应供应商数和网上商城等历史规定；**不直接移植为 2026 硬规则** | **2023-03-07**；后有 2024 非政采实施细则，替代／沿用范围**待原文确认**；学校货物／服务采购，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-008",
      "title": "成都理工大学党政办公室通知公告：《成都理工大学关于2026年度合同签署授权代表信息的公告》；可访问线索首页 https://dbxb.cdut.edu.cn/index.htm （正文直达 URL 待取得）",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/index.htm"
      ],
      "description": "| SRC-008 | `CURRENTITY-UNKNOWN`；官网标题日期可核，授权名单及条款未取得 | 成都理工大学党政办公室通知公告：《成都理工大学关于2026年度合同签署授权代表信息的公告》；可访问线索首页 https://dbxb.cdut.edu.cn/index.htm （正文直达 URL **待取得**） | 主页“通知公告”显示公告存在，**不能据 2025 名单推定 2026 签署人**；同时见 2026-03-16 授权变更公告标题，需核先后效力 | 标题日期 **2026-05-08**；具体生效／替代与授权期限未知；适用学校合同对外签署主体；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-009",
      "title": "成都理工大学：《成都理工大学合同管理办法》（成理校发〔2024〕8号）；唯一核实到的校方解读入口 https://dbxb.cdut.edu.cn/info/1063/4726.htm；制度原件 URL／校内制度公开路径待取得",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/info/1063/4726.htm；制度原件"
      ],
      "description": "| SRC-009 | `CURRENTITY-UNKNOWN`；发布事实由解读证实，制度全文未取得 | 成都理工大学：《成都理工大学合同管理办法》（成理校发〔2024〕8号）；唯一核实到的校方解读入口 https://dbxb.cdut.edu.cn/info/1063/4726.htm；制度原件 URL／校内制度公开路径**待取得** | 官方解读指共9章53条，尤其需取第2–6章全部审批分级、签署、用章、变更规定与附表；不可使用推测条号 | 据 SRC-001 于 **2024-03-15** 印发；制度自身施行条款／废止情况未知；成都理工大学全部相关合同，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-010",
      "title": "成都理工大学：《成都理工大学非政府采购实施细则》（成理校发〔2024〕1号）；间接官方年报 https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm；采购中心政策法规索引 https://cg.cdut.edu.cn/index.htm",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm；采购中心政策法规索引",
        "https://cg.cdut.edu.cn/index.htm"
      ],
      "description": "| SRC-010 | `CURRENTITY-UNKNOWN`；存在由学校年报证实，原件不可核 | 成都理工大学：《成都理工大学非政府采购实施细则》（成理校发〔2024〕1号）；间接官方年报 https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm；采购中心政策法规索引 https://cg.cdut.edu.cn/index.htm | 需核该细则第几条规定采购合同要求、采购组织权限、成交确认、采购类型／金额分档；**不得直接把年报中的工程项目区间当成所有采购合同阈值** | 成文 **2024 年**，确切印发／施行／废止日待查；学校非政府采购；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-011",
      "title": "全国人大常委会：《中华人民共和国政府采购法》（2014修正版本由国家市场监督管理总局公开）；https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html"
      ],
      "description": "| SRC-011 | `GENERAL-RESEARCH`；上位法律条文核实 | 全国人大常委会：《中华人民共和国政府采购法》（2014修正版本由国家市场监督管理总局公开）；https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html | 第42–50条：采购档案、书面合同、结果后订立、备案、同标的补充合同与不得擅改；第52–58条质疑投诉另路由。对政府采购成立适用条件先核项目性质 | **2002-06-29**通过、**2003-01-01**起施行、**2014-08-31**修正；后续修法需持续追踪，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-012",
      "title": "国务院：《中华人民共和国政府采购法实施条例》（国务院令第658号，司法部国家行政法规库）；https://xzfg.moj.gov.cn/front/law/detail?LawID=417",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://xzfg.moj.gov.cn/front/law/detail?LawID=417"
      ],
      "description": "| SRC-012 | `GENERAL-RESEARCH`；行政法规正文核实 | 国务院：《中华人民共和国政府采购法实施条例》（国务院令第658号，司法部国家行政法规库）；https://xzfg.moj.gov.cn/front/law/detail?LawID=417 | 第43、49、50、54条：结果确定、拒签处理、合同公告、质疑影响签约或履行等；**不等于校内合同审批权限** | **2015-01-30**公布，**2015-03-01**施行；废止／新修须常态复核，适用政府采购；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-013",
      "title": "全国人大常委会：《中华人民共和国招标投标法》（国家市场监督管理总局公开）；https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_1f79dd79321441a0831f3aed697b4535.html",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_1f79dd79321441a0831f3aed697b4535.html"
      ],
      "description": "| SRC-013 | `GENERAL-RESEARCH`；上位法律正文核实 | 全国人大常委会：《中华人民共和国招标投标法》（国家市场监督管理总局公开）；https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_1f79dd79321441a0831f3aed697b4535.html | 第46条中标通知后书面合同及不得背离招投标文件实质内容，第59条相关责任；仅依法适用招投标法时使用 | **1999-08-30**通过、**2000-01-01**施行，**2017-12-27**修正；相关适用标准另查；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-014",
      "title": "全国人大：《中华人民共和国民法典》（国家市场监督管理总局公开）；https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_60fb3863b7364b759123a42d1df568ca.html",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_60fb3863b7364b759123a42d1df568ca.html"
      ],
      "description": "| SRC-014 | `GENERAL-RESEARCH`；上位法律正文核实 | 全国人大：《中华人民共和国民法典》（国家市场监督管理总局公开）；https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_60fb3863b7364b759123a42d1df568ca.html | 第543、544条协商变更与变更不明的后果；不得据此忽略政府采购特殊限制或学校内部授权 | **2020-05-28**通过、**2021-01-01**施行；一般合同法基础，需叠加特别法；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-015",
      "title": "| SRC-015 | `CURRENTITY-UNKNOWN`；固定 SHA 的 JSON 正文已通过仓库内容接口核实，当前主分支运行/发布效力未知 | 项目仓库 `Fuck-GH-Admin/cdut-studio-review-agent`：`docs/design/review-agent/",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
      ],
      "description": "| SRC-015 | `CURRENTITY-UNKNOWN`；固定 SHA 的 JSON 正文已通过仓库内容接口核实，当前主分支运行/发布效力未知 | 项目仓库 `Fuck-GH-Admin/cdut-studio-review-agent`：`docs/design/review-agent/acceptance/d4-unified-r01/catalog.json`；https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json | `templateCount=50`、8 个 G 领域，记录技术工作区与固定 blob；自述 `authoritativeSchoolTemplate=false`、`public"
    },
    {
      "id": "SRC-016",
      "title": "成都理工大学党政办公室：《机构设置》；https://dbxb.cdut.edu.cn/jgsz.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/jgsz.htm"
      ],
      "description": "| SRC-016 | `CDUT-VERIFIED`；机构职责正文已核，人员权限另核 | 成都理工大学党政办公室：《机构设置》；https://dbxb.cdut.edu.cn/jgsz.htm | 职责说明含统筹合同管理、合法性审查、涉法纠纷法律事务和校级党政印信管理；不确定具体合同签批人 | 网页公布日未标明；现行机构网页但岗位／授权随时可能调整，适用学校机构职责，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-017",
      "title": "成都理工大学财务处：《学校召开采购管理信息系统操作培训会》，可检索入口 https://jcc.cdut.edu.cn/ssjg.jsp?currentnum=7&newskeycode2=&searchScope=0&wbtreeid=1033",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/ssjg.jsp?currentnum=7&newskeycode2=&searchScope=0&wbtreeid=1033"
      ],
      "description": "| SRC-017 | `CDUT-VERIFIED`；校内培训报道已核，系统正式接口不可推定 | 成都理工大学财务处：《学校召开采购管理信息系统操作培训会》，可检索入口 https://jcc.cdut.edu.cn/ssjg.jsp?currentnum=7&newskeycode2=&searchScope=0&wbtreeid=1033 | 记述采购基础操作、计划管理、项目组合、申请发起、执行管理和合同管理六大功能模块的培训；**不证明本项目可调用其接口** | **2025-06-18**报道（培训于6月12日）；非制度规范，学校采购人员培训事实，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-018",
      "title": "成都理工大学党政办公室：《合同审批流程图》；索引 https://dbxb.cdut.edu.cn/fzzc.htm",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/fzzc.htm"
      ],
      "description": "| SRC-018 | `CURRENTITY-UNKNOWN`；仅官网索引标题，流程图原图未取 | 成都理工大学党政办公室：《合同审批流程图》；索引 https://dbxb.cdut.edu.cn/fzzc.htm | 可确认有该历史流程图条目，但具体节点／会签顺序不可核实；不能当 2024 修订后的现行流转图 | 索引 **2021-05-18**；现行效力／原件 URL 待查；学校合同管理历史资料，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-019",
      "title": "成都理工大学党政办公室：《合同管理系统合同审批表填写说明》；索引 https://dbxb.cdut.edu.cn/fzzc.htm；另首页 https://dbxb.cdut.edu.cn/index.htm 列“合同审批表（2021版）”",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/fzzc.htm；另首页",
        "https://dbxb.cdut.edu.cn/index.htm"
      ],
      "description": "| SRC-019 | `CURRENTITY-UNKNOWN`；仅官网索引标题，填写说明正文未取 | 成都理工大学党政办公室：《合同管理系统合同审批表填写说明》；索引 https://dbxb.cdut.edu.cn/fzzc.htm；另首页 https://dbxb.cdut.edu.cn/index.htm 列“合同审批表（2021版）” | 历史表单与填写说明**存在**，但表中字段、是否仍适用及 2024 后修订版均未核实 | 索引 **2021-05-18**；版次／现行效力待查；学校合同系统历史参考，访问 **2026-10-22** |"
    },
    {
      "id": "SRC-020",
      "title": "CDUT Studio G50 g07-t03：《物资与服务采购事前经费合规预审》工作区；https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-g07-build/T03/workspace/workspac",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-g07-build/T03/workspace/workspace.json"
      ],
      "description": "| SRC-020 | `GENERAL-RESEARCH`；固定 SHA 技术候选正文已核，不是学校政策 | CDUT Studio G50 `g07-t03`：《物资与服务采购事前经费合规预审》工作区；https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-g07-build/T03/workspace/workspace.json | 模块 `g07-t03-rulebook` 的 `purpose` 为采购**事前经费**合规、对象 `g07-procurement-package`；T04-T03 只能引用其有权资金前置结论，不能重新批准经费 | 固定历史候选，源码不是规章；统一发布／客户端现行效力不明；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-021",
      "title": "CDUT Studio G50 g07-t04：《采购及委托服务履约结算预审》工作区；https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-g07-build/T04/workspace/workspace.",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-g07-build/T04/workspace/workspace.json"
      ],
      "description": "| SRC-021 | `GENERAL-RESEARCH`；固定 SHA 技术候选正文已核，不是学校政策 | CDUT Studio G50 `g07-t04`：《采购及委托服务履约结算预审》工作区；https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-g07-build/T04/workspace/workspace.json | 模块 `g07-t04-rulebook` 的 `purpose` 为采购/委托服务**履约结算**、对象 `g07-settlement-line`；T04-T03 可以提供已签合同及文本事实引用，不审付款与履约结算 | 固定历史候选，源码不是规章；统一发布／客户端现行效力不明；访问 **2026-10-22** |"
    },
    {
      "id": "SRC-022",
      "title": "通知公告索引",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/index.htm"
      ],
      "description": "| SRC-022 | `CURRENTITY-UNKNOWN`；C级索引，只证标题/日期，不证授权姓名与权限 | 成都理工大学党政办公室首页[通知公告索引](https://dbxb.cdut.edu.cn/index.htm)：《2026年合同签署授权代表信息变更公告（一）》 | 首页显示 **2026-03-16** 变更公告标题；与 SRC-008 的 **2026-05-08** 年度公告存在时间先后关系，必须核其各自适用时段、被替代条目、临时授权/撤回，不凭先后自动认定后者覆盖全部条款 | 公告索引，无正文签发文号/施行内容；成都理工大学对外合同签署；访问 **2026-10-23**，网站直连受 412 限制 |"
    },
    {
      "id": "SRC-023",
      "title": "国家行政法规库",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://xzfg.moj.gov.cn/front/law/detail?LawID=1154"
      ],
      "description": "| SRC-023 | `GENERAL-RESEARCH`；A级行政法规原文 | 国务院：《中华人民共和国招标投标法实施条例》，[国家行政法规库](https://xzfg.moj.gov.cn/front/law/detail?LawID=1154) | 第2条工程建设项目法域边界、第57条书面合同的标的/价款/质量/履行期限等主要条款与招标投标文件一致；仅依法适用该条例时触发，不替代校内归口决定 | 2012年施行、经后续修订；应以行政法规库的有效文本为准；适用依法招标项目；访问 **2026-10-23** |"
    },
    {
      "id": "SRC-024",
      "title": "财政部正文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://tfs.mof.gov.cn/caizhengbuling/201801/t20180102_2791704.htm"
      ],
      "description": "| SRC-024 | `GENERAL-RESEARCH`；A级部门规章原文 | 财政部：《政府采购质疑和投诉办法》（财政部令第94号），[财政部正文](https://tfs.mof.gov.cn/caizhengbuling/201801/t20180102_2791704.htm) | 第10、16–17条质疑/投诉，第31–34条投诉处理对结果的影响与正式决定；T04-T03 仅引用有权采购机构/财政部门的暂停、结果改变和处理状态，不受理供应商法定投诉 | **2018-03-01** 施行；政府采购法域；访问 **2026-10-23** |"
    },
    {
      "id": "SRC-025",
      "title": "中央网信办转载人大正文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"
      ],
      "description": "| SRC-025 | `GENERAL-RESEARCH`；A级上位法原文 | 全国人大常委会：《中华人民共和国个人信息保护法》，[中央网信办转载人大正文](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm) | 第5–6条合法/正当/必要与最小范围；第13条处理依据，结合当事人身份和法定职责核采集/处理合法性；不能因为采购合同需要就无限收集个人证件 | **2021-11-01** 施行；仅自然人个人信息，不取代商业秘密/国家秘密专门规则；访问 **2026-10-23** |"
    },
    {
      "id": "SRC-026",
      "title": "财政部正文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gp/xxgkml/tfs/201707/t20170718_2652766.htm"
      ],
      "description": "| SRC-026 | `GENERAL-RESEARCH`；A级部门规章原文 | 财政部：《政府采购货物和服务招标投标管理办法》（财政部令第87号），[财政部正文](https://www.mof.gov.cn/gp/xxgkml/tfs/201707/t20170718_2652766.htm) | 第71条货物/服务政府采购招标签约不得实质改动招标/投标文件，第72条合同应包含的条款清单；**仅该采购方式法域**可将缺少相应合同条款列为具体事实差异 | **2017-10-01** 施行；注意原文个别“合同法”旧引称须结合现行民法典理解；访问 **2026-10-23** | ### 04.3 来源冲突及可执行性禁区 1. SRC-001 解读不替代 SRC-009 的制度原文；第11、15、40条可用作研究锚点，不能仅凭解读就填出完整金额分级和法治会签条件。 2. SRC-007 是 2023 补充说明；2024 的 SRC-010 尚未通读，暂不宣称 2023 年供应商数、网上"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-003",
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-003",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-003",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-005",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-011",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-008",
        "SRC-009",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-011",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R035",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R036",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-011",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R037",
      "sourceIds": [
        "SRC-001",
        "SRC-014",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R038",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R039",
      "sourceIds": [
        "SRC-003",
        "SRC-011",
        "SRC-012",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R040",
      "sourceIds": [
        "SRC-012",
        "SRC-024",
        "SRC-025"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4a",
      "criterionId": "R041",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T04-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "采购合同订立、变更与采购合规性审核",
  "description": "采购合同订立、变更与采购合规性审核。本地研究模板 · 非校方正式模板。只用于事实与证据预审，未知制度、权限和正式结论由有权人员人工核定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T04-T03 是本地研究/预审定义，非成都理工大学校方正式模板；不得据此宣称校方批准、正式通过、正式拒绝或已接入校方系统。",
  "objectType": "transaction",
  "displayName": {
    "template": "T04-T03 · {{caseOrAssetId}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "caseId:string；审核案卷",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001；`caseId:string`；审核案卷；S0起；HOST 案卷聚合；内部 Case 主键；非上传文档；P1；未建案不能形成有效审核；系统待办 HD"
    },
    {
      "key": "F002",
      "label": "scenarioCode:enum(A–J)；办理情形",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002；`scenarioCode:enum(A–J)`；办理情形；S0及事件变化；HOST 路由＋HUM 校核，M001/007/018等；触发依据材料位置与路由决定编号；P1；不确定标 PU/HD，不按名称自动分流"
    },
    {
      "key": "F003",
      "label": "stage:enum(S0–S7,E1,E2)；流程状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003；`stage:enum(S0–S7,E1,E2)`；流程状态；全程；HOST 可信案卷事件；状态事件ID、时间、Actor；P1；无可信事件则 SU/HD，不信 Renderer 传值"
    },
    {
      "key": "F004",
      "label": "applicantActorId:string；提出人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004；`applicantActorId:string`；提出人；S0/S2/E1/E2；HOST 身份，M001；登录认证主体、人员ID（不对外展示）；P2；SU/HD；不由姓名 OCR 反推"
    },
    {
      "key": "F005",
      "label": "applicantUnitId:string；承办单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005；`applicantUnitId:string`；承办单位；S0/S2；HOST 组织关系，M001；组织目录单位ID及有效期；P1；SU/HD；院名文本不构成授权"
    },
    {
      "key": "F006",
      "label": "actingAuthorization:record(status,from,to,scope)；代理/经办权限",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006；`actingAuthorization:record(status,from,to,scope)`；代理/经办权限；S0/S2/E1/E2；HOST 授权或核证 M001/M015；人员-单位-事项的授权记录与签发位置；P2；无权威授权 HD；相矛盾 CF"
    },
    {
      "key": "F007",
      "label": "procurementProjectId:string；采购项目",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007；`procurementProjectId:string`；采购项目；S1/S2；UP T04-T01，M002；项目计划/核准编号字段；P1；SU 或 NM；尚未产生则“前置未完成”"
    },
    {
      "key": "F008",
      "label": "packageId:string?；采购包",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008；`packageId:string?`；采购包；S1/S2（有包时）；UP T04-T01/T02，M002/M005；采购包号/分包表；P1；确认无包则 NA；有包缺号 SU/NM"
    },
    {
      "key": "F009",
      "label": "procurementCategory:enum(goods,service,works,mixed,unknown)；标的类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009；`procurementCategory:enum(goods,service,works,mixed,unknown)`；标的类别；S0/S1；UP M002/M004＋HUM；项目品目、采购需求条目；P1；混合或不明 PU/HD，禁止套金额阈值"
    },
    {
      "key": "F010",
      "label": "applicableRegimes:set(gov,nonGov,tender,other,unknown)；法律与校本采购路径",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010；`applicableRegimes:set(gov,nonGov,tender,other,unknown)`；法律与校本采购路径；S0/S1，变更再核；UP 采购归口，M002/M003/M004；SRC-009–013；项目性质决定／采购方式审核及法律依据位置；P1；未权威确定 PU/HD；多法并行不互斥"
    },
    {
      "key": "F011",
      "label": "fundingClass:enum/record；经费来源类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011；`fundingClass:enum/record`；经费来源类别；S1/S2（归口判断）；UP T04-T01/G07，M002/M015；项目核准经费科目及来源字段；P2；源不可用 SU；归口争议 HD；不作支付资格决定"
    },
    {
      "key": "F012",
      "label": "projectApprovalRef:decisionRef；项目/需求前置结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012；`projectApprovalRef:decisionRef`；项目/需求前置结论；S1/S2；UP T04-T01，M002；决定单号、版本、状态、签发时间；P1；未形成 NM/HD，已撤销 CF；不得自制决定"
    },
    {
      "key": "F013",
      "label": "procurementMethod:enum；采购方式",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013；`procurementMethod:enum`；采购方式；S1/S2；UP T04-T02，M003/M004；方式审批/采购文件对应条款；P1；SU/NM；与采购结果矛盾 CF"
    },
    {
      "key": "F014",
      "label": "procedureAndAwardDecisionRef:decisionRef；采购程序/选择结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014；`procedureAndAwardDecisionRef:decisionRef`；采购程序/选择结论；S1/S2；UP T04-T02/采购机构，M003/M005；定标/成交记录编号、当前状态与签发人；P1；NM/SU；不得以报价汇总推为定标"
    },
    {
      "key": "F015",
      "label": "awardNoticeIssuedAt:date?；中标成交通知日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015；`awardNoticeIssuedAt:date?`；中标成交通知日期；S2（政府采购/依法招标）；UP M005；通知书日期及官方平台发布时间；P1；NM/SU，跨日期 CF；触发特定法定签约时间提示"
    },
    {
      "key": "F016",
      "label": "awardedSupplierName:string；已定供应商名称",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016；`awardedSupplierName:string`；已定供应商名称；S2；UP M005；成交/中标公告供应商名称；P1；缺结果 NM/SU，和合同不符 CF"
    },
    {
      "key": "F017",
      "label": "awardedSupplierCode:string?；已定供应商统一社会信用代码/唯一标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017；`awardedSupplierCode:string?`；已定供应商统一社会信用代码/唯一标识；S2（可获得时）；UP M005/M006；采购官方记录/市场登记核验字段；P2；公告无代码则 HD/条件 NM，不凭同名判同主体"
    },
    {
      "key": "F018",
      "label": "awardedAmount:money；成交/中标金额",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018；`awardedAmount:money`；成交/中标金额；S2；UP M005；成交金额及币种/包维度；P1；NM/SU；币种/包错配 CF"
    },
    {
      "key": "F019",
      "label": "awardedSubject:lineItems；采购标的和主要规格",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019；`awardedSubject:lineItems`；采购标的和主要规格；S2；UP M004/M005/M008；采购结果明细、技术商务附件条款；P2；资料不全条件 NM；无法判同一标的 HD"
    },
    {
      "key": "F020",
      "label": "procurementFileVersion:string/ref；采购文件版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020；`procurementFileVersion:string/ref`；采购文件版本；S2（有采购文件时）；UP M004；公告链接、文件编号、修订/澄清版次；P1；无权威版本 NM/SU；版本冲突 CF"
    },
    {
      "key": "F021",
      "label": "winningResponseRef:documentRef；中标投标/成交响应文件版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021；`winningResponseRef:documentRef`；中标投标/成交响应文件版本；S2（依法招标/条款比对）；UP 采购档案，M008；响应文件档案号、页/条/包；P2；采购档案不可取 SU/HD；不可读 UR"
    },
    {
      "key": "F022",
      "label": "draftContractRef:documentRef；本次拟签合同",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022；`draftContractRef:documentRef`；本次拟签合同；S2/S3；DOC M007；签后由 M011 校核；当前材料ID与标题、合同编号（若有）；P2；未提交 NM；不可读 UR"
    },
    {
      "key": "F023",
      "label": "draftSourceVersion:version/hash；草稿版次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023；`draftSourceVersion:version/hash`；草稿版次；S2/S3 每次变化；HOST 附件接收回执＋M007/M016；文件哈希、送审时间、version及替换链；P1；缺版本 HD；复用旧件但哈希变化 CF"
    },
    {
      "key": "F024",
      "label": "draftBuyerName:string；合同甲方",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024；`draftBuyerName:string`；合同甲方；S2/S3；DOC M007＋HUM 归口；合同首页当事人、签章页；P2；NM/UR；非学校主体但自称学校采购 HD"
    },
    {
      "key": "F025",
      "label": "draftSupplierName:string；合同乙方名称",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025；`draftSupplierName:string`；合同乙方名称；S2/S3；DOC M007 对照 UP F016；合同首页及签署页；P2；NM/UR；与定标名称不符 CF"
    },
    {
      "key": "F026",
      "label": "draftSupplierCode:string?；合同乙方唯一标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026；`draftSupplierCode:string?`；合同乙方唯一标识；S2/S3（存在时）；DOC M007/M006 对照 UP F017；合同主体信息/营业执照核证；P2；无代码且同名不唯一 HD；错配 CF"
    },
    {
      "key": "F027",
      "label": "draftLineItems:lineItems；标的/数量/规格",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027；`draftLineItems:lineItems`；标的/数量/规格；S2/S3；DOC M007 对照 UP F019；标的清单、报价附件行号；P2；缺明细 NM；与采购结果不符 CF/HD"
    },
    {
      "key": "F028",
      "label": "draftTotalAmount:money；拟签金额/币种",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028；`draftTotalAmount:money`；拟签金额/币种；S2/S3；DOC M007 对照 UP F018；价款条款、总价表及大写金额；P2；缺价 NM；大写小写、包别与结果差 CF"
    },
    {
      "key": "F029",
      "label": "unitPriceAndQuantity:lineItems；数量×单价结构",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029；`unitPriceAndQuantity:lineItems`；数量×单价结构；S2/S3（合同可分项时）；DOC M007，UP M004/M008；价格清单行、单位/税费约定；P2；NA仅不可分项；内算不符 CF，不自行改价"
    },
    {
      "key": "F030",
      "label": "deliveryAndTerm:record；交付、履约期限/地点",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030；`deliveryAndTerm:record`；交付、履约期限/地点；S2/S3；DOC M007，UP M004/M008；履行条款及技术商务要求位置；P2；无强制项与缺件区别处理；重大偏离 HD"
    },
    {
      "key": "F031",
      "label": "paymentAcceptanceClauses:record；付款/验收条款文本事实",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031；`paymentAcceptanceClauses:record`；付款/验收条款文本事实；S2/S3；DOC M007，UP M004/M008；G07只引用；合同价款支付和验收条款；P2；缺条款 NM/HD；只核相符性，不批准付款"
    },
    {
      "key": "F032",
      "label": "contractResponsibleUnitRef:org/decisionRef；业务归口",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032；`contractResponsibleUnitRef:org/decisionRef`；业务归口；S0/S2/S4；HOST 归口决定、M015；SRC-001/009/016；归口机构单号及授权范围；P1；多归口不明 HD/PU；不得由经办人选择覆盖"
    },
    {
      "key": "F033",
      "label": "authorizedSignerRef:actorRef?；预定/实际签署人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033；`authorizedSignerRef:actorRef?`；预定/实际签署人；S4/S5（S2可预填不可信声明）；UP 校方授权 M009，签后 M011；2026授权记录与实际签字页；P2；授权列表不可得 PU/SU/HD"
    },
    {
      "key": "F034",
      "label": "signerAuthorityScope:record(from,to,kind,limit)；签署授权期限范围",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034；`signerAuthorityScope:record(from,to,kind,limit)`；签署授权期限范围；S4/S5；UP M009/M015，SRC-008；授权公告/委托书条款及有效日期；P2；无核验结论 PU/HD，不把表单签名视作权利来源"
    },
    {
      "key": "F035",
      "label": "signedAt:date?；实际签署日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035；`signedAt:date?`；实际签署日；S5/S6；S2只保存拟定日期另属性；UP M011/签章验证；双方签署页/电子签名时戳；P2；未签为 NA；不能提前当缺件；已签无日期 HD"
    },
    {
      "key": "F036",
      "label": "originalContractRef:documentRef；原生效合同基线",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036；`originalContractRef:documentRef`；原生效合同基线；S7/H/I；UP合同档案或核证 M017；合同编号、签章页、原文版次；P2；无原合同 NM/SU；不得把草稿当已签"
    },
    {
      "key": "F037",
      "label": "proposedClauseDiff:diff；逐条拟变更内容",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037；`proposedClauseDiff:diff`；逐条拟变更内容；S3/G/S7/H；DOC M016/M018 对照 M007/017；条款号、前后文本、附件明细与页码；P2；缺对照 NM；模糊/不一致 UR/CF"
    },
    {
      "key": "F038",
      "label": "changeReason:category+text；变更/解除理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F038；`changeReason:category+text`；变更/解除理由；S7/H/I；DOC M018/M022＋HUM；申请说明、对方函/履约证据段落；P2；NM；理由是否成立 HD，不自动判合法"
    },
    {
      "key": "F039",
      "label": "counterpartyPosition:documentRef/status；相对方意思表示",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039；`counterpartyPosition:documentRef/status`；相对方意思表示；S7/H/I（发生时）；DOC M019/M022 核签章；通知或确认函日期、签字位置；P2；尚未同意不预要求；如自称已协商但无证据 NM/HD"
    },
    {
      "key": "F040",
      "label": "cumulativeAdditionalAmount:money?；同标的补充累计金额",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040；`cumulativeAdditionalAmount:money?`；同标的补充累计金额；S7/H且政府采购第49条触发；UP合同台账 M020＋HUM；原合同及各补充协议金额/签署版本；P2；不能取全记录 SU/HD；不得自动判10%许可"
    },
    {
      "key": "F041",
      "label": "procurementHoldStatus:enum；质疑投诉/采购结果暂停状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F041；`procurementHoldStatus:enum`；质疑投诉/采购结果暂停状态；S2前及签前再核、S7变更；UP采购监督/采购机构 M005/M027；质疑暂停通知、权威事件号、有效区间；P2；来源不可达 SU/HD；未查询不等于无质疑"
    },
    {
      "key": "F042",
      "label": "caseEventState:enum；补件/撤回/复核申请状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F042；`caseEventState:enum`；补件/撤回/复核申请状态；S3/E1/E2；HOST事件＋M023/M024/M025；提交、受理、回退、复核时间及Actor；P1；无可信状态 SU/HD；客户自报“撤回成功”无效"
    },
    {
      "key": "F043",
      "label": "formalContractDecisionRef:decisionRef?；正式审签/变更决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F043；`formalContractDecisionRef:decisionRef?`；正式审签/变更决定；S4、S7后续；UP学校合同审批 M010/M021/M026；流程决议ID、签发主体、版本时间；P2；首审前 NA；正式阶段无决定不能冒充批准"
    },
    {
      "key": "F044",
      "label": "applicablePolicyRevision:record；政策依据与校本参数",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F044；`applicablePolicyRevision:record`；政策依据与校本参数；S0/S2/S7；SRC-001/008/009/010/011–014＋HUM；制度标题、文号、条、施行/废止、校本确认人；P1；原文或现行性未知 PU，阈值不启用"
    },
    {
      "key": "F045",
      "label": "evidenceQuality:record；可读性/哈希/签章检测",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F045；`evidenceQuality:record`；可读性/哈希/签章检测；每次上传/读取；HOST文件处理＋各 M；页码、块坐标、错误码、哈希、OCR置信；P2/3；UR/CF；不得凭低置信 OCR 得 PASS_FACT"
    },
    {
      "key": "F046",
      "label": "checkedFingerprint:string；旧检查适用版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F046；`checkedFingerprint:string`；旧检查适用版本；每次预审重算；HOST计划/检查快照；planId、checkId、target、sourceVersion、fingerprint；P1；指纹不匹配则旧事实结论失效重审"
    },
    {
      "key": "F047",
      "label": "authoritySourceAvailability:record；权威源可用性",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F047；`authoritySourceAvailability:record`；权威源可用性；每次引用上游；HOST适配器或人工核证；源名、查询时间、失败原因、替代核证状态；P1；SU；不可自动从旧缓存判当前通过"
    },
    {
      "key": "F048",
      "label": "signedOrSealedRecordRef:record?；签署/用章结果",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F048；`signedOrSealedRecordRef:record?`；签署/用章结果；S5/S6及 S7后续；UP印信/合同系统或核证 M011/M021；电子签章时戳、章位、验证回执；P2/3；首审前 NA；签后验真失败 HD/CF"
    },
    {
      "key": "F049",
      "label": "governmentContractPublishedAt:datetime?；政府采购合同公告时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F049；`governmentContractPublishedAt:datetime?`；政府采购合同公告时点；`S6` 且已确认适用公告义务；AUTH 财政指定媒体当前公告，M012；SRC-012；公告页面唯一 ID、发布时戳、与已签合同对应的版本/敏感附件处理记录；P1/P2；未到 S6→NA；到期应有记录而查不到→SU/NM；例外及是否逾期→HD"
    },
    {
      "key": "F050",
      "label": "governmentContractFiledAt:datetime?；政府采购合同副本备案时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F050；`governmentContractFiledAt:datetime?`；政府采购合同副本备案时点；`S6` 且已确认适用备案义务；AUTH 主管部门备案源，M028；SRC-011；备案受理回执号/确认时点、原合同与副本版本；P1/P2；未到 S6→NA；无法核查→SU；未办或迟办后果→HD"
    },
    {
      "key": "F051",
      "label": "accessGrantForEvidence:record(actor,case,material,scope,validFrom,validTo,issuer)；材料访问授权",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F051；`accessGrantForEvidence:record(actor,case,material,scope,validFrom,validTo,issuer)`；材料访问授权；每次读取受限证据时；HOST 服务端访问控制/信息安全授权，M030；SRC-025；对象与权限策略版本、访问主体、访问审计事件；P2/P3；不能核实→`NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE`；绝不以经办权概括全部材料可见权"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "经办身份、单位、代理范围；校方人事/组织/认证/授权 Owner 的人员与部门授权记录（AUTH）",
      "purpose": "M001；**经办身份、单位、代理范围**；校方人事/组织/认证/授权 Owner 的人员与部门授权记录（AUTH）；`C:S0/S2/E1/E2`；校内经办身份必核；无接口时由校方核验书面委托及人员组织关系；个人自填姓名/学院不能替代；F001–F006,F042；SRC-001/003/008/016；绑定 actorId、unitId、授权生效区间、案卷；缺→SU/HD，证件照片不清→UR/HD，不可越权批准",
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
        "经办身份、单位、代理范围；校方人事/组织/认证/授权 Owner 的人员与部门授权记录（AUTH）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "项目、包和资金前置；T04-T01/采购立项 Owner 的项目审批/采购计划/需求论证决定（AUTH/FILE）",
      "purpose": "M002；**项目、包和资金前置**；T04-T01/采购立项 Owner 的项目审批/采购计划/需求论证决定（AUTH/FILE）；`C:S1/S2`，若尚处 S0 则后续等待；校方有签章/可验证电子回执可替代在线接口；经办预算表不代替有权项目决定；F007–F012,F019；SRC-003/009/010；归属项目+包+批准版本；未形成→前置未完成 NM，源离线→SU，扫描不清→UR",
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
        "项目、包和资金前置；T04-T01/采购立项 Owner 的项目审批/采购计划/需求论证决定（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "采购方式与组织程序权威结论；T04-T02/采招机构的方式批准与程序结果（AUTH/FILE）",
      "purpose": "M003；**采购方式与组织程序权威结论**；T04-T02/采招机构的方式批准与程序结果（AUTH/FILE）；`C:S1/S2`，依采购路径；经签发部门核证的采购方式文件；会议纪要是否有同等效力需 SRC-010 判定；F010,F013,F014；SRC-003/007/010/011；对应项目包、采购方式、决定有效状态；缺→NM/SU/PU，不得用草稿代替",
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
        "采购方式与组织程序权威结论；T04-T02/采招机构的方式批准与程序结果（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "采购文件确定的要求；采招机构/平台持有的招标/磋商/谈判/询价文件及更正文件（AUTH/FILE）",
      "purpose": "M004；**采购文件确定的要求**；采招机构/平台持有的招标/磋商/谈判/询价文件及更正文件（AUTH/FILE）；`C:A/E`；`K:B/C/D/H`（存在、需要比对或已依法要求时）；官方发布/留档的完整版本；商业网站转载不能替代权威采购文件；F009,F010,F013,F019–F021,F027–F031；SRC-011/013；项目包及公告澄清顺序；缺→NM/SU，文件版本冲突→CF，不可读→UR",
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
        "采购文件确定的要求；采招机构/平台持有的招标/磋商/谈判/询价文件及更正文件（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "中标/成交/单位选定结论；政府平台、采招机构或有权单位的通知书/公告/定标文件（AUTH/FILE）",
      "purpose": "M005；**中标/成交/单位选定结论**；政府平台、采招机构或有权单位的通知书/公告/定标文件（AUTH/FILE）；`C:A/B/C/E`；`K:D/G/H`；可核验的中标成交通知、内部有权集体选择决定（仅其法域允许时）；供应商报价不替代定标；F008,F014–F019,F041；SRC-003/005/011–013；与项目包、供应商、金额绑定；尚未形成→前置未完成，源离线 SU，模糊 UR，结果变更 CF",
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
        "中标/成交/单位选定结论；政府平台、采招机构或有权单位的通知书/公告/定标文件（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "供应商唯一身份；政府采购记录/登记机关/供应商营业执照或资格证明（AUTH/FILE）",
      "purpose": "M006；**供应商唯一身份**；政府采购记录/登记机关/供应商营业执照或资格证明（AUTH/FILE）；`K:S2` 仅公告信息不足以识别主体、同名、更名或主体变化时；有权登记机关查询结果／可核证证明；不得仅凭名称相同、对方自行说明放行；F016,F017,F025,F026；SRC-011/014；绑定统一社会信用代码与变更时点；缺→HD/NM，登记源离线 SU，证照不清 UR",
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
        "供应商唯一身份；政府采购记录/登记机关/供应商营业执照或资格证明（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "当次当前拟签合同草稿；承办单位持有的 DOCX/PDF/电子合同文本（FILE）",
      "purpose": "M007；**当次当前拟签合同草稿**；承办单位持有的 DOCX/PDF/电子合同文本（FILE）；`C:A/B/C/E/G`；`K:D` 若平台订单不含可签完整文本；H 用 M018；文书格式可替代（可读电子文本/扫描件），但必须包含足以比对的完整条款和附件；F022–F031；SRC-001/009/011/013；绑定案卷+项目包+sourceVersion，旧版不得覆盖；缺→NM、不可读→UR、与结果相矛盾→CF",
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
        "当次当前拟签合同草稿；承办单位持有的 DOCX/PDF/电子合同文本（FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "成交/中标响应内容；采购档案/投标人响应文件正式归档版（AUTH/FILE）",
      "purpose": "M008；**成交/中标响应内容**；采购档案/投标人响应文件正式归档版（AUTH/FILE）；`C:A/E` 用于实质条款比对；`K:B/C/H` 视程序类型；采招机构提供的可核原档或同版经签章副本；不能以宣传册替代正式响应；F019–F021,F027–F031；SRC-011/013；项目/包/供应商/投标版次；缺→NM/SU，扫描模糊 UR，版本不明 HD",
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
        "成交/中标响应内容；采购档案/投标人响应文件正式归档版（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "当前对外签署授权；党政办公室授权代表公告、委托书及变更/撤销记录（AUTH/FILE）",
      "purpose": "M009；**当前对外签署授权**；党政办公室授权代表公告、委托书及变更/撤销记录（AUTH/FILE）；`K:S4/S5` 必查；S2可提示准备，但**不为初送审上传必需件**；学校即时可核的有效授权记录/临时委托书；2025 名单不能替代 2026 当期授权；F006,F032–F034,F048；SRC-001/008/016；按签署时间、对象、事项范围核验；正文缺失→PU/SU/HD，不可读 UR",
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
        "当前对外签署授权；党政办公室授权代表公告、委托书及变更/撤销记录（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "学校正式订立审批回执；归口/法治/有权审批人的真实流程决定（AUTH/FILE）",
      "purpose": "M010；**学校正式订立审批回执**；归口/法治/有权审批人的真实流程决定（AUTH/FILE）；`L:S4` 才形成，绝不是 S2 必交；真实电子审批记录或核证签章审签表；申请人上传“已批准”字样无效；F032,F043；SRC-001/009/018/019；与**最终待签合同版**一致；未到阶段→NA，审批后来源失联 SU，版本错配 CF",
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
        "学校正式订立审批回执；归口/法治/有权审批人的真实流程决定（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "已签采购合同/用章证据；合同管理/印信档案，电子签章或纸质原件（AUTH/FILE）",
      "purpose": "M011；**已签采购合同/用章证据**；合同管理/印信档案，电子签章或纸质原件（AUTH/FILE）；`L:S5` 首次订立；H/I 的原合同走 M017；核证双方签署并具法律要求的完整版本；草稿或单方签字不能代替已签合同；F035,F048,F022–F031；SRC-001/011/013/014；合同号+签署日期+签章+全文版；S2没有→NA；已宣称签署却无原件→NM/HD",
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
        "已签采购合同/用章证据；合同管理/印信档案，电子签章或纸质原件（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "政府采购合同公告记录；财政指定媒体、采购机构公告（AUTH）",
      "purpose": "M012；**政府采购合同公告记录**；财政指定媒体、采购机构公告（AUTH）；`L:S6`，仅已签且法规适用时；官方公告页及保留公告版本；**不能替代备案回执 M028**；F035,F047,F049；SRC-002/005/012；归属已签合同/公告版本与实际发布时间；首次送审→NA，平台不可核→SU；保密例外请有权人裁量",
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
        "政府采购合同公告记录；财政指定媒体、采购机构公告（AUTH）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "平台订单/电子交易/直接选定记录；政府电子卖场或授权交易平台（AUTH/FILE）",
      "purpose": "M013；**平台订单/电子交易/直接选定记录**；政府电子卖场或授权交易平台（AUTH/FILE）；`C:D`；其他情形 NA；可核的官方订单/合同和交易回执；单独截图需由平台/采购部门核证；F007–F010,F013–F020,F022；SRC-005/010/011；绑定订单号/包号/商品及交易时戳；缺→NM/SU，截屏差异→CF，平台不明→PU",
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
        "平台订单/电子交易/直接选定记录；政府电子卖场或授权交易平台（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "自主/非政采过程选择的集体决定或程序记录；有权采购需求单位持有的会议纪要、报价评议与成交决定（AUTH/FILE）",
      "purpose": "M014；**自主/非政采过程选择的集体决定或程序记录**；有权采购需求单位持有的会议纪要、报价评议与成交决定（AUTH/FILE）；`C:C` 按当前程序，`K:B` 按方式，`NA` 于不需此过程者；是否法定必需待 SRC-010；仅有权签发的正式采购选择结论/批准件可能替代；三家报价本身不能证明已经集体定标；F013,F014,F016–F019；SRC-003/007/010；需签发主体、会议/程序日期、项目包；缺→PU/NM/HD，纪要不清 UR",
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
        "自主/非政采过程选择的集体决定或程序记录；有权采购需求单位持有的会议纪要、报价评议与成交决定（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "跨归口/二次划拨与基层授权依据；原归口单位和被授权单位的委托/划拨/审批记录（AUTH/FILE）",
      "purpose": "M015；**跨归口/二次划拨与基层授权依据**；原归口单位和被授权单位的委托/划拨/审批记录（AUTH/FILE）；`C:F`，叠加原 A–E 基础集；有权部门签章/可核电子授权+经费划拨决定；学院“自行管理经费”说明不等于合同签署授权；F005,F006,F011,F032–F034；SRC-001/009；双方单位、事项、授权区间和责任边界；缺→HD/PU，若与授权公示冲突 CF",
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
        "跨归口/二次划拨与基层授权依据；原归口单位和被授权单位的委托/划拨/审批记录（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "签前修订差异；承办单位的逐条红线/修改清单、新旧草稿（FILE）",
      "purpose": "M016；**签前修订差异**；承办单位的逐条红线/修改清单、新旧草稿（FILE）；`C:G`，与新版 M007 配套；完整可复算的文本版本差异可替代人工红线表；不能用“仅微调”口述替代比较；F022,F023,F027–F031,F037,F046；SRC-001/013；旧/新源版本及条款号；缺→NM，旧版被覆盖→HD，无法读取→UR",
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
        "签前修订差异；承办单位的逐条红线/修改清单、新旧草稿（FILE）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "已签原合同基线；合同管理/归档机构原合同（AUTH/FILE）",
      "purpose": "M017；**已签原合同基线**；合同管理/归档机构原合同（AUTH/FILE）；`C:H/I`，仅 S7；由 M011 已存原合同的可信引用或原归口档案核证，避免重复上传；拟签草稿不能代替；F035,F036,F037,F040；SRC-001/011/014；原合同号、签订日、全部附件与章；缺→NM/SU，原文不完整 UR/HD",
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
        "已签原合同基线；合同管理/归档机构原合同（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "变更申请与理由；合同承办单位提交的变更申请、条款/范围/金额/期限差异（FILE/NOTE）",
      "purpose": "M018；**变更申请与理由**；合同承办单位提交的变更申请、条款/范围/金额/期限差异（FILE/NOTE）；`C:H`；S7变更，I解除另走 M022；申请系统中的完整变更字段+文件可替代自拟说明；仅供应商发函不能替代校内立项申请；F002,F037–F040；SRC-001/009/011/014；关联原合同与新方案版，写明发起时点；缺→NM，事实无法证实 HD",
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
        "变更申请与理由；合同承办单位提交的变更申请、条款/范围/金额/期限差异（FILE/NOTE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "合同相对方变更意见或协商证明；供应商/合同对方的确认函、签章/通讯证据（FILE）",
      "purpose": "M019；**合同相对方变更意见或协商证明**；供应商/合同对方的确认函、签章/通讯证据（FILE）；`K:H/I`，**对方明确作出意思表示之后**，不得要求申请之初凭空产生；可核法律认可的双方意思表示或通信原件；意向沟通≠已签补充合同；F039,F037；SRC-001/011/014；绑定双方、原合同和发送接收时间；若申请声称已同意但无件→NM/HD，签章不清 UR",
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
        "合同相对方变更意见或协商证明；供应商/合同对方的确认函、签章/通讯证据（FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "政府采购同标的补充累计情况；合同台账和历次补充协议（AUTH/FILE）",
      "purpose": "M020；**政府采购同标的补充累计情况**；合同台账和历次补充协议（AUTH/FILE）；`K:H`，触发政府采购法第49条情形时当前需核；其他 NA；学校合同档案/财政监管台账可替代逐件上传，但须能核累计完整性；F036,F037,F040,F044；SRC-011；按原合同、各补充编号及币种汇总；源不完整→SU/HD，超限疑义不能自动判否",
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
        "政府采购同标的补充累计情况；合同台账和历次补充协议（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "变更审批及补充协议签署/用章结果；合同归口和签章档案（AUTH/FILE）",
      "purpose": "M021；**变更审批及补充协议签署/用章结果**；合同归口和签章档案（AUTH/FILE）；`L:S7` 正式决定后才形成；有权合同管理/法治工作流或核证签章原件；供应商盖章不足以替代学校决定；F034,F043,F048；SRC-001/009/011/014；绑定原合同和拟变更版、有效决定、签署人；申请时 NA，后续缺→HD",
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
        "变更审批及补充协议签署/用章结果；合同归口和签章档案（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "解除要求/争议或履约事实；承办单位和对方持有的通知、往来函件、送达、履约证据（FILE）",
      "purpose": "M022；**解除要求/争议或履约事实**；承办单位和对方持有的通知、往来函件、送达、履约证据（FILE）；`C:I`，收到通知/有实际争议时；依法可核的电子送达/纸质函/其他事实证据；未发生的违约证明不能预先要求；F036,F038,F039；SRC-001/014；绑定通知方、送达时点、合同和证据时间；缺→NM，口头通知先可记录但真实性 HD",
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
        "解除要求/争议或履约事实；承办单位和对方持有的通知、往来函件、送达、履约证据（FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "撤回申请事件；申请经办人员在校内可信系统提出的撤回请求（AUTH/NOTE）",
      "purpose": "M023；**撤回申请事件**；申请经办人员在校内可信系统提出的撤回请求（AUTH/NOTE）；`K:E1/J`，仅实际申请撤回才需要；经学校验证的书面撤回请求可作输入；不证明撤回已生效；F003,F004,F006,F042；SRC-001/006/018；归属未签当前案卷/阶段；请求缺→不触发，已签仍称撤回→HD",
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
        "撤回申请事件；申请经办人员在校内可信系统提出的撤回请求（AUTH/NOTE）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "补件/材料版本更新；承办单位或有权源 Owner 新证据（FILE/AUTH）",
      "purpose": "M024；**补件/材料版本更新**；承办单位或有权源 Owner 新证据（FILE/AUTH）；`K:S3/J`，发生补件才需；上游权威记录直接修正优于再次上传；补件仅覆盖明示字段；F023,F037,F042,F045,F046；SRC-001/003；原 M id、替换原因与新 hash；不提供→原待办继续，读不出→UR",
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
        "补件/材料版本更新；承办单位或有权源 Owner 新证据（FILE/AUTH）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "复核请求与争议指向；承办人/有权复核发起者的争议说明和新依据（AUTH/NOTE）",
      "purpose": "M025；**复核请求与争议指向**；承办人/有权复核发起者的争议说明和新依据（AUTH/NOTE）；`K:E2/J`，实际发起事实复核时；校内可信工作流受理/签章申诉可替代自由文本；不能替代政府采购法定投诉；F003,F006,F042,F046；SRC-001/011/012；绑定原事实检查ID、争议点与版本；未发起→NA，来源冲突→CF/HD",
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
        "复核请求与争议指向；承办人/有权复核发起者的争议说明和新依据（AUTH/NOTE）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "法务/归口实体处理决定；学校有权法治/合同管理及司法处理记录（AUTH/FILE）",
      "purpose": "M026；**法务/归口实体处理决定**；学校有权法治/合同管理及司法处理记录（AUTH/FILE）；`L:I/H` 的正式处理阶段，不能初次要求；只有权威决定/法院仲裁文书及可验证回执；AI建议或经办人意见无替代效力；F038,F043,F048；SRC-001/009/014/016；记录决定机构、日期、适用合同及生效性；决定前 NA，权威源失联 SU",
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
        "法务/归口实体处理决定；学校有权法治/合同管理及司法处理记录（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M027",
      "name": "采购质疑/投诉影响合同状态的暂停/解除暂停记录；采购机构/财政主管部门权威记录（AUTH/FILE）",
      "purpose": "M027；**采购质疑/投诉影响合同状态的暂停/解除暂停记录**；采购机构/财政主管部门权威记录（AUTH/FILE）；`K:S2/S5`，如有质疑或需核是否暂停；核验动作必做，申请人文件不必强要；有权财政/采购机构的有效通知或在线状态；仅申请人声明“无投诉”不等价；F014,F041,F047；SRC-011/012；项目包、事件范围和生效区间；来源不能查→SU/HD，已暂停但仍申报签约→CF",
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
        "采购质疑/投诉影响合同状态的暂停/解除暂停记录；采购机构/财政主管部门权威记录（AUTH/FILE）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M028",
      "name": "政府采购合同副本备案回执；同级政府采购监督管理部门及有关部门可信备案记录（AUTH）",
      "purpose": "M028；**政府采购合同副本备案回执**；同级政府采购监督管理部门及有关部门可信备案记录（AUTH）；`L:S6`，只在已签且法定备案条件成立时；主管部门可核验备案/收件回执与合同副本，**公告 M012 不代备案**；F035,F047,F050；SRC-011；绑定已签版本、签署日、备案日期、受理主体及编号；S2→NA，来源无法查询→SU，逾期与例外由有权主管人处理",
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
        "政府采购合同副本备案回执；同级政府采购监督管理部门及有关部门可信备案记录（AUTH）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M029",
      "name": "撤回获准/不准的有权工作流事件；合同审批流程 Owner 的决定回执（AUTH）",
      "purpose": "M029；**撤回获准/不准的有权工作流事件**；合同审批流程 Owner 的决定回执（AUTH）；`L:E1`，收到撤回请求之后才可能形成；校方有权系统事件或经签发者核证纸面回执；经办人 M023 请求不能代替；F003,F042,F043；SRC-001/009/018；绑定旧送审版、案件和有权签发者及生效时点；未决→NA，已声称确认但回执源离线→SU，效力疑义 HD",
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
        "撤回获准/不准的有权工作流事件；合同审批流程 Owner 的决定回执（AUTH）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M030",
      "name": "受限证据的访问授权/审计记录；服务端身份及信息安全 Owner（AUTH）",
      "purpose": "M030；**受限证据的访问授权/审计记录**；服务端身份及信息安全 Owner（AUTH）；`K:所有阶段`，仅在读取 P2/P3 或法定限制证据时；有权系统的最小必要读取授权及访问日志；截图/前端隐藏按钮不是许可；F004–F006,F045,F051；SRC-025；actor+case+material+purpose+validRange/策略版本；无授权不得为自动核查取原文；缺权威源 SU/HD",
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
        "受限证据的访问授权/审计记录；服务端身份及信息安全 Owner（AUTH）"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 路由与采购前置（R001–R010）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "事项属于采购合同而非相邻合同",
          "requirement": "**R001 事项属于采购合同而非相邻合同**；S0/S2/S7；T=拟订立采购货物/服务/工程合同或变更；F=经有权归口认定为纯科研技术／非采购合同；U=合同性质混合不明；SRC-001,SRC-009,SRC-013；F002,F009,F010,F032；M002,M007,M017；对照目的条款、采购前置 ID、归口权威决定 T0/T1；以发起日或原合同签订日对应法域判，科研经费购买货物不自动等于科研合同；T 且路由依据齐→核后 PASS；F→NA 并路由 T03/T07；U→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；合同归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "校内经办主体与事项代理权",
          "requirement": "**R002 校内经办主体与事项代理权**；S0/S2/E1/E2/S7；T=校内主体提交或代理；F=已确认非本案申请；U=身份/代理关系无可信凭据；SRC-001,SRC-003,SRC-009；F003–F006；M001,M015；HOST/T0 身份、单位、代理授权的生效日/范围与当前事件对照；证照 OCR/T2 仅证明文本，不授权；继任经办人需另核；对齐→核后 PASS；无权限→`NEEDS_HUMAN_DECISION`，矛盾→`CONFLICT`，源离线→`SOURCE_UNAVAILABLE`；校内组织/授权 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "项目、采购包、当前合同证据归属",
          "requirement": "**R003 项目、采购包、当前合同证据归属**；S1/S2/S7；T=有采购项目、合同或包需关联；F=不属于本 ID；U=包号/合同关系不可识别；SRC-003,SRC-005,SRC-011；F001,F007,F008,F022；M002,M005,M007,M017；同一项目/包 ID、采购人、合同/原合同 ID 与文件元数据逐一对照，保留 sourceVersion；平台无分包有权证明则包号 NA；一致→核后 PASS；跨包→`CONFLICT`；缺现有材料→`NEEDS_MATERIAL`，权威源失联→`SOURCE_UNAVAILABLE`；承办单位／采购归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "政采、非政采及招标法域识别",
          "requirement": "**R004 政采、非政采及招标法域识别**；S0/S1/S2/S7；T=已有归口对适用法域的结论；F=明确非本合同；U=仅由合同金额、名称或资金猜测；SRC-001,SRC-009,SRC-010,SRC-011,SRC-013；F009–F011,F044；M002,M003,M004,M013；以项目类别、经费、采购方式正式权威 T0/T1 判**可并行适用**的法域；时间按采购发起、招标/签约节点；不由 2023 历史阈值自动切分；有权法域结论可核→核后 PASS；U→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；采购归口／法治部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "需求/项目立项前置决定存在且有效",
          "requirement": "**R005 需求/项目立项前置决定存在且有效**；S1/S2；T=该采购路径依法校内应有立项且已进入送签；F=有权确认不须单独立项；U=学校例外不明；SRC-001,SRC-003,SRC-009；F007,F011,F012；M002；从 T04-T01 T0/T1 核项目/包、审批状态/签发者、有效版本与拟签标的一致；S0 尚未走采购程序不先索正式决定；一致→核后 PASS；尚未形成→`NEEDS_MATERIAL`（**上游待形成**）；旧决定撤销→`CONFLICT`；归口/上游 T04-T01",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "采购方式与自主选定程序引用",
          "requirement": "**R006 采购方式与自主选定程序引用**；S1/S2；T=方式决定或自主采购选定已产生；F=有权认定平台简化路径不需该独立文件；U=适用程序/权限不明；SRC-003,SRC-007,SRC-010；F010,F013,F014；M003,M014；比对 T04-T02 的方式审批/有权会议决定/程序记录的签发人、编号和日期（T0/T1）；报价单不能当成交决定；2023 供应商数不作现行硬线；可信相符→核后 PASS；程序文件缺→`NEEDS_MATERIAL`，校本条件不明→`POLICY_UNCONFIRMED`；T04-T02／采购组织主体",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "中标/成交及选择结果当前效力",
          "requirement": "**R007 中标/成交及选择结果当前效力**；S1/S2/S7；T=已有选择结果用于合同订立/变更；F=有权确认该交易依法不走单独定标；U=未获决定当前状态；SRC-003,SRC-011,SRC-013；F014–F018,F047；M003,M005,M014；对照结果决定、通知日期、供应商、包、金额与状态，区分公开公告与正式选择决定；T0/T1 当前有效版本，旧公告不能覆盖撤销；正确→核后 PASS；尚未形成→`NEEDS_MATERIAL`（上游）；状态源失联→`SOURCE_UNAVAILABLE`；采购归口/T04-T02",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "质疑投诉暂停与采购结果变动",
          "requirement": "**R008 质疑投诉暂停与采购结果变动**；S2签前/S5/S7；T=政府采购或有正式暂停/更正事件；F=经权威确认法域及暂停核查不触发；U=仅有历史“无投诉”自述/查询失败；SRC-011,SRC-012；F014,F041,F047；M005,M027；查询有效时点的暂停/解除暂停、影响包和时间区间；政府采购 T0 或合法 T1，未查询不是无质疑，未出现实际暂停记录不能反向证明绝不存在；当前无阻断且权威核证→核后 PASS（仅状态事实）；暂停/结果冲突→`CONFLICT/NEEDS_HUMAN_DECISION`，离线→`SOURCE_UNAVAILABLE`；采招/监管主体",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "官方平台订单与独立合同关系",
          "requirement": "**R009 官方平台订单与独立合同关系**；S1/S2（D 情形）；T=使用网上商城/直接选定交易；F=不使用平台路径；U=只有截图不能定位平台订单；SRC-005,SRC-010,SRC-011；F007,F013,F014,F022；M002,M013,M007；核官方订单号、采购方、供应商、交易时间和完整合同/协议文本是否存在；T0/T1 平台回执优先，截图 T2 不等于订单生效或审签完成；有效事实→核后 PASS；F→NA；截图不可验证→`SOURCE_UNAVAILABLE`；是否另签→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；采购归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "招标/采购文件与响应的有效版本",
          "requirement": "**R010 招标/采购文件与响应的有效版本**；S2/A/E，或 B/C/H 依法形成该档案时；T=依法须按文件/响应比对；F=有权确认该程序不产生此材料；U=版本/法域不明；SRC-011,SRC-013；F019–F021；M004,M008；比对公告澄清版、最终招标/磋商文件及投标/成交响应的项目包、签发/提交时间、附件页，取采购档案 T0/T1；未归档宣传册不可替代；版本相符→核后 PASS；错版→`CONFLICT`；当前需用但缺→`NEEDS_MATERIAL`，源断→`SOURCE_UNAVAILABLE`；采购档案 Owner",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "08.3 合同事实、审批与签署（R011–R022）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R011",
          "title": "中标与合同乙方为同一法律主体",
          "requirement": "**R011 中标与合同乙方为同一法律主体**；S2/S3；T=结果已指向供应商且合同拟指定相对方；F=法定无独立中标相对方的路径；U=名称相同但代码/更名链不明；SRC-011,SRC-013,SRC-014；F016,F017,F025,F026；M005,M006,M007；官方结果 T0/T1 比营业登记及合同 T2 的统一代码/更名时点；名称 OCR 相同不足以通过，法人合并/承继须人核；相符→核后 PASS；代码相悖→`CONFLICT`；身份承继争议→`NEEDS_HUMAN_DECISION`；采招机构/法治",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "采购合同甲方与学校有权主体一致",
          "requirement": "**R012 采购合同甲方与学校有权主体一致**；S2/S3；T=草稿声明学校或所属主体为采购方；F=不属采购合同；U=独立法人子单位/代理签约权不明；SRC-001,SRC-009,SRC-016；F024,F032,F006；M001,M007,M015；合同抬头、学校法律主体与归口授权比对，采购代理执行不等于代理有对外签署权；T0/T1 归口优于草稿 T2；对应事实相符→核后 PASS；主体冲突→`CONFLICT`；独立法人/代理权未知→`NEEDS_HUMAN_DECISION`；合同归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "标的/规格数量与成交、采购需求一致",
          "requirement": "**R013 标的/规格数量与成交、采购需求一致**；S2/S3；T=有逐项可比采购结果和合同；F=经确认合同不含该项目包；U=清单附件缺损或无法对应；SRC-011,SRC-013；F019,F027,F020；M004,M005,M007,M008；按包、行号、单位、型号、数量、规格以 T0/T1 原采购文件/响应比 T2 草稿；修订澄清版优先，差异“实质性”由法治认定；全部可比项一致→核后 PASS；不一致→`CONFLICT`；范围是否允许变更→`NEEDS_HUMAN_DECISION`；承办人/采招/法治",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "合同总价、币种及分项算术与中标价一致",
          "requirement": "**R014 合同总价、币种及分项算术与中标价一致**；S2/S3；T=可从结果与合同核金额；F=明示非价款型且有权确认该核验不适用；U=币种/税费/分包口径未明；SRC-011,SRC-013；F018,F028,F029；M005,M007,M008；按包/币种/税费口径比大写小写与分项乘积、结果价；T0/T1 对 T2，计算只证明数字一致，不决定变价许可；一致→核后 PASS；冲突→`CONFLICT`，附件缺→`NEEDS_MATERIAL/UNREADABLE`；采购归口与合同承办人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "履行、付款和验收约定的文本一致性",
          "requirement": "**R015 履行、付款和验收约定的文本一致性**；S2/S3；T=合同有履约/付款/验收条款且采购文件规定内容；F=有权确认某具体条款不适用；U=条款缺失或采购文件效力不明；SRC-001,SRC-011,SRC-013；F030,F031；M004,M007,M008；比期限、地点、履约范围和支付/验收**合同约定**，按采购文件有效版本逐条标页/条；不审核发票、验收是否实际完成或款项可付；文本一致→核后 PASS；不符→`CONFLICT`，可否偏离→`NEEDS_HUMAN_DECISION`；承办单位/合同归口，执行环节路由 G07",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "当前送审合同版本、附件与差异完整",
          "requirement": "**R016 当前送审合同版本、附件与差异完整**；S2/S3/G；T=已有拟签合同或换版；F=平台标准订单且无需另签合同（校本确认）；U=哈希/主附件归属不明；SRC-001,SRC-009,SRC-014；F022,F023,F037,F045,F046；M007,M016,M024；对同一案卷哈希、全文、附件、红线差异、旧新版本；保存 `replacesMaterialId`/检查指纹，T2 文件只抽事实，换版立即使旧依赖结论失效；可追溯→核后 PASS；缺新稿/差异→`NEEDS_MATERIAL`，旧结论误沿用→`CONFLICT`；案卷 Owner/承办人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "多归口与二次划拨的承办授权",
          "requirement": "**R017 多归口与二次划拨的承办授权**；S0/S2（F 叠加情形）；T=跨归口/基层受委托/二次划拨；F=权威单一归口且无委托；U=院系口头认可、授权范围不清；SRC-001,SRC-009；F005,F006,F011,F032；M001,M015；对照授权起止、事项范围和经费决定来源 T0/T1；与 R019 签署代表授权分离；不由资金余额推定审批权；授权事实相符→核后 PASS；F→NA；范围不明→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；合同综合管理/原归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "正式审签决定与当前合同版绑定",
          "requirement": "**R018 正式审签决定与当前合同版绑定**；S4 或签后复核；T=进入正式校内合同会签；F=S2/S3 尚未进入 S4；U=现行分级/签发机构无法确证；SRC-001,SRC-009,SRC-016；F032,F043,F044；M010,M015；校方 T0/T1 的审批事件号、签发主体、版本、日期与**最后一版合同**匹配；本轮无 SRC-009 全文，不启用固定会签角色/金额门槛；S2/S3→NA（后生）；可证事实→核后 PASS；授权/会签规则未知→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；真实归口/法治审批人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "签署代表授权与签约时点适配",
          "requirement": "**R019 签署代表授权与签约时点适配**；S4/S5；T=待核具体签署人或已有签署事实；F=S2 尚未要求签署；U=2026授权公告正文及撤销链不明；SRC-008,SRC-009,SRC-016；F033,F034；M009,M011；依据合同性质、签署日期、代表身份及金额/范围核有效授权 T0/T1，禁止从 Renderer actor、旧名单或对方盖章推定；历史签约用历史授权时点；签署身份与范围核实→核后 PASS（**不等于批准签约**）；未核→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；校方印信/授权管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "签署用章事实与合同版本真实性",
          "requirement": "**R020 签署用章事实与合同版本真实性**；S5/S6，或 H/I 核历史原件；T=声称已签或进入签章环节；F=S2 未签；U=签章页无法查真；SRC-001,SRC-011,SRC-014；F035,F043,F048；M010,M011；对双方签字/电子签章时间、盖章、整本文本和 S4 审签版，采用权威合同/印信台账 T0/T1；单方盖章、文件名“已签”不等于合同成立或生效；可证明签署事实→核后 PASS；版次冲突→`CONFLICT`；效力争议→`NEEDS_HUMAN_DECISION`；印信部门/法治",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "法律特定签约期限事实",
          "requirement": "**R021 法律特定签约期限事实**；S5/S6；T=经 R004 确认政府采购或依法必须招标且已有通知/签约日；F=有权证实非此法域；U=通知/签约日期未形成或法域不明；SRC-011,SRC-013；F010,F015,F035；M005,M011；对通知书与双方签署日期按各法第46条分别计算 30 日；时间/生效版本 T0/T1；在 S2 尚未签时只**提示**日期节点，不标缺 M011；已签期限内可核→核后 PASS；超期事实→`NEEDS_HUMAN_DECISION`（后果由有权者认定）；U→`SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED`；采购归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "政府采购签后合同公告时点",
          "requirement": "**R022 政府采购签后合同公告时点**；S6；T=政府采购合同已签并适用公告义务；F=未签/非该法域；U=签署日、公告源或例外未核；SRC-012；F010,F035,F047,F049；M011,M012；已签合同版本、签署时点对财政指定媒体公告 ID/时点；实施条例第50条签后2工作日；涉密和商业秘密例外先由有权人核，不公开受限内容；正式公告事实且时点可比→核后 PASS；源断→`SOURCE_UNAVAILABLE`；逾期及例外后果→`NEEDS_HUMAN_DECISION`；采购归口/公告 Owner。备案**独立 R033**",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-4",
      "name": "08.4 变更、解除、撤回与证据管理（R023–R032）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R023",
          "title": "已签原合同与拟变更差异的基线",
          "requirement": "**R023 已签原合同与拟变更差异的基线**；S7（H 情形）；T=对已签原合同提出变更/补充；F=只修改尚未签署草稿（转 R016）；U=原合同签章或版本不明；SRC-001,SRC-014；F036,F037,F038；M017,M018；T0/T1 原合同全文+附件与当前 M018 逐条 diff，核合同号、双方、时间；原合同不允许被申请人替换为新草稿；基线可核且差异完整→核后 PASS；无原件→`NEEDS_MATERIAL/SOURCE_UNAVAILABLE`，差异模糊→`UNREADABLE`；承办人/合同档案",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "校内变更申请理由的存在与原合同归属",
          "requirement": "**R024 校内变更申请理由的存在与原合同归属**；S7/H；T=承办单位确实提出变更；F=非变更；U=申请理由/提交权未核；SRC-001,SRC-009,SRC-014；F036–F038；M001,M017,M018；对照申请人授权、原合同号、变更文本/理由发生日期；核理由**陈述事实**，不判断充分性或批准变更；可追溯→核后 PASS；材料缺→`NEEDS_MATERIAL`，理由成立/变更权限→`NEEDS_HUMAN_DECISION`；承办单位/归口。对方意思表示另 R034",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "政采同标的补充累计金额比例",
          "requirement": "**R025 政采同标的补充累计金额比例**；S7/H；T=经 R004确认为政府采购且拟援引第49条追加例外；F=非该例外；U=原合同/历次补充价款不全；SRC-011；F010,F036,F040,F044；M017,M018,M020；T0/T1 台账汇总**所有历次补充采购金额**，同币种同税额口径除以原合同采购金额，保留每项来源；只算金额这一事实，适用同标的由 R035、其他条款不变由 R041 核；比例≤10%且累计完整→仅金额事实 `PASS_FACT`；超过10%→`CONFLICT`（与第49条上限不符）并交法治处理，决不自动补签；台账不全→`SOURCE_UNAVAILABLE/NEEDS_MATERIAL`；采购归口/法治",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "变更正式审签决定与拟变更版本绑定",
          "requirement": "**R026 变更正式审签决定与拟变更版本绑定**；S7/正式审签节点；T=有权流程已形成变更决定；F=初次变更申请尚未审签；U=审批权限不明；SRC-001,SRC-009；F034,F036,F037,F043,F044；M017,M018,M021；核学校权威决定号/签发人/签发时点、原合同号与**所批准的拟变更版**匹配；初申请不预要求后置 M021；真实决定事实匹配→核后 PASS；版本矛盾→`CONFLICT`；权限不明→`POLICY_UNCONFIRMED`；合同归口/法治。补充协议签署另 R036",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "解除或履约争议通知的收到/送达事实",
          "requirement": "**R027 解除或履约争议通知的收到/送达事实**；S7/I；T=实际有解除/争议通知；F=经权威确认未发生；U=送达和通知真实性不明；SRC-001,SRC-014；F036,F038,F039；M017,M022；对原合同及通知发送/接收双方、送达证据、时间、事项定位；只核通知发生，不推定解除效果；可核通知→核后 PASS；不可读→`UNREADABLE`，已收但内容冲突→`CONFLICT`；合同归口/法治。最终处置另 R037",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "可信撤回申请事件的真实性",
          "requirement": "**R028 可信撤回申请事件的真实性**；E1/J；T=身份验证经办人对未签送审请求撤回；F=无请求/已签后转 I；U=当前状态或代理人不明；SRC-001,SRC-006,SRC-018；F003–F006,F042；M001,M023；核 Host actor、案卷送审版、请求时点与归属；“提交撤回”仅证请求，不等于撤回获准；请求可信→核后 PASS；身份不明→`SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION`；合同工作流。确认生效另 R038",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "补件与新版本影响集重审",
          "requirement": "**R029 补件与新版本影响集重审**；S3（J/G情形）或 S7（H情形）；T=有新材料/来源更正/草稿换版；F=无补件事件；U=替换链或依赖关系不明；SRC-001,SRC-009；F023,F037,F045,F046；M007,M016,M024；对 `old/new hash+materialId+sourceVersion+fieldDiff` 建依赖集，标记旧相关检查 `SUPERSEDED` 并生成新 Run；上游决定变动也触发下游复核，不无故全案重做；影响集完整→核后 PASS（只表示变更可追踪）；链丢失→`CONFLICT/NEEDS_HUMAN_DECISION`；案卷 Owner/承办人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "事实复核请求、原问题与新依据关联",
          "requirement": "**R030 事实复核请求、原问题与新依据关联**；E2（J 情形）；T=原经办人/有权人提出事实异议及新证据；F=未请求复核；U=申请权限/复核时限未核；SRC-001,SRC-006,SRC-018,SRC-019；F003,F006,F042,F046；M025,M024；绑定旧 `ruleId/checkId/targetId/runId/sourceVersion` 与新材料，核复核人真实身份；不等同政府采购供应商质疑/投诉；决定再审的正式权限另核；请求与证据关联→核后 PASS；能否重开审批→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；归口复核员/原决定 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "当期校本政策及授权表单可核性",
          "requirement": "**R031 当期校本政策及授权表单可核性**；S0/S2/S4/S7/E1/E2；T=将校本审签级别/权限或表单列为硬条件；F=纯文本事实核对不需校本阈值；U=2024 原文/2026 授权/现行表单缺失；SRC-001,SRC-008,SRC-009,SRC-010,SRC-018,SRC-019；F032,F034,F044,F047；M009,M010,M015；必须留文件文号、条/页、施行/废止日、适用合同类别、决定机构和确认人；2021 表单索引仅历史 T2 线索，不能当现行政策 T0；完整现行来源及角色核定方可核后 PASS；否则`POLICY_UNCONFIRMED`；合同管理/法治校本政策维护者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "材料内容可读性与原版完整性",
          "requirement": "**R032 材料内容可读性与原版完整性**；各阶段；T=证据材料被该条目标引用；F=本案不引用；U=页缺失/OCR低可信/文件损坏；SRC-001,SRC-014；F023,F045；M007,M017,M022,M024；文件哈希、页数、关键条款坐标与原件对照，OCR抽取不等于原件真实；仅判**可否可靠抽取特定字段**；原文可读→核后 PASS；不清晰→`UNREADABLE`；材料 Owner。权威源在线性另 R039，敏感权限另 R040",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-4a",
      "name": "08.4a 第四轮拆分后的独立事实规则（R033–R041）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "R033",
          "title": "政府采购合同副本备案时间",
          "requirement": "**R033 政府采购合同副本备案时间**；S6；T=已签且政府采购法第47条备案义务成立；F=非该法域/未签；U=真实备案状态不可查；SRC-011；F010,F035,F047,F050；M011,M028；依据签署日、备案回执受理时点、已签合同副本版，分别记录7**工作日**时限事实；公告 M012 不替代备案；时间事实可核→`PASS_FACT`；F→`NOT_APPLICABLE`；U/权限不足→`SOURCE_UNAVAILABLE`；期限异常→`NEEDS_HUMAN_DECISION`；采购归口/备案 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "合同相对方实际意思表示的存在和归属",
          "requirement": "**R034 合同相对方实际意思表示的存在和归属**；S7/H/I；T=申请声称已获得对方同意、拒绝或收到意思表示；F=尚未协商/无须先有表示的提出阶段；U=来源或签发身份不明；SRC-014；F036,F037,F039；M017,M019,M022；比函件收发时间、相对方主体、原合同号、签章/通信可信核证；绝不把初次变更申请的未来同意函视缺件；真实表示→`PASS_FACT`；声称已发生但无件→`NEEDS_MATERIAL`；主体不符→`CONFLICT`；法律效果→`NEEDS_HUMAN_DECISION`；合同归口/法治",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "政采第49条补充是否为原合同同标的",
          "requirement": "**R035 政采第49条补充是否为原合同同标的**；S7/H；T=拟援引同标的追加；F=非政采或未追加；U=原标的/拟追加内容不清；SRC-011；F010,F027,F036,F037；M017,M018,M020；比原采购合同的**标的法律/技术身份**与本次拟追加标的，按原项目包、清单与合同基线定位；累计金额由 R025、其他条款未变由 R041 另核；同标的证据可核→`PASS_FACT`；新增/替换不同标的→`CONFLICT`；同一性争议→`NEEDS_HUMAN_DECISION`；采购归口/法治",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "补充协议实际签署/用章事实",
          "requirement": "**R036 补充协议实际签署/用章事实**；S7/H 正式审签以后；T=有权变更决定已形成并声明补充协议签署；F=仍在初次变更送审；U=签署版/代表授权不可核；SRC-001,SRC-009,SRC-011,SRC-014；F034,F036,F043,F048；M017,M021,M009；比原合同号、最终补充协议版、签署日、双方签章和授权范围；与 R026 的**审签决定**分别校验，不以供应商单章作为学校批准；签署事实可核→`PASS_FACT`；版次不符→`CONFLICT`；授权不可核→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；印信/合同管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "解除/争议的权威实体处理决定存在",
          "requirement": "**R037 解除/争议的权威实体处理决定存在**；S7/I 实体处理以后；T=有正式学校处理、司法或仲裁结果；F=仅收到解除通知、尚无处理；U=决定来源/效力不明；SRC-001,SRC-014,SRC-016；F036,F038,F043,F048；M017,M022,M026；只核真实决定来源、签发时点、合同号、决定类型与有效状态；**不独立裁断违约、解除生效、赔偿**；有权文书可核→事实 `PASS_FACT`；未到阶段→`NOT_APPLICABLE`；权威源断→`SOURCE_UNAVAILABLE`；效力争议→`NEEDS_HUMAN_DECISION`；法治/裁判机关",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R038",
          "title": "撤回是否被有权工作流确认",
          "requirement": "**R038 撤回是否被有权工作流确认**；E1/J 请求之后；T=撤回已进入有权处理节点；F=尚无请求或只是申请录入；U=审批权限/回执不可查；SRC-001,SRC-009,SRC-018；F003,F004,F042,F043；M023,M029；比申请事件与独立确认/不准事件的签发者、时间、阶段、合同当前状态及请求版；M023 本身只证明申请；确认事实可核→`PASS_FACT`（只证明工作流事件）；未决→`NOT_APPLICABLE` 于“结果已存在”检查、案卷仍 `WITHDRAW_REQUESTED`；无权/未知→`POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION`；原审批 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R039",
          "title": "权威采购来源当前可用性与时点",
          "requirement": "**R039 权威采购来源当前可用性与时点**；S1/S2/S5/S7 或引用旧决定时；T=规则需要当前采购决定/暂停状态；F=本项不依赖权威采购源；U=接口未接、超时、无查询权限；SRC-003,SRC-011,SRC-012,SRC-024；F014,F041,F047；M003,M005,M027；保存查源地址/Owner/事件时点/状态版本/失败原因；缓存公告仅历史事实，不能证明**当前无暂停**；T1可由有权 Owner核证；当前状态可核→`PASS_FACT`；F→`NOT_APPLICABLE`；离线/无权限→`SOURCE_UNAVAILABLE`；采购机构/监管 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R040",
          "title": "读取敏感合同证据的权限范围",
          "requirement": "**R040 读取敏感合同证据的权限范围**；任一阶段进入受限材料读取前；T=本次确需处理 P2/P3 或受限采购档案；F=仅公共可公开元数据；U=用途/角色/策略不明；SRC-025,SRC-012,SRC-024；F004–F006,F045,F051；M001,M007,M017,M030；只由服务端授权核 `actorId+caseId+materialId+purpose+validRange` 并按最小必要屏蔽未授权字段；OCR/前端显示不授予权限；不因公告可见推断保密附件可见；权限事实可核→`PASS_FACT`；F→`NOT_APPLICABLE`；未知→`NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE`；信息安全/材料 Owner。禁止越权读数",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R041",
          "title": "政采第49条补充是否未改变其他合同条款",
          "requirement": "**R041 政采第49条补充是否未改变其他合同条款**；S7/H；T=拟援引第49条例外；F=非该例外；U=原全文/拟协议差异不完整；SRC-011；F010,F036,F037,F044；M017,M018,M020；按条款号比原合同与拟补充文本，核除追加同标的价款数量外的其他条款是否**保持不变**；履约期限、乙方、付款方式、责任等变更都应独立列差异；与 R025/R035 不共判；完整对照且未变→仅 `PASS_FACT`；存在变更→`CONFLICT`；合法路径转采购归口/法治 `NEEDS_HUMAN_DECISION`",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "s0",
      "name": "识别路由",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s1",
      "workflowOwner": "local"
    },
    {
      "id": "s1",
      "name": "采购前置已完成",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s2",
      "workflowOwner": "local"
    },
    {
      "id": "s2",
      "name": "合同初次送审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s3",
      "workflowOwner": "local"
    },
    {
      "id": "s3",
      "name": "预审／补件／版本修订",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s4",
      "workflowOwner": "local"
    },
    {
      "id": "s4",
      "name": "正式审签",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s5",
      "workflowOwner": "local"
    },
    {
      "id": "s5",
      "name": "签署用章",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s6",
      "workflowOwner": "local"
    },
    {
      "id": "s6",
      "name": "公示、归档、履行交接",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "s7",
      "workflowOwner": "local"
    },
    {
      "id": "s7",
      "name": "签后变更／解除",
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
