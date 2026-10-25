import type { TemplateVersion } from '@profer/shared'

/** SRC IDs below are research-source metadata, never case SourceRef values. */
export const r02Metadata = {
  "templateId": "T04-T01",
  "name": "部门采购需求、采购立项与组织采购权责审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T01.md",
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T04-T01.md",
  "sourceDocumentSha256": "1c4b27e5bfd597c42337835cde1fdcda16a72fef4adb0318b7bdbd52159dd0f5",
  "originalSourceSha256": "1c4b27e5bfd597c42337835cde1fdcda16a72fef4adb0318b7bdbd52159dd0f5",
  "originalGitBlobSha": "a43447e04f0e3c1386ace981d098ef6a6ee67e49",
  "sourceIntegrityNote": "LINE_ENDING_DRIFT_ONE_LF: Git blob plus one LF matches authoritative manifest bytes/SHA-256; reviewed source follows that convention.",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "School-specific current rules, authorization matrix and current forms remain incomplete; unresolved policy branches stay manual and cannot produce official pass/reject.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "SRC-001｜CDUT-VERIFIED｜2026 年校本年度采购办理通知（仅可见正文片段）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/tzgg.htm"
      ],
      "description": "**SRC-001｜CDUT-VERIFIED｜2026 年校本年度采购办理通知（仅可见正文片段）** - 机构：成都理工大学财务处（采购与招标管理中心）。原题：《关于加快推进2026年度采购工作的通知》。URL：https://jcc.cdut.edu.cn/tzgg.htm （官方通知列表；详情页正文未完整抓取）。 - 位置：2026-03-24 条目及检索索引可见段落。发布：2026-03-24；适用：2026 年校内单位政府采购、统一实施非政府采购及自主采购。生效/废止：年度性通知，未找到明示废止日期。 - 核实：可核实“年度计划绝大部分备案、各单位需对接、统一实施项目开展需求论证并报需求表及意向材料、自主采购按另一实施办法办理”；**截断处不推断具体自采条文或批准流程**。直开页面受限。访问：2026-10-22。 "
    },
    {
      "id": "SRC-002",
      "title": "SRC-002｜CDUT-VERIFIED｜2025 年校本采购业务通知（全文见检索索引）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/4398.htm"
      ],
      "description": "**SRC-002｜CDUT-VERIFIED｜2025 年校本采购业务通知（全文见检索索引）** - 机构：成都理工大学财务处（采购与招标管理中心）。原题：《关于开展2025年度采购工作的通知》。URL：https://cg.cdut.edu.cn/info/1008/4398.htm 。 - 位置：正文第一至五项、附件清单。发布：2025-05-08；适用：2025 年提交采购计划的校内各单位。生效/废止：2025 年办理通知，**不直接替代 2026 年通知**。 - 核实：单位责任领导统筹、经办落实、归口协调；核对项目/分包/采购方式；单位组织市场调查和需求论证并审核后报送《成都理工大学采购需求论证表》及意向附件。附件 `zip/docx` 实体未取得，具体字段未核。原页直开 HTTP 412，但官方检索索引显示完整通知。访问：2026-10-22。 "
    },
    {
      "id": "SRC-003",
      "title": "SRC-003｜CDUT-VERIFIED｜采购与招标科职责（直接取得正文）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/jgsz/cgyzbt.htm"
      ],
      "description": "**SRC-003｜CDUT-VERIFIED｜采购与招标科职责（直接取得正文）** - 机构：成都理工大学财务处。原题：《采购与招标科》。URL：https://jcc.cdut.edu.cn/jgsz/cgyzbt.htm 。 - 位置：职责第 1—11 点，尤其第 3—8 点。发布/生效/废止：页面未标日期及修废信息；现网页为机构职责，不等同校级审批授权表。适用：财务处采购与招标科。 - 核实：计划汇总、品目划分、备案、项目分包、意向公示、需求论证初审、实施相关采购、选定和监管代理机构、后续合同资料与采购质疑处理等。**没有明文赋予该科独自批准全部“采购立项”的权限。**访问：2026-10-22。 "
    },
    {
      "id": "SRC-004",
      "title": "SRC-004｜CDUT-VERIFIED｜2025 年财务处公开服务指引 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf"
      ],
      "description": "**SRC-004｜CDUT-VERIFIED｜2025 年财务处公开服务指引 PDF** - 机构：成都理工大学财务处（采购与招标管理中心）。原题：《成都理工大学“只跑一次”财务事项清单》。URL：https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf 。 - 位置：PDF 第 1—3 页（封面标 2025 年 4 月；PDF 第 2 页科室职责，第 3 页财务事项列表）。发布：2025-04（封面）；生效/废止：未注明。适用：财务处服务与学校师生财务办理事项。 - 核实：采购与招标科负责采购计划汇总、公示及实施；预决算中心、会计核算中心、资金结算中心职责有别；“只跑一次”列表是**财务报销/服务事项**，不得当成采购前置立项的官方表单。PDF 正文已检索。访问：2026-10-22。 "
    },
    {
      "id": "SRC-005",
      "title": "SRC-005｜CDUT-VERIFIED｜校方 2025 年信息公开年报（公开实践）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm"
      ],
      "description": "**SRC-005｜CDUT-VERIFIED｜校方 2025 年信息公开年报（公开实践）** - 机构：成都理工大学信息公开办公室。原题：《成都理工大学2025年信息公开年度报告》。URL：https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm 。 - 位置：“二、主动公开信息情况”之财务信息、基建采购公开段。发布：2025-10-31；生效/废止：年度报告，无规范性生效条款。适用：2025 年学校采购实际公开情况。 - 核实：校方报告按照《成都理工大学非政府采购实施细则》办理；对基建相关特定服务/工程公开方式与采购中心委托代理模式有所说明。**年度报告不是细则全文，个别金额示例不得泛化所有采购品类。**原页直开受限，检索索引显示相关正文。访问：2026-10-22。 "
    },
    {
      "id": "SRC-006",
      "title": "SRC-006｜CDUT-VERIFIED｜2026 年采购推进会消息（片段）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/info/1014/2664.htm"
      ],
      "description": "**SRC-006｜CDUT-VERIFIED｜2026 年采购推进会消息（片段）** - 机构：成都理工大学财务处（采购与招标管理中心）。原题：《学校召开2026年度采购工作推进会》。URL：https://jcc.cdut.edu.cn/info/1014/2664.htm 。 - 位置：检索索引关于 2026 年 1 月 22 日会议、预算安排、政府采购指标、资产配置标准及采购计划“二上”的段落。发布：2026-01-23；生效/废止：新闻，无规范性效力。适用：2026 年相关部门预算/采购推进事实。 - 核实：证明有“预算/指标—采购计划—设备家具配置”协调活动，**不证明单项采购已批准或给出审批阈值**；详情页直接访问 HTTP 412，保留片段限定。访问：2026-10-22。 "
    },
    {
      "id": "SRC-007",
      "title": "SRC-007｜CDUT-VERIFIED｜2026 年项目库预算评审活动（直接取得正文）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/info/1014/2651.htm"
      ],
      "description": "**SRC-007｜CDUT-VERIFIED｜2026 年项目库预算评审活动（直接取得正文）** - 机构：成都理工大学财务处。原题：《学校召开2026年项目库申报答辩暨收入与预算规划委员会会议》。URL：https://jcc.cdut.edu.cn/info/1014/2651.htm 。 - 位置：正文关于 2025-12-11 会议、十四类项目库、预算合理性评审及预算约束的段落。发布：2025-12-19；生效/废止：新闻，无规范性效力。适用：校级预算项目库事实。 - 核实：预算项目评审与采购执行存在前后关联；**项目库论证或预算安排≠采购立项最终授权**。访问：2026-10-22。 "
    },
    {
      "id": "SRC-008",
      "title": "SRC-008｜CDUT-VERIFIED｜2024 年合同管理办法解读（限合同边界）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/info/1063/4726.htm"
      ],
      "description": "**SRC-008｜CDUT-VERIFIED｜2024 年合同管理办法解读（限合同边界）** - 机构：成都理工大学党政办公室。原题：《〈成都理工大学合同管理办法（2024修订版）〉解读》。URL：https://dbxb.cdut.edu.cn/info/1063/4726.htm 。 - 位置：解读中的“第十五条”引用及各章说明。发布：2024 年（解读指出新办法 2024-03-15 印发，文号成理校发〔2024〕8号）；实际发布日期、废止条款待核。适用：学校合同订立、前置程序与签署。 - 核实：订立合同前需完成必要的项目审批、采购招标等程序，支持**合同是后段、不能反推采购立项成立**；未取得完整红头文件，不在本模板复现合同审核阈值。访问：2026-10-22。 "
    },
    {
      "id": "SRC-009",
      "title": "SRC-009｜CURRENTITY-UNKNOWN｜2023 年试行办法补充说明",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/3280.htm"
      ],
      "description": "**SRC-009｜CURRENTITY-UNKNOWN｜2023 年试行办法补充说明** - 机构：成都理工大学采购与招标管理中心。原题：《关于〈成都理工大学采购管理办法(试行)〉的补充说明》。URL：https://cg.cdut.edu.cn/info/1008/3280.htm 。 - 位置：2023-03-07 正文第 1—5 项，针对成理校发〔2021〕12号第十一条。发布：2023-03-07；适用：**当期**非政府采购/自主采购，是否仍适用待查；生效/废止：未取得 2024 新细则衔接规定。 - 核实：历史上自主采购可以由需求单位实施或委托社会代理、部分类型要求市场调研/会议纪要及留档。**因 2024 新细则已出现，本轮不将历史金额、家数、方式写入可执行规则。**直开 HTTP 412，索引可见正文。访问：2026-10-22。 "
    },
    {
      "id": "SRC-010",
      "title": "SRC-010｜CURRENTITY-UNKNOWN｜2024 年校内非政府采购实施细则",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/index.htm",
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm"
      ],
      "description": "**SRC-010｜CURRENTITY-UNKNOWN｜2024 年校内非政府采购实施细则** - 机构：成都理工大学（校方年报引用；采购与招标管理中心网站政策栏目列载）。原题：《成都理工大学非政府采购实施细则》（成理校发〔2024〕1号）。已发现目录 URL：https://cg.cdut.edu.cn/index.htm ；佐证 URL：https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm 。 - 位置：采招网站“政策法规”列表及 2024/2025 信息公开年报引用；**没有取得正式全文、原始附件可访问地址与条号**。发布：文号 2024 年，具体印发日未知；生效/废止及与 2021/2023 文件关系未知。适用：学校非政府采购，具体分型待核。 - 核实：文件存在及学校在 2025 年引用已证实；权责、金额、例外、撤回、复核均不能仅凭标题推断。访问：2026-10-22。 "
    },
    {
      "id": "SRC-011",
      "title": "SRC-011｜CURRENTITY-UNKNOWN｜2021 年采购管理试行办法",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.cdut.edu.cn/__local/C/2E/21/1F734F9C0026BD14BA241AB7F97_CBEF168F_F7793.pdf",
        "https://cg.cdut.edu.cn/info/1008/3280.htm"
      ],
      "description": "**SRC-011｜CURRENTITY-UNKNOWN｜2021 年采购管理试行办法** - 机构：成都理工大学。原题：《成都理工大学采购管理办法（试行）》（成理校发〔2021〕12号）。题录证据：https://www.cdut.edu.cn/__local/C/2E/21/1F734F9C0026BD14BA241AB7F97_CBEF168F_F7793.pdf ；引用 URL：https://cg.cdut.edu.cn/info/1008/3280.htm 。 - 位置：学校规章题录第 18 项及 2023 补充说明提及第十、十一条。发布：题录列 2021-06-03；生效/废止：未知，2024 细则对非政采影响待核。适用：旧制度历史背景。 - 核实：制度曾存在；**没有获取原规章正文，不能引用未读条款为现行事实**。访问：2026-10-22。 "
    },
    {
      "id": "SRC-012",
      "title": "SRC-012｜CDUT-VERIFIED｜国资与实验室管理处职责（相关片段）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm"
      ],
      "description": "**SRC-012｜CDUT-VERIFIED｜国资与实验室管理处职责（相关片段）** - 机构：成都理工大学国资与实验室管理处。原题：《内设机构及职责》。URL：https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm 。 - 位置：资产管理与实验室建设/设备管理部门职责段。发布、生效、废止：页面未注明；适用：学校资产配置、实验室设备购置、资产/验收关联职责。 - 核实：可见行政办公设备购置配置、实验室新购仪器设备项目立项论证等职责；**不能据此推定该处对全部货物服务工程采购有最终审批权**。官方索引片段可见，直开受限。访问：2026-10-22。 "
    },
    {
      "id": "SRC-013",
      "title": "SRC-013｜GENERAL-RESEARCH｜政府采购法",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html"
      ],
      "description": "**SRC-013｜GENERAL-RESEARCH｜政府采购法** - 机构：全国人大常委会制定，国家市场监督管理总局网站转载法律原文。原题：《中华人民共和国政府采购法》。URL：https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html 。 - 位置：第 2、6—8、12、18、27—28、33 条。公布：2002-06-29，2014-08-31 修正；生效/废止：本轮未作后续修法穷尽核查。适用：符合法定财政性资金/目录/限额条件的政府采购，不是所有校内自采。 - 核实：政府采购范围、预算约束、集中/分散与采购方式/规避招标等法定原则；不是校内具体签批授权表。访问：2026-10-22。 "
    },
    {
      "id": "SRC-014",
      "title": "SRC-014｜GENERAL-RESEARCH｜财政部需求管理办法",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gkml/caizhengwengao/wg2021/wg202005/202109/t20210917_3753625.htm"
      ],
      "description": "**SRC-014｜GENERAL-RESEARCH｜财政部需求管理办法** - 机构：中华人民共和国财政部。原题：《财政部关于印发〈政府采购需求管理办法〉的通知》（财库〔2021〕22号）。URL：https://www.mof.gov.cn/gkml/caizhengwengao/wg2021/wg202005/202109/t20210917_3753625.htm 。 - 位置：通知正文与附件，参考需求管理办法第 3、6、10 条等（附件 PDF 本轮点击超时，条文仅由政府机构其他公开索引交叉检索，后续核全文）。印发：2021-04-30，财政部网页发布日期 2021-09-17；生效/废止：须进一步核对现行版本。适用：政府采购需求管理。 - 核实：政府采购需求与组织实施计划需区分；不推定学校自采通用阈值。访问：2026-10-22。 "
    },
    {
      "id": "SRC-015",
      "title": "SRC-015｜GENERAL-RESEARCH｜四川省政府集中采购目录及标准（2024年版；本轮增核正式全文）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.ccgp.gov.cn/cgml/df/202403/t20240307_21606814.htm",
        "https://czt.sc.gov.cn/scczt/zcjd/2023/11/8/f17f13b9d13a4695aa40fac8d6a75d0c/files/%E3%80%8A%E5%9B%9B%E5%B7%9D%E7%9C%81%E6%94%BF%E5%BA%9C%E9%9B%86%E4%B8%AD%E9%87%87%E8%B4%AD%E7%9B%AE%E5%BD%95%E5%8F%8A%E6%A0%87%E5%87%86%EF%BC%882024%E5%B9%B4%E7%89%88%EF%BC%89%E3%80%8B%E6%94%BF%E7%AD%96%E8%A7%A3%E8%AF%BB.pdf"
      ],
      "description": "**SRC-015｜GENERAL-RESEARCH｜四川省政府集中采购目录及标准（2024年版；本轮增核正式全文）** - 机构：四川省财政厅，原题：《四川省政府集中采购目录及标准（2024年版）》（川财规〔2023〕9号）。**本轮直接读取正式目录公开全文**：https://www.ccgp.gov.cn/cgml/df/202403/t20240307_21606814.htm （中国政府采购网标注来源四川省财政厅）；旧解读原件：https://czt.sc.gov.cn/scczt/zcjd/2023/11/8/f17f13b9d13a4695aa40fac8d6a75d0c/files/%E3%80%8A%E5%9B%9B%E5%B7%9D%E7%9C%81%E6%94%BF%E5%BA%9C%E9%9B%86%E4%B8%AD%E9%87%87%E8%B4%AD%E7%9B%AE%E5%BD%95%E5%8F%8A%E6%A0%87%E5%87%86%EF%BC%88202"
    },
    {
      "id": "SRC-016",
      "title": "SRC-016｜CDUT-VERIFIED｜学校采购中心官网的办事指南与常用下载入口（目录级）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/index.htm",
        "https://cg.cdut.edu.cn/cyxz.htm"
      ],
      "description": "**SRC-016｜CDUT-VERIFIED｜学校采购中心官网的办事指南与常用下载入口（目录级）** - 机构：成都理工大学采购与招标管理中心。页面原题：《采购与招标管理中心》（首页“办事指南”“常用下载”栏目）。URL：https://cg.cdut.edu.cn/index.htm ；常用下载入口：https://cg.cdut.edu.cn/cyxz.htm 。 - 位置：首页底部“采购管理流程图”“各政府采购方式流程图”“进口产品采购申报流程”等标题及多条“成都理工大学采购需求……”下载标题。网页栏目未标统一发布时间、制度生效/废止时间；索引抓取为 2026-10-22 前公开页面。适用：成都理工大学采购办事资料**存在性**。 - 核实：仅证实官方发布**表单和流程图入口**，既未取得每个附件全文，也未核实哪个是 2026 年现行版本；不根据截断标题创造栏目、签章栏或流程步骤。访问：2026-10-22。 "
    },
    {
      "id": "SRC-017",
      "title": "SRC-017｜CURRENTITY-UNKNOWN｜2021 年经办与采购监督人员报送通知（历史身份管理线索）",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/2378.htm"
      ],
      "description": "**SRC-017｜CURRENTITY-UNKNOWN｜2021 年经办与采购监督人员报送通知（历史身份管理线索）** - 机构：成都理工大学国有资产管理处、采购与招标管理中心。原题：《关于报送采购监督人员、采购经办人员名单的通知》。URL：https://cg.cdut.edu.cn/info/1008/2378.htm 。 - 位置：正文“采购经办人员工作职责”“报送要求”及附《成都理工大学采购监督人员、采购经办人员登记表.xls》标题。发布：2021-12-16；当期提交节点 2021-12-23；现行效力、名单更新、撤销与替代版本未知。适用：历史采购岗位登记，不作为 2026 人员资格硬条件。 - 核实：当时学校要求各单位填报采购经办人员名单、经办汇总/初审需求；历史登记表实体未获取，**不把 2021 在册视为今日仍有效**。访问：2026-10-22。 "
    },
    {
      "id": "SRC-018",
      "title": "SRC-018｜CDUT-VERIFIED｜2025 年采购管理信息系统操作培训新闻标题（仅存在性）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/index.htm"
      ],
      "description": "**SRC-018｜CDUT-VERIFIED｜2025 年采购管理信息系统操作培训新闻标题（仅存在性）** - 机构：成都理工大学采购与招标管理中心。原题：《学校召开采购管理信息系统操作培训会》。URL：https://cg.cdut.edu.cn/index.htm （学校采购中心官网“新闻动态”栏目，2025-06-18 条目）。 - 位置：首页新闻标题和日期；正文/课程资料未取得。发布：2025-06-18（栏目显示）；制度生效/废止：新闻不产生制度效力。适用：学校曾组织采购系统操作培训这一事实。 - 核实：**不证明**任何特定表单字段、学校认证 API 已开放、该系统当前部署状态、T04-T01 审批人或线上受理已存在；只用于第 05–07 节的可信系统“可能存在、仍需接口核实”说明。访问：2026-10-22。 "
    },
    {
      "id": "SRC-019",
      "title": "SRC-019｜CDUT-VERIFIED｜2024 年校长办公会正式纪要，直接核验 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/__local/B/A0/BE/AEE3FE9DF44A4382326CAC4E5CA_2979B53E_154C3.pdf"
      ],
      "description": "**SRC-019｜CDUT-VERIFIED｜2024 年校长办公会正式纪要，直接核验 PDF** - 机构：成都理工大学校长办公室。原题：《校长办公会通报》（校长办公会纪要〔2024〕1号）。原始 PDF：https://dbxb.cdut.edu.cn/__local/B/A0/BE/AEE3FE9DF44A4382326CAC4E5CA_2979B53E_154C3.pdf 。 - 位置：PDF 第 1 页第 9 项；会议日期 2024-01-03，纪要印发 2024-01-05。适用：**校级会议确曾审定《成都理工大学非政府采购实施细则》相关事宜**；会议纪要为决策经过，不是该细则正文。生效/废止：该纪要不载细则的施行或废止日期。 - 核实：官方 PDF 可读、两页、第一页面第 9 项可逐字定位；加强 `SRC-010` 文件存在性证明，但**并不证明细则条款、特定院系立项批准权或金额阈值**。访问：2026-10-23。 "
    },
    {
      "id": "SRC-020",
      "title": "SRC-020｜GENERAL-RESEARCH｜2026 年《紧急采购管理暂行办法》全文，直接核验财政部官方网页",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://m.mof.gov.cn/zcfb/202609/t20260911_3997286.htm",
        "https://gks.mof.gov.cn/guizhangzhidu/202609/t20260911_3997286.htm"
      ],
      "description": "**SRC-020｜GENERAL-RESEARCH｜2026 年《紧急采购管理暂行办法》全文，直接核验财政部官方网页** - 机构：财政部、应急管理部。原题：《关于印发〈紧急采购管理暂行办法〉的通知》（财库〔2026〕12号）。财政部官方移动端全文：https://m.mof.gov.cn/zcfb/202609/t20260911_3997286.htm ；国库司原文页：https://gks.mof.gov.cn/guizhangzhidu/202609/t20260911_3997286.htm （本轮直开超时）。 - 位置：第 2、3、5、7、10、12、18、21、27、29 条。印发：2026-09-07；网页发布：2026-09-14；**2026-10-01 施行**；截至 2026-10-23 未检索到废止。适用：达到其第二条定义的各级采购人之法定紧急采购，不是学校一切临时或加急采购。 - 核实：财政部移动端全文可以直接逐条读取。第二条要求灾害等突发/不可抗力事件且现"
    },
    {
      "id": "SRC-021",
      "title": "SRC-021｜CDUT-VERIFIED｜2026 年二级单位自行组织采购的公开实践（非前置授权文件）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://bwc.cdut.edu.cn/info/1033/2373.htm"
      ],
      "description": "**SRC-021｜CDUT-VERIFIED｜2026 年二级单位自行组织采购的公开实践（非前置授权文件）** - 机构：成都理工大学党委保卫部（保卫处）。原题：《成都理工大学保卫处安防巡逻车购买项目比选结果公告》。URL：https://bwc.cdut.edu.cn/info/1033/2373.htm 。 - 位置：正文开头引述学校采购管理办法与非政采细则、保卫处官网公开比选及评审结果部分。发布：2026-04-13；公告性事件，无制度生效/废止条款。适用：保卫处该特定采购项目，不能扩张全体单位、任何品目或所有采购预算。 - 核实：**本轮已直接读取校方原站公告全文**（正文及发布日期）；保卫处确曾按照其所述比选规则组织本单位采购并公示结果；**未取得该项目采购立项前的内部授权、批示和有效校本阈值**，公告只证明后段实践，不能用结果倒推前置程序完全合规。访问：2026-10-23。 "
    },
    {
      "id": "SRC-022",
      "title": "SRC-022｜CDUT-VERIFIED｜学校2024年信息公开报告的非政府采购场景举证（本轮新增）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm"
      ],
      "description": "**SRC-022｜CDUT-VERIFIED｜学校2024年信息公开报告的非政府采购场景举证（本轮新增）** - 机构：成都理工大学信息公开主管部门。原题：《成都理工大学关于2024年信息公开工作的报告》。原校方页面：https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm 。位置：“（二）规范基建信息公开”第 3、4 项。报告形成并公开于 2024 年度信息公开周期，具体网页发布日期与规范效力日期尚待原页校验；报告本身不是规范性文件。适用：**2024 年学校基建类服务和工程采购**的报告实践，不可外推全部货物、服务、科研或其他年度。 - 核实：学校公开报告明确引用“成理校发〔2024〕1号”《成都理工大学非政府采购实施细则》，并陈述当年部分非政府采购服务/工程项目在校网公开、较高金额由采招中心委托社会代理组织的做法。可见报告提供了**特定领域、特定年度的金额区间与组织路径事实**，但 2024 细则全文、废止/修订关系与其他品目授权仍不明"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-002",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-002",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-009",
        "SRC-010",
        "SRC-013",
        "SRC-015",
        "SRC-022"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-002",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-006",
        "SRC-012",
        "SRC-013",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-003",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-009",
        "SRC-010",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-003",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-015",
        "SRC-016",
        "SRC-020",
        "SRC-022"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-002",
        "SRC-016",
        "SRC-018"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-003",
        "SRC-010",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-003",
        "SRC-010",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-013",
        "SRC-015",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-003",
        "SRC-010",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T04-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "部门采购需求、采购立项与组织采购权责审核",
  "description": "部门采购需求、采购立项与组织采购权责审核。本地研究模板 · 非校方正式模板。只用于事实与证据预审，未知制度、权限和正式结论由有权人员人工核定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T04-T01 是本地研究/预审定义，非成都理工大学校方正式模板；不得据此宣称校方批准、正式通过、正式拒绝或已接入校方系统。",
  "objectType": "transaction",
  "displayName": {
    "template": "T04-T01 · {{caseOrAssetId}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷键 UUID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "`F001` 案卷键 `UUID`；Case；L0，全部；Main 创建并绑定，非前端自报；案卷主键、创建事件；P1；无主键拒绝关联材料/转内部技术待办；不得造案"
    },
    {
      "key": "F002",
      "label": "办理阶段 enum L0–L5",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "`F002` 办理阶段 `enum L0–L5`；Case；L0 起，全部；Main 阶段事件，校本实际状态另映射；阶段事件 ID/时刻；P1；阶段不明先人，不前置补后段资料"
    },
    {
      "key": "F003",
      "label": "需求单位 ID org-id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F003` 需求单位 ID `org-id`；ApplicantOrg；L0，全部；校方组织名录+可信登录所属，缺则部门出具证明；`M001/M003` 抬头+组织台账；P1；补/源；名称与 ID 不同则突"
    },
    {
      "key": "F004",
      "label": "实际提交人 ID person-id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F004` 实际提交人 ID `person-id`；ActorMandate；L0，全部；SSO/Host 真实绑定身份；登录证明/单位认证记录（不采公开密码）；P2；源/人；Renderer 值不可信"
    },
    {
      "key": "F005",
      "label": "经办/代理授权 mandate-id+period+scope",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F005` 经办/代理授权 `mandate-id+period+scope`；ActorMandate；L0，实际代理或经办；当期岗位/委托台账、经核验委托书；`M002/M003`、委托范围段；P2；补/源/人；超期或调岗突"
    },
    {
      "key": "F006",
      "label": "单位责任领导及审核岗位 person-role-id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F006` 单位责任领导及审核岗位 `person-role-id`；ActorMandate；L2 单位审核；L0 可未知；校方机构和授权记录、真实签批链；`M003/M011`、OA 签署事件；P2；L0 不缺；L2 源/人"
    },
    {
      "key": "F007",
      "label": "事项来源/办理子类 enum+text",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F007` 事项来源/办理子类 `enum+text`；Demand；L0，全部；提出单位说明；由归口复核分类；`M001` 事由，`M007` 变更说明；P1；补；未经核实不自动定路由"
    },
    {
      "key": "F008",
      "label": "资金/采购年度 year",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F008` 资金/采购年度 `year`；BudgetRef；L0 主张，L1 核真；预算项目/采购计划权威年度；`M004–M006` 年度信息；P1；L0 补，L1 源/突"
    },
    {
      "key": "F009",
      "label": "项目或科研项目 ID ref-id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F009` 项目或科研项目 ID `ref-id`；BudgetRef；L1，有项目来源时；预算项目库/科研主管有效项目记录；`M004/M017` 项目标识；P3；条件补/源；T03 结论仅引用"
    },
    {
      "key": "F010",
      "label": "预算指标/资金来源 ID ref-id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F010` 预算指标/资金来源 ID `ref-id`；BudgetRef；L1，适用资金路径；财务预算指标/下达记录；`M005` 系统记录或凭证；P3；内部源/人；不由采购案调整预算"
    },
    {
      "key": "F011",
      "label": "可用性/冻结状态 enum+as-of",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F011` 可用性/冻结状态 `enum+as-of`；BudgetRef；L1，权威状态可得时；有权财务预算系统/人工确认；`M005` 状态、更新时间、来源ID；P3；源/人；截图无权定可用、不是 G07 支付许可"
    },
    {
      "key": "F012",
      "label": "年度采购计划/备案 ID ref-id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F012` 年度采购计划/备案 ID `ref-id`；ProcurementPlan；L1，A/B/C 已报计划；D1 可暂缺；采购中心有效计划记录；`M006` 计划/备案条目；P1；A/B 源/补；D1 标待补报，不否决 L0"
    },
    {
      "key": "F013",
      "label": "采购计划状态及版次 status+rev",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F013` 采购计划状态及版次 `status+rev`；ProcurementPlan；L1，已有计划时；采购中心最新有效记录；`M006/M019` 变更历史；P1；源/突；旧版不得覆盖新版"
    },
    {
      "key": "F014",
      "label": "需求目标/必要性 text",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F014` 需求目标/必要性 `text`；Demand；L0，全部；需求单位声明，后由论证确认；`M001/M008` 具体段落；P1；补；描述矛盾突"
    },
    {
      "key": "F015",
      "label": "标的品目及分类 code+text",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F015` 标的品目及分类 `code+text`；Demand；L0 自述，L1/L3 确认；单位规格；采购中心分类或现行品目目录；`M008/M013` 品目与分类决定；P1；未分型策/人；不凭猜测限额分类"
    },
    {
      "key": "F016",
      "label": "预计采购金额 money+CNY",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F016` 预计采购金额 `money+CNY`；Demand；L0 估算，L1 与预算对照；需求单位估算，预算系统/论证证据对照；`M001/M005/M008` 数字和单位；P3；补/突；金额阈值只能待现行政策"
    },
    {
      "key": "F017",
      "label": "分包、项目组合标识 list<ref-id>",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F017` 分包、项目组合标识 `list<ref-id>`；ProcurementPlan；L1 已有分包时，L3 中心确认；采购中心计划分包/组合记录；`M006/M013` 包号与沿革；P1；无分包尚未生成则 NA；既有分包源/突"
    },
    {
      "key": "F018",
      "label": "联合需求单位与牵头主体 org-list+lead",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F018` 联合需求单位与牵头主体 `org-list+lead`；ApplicantOrg；L0/E 主张，L1 核授权；各单位授权与有权牵头决定；`M015` 单位清单、牵头依据；P1；E 补/人；非 E 为 NA"
    },
    {
      "key": "F019",
      "label": "市场调查证据状态 enum+rev",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F019` 市场调查证据状态 `enum+rev`；Analysis；L2，需开展论证的分支；原始市场调查材料+单位审阅记录；`M009` 调查记录、时间/对象；P1/P3；L0/L1 非必需；L2 补/不可读"
    },
    {
      "key": "F020",
      "label": "需求论证表身份/版次 ref+rev",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F020` 需求论证表身份/版次 `ref+rev`；Analysis；L2，适用分支；单位正式提交、校方认可表单样式；`M010` 文件、标题、版本指纹；P1/P3；L2 补；原表栏位未取得则策"
    },
    {
      "key": "F021",
      "label": "单位内部审核事件 decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F021` 单位内部审核事件 `decision-ref`；Analysis；L2 真实审核后；OA/归口签批记录或经核验原件；`M011` 签发人、时刻、关联需求版；P2/P3；未审核时不提前索取；已称审核则源/人"
    },
    {
      "key": "F022",
      "label": "申请人主张的采购路线 enum+reason",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F022` 申请人主张的采购路线 `enum+reason`；ProcurementRoute；L0 可提，L1 分类参考；单位说明，不具备权威性；`M001/M008` 拟组织方式；P1；可未知；不能据金额自动确立自采资格"
    },
    {
      "key": "F023",
      "label": "有权确定的组织路线/方式 decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F023` 有权确定的组织路线/方式 `decision-ref`；ProcurementRoute；L3/L4 真实确定后；采购中心或现行制度指定的有权部门；`M013/M014/M021` 决定/授权；P1/P3；未形成即人/策，禁止伪造批准"
    },
    {
      "key": "F024",
      "label": "采购中心接收/初审事实 event-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F024` 采购中心接收/初审事实 `event-ref`；ProcurementRoute；L3 真实接收后；中心台账、受理回执、正式意见；`M013` 接收和退回记录；P1；L0–L2 不要求；L3 源/人"
    },
    {
      "key": "F025",
      "label": "专项属性及归口需求 set<enum>",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F025` 专项属性及归口需求 `set<enum>`；Demand；L0 自述，L1 专项核定；设备/国资/基建/信息化/定密等真实归口记录；`M008/M016/M023` 适用性依据；P3；专项疑似时策/人；不能一律强制专项附件"
    },
    {
      "key": "F026",
      "label": "外部权威结论引用 list<signed-ref>",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F026` 外部权威结论引用 `list<signed-ref>`；DecisionRef；L1–L3，G/F/E 等有前置决定时；T03/预算/国资/校内授权系统有效记录；`M004/M016/M017/M021/M023` 原决定 ID；P3；源/人；上传截图不能替代 T3"
    },
    {
      "key": "F027",
      "label": "本事项正式有权决定 signed-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F027` 本事项正式有权决定 `signed-ref`；DecisionRef；L4 **决定已形成后**；当期有权校方决定机关和签批链；`M020` 决定 ID、签章/状态；P3；L0–L3 禁止必填；L4 人/源"
    },
    {
      "key": "F028",
      "label": "补正/变更/撤回/复核动作 event+status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F028` 补正/变更/撤回/复核动作 `event+status`；LifecycleEvent；H1/H2/H3 或 D3；申请请求与学校受理/决定分开记；`M018/M019` 请求与后来回执；P2/P3；不因申请视为批准；丢链路人/突"
    },
    {
      "key": "F029",
      "label": "政策适用版本/归口 policy-ref+date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F029` 政策适用版本/归口 `policy-ref+date`；DecisionRef；L1–L4 涉分类/权限时；正式现行制度台账，`SRC-001/010/015` 仅线索；`M022` 版本和适用区间；P1；策；不得代用 2023 金额阈值"
    },
    {
      "key": "F030",
      "label": "办理模式适用性证据 set<case-code>",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "`F030` 办理模式适用性证据 `set<case-code>`；Case；L0–L3，全部；需求特征、归口复核、材料范围联合推断；`M001/M008` 与业务证据交叉点；P1；未能确定时策/人，可多标签"
    },
    {
      "key": "F031",
      "label": "有来源的截止/受理节点 date+source",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F031` 有来源的截止/受理节点 `date+source`；LifecycleEvent；对有真实当期时限的阶段；2026 现行通知/OA 受理记录；`M022/M013` 截止/受理时刻；P1；无当期依据设 `unknown`；不自动判逾期"
    },
    {
      "key": "F032",
      "label": "证据归属、指纹、取用版本 case/ref/hash/rev",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "`F032` 证据归属、指纹、取用版本 `case/ref/hash/rev`；EvidenceRef；材料纳入时，全部；Host 文件保存与来源元数据；每一 `Mxxx` 的页/行/版本/来源链接；P1–P3；不可读为 `UNREADABLE`；错案/旧版突，受影响结论需重核"
    },
    {
      "key": "F033",
      "label": "法定突发/不可抗力事件事实 event-type+id+time",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F033` 法定突发/不可抗力事件事实 `event-type+id+time`；Demand；D2a L0 申请时主张，L1 核真；其他 D2b 不强制；应急管理/校方有权应急事件记录及人工鉴别；`M024` 事件类型、发生时间、官方来源ID；P3；无有效事件不宣告法定紧急；来源失联 `SOURCE_UNAVAILABLE`，仅口述为人"
    },
    {
      "key": "F034",
      "label": "储备、调拨/支援后仍不足 reserve+transfer+as-of",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F034` 储备、调拨/支援后仍不足 `reserve+transfer+as-of`；Demand；D2a L1 当前核真（满足法定条件需要），D2b 不适用；学校应急物资主管、储备/调拨记录及授权人员核实；`M024` 储备状态、调拨/支援请求及结果；P3；已到核真阶段缺真实记录时内部查源/人；不得以“没查到库存”当库存为零"
    },
    {
      "key": "F035",
      "label": "紧急采购内部会商启动决定 signed-decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F035` 紧急采购内部会商启动决定 `signed-decision-ref`；DecisionRef；D2a **法定条件核定并完成内部会商后**；L0 未来；真实采购人内部会商与有权签发链，须按当期制度确认；`M025` 会商决定、人员权限、时间、所涉项目/包及版本；P3；尚未会商不向申请人报缺件；签发主体不明 `NEEDS_HUMAN_DECISION`，源失联 `SOURCE_UNAVAILABLE`"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "采购需求发起与事项性质；需求单位/经办",
      "purpose": "`M001` 采购需求发起与事项性质；需求单位/经办；需求说明、发起记录；**L0 当前**；校方已认证的采购申请记录；尚未证实其正式字段（`SRC-018`）；`F001/003/007/008/014/016/022/030`；`SRC-002/007`；属当前需求案+提交人，保留发起时间/版次；无可用主张 `NEEDS_MATERIAL`，不可读 `UNREADABLE`",
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
        "采购需求发起与事项性质；需求单位/经办"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "本人身份与代理关系；校方身份主管/单位",
      "purpose": "`M002` 本人身份与代理关系；校方身份主管/单位；可信人员身份和委托关系；**L0 条件**（未能由 SSO 验真或代办时）；Host 从 SSO、岗位台账只读核验，不要求重复上传身份证；纸质委托替代须有权核真；`F004/005`；`SRC-002/017`；委托绑定经办 ID、组织、范围及有效期；系统不可达 `SOURCE_UNAVAILABLE`，授权不符 `CONFLICT`",
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
        "本人身份与代理关系；校方身份主管/单位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "单位责任人/当期经办授权；学校岗位主管/单位",
      "purpose": "`M003` 单位责任人/当期经办授权；学校岗位主管/单位；现行名单、任命或授权文件；**L1 条件，L2 审核需核实**；岗位授权台账/OA；2021 历史人员登记不能代替当前；`F003/005/006`；`SRC-002/017`；保留撤销/调岗版次；无当前权限证据 `NEEDS_HUMAN_DECISION`；不可读 `UNREADABLE`",
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
        "单位责任人/当期经办授权；学校岗位主管/单位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "采购关联项目来源；预算/科研或主管部门",
      "purpose": "`M004` 采购关联项目来源；预算/科研或主管部门；有权项目批复/项目库有效记录；**L1 条件**（存在项目关联）；预算/科研项目权威记录，优先只读 ID；项目库新闻不作单项批准；`F008/009/026`；`SRC-007/004`；绑定项目 ID、年度、签发主体与有效期；系统失联 `SOURCE_UNAVAILABLE`，编号冲突 `CONFLICT`",
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
        "采购关联项目来源；预算/科研或主管部门"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "资金指标/预算状态；财务预算主管",
      "purpose": "`M005` 资金指标/预算状态；财务预算主管；有效预算/资金指标记录；**L1 当前核证对象**（可用性具体判断仍属财务权）；财务预算系统只读记录/经授权财务确认，不能无故索上传余额截图；`F008/010/011/016`；`SRC-004/007`；时间点、冻结/调整历史与资金年度不可丢；源失联记 `SOURCE_UNAVAILABLE`，不得改报“有款可付”",
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
        "资金指标/预算状态；财务预算主管"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "年度采购计划/分包备案；采招中心",
      "purpose": "`M006` 年度采购计划/分包备案；采招中心；当年计划 ID、备案状态、所属项目、分包；**L1 A/B 当前；C 视适用；D1 后续**；采购中心台账有效计划和变更历史；`F008/012/013/017`；`SRC-001/002/003`；年度、包号、版次与需求 ID 绑定；无记录先分源不可达/未形成，D1 不倒逼初始提交",
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
        "年度采购计划/分包备案；采招中心"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "新增、紧急或例外申请事由；需求单位",
      "purpose": "`M007` 新增、紧急或例外申请事由；需求单位；事由、紧急影响、请求时间的说明；**L0 D1/D2 条件当前**；学校真实内部业务申请记录（若存在），不视为例外获批；`F007/014/028/030`；`SRC-001/003/009`；请求属于新/变更案和申报人，不等于免招标决定；缺失 `NEEDS_MATERIAL`，法源未定 `POLICY_UNCONFIRMED`",
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
        "新增、紧急或例外申请事由；需求单位"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "标的与技术/服务需求边界；需求单位",
      "purpose": "`M008` 标的与技术/服务需求边界；需求单位；需求清单或规格范围、品目线索、估算；**L0 当前**（可与 M001 合并）；可信系统已有需求条目或正式项目说明可复用；`F014/015/016/018/025/030`；`SRC-002/003`；多行清单逐项定位，维护需求版次；缺关键目标 `NEEDS_MATERIAL`，图表识别失败 `UNREADABLE`",
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
        "标的与技术/服务需求边界；需求单位"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "市场调查及调研结论；需求单位/专业人员",
      "purpose": "`M009` 市场调查及调研结论；需求单位/专业人员；走访/调研、比对、日期及适用范围；**L2 按适用的需求论证当前，L0/L1 后续**；已校验的学校论证附件；不得虚构当前规定的最少供应商家数；`F019/015/016/032`；`SRC-002/014`；与需求版次、品目/参数绑定；无调查在 L2 才补，失读 `UNREADABLE`；历史 `SRC-009` 不作现行阈值",
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
        "市场调查及调研结论；需求单位/专业人员"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "需求论证表；需求单位",
      "purpose": "`M010` 需求论证表；需求单位；《成都理工大学采购需求论证表》；**L2 按当前通知适用，L0/L1 后续**；学校系统中真正获认可的同类论证记录；替代性待归口确认；`F019/020/014/015/016`；`SRC-001/002/016`；2026 正式表样、栏位和版次未获，属 `GAP-03`；未形成不要求，现有表不可读 `UNREADABLE`",
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
        "需求论证表；需求单位"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "单位内部需求审查/签批；单位有权人员",
      "purpose": "`M011` 单位内部需求审查/签批；单位有权人员；有权真实审查记录或文件；**L2 审核事件之后产生**；OA 原记录优先，纸质签章需人岗/时点核验；`F006/021/032`；`SRC-002/017`；必须绑定具体 M010/M008 版本与签批 ID；需求替换可能使签批待重核；无法验真 `NEEDS_HUMAN_DECISION`",
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
        "单位内部需求审查/签批；单位有权人员"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "采购意向材料；需求单位/中心",
      "purpose": "`M012` 采购意向材料；需求单位/中心；2025 通知所列《成都理工大学政府采购意向公告》及相应报送记录；**L2 A 或政策触发的分支，L0/L1 后续**；可信正式意向公开记录；2026 实际适用范围由当期制度确定；`F012/015/017/022`；`SRC-001/002/016`；公告/草稿/已报送状态分离；非政采不一律强制；源失联 `SOURCE_UNAVAILABLE`、政策不明 `POLICY_UNCONFIRMED`",
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
        "采购意向材料；需求单位/中心"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "中心受理、初审与组织路径；采招中心",
      "purpose": "`M013` 中心受理、初审与组织路径；采招中心；接收回执、分包、初审或方式决定（按真实职权分开）；**L3 实际发生后**；中心业务台账/API，经授权只读；`F017/023/024/031`；`SRC-001/003/016`；初审不是当然批准；若 L3 尚未受理不要求既有回执；台账不达 `SOURCE_UNAVAILABLE`",
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
        "中心受理、初审与组织路径；采招中心"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "自主采购权责凭证；需求单位/有权授权机构",
      "purpose": "`M014` 自主采购权责凭证；需求单位/有权授权机构；现行规章、具体授权或真实单位决定；**C 在启动自主组织前条件需核，L0 后续**；学校现行有效组织授权台账/经核签批；2023 旧补充仅历史参考；`F005/022/023/029`；`SRC-001/009/010`；权限对象、金额/品目适用版本不得空推；无现行规则 `POLICY_UNCONFIRMED`+`NEEDS_HUMAN_DECISION`",
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
        "自主采购权责凭证；需求单位/有权授权机构"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "联合采购牵头与成员单位事实；各需求单位/中心",
      "purpose": "`M015` 联合采购牵头与成员单位事实；各需求单位/中心；共同需求清单、牵头授权或汇总记录；**E L1 条件当前，L0 可先列未确认单位**；各单位可信授权信息及中心统一项目记录；`F003/018/017/026`；`SRC-002/003`；单位/分包逐一关联，冲突时保留各版本；牵头权限未证实为人工待办",
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
        "联合采购牵头与成员单位事实；各需求单位/中心"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "设备及资产/专项归口意见；国资/实验室或其他有权部门",
      "purpose": "`M016` 设备及资产/专项归口意见；国资/实验室或其他有权部门；资产配置、专业论证/专项意见；**F1/F2 适用时 L1–L3 条件，尚未办理为后续**；国资/实验室可信原始决定、非本案重新审批；`F015/025/026`；`SRC-006/012`；不按“有设备”一律强制大型仪器论证；归口未确定 `POLICY_UNCONFIRMED`",
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
        "设备及资产/专项归口意见；国资/实验室或其他有权部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "科研项目与经费权限结论；科研主管/T03",
      "purpose": "`M017` 科研项目与经费权限结论；科研主管/T03；有效科研立项/任务书/批准预算的真实决策引用；**G L1 条件当前**；T03 权威决定记录 ID，避免重复上传原材料；采购案不审科研立项；`F009/010/026`；`SRC-004/007`（仅边界佐证）；关联实际课题编号与决定版次；G50/T03 原文待取；系统失联 `SOURCE_UNAVAILABLE`",
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
        "科研项目与经费权限结论；科研主管/T03"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "补正、撤回、复核申请及原案；提出单位/经办",
      "purpose": "`M018` 补正、撤回、复核申请及原案；提出单位/经办；原案号、原决定/退回内容、请求与争点；**H1/H2/H3 当前**；校方真实受理系统的原案+请求，申请人的书面说明只证明提出；`F001/002/028/032`；`SRC-003/016`（程序细则未核）；旧请求不可覆盖新版；请求≠批准，未有合法复核渠道 `POLICY_UNCONFIRMED`",
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
        "补正、撤回、复核申请及原案；提出单位/经办"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "资金/计划/需求变更前后比对；原单位及预算/中心",
      "purpose": "`M019` 资金/计划/需求变更前后比对；原单位及预算/中心；旧版 ID、变化清单、申请原因；**D3 当前**；新批准版尚未产生则为后续；权威预算/采购计划变更历史；不要求申请人签制不存在的“已批”表；`F008/010/012/013/016/017/028`；`SRC-001/003/007`；保留 old→new 关系；如果新预算未正式有效标待人，不承认新状态",
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
        "资金/计划/需求变更前后比对；原单位及预算/中心"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "本事项有权形成的正式决定；学校/法定主体",
      "purpose": "`M020` 本事项有权形成的正式决定；学校/法定主体；签批、会议决定、备案等**真实有权决定**；**L4 后续才产生**；可信签批系统原始 ID；独立采购立项决定是否普遍存在待核；`F023/027/029`；`SRC-001/003/010`；校方实际签发主体与效力待 `GAP-02`；不存在不能凭 AI 编造；未获批准不能显示“已通过”",
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
        "本事项有权形成的正式决定；学校/法定主体"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "外部代理/第三方采购组织委托；有权学校机构、代理",
      "purpose": "`M021` 外部代理/第三方采购组织委托；有权学校机构、代理；适用时合同/委托/权限范围；**C 或中心委托代理项目 L3 条件**；采招中心授权台账/委托原件；学校合同仍由其他流程处理；`F005/023/026`；`SRC-003/005/009`；绑定具体项目、代理范围与有效期；旧委托不可复用新分包；无法核真 `NEEDS_HUMAN_DECISION`",
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
        "外部代理/第三方采购组织委托；有权学校机构、代理"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "当前政策、时限和校本程序版本；归口制度主管",
      "purpose": "`M022` 当前政策、时限和校本程序版本；归口制度主管；2026 有效制度、通知/流程图及适用范围；**系统/审核方 L1–L4 内部必核，不是申请人必传**；学校制度库或经有权部门确认的现行文件；公开网页仅线索；`F029/031`；`SRC-001/010/011/015/016`；保存政策快照及生效区间；无法核时 `POLICY_UNCONFIRMED`，不得要求经办自证制度有效性",
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
        "当前政策、时限和校本程序版本；归口制度主管"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "进口、涉密、工程等例外批准或专项许可；专项主管机关",
      "purpose": "`M023` 进口、涉密、工程等例外批准或专项许可；专项主管机关；**F2 或 D2 经现行规定触发的条件材料，往往 L1–L4 后续形成**；相应法定/校内许可的权威记录 ID，不可用需求说明代替；`F025/026/029`；`SRC-012/013/015/016`（具体规程待核）；不得默认任意进口/涉密/工程均适用同一审批表；缺适用性法源 `POLICY_UNCONFIRMED`",
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
        "进口、涉密、工程等例外批准或专项许可；专项主管机关"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "法定紧急采购事实、储备与调拨验证；应急事件及物资/预算主管",
      "purpose": "`M024` 法定紧急采购事实、储备与调拨验证；应急事件及物资/预算主管；突发/不可抗力事件的来源、当时储备不足及紧急调拨/支援仍无法满足的权威记录；**D2a L1 条件当前，L0 可先提出线索；D2b 不强制**；应急管理、储备/调拨部门经核原始记录，缺线上接口可交授权校方人员查证；一般“急需说明”`M007` 不等效；`F033/034/008/010`；`SRC-020/015`；绑定事件发生时刻、预算性质、年度及采购包；源失联 `SOURCE_UNAVAILABLE`、无法阅读 `UNREADABLE`、仅申请人自述 `NEEDS_HUMAN_DECISION`",
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
        "法定紧急采购事实、储备与调拨验证；应急事件及物资/预算主管"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "紧急采购内部会商启动决定；法定采购人有权内部决策机关",
      "purpose": "`M025` 紧急采购内部会商启动决定；法定采购人有权内部决策机关；D2a 在法定适用核定并真实会商后形成的决定与过程引用；**L0/L1 会商前为未来材料，签发后才核验**；采购人内部会商原记录及校方签批链 T3，签发人由校本授权核真；不得用部门经办口头指令替代；`F035/027/029/032`；`SRC-020/003/010`；绑定 `M024` 事件、项目包、会商成员权限、签发时刻和版次；尚未形成给“待有权决定”，不是申请人缺件；假签章/错包 `CONFLICT`",
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
        "紧急采购内部会商启动决定；法定采购人有权内部决策机关"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 连续 R 规则：主体、资金、计划、采购需求（`R001–R011`）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "案卷归属与真实需求单位；L0+",
          "requirement": "`R001` 案卷归属与真实需求单位；L0+；T=本 ID 采购发起；F=确属其他业务；U=案/单位来源不明；`SRC-002/SRC-003`；`F001/F002/F003/F004/F032`；`M001/M002`；Main 案 ID↔单位 ID↔登录主体，核创建时与本轮复审时，T2 优先；非校内个人不得凭上传抬头变为申请组织；一致 `PASS_FACT`；ID 矛盾 `CONFLICT`；SSO 不通 `SOURCE_UNAVAILABLE` → Host 身份核验/需求单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "经办与代理授权范围；L0/L1",
          "requirement": "`R002` 经办与代理授权范围；L0/L1；T=人员代表单位办理；F=仅案卷只读参阅；U=岗位/委托真实性未知；`SRC-002/SRC-017`；`F003/F004/F005`；`M002/M003`；在申请动作时核 T2 岗位/委托 `person-org-scope-validFrom/To`；2021 名册只能佐证历史，代理在换岗/过期后不续效；有效 `PASS_FACT`；不同人/越权 `CONFLICT`；台账失联 `SOURCE_UNAVAILABLE`；授权裁量 `NEEDS_HUMAN_DECISION` → 单位人事/OA 管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "单位内部审签人及决定对象；L2 已实际提交审查后",
          "requirement": "`R003` 单位内部审签人及决定对象；L2 已实际提交审查后；T=声称单位已审核；F=仍是 L2 草稿未审；U=是否签署不明；`SRC-002/SRC-017`；`F006/F020/F021/F032`；`M003/M010/M011`；比较审签岗位、签发日、关联 M010 的版本哈希及事项；T3/OA 优先，扫描签名 T1 不构成真实任职证明；领导统筹职责不等于各项批准权；同版事实成立 `PASS_FACT`；错版 `CONFLICT`；无法验签 `NEEDS_HUMAN_DECISION` → 单位真实有权审核者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "项目/课题来源与采购申请关联；L1",
          "requirement": "`R004` 项目/课题来源与采购申请关联；L1；T=申请指向已存在项目/经费任务；F=有权确认不需项目号的非项目场景；U=项目性质未明；`SRC-004/SRC-007`；`F007/F008/F009/F026`；`M001/M004`；匹配项目主管决定的编号、单位、使用年度及效力，T2/T3；项目库讨论新闻只证明流程存在；科研批准另走 R019；关联一致 `PASS_FACT`；项目不同 `CONFLICT`；来源失联 `SOURCE_UNAVAILABLE` → 项目/预算主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "预算指标与项目年度对应；L1",
          "requirement": "`R005` 预算指标与项目年度对应；L1；T=已到预算/资金关联核验；F=尚在 L0 草拟；U=项目资金属性不明；`SRC-004/SRC-007`；`F008/F009/F010/F016`；`M004/M005`；由财务 T2 指标或授权确认查年度、项目号、指标标识；估算不自动等于可用额度，财务调整在外部形成；对应 `PASS_FACT`；跨年或跨项目 `CONFLICT`；不可取 `SOURCE_UNAVAILABLE` → 财务预算主体，不回到 G07 付款决定",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "财务可用性/冻结状态的来源真实性；L1",
          "requirement": "`R006` 财务可用性/冻结状态的来源真实性；L1；T=提交了“预算可用”主张或进入预算状态核验；F=仅 L0 估算尚无权威状态；U=财务确认渠道未知；`SRC-004/SRC-007`；`F010/F011/F016/F032`；`M005`；核 T2/T3 当前指标冻结、下达、变动时刻；只有上传余额图时仅判“有材料主张”，不推断可支出；余额阈值留 G07/财务；权威状态可确认 `PASS_FACT`（只证明状态）；错年 `CONFLICT`；财务系统失联 `SOURCE_UNAVAILABLE` → 预算主管",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "年度计划及备案事实；L1",
          "requirement": "`R007` 年度计划及备案事实；L1；T=A/B 已报计划或 C 已有计划；F=D1 新增尚待补报；U=是否需备案未知；`SRC-001/SRC-002/SRC-003`；`F008/F012/F013`；`M006`；以采购中心 T2 记录核年度、计划 ID、备案/撤销状态及版本；2025 已报不自动视为 2026 备案；已有一致 `PASS_FACT`；应有却无且可由单位提供 `NEEDS_MATERIAL`；中心源失联 `SOURCE_UNAVAILABLE` → 采招中心",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "分包与采购计划归属；L1 已分包/L3",
          "requirement": "`R008` 分包与采购计划归属；L1 已分包/L3；T=中心已有分包/组合；F=尚未分包；U=包号仅上传文本/不明；`SRC-002/SRC-003`；`F009/F012/F013/F017/F032`；`M006/M013`；计划→每个包→项目的 T2 映射对齐，按受理时版次；拆包、合包后旧计划不得覆盖新包；对齐 `PASS_FACT`；错包 `CONFLICT`；未分包 `NOT_APPLICABLE` → 采招中心项目负责人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "当前需求目标和标的陈述；L0",
          "requirement": "`R009` 当前需求目标和标的陈述；L0；T=真实发起需求；F=非采购案；U=材料不可判是否采购；`SRC-002/SRC-003`；`F007/F014/F015/F016`；`M001/M008`；比较目的、货物/服务/工程、清单与估算的自洽，不把可读主张当已论证可采购；OCR 不可读另见 R027；可定位一致 `PASS_FACT`（仅主张存在）；缺当前需求 `NEEDS_MATERIAL`；自相矛盾 `CONFLICT` → 需求单位经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "估算金额与计划/预算口径一致性；L1/L2",
          "requirement": "`R010` 估算金额与计划/预算口径一致性；L1/L2；T=两个以上可比较的金额/币种/包口径；F=仅 L0 一份初始估算；U=币种/包范围不明；`SRC-002/SRC-003/SRC-004`；`F008/F010/F016/F017`；`M001/M005/M006/M008`；统一币种、税费范围、年度、分包对应后比对 T1 与 T2；不凭旧校本金额阈值判违法，也不替 G07 判断可支出；同口径一致 `PASS_FACT`；数额不一致 `CONFLICT`；口径难定 `NEEDS_HUMAN_DECISION` → 财务与需求单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "政府/非政府采购分类与组织路径适用；L1–L3",
          "requirement": "`R011` 政府/非政府采购分类与组织路径适用；L1–L3；T=项目需确定 A/B/C 路线；F=尚处 L0 不作权威路径确认；U=当前政策版本/归类不明；`SRC-001/SRC-003/SRC-010/SRC-013/SRC-015/SRC-022`；`F015/F016/F022/F023/F029/F030`；`M008/M014/M013/M022`；校方采招中心/财政有效目录的当期品目、资金属性和有权组织方式逐包比对；2024 年报的基建金额区间不是全校阈值；申请人选 C 不是自采授权，旧 `SRC-009` 不得定阈值；有权路径已核可 `PASS_FACT`；两路冲突 `CONFLICT`；本 R 政策未全为 `POLICY_UNCONFIRMED`，如另需组织授权则 `R024` 独立记 `NEEDS_HUMAN_DECISION` → 采招中心/法定主管",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "08.3 连续 R 规则：论证、归口与外部决定（`R012–R024`）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R012",
          "title": "市场调查事实及需求对应；L2",
          "requirement": "`R012` 市场调查事实及需求对应；L2；T=适用需求论证已进入调研报送；F=L0/L1 尚未调研或现行制度确认豁免；U=调研要求未知；`SRC-002/SRC-014`；`F014/F015/F016/F019/F032`；`M008/M009`；核调查对象、记录时间、所对应 M008 需求版本；T1 可证“有调查”，不自动评价充分性；供应商数量等现行规定未知；已有可读调查 `PASS_FACT`（仅存在一致）；L2 应有缺失 `NEEDS_MATERIAL`；方法裁量 `NEEDS_HUMAN_DECISION` → 单位专业人员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "校本需求论证表的存在、完整性与版本；L2",
          "requirement": "`R013` 校本需求论证表的存在、完整性与版本；L2；T=现行通知要求提交论证；F=该阶段未到或已证豁免；U=2026 表样适用性不明；`SRC-001/SRC-002/SRC-016`；`F014/F015/F020/F032`；`M008/M010`；对照学校确认的表样 ID/版次、需求范围与 M008，不编造字段；2025 表名不等于 2026 版所有栏目；表格式未知须归口确认；同版事实 `PASS_FACT`；应有缺件 `NEEDS_MATERIAL`；表样不明 `POLICY_UNCONFIRMED` → 单位/采招中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "单位内部审核记录与论证版绑定；L2",
          "requirement": "`R014` 单位内部审核记录与论证版绑定；L2；T=论证已经进入单位内部完成审核/报送；F=尚未送审草稿；U=签批是否成立不明；`SRC-002/SRC-003`；`F006/F020/F021/F032`；`M010/M011`；OA T3 审核事件关联 M010 哈希/版次，检查签发时点晚于论证，旧版签章不得自动续用；批准权需另核 R003；同版事实 `PASS_FACT`；错版/倒挂 `CONFLICT`；校本签批形式不明 `NEEDS_HUMAN_DECISION` → 单位有权审核人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "采购意向材料适用与状态；L2",
          "requirement": "`R015` 采购意向材料适用与状态；L2；T=政府采购或经现行规定确须公告的分支；F=已核不适用；U=非政采/紧急例外无法证明；`SRC-001/SRC-002/SRC-013/SRC-014`；`F012/F015/F017/F029`；`M012/M022`；区分起草、单位报送、公开发布与法定完成状态；2025 需报材料不代表所有 C 情形都有公开义务；有真实阶段材料 `PASS_FACT`；缺本阶段已应有者 `NEEDS_MATERIAL`；法源不明 `POLICY_UNCONFIRMED` → 采招中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "中心受理/初审事实与效力；L3",
          "requirement": "`R016` 中心受理/初审事实与效力；L3；T=单位确已交中心且声称被受理/初审；F=尚未向中心提交；U=中心记录失联；`SRC-001/SRC-003`；`F012/F017/F023/F024/F032`；`M006/M013`；中心 T2/T3 原始回执和意见的对象、时间、状态；**初审结果不自动等于采购方式批准**；收件一致 `PASS_FACT`；上传自称已批而中心否认 `CONFLICT`；失联 `SOURCE_UNAVAILABLE` → 中心受理岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "联合需求单位的牵头与权限；L1/E",
          "requirement": "`R017` 联合需求单位的牵头与权限；L1/E；T=多校内单位共享需求/采购包；F=经核仅一单位；U=联合关系未明；`SRC-002/SRC-003`；`F003/F005/F018/F026`；`M003/M015`；逐单位核 T2 授权、牵头对象和分包关联，防止一院代表另院签字；是否必须共同会签按校规另核；有效关系 `PASS_FACT`；单位主张抵触 `CONFLICT`；牵头权不明 `NEEDS_HUMAN_DECISION` → 成员单位/采招中心",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "资产/信息化/工程/进口/涉密专项前置事实；L1–L3/F",
          "requirement": "`R018` 资产/信息化/工程/进口/涉密专项前置事实；L1–L3/F；T=有权归口证实特定专项许可适用；F=核定该项不适用；U=仅凭名称怀疑触发；`SRC-006/SRC-012/SRC-013/SRC-015/SRC-016`；`F015/F025/F026/F029`；`M008/M016/M023`；按标的、使用场景、专项决定 ID/有效期作 T3 引用；不得用一般采购案批准设备立项、进口许可或定密；涉密原件不得传无权限 OCR；可信专项事实 `PASS_FACT`；源不可达 `SOURCE_UNAVAILABLE`；本 R 的法源触发不明 `POLICY_UNCONFIRMED`，另由专项归口人工认定许可（独立待办），不混作同一结果",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "T03 科研项目资格与经费授权引用；L1/G",
          "requirement": "`R019` T03 科研项目资格与经费授权引用；L1/G；T=项目资金源为科研；F=有权确认非科研资金；U=科研项目号或有效性未明；`SRC-003/SRC-004/SRC-007`（限职责边界）；`F008/F009/F010/F026`；`M004/M005/M017`；只核 T03/科研归口 T3 有效项目与预算决定 ID、对应采购项目号；“申请通过”或旧 run 不是授权；不重审科研成果；可信外部决定对应 `PASS_FACT`；编号冲突 `CONFLICT`；记录不可取 `SOURCE_UNAVAILABLE` → 科研/财务归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "计划外新增/补报请求的前置事实；L0–L1/D1",
          "requirement": "`R020` 计划外新增/补报请求的前置事实；L0–L1/D1；T=当期无已报计划而申请新增；F=已明确有效计划；U=计划状态查不到；`SRC-001/SRC-003/SRC-007`；`F007/F012/F013/F028`；`M001/M007/M006`；在申请时仅核新增事由和需求，补报批准须未来由中心形成；查不到计划先 `SOURCE_UNAVAILABLE` 而非否决；窗口时间待现行通知；事由可读 `PASS_FACT`（仅申请事实）；M007 缺失 `NEEDS_MATERIAL`；批复权限 `NEEDS_HUMAN_DECISION` → 单位/中心",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "一般业务急需与拟请求例外；L0–L3/D2b",
          "requirement": "`R021` 一般业务急需与拟请求例外；L0–L3/D2b；T=单位提出临时急需或请求特别办理；F=常规无急需，或已转 R030 法定 D2a；U=紧急性质无法分类；`SRC-001/SRC-003/SRC-009/SRC-010/SRC-020`；`F007/F014/F025/F028/F029/F033`；`M007/M023`；核急需原因和事件时间，只证明请求存在；2026 国家办法第二、三条的突发事件标准**不等于**院系赶工、课题排期；旧 2023 文件只作历史线索，业务例外是否存在仍依现行校规；请求事实可 `PASS_FACT`；缺说明 `NEEDS_MATERIAL`；拟豁免依据未知 `POLICY_UNCONFIRMED` → 采招中心；不能对普通 D2b 套法定紧急采购简化程序",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "原计划/资金/分包变更与新版效力；L1–L4/D3",
          "requirement": "`R022` 原计划/资金/分包变更与新版效力；L1–L4/D3；T=原案存在变更请求；F=没有变更、原版持续有效；U=旧案/新版关系无法证明；`SRC-002/SRC-003/SRC-007`；`F008/F010/F012/F013/F016/F017/F028/F032`；`M006/M019/M018`；核 old→new 案号、变更类型、财务/中心批准的生效时点；请求≠新批准，已生成的真实外部决定由原签发方变更；变更链清晰 `PASS_FACT`（只证申请/版次）；同包时点冲突 `CONFLICT`；批准未核 `NEEDS_HUMAN_DECISION` → 原归口机关",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "委托社会采购代理与项目范围；L3/C 或中心委托",
          "requirement": "`R023` 委托社会采购代理与项目范围；L3/C 或中心委托；T=已选择委托代理；F=明确由单位/中心直接办理；U=代理授权文件未知；`SRC-003/SRC-005/SRC-009`（旧规则非现行依据）；`F005/F023/F026/F029`；`M014/M021`；核代理合同/委托的项目包、授予主体、范围与有效期，T3 校方委托优先；只证明代理组织权，不等于采购方式或合同审查获批；有效范围 `PASS_FACT`；越包/过期 `CONFLICT`；本 R 当前授权规则不明 `POLICY_UNCONFIRMED`，另派采购中心/合同归口人工确认签发权限",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "学校/法定主体最终有权决定的真伪及关联；L4",
          "requirement": "`R024` 学校/法定主体最终有权决定的真伪及关联；L4；T=已到真实有权决定阶段或声称已批准；F=L0–L3 尚未到正式决定阶段且未声称已批；U=是否存在该独立决定/生效程序未知；`SRC-001/SRC-003/SRC-010/SRC-013`；`F005/F023/F027/F029/F032`；`M013/M014/M020`；T3 验证签发机构权限、决定类型、项目/包、签发与失效时刻；预算备案和需求初审不可代签；不存在独立普遍立项制度时只记实际有权决定类型；真决定存在只能记“**权威决定已验证**”事实 `PASS_FACT`；伪造/错版 `CONFLICT`；L4 待决定或权限/有无此类决定不明 `NEEDS_HUMAN_DECISION`，**不报 M020 缺件** → 校方真实决定机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-4",
      "name": "08.4 连续 R 规则：政策、期限、载体和请求生命周期（`R025–R029`）",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R025",
          "title": "现行校本制度/目录适用性；L1–L4",
          "requirement": "`R025` 现行校本制度/目录适用性；L1–L4；T=要据制度认定类别、金额限额或签批权限；F=仅 L0 记录主张无需政策阈值；U=制度版本未见全文；`SRC-001/SRC-009/SRC-010/SRC-011/SRC-015/SRC-016/SRC-020/SRC-022`；`F007/F008/F015/F016/F023/F029/F030`；`M014/M022`；校内正式制度/财政目录按签发日、生效日、项目年度与当期有效性核对；`SRC-015` 的 2024 全文可作当期版本候选，`SRC-022` 仅证明2024年特定基建路径，二者不能直接给2026校内自采授权；2026 新紧急办法仅适于真正 D2a；外校不得当本校依据；版本真实对应可 `PASS_FACT`；适用不明 `POLICY_UNCONFIRMED`；范围裁量 `NEEDS_HUMAN_DECISION` → 采招/政策管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "可证明的办理截止/受理日期；L0–L4",
          "requirement": "`R026` 可证明的办理截止/受理日期；L0–L4；T=现行通知/权威回执明定该场景时限；F=有权确认本节点不设此项截止；U=只找到历史通知/空白；`SRC-001/SRC-002/SRC-016`；`F002/F028/F031`；`M013/M022`；对照 2026 有效通知、官方受理时刻及是否适用批次；绝不用 2021/2025 截止迁移 2026；不给默认逾期天数；日期可核 `PASS_FACT`；时限依据不可证 `POLICY_UNCONFIRMED` → 受理机构；不得机器逾期拒绝",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "当前证据文件可读、归属与版本真实性；每次纳入材料",
          "requirement": "`R027` 当前证据文件可读、归属与版本真实性；每次纳入材料；T=本案实际接收 M 槽证据；F=槽在此阶段不适用/未产生；U=材料归属或格式不明；`SRC-002/SRC-016/SRC-018`（仅入口线索）；`F001/F002/F020/F021/F032`；`M001/M008/M010/M011`（并**逐项施于 M001–M025**）；校验 MIME、页/字段定位、哈希、所属项目/包、版次与证据源；OCR T0 低置信度不制造印章；受限文件只在合法授权环境读；可读可定位 `PASS_FACT`；读失败 `UNREADABLE`；错案/旧版 `CONFLICT` → 材料持有人/档案管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "撤回请求与生效边界；L0–L4/H2",
          "requirement": "`R028` 撤回请求与生效边界；L0–L4/H2；T=真实提交撤回/终止请求；F=无撤回请求；U=申请人权限、受理和撤回阶段未知；`SRC-003/SRC-010/SRC-016`（程序待核）；`F001/F002/F004/F005/F028/F032`；`M002/M018/M020`；申请→有权受理→正式准许/拒绝是分立事件；新案重提必须链接原案、不能覆盖旧决定；效力取 T3 来源时刻；请求存在 `PASS_FACT`（仅提出）；渠道/身份不明 `NEEDS_HUMAN_DECISION`，规则不明 `POLICY_UNCONFIRMED` → 原受理/批准机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "异议/复核请求及后续决定引用；L1–L4/H3",
          "requirement": "`R029` 异议/复核请求及后续决定引用；L1–L4/H3；T=有争点及正式申请复核；F=未提出复核；U=申请资格/受理渠道/期限不明；`SRC-003/SRC-010/SRC-016`（仅职能线索）；`F001/F002/F004/F005/F027/F028/F031/F032`；`M018/M020/M022`；只对原决定 ID、申诉人授权、争点、提交日期及后发复核决定 ID 作 T2/T3 引用；不能由本 R 复写另一审批主体结论；请求事实 `PASS_FACT`；原决定无法核 `SOURCE_UNAVAILABLE`；本 R 的权利或期限不明 `POLICY_UNCONFIRMED`，另由采购归口/合法复核机关作独立受理决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "2026 法定紧急采购适用事实；L0–L1/D2a",
          "requirement": "`R030` 2026 法定紧急采购适用事实；L0–L1/D2a；T=请求依据财库〔2026〕12号启动法定紧急采购；F=经可信证据证实只是普通业务急需或预先储备采购，应回 D2b/常规路由；U=事件性质、预算/目录、现有储备或紧急调拨事实未知；`SRC-020/SRC-013/SRC-015`；`F007/F008/F010/F015/F033/F034`；`M007/M024/M022`；以采购事项发生时（不得早于 2026-10-01）事件证明、预算资金、当期目录/限额、库存与调拨/支援状态 T2/人工原件逐项核；不得将“会议紧迫”“资金年底用完”视突发事件；涉密另循专规；仅完整可证的**适用事实** `PASS_FACT`；关键主管记录失联 `SOURCE_UNAVAILABLE`；明显与事实相反 `CONFLICT`；目录效力未知 `POLICY_UNCONFIRMED`；须人工定性 `NEEDS_HUMAN_DECISION` → 采购人/应急主管，不授予启动权",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "法定紧急采购内部会商启动决定；L1–L3/D2a",
          "requirement": "`R031` 法定紧急采购内部会商启动决定；L1–L3/D2a；T=R030 事实已核且已进入真实启动会商/权限核验节点；F=非 D2a 或**尚未进入会商节点**；U=节点已到但会商或有权签发主体不明；`SRC-020/SRC-003/SRC-010`；`F005/F027/F029/F033/F034/F035/F032`；`M024/M025/M022`；验证真实采购人 T3 会商/决策 ID、组织权限、事由、同一项目/包与时点，国家第 5、7 条不是指定某院长或经办可独签；未开会仅记下一阶段待决定，不向申请人索未来的 `M025`；仅对真实已形成会商**存在及对象一致**为 `PASS_FACT`；T 下尚未会商 `NEEDS_HUMAN_DECISION`（不是材料缺失）；F 为 `NOT_APPLICABLE`；伪造签批/错包 `CONFLICT`；原系统失联 `SOURCE_UNAVAILABLE` → 学校有权采购人会商/采招主管",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l0",
      "name": "需求酝酿/发起",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l1",
      "workflowOwner": "local"
    },
    {
      "id": "l1",
      "name": "计划、资金和申请资格核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local"
    },
    {
      "id": "l2",
      "name": "调研论证及单位内部审核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "采购中心接收、初审、归类/组织路径",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "学校/法定主体正式决定（如适用）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l5",
      "workflowOwner": "local"
    },
    {
      "id": "l5",
      "name": "后续实施引用",
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
