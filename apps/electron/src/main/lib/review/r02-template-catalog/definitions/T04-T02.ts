import type { TemplateVersion } from '@profer/shared'

/** SRC IDs below are research-source metadata, never case SourceRef values. */
export const r02Metadata = {
  "templateId": "T04-T02",
  "name": "招采方式、询比价与供应商选择程序审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T02.md",
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T04-T02.md",
  "sourceDocumentSha256": "63e7ba2b958014dec214aafeafc344cf6a19b366ccae98ec2b96d2725fe6c702",
  "originalSourceSha256": "63e7ba2b958014dec214aafeafc344cf6a19b366ccae98ec2b96d2725fe6c702",
  "originalGitBlobSha": "7ae0dae8444cc202e6aa2cf1d038045a83016e88",
  "sourceIntegrityNote": "LINE_ENDING_DRIFT_ONE_LF: Git blob plus one LF matches authoritative manifest bytes/SHA-256; reviewed source follows that convention.",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "School-specific current rules, authorization matrix and current forms remain incomplete; unresolved policy branches stay manual and cannot produce official pass/reject.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "校方采购制度目录",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/index.htm"
      ],
      "description": "| **SRC-001** `CURRENTITY-UNKNOWN` | 成都理工大学采购与招标管理中心：《成都理工大学非政府采购实施细则》，成理校发〔2024〕1号；[校方采购制度目录](https://cg.cdut.edu.cn/index.htm) | 首页“政策法规”列表 06-27（年份待查）；校长办公会 2024-01-03 审定见 SRC-013；正文条、印发/生效/废止未知 | 成都理工大学非政府采购；**确认标题/文号与后续年度引用，未取得原文，直接访问官网返回 412**。不得据此写死家数和阈值。 |"
    },
    {
      "id": "SRC-002",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm"
      ],
      "description": "| **SRC-002** `CDUT-VERIFIED` | 成都理工大学信息公开：《成都理工大学2025年信息公开年度报告》；[原页](https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm) | “推进财务信息公开”“未达到政府采购标准的工程项目”；报告年 2025，网页具体发布日未在索引显示；生效/废止不适用 | 校本**年度实践**：叙述 1 万（含）至 30 万以下服务及工程采购公开、30 万（含）以上交中心委托代理；官方索引可读、直开 412；**不是完整采购办法条文，也不是全部货物规则**。 |"
    },
    {
      "id": "SRC-003",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm"
      ],
      "description": "| **SRC-003** `CDUT-VERIFIED` | 成都理工大学信息公开：《成都理工大学关于2024年信息公开工作的报告》；[原页](https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4001.htm) | “规范基建信息公开”“严格执行招采规定”；报告 2024；具体网页发布日期待核；生效/废止不适用 | 校本年度实践及成理校发〔2024〕1号文号复核；官方索引可读、直开 412。30 万以上非政采代理组织及公告公开仅作为对应叙述，不推成自动普适规则。 |"
    },
    {
      "id": "SRC-004",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/3280.htm"
      ],
      "description": "| **SRC-004** `CDUT-VERIFIED` | 成都理工大学采购与招标管理中心：《关于〈成都理工大学采购管理办法（试行）〉的补充说明》；[原页](https://cg.cdut.edu.cn/info/1008/3280.htm) | 第 1—5 项；**2023-03-07**；基于成理校发〔2021〕12号第 11 条；生效/废止、被 2024 细则替代范围不明 | 校本历史说明，包含自采主体、货物候选方式、三家/报价轮次、网上商城 10 万以下、服务不可用“询价”、留存材料；索引正文可读、直开 412。**适用性冻结，不能直接成为 2026 硬规则**。 |"
    },
    {
      "id": "SRC-005",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cg.cdut.edu.cn/info/1008/4398.htm"
      ],
      "description": "| **SRC-005** `CDUT-VERIFIED` | 成都理工大学采购与招标管理中心：《关于开展2025年度采购工作的通知》；[原页](https://cg.cdut.edu.cn/info/1008/4398.htm) | 第一至五部分、附件 1/2 名称；**2025-05-08** 发布；仅该年度通知 | 已报采购计划单位确认项目/分包/方式；明确单位责任领导、采购经办、单位审核后向中心提交采购需求论证表与政府采购意向公告表。附件有 ZIP/DOCX 链接但本轮**未取得表内字段**；不能推得 2026 普遍期限。 |"
    },
    {
      "id": "SRC-006",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/info/1063/4726.htm"
      ],
      "description": "| **SRC-006** `CDUT-VERIFIED` | 成都理工大学党政办公室/依法治校办公室：《〈成都理工大学合同管理办法（2024修订版）〉解读》；[原页](https://dbxb.cdut.edu.cn/info/1063/4726.htm) | 引述《合同管理办法》**第 15 条**；**2024-04-07** 发布；成理校发〔2024〕8号 2024-03-15 印发；废止未核 | 校本合同前置程序边界；采购/询比价/会议决定是**签约前置**，本模板不接管合同签章；索引可读、直开 412。 |"
    },
    {
      "id": "SRC-007",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gra.cdut.edu.cn/info/1007/5930.htm"
      ],
      "description": "| **SRC-007** `CDUT-VERIFIED` | 成都理工大学研究生院：《成都理工大学2026年学校徽章采购公开询价公告》；[原页](https://gra.cdut.edu.cn/info/1007/5930.htm) | 项目概况、询价文件递交、现场询价；**2026-07-06**；个案公告而非制度 | 成都校区货物询价实践，预算 28000 元仅为该项目个案，不是阈值；官方索引正文可读、直开 412。 |"
    },
    {
      "id": "SRC-008",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gz.cdut.edu.cn/info/1043/2716.htm"
      ],
      "description": "| **SRC-008** `CDUT-VERIFIED` | 成都理工大学国资与实验室管理处：《成都理工大学2026年实验室安全文化周服务校内比选公告》；[原页](https://gz.cdut.edu.cn/info/1043/2716.htm) | “比选项目概况”“比选中选结果确认方式”；**2026-04-28**；个案 | 2026 成都校区服务比选，记载 3 人小组、监督、现场拆封、有效最低报价；但同一公告出现“询价响应文件”文字，**术语冲突必须人工核**；仅作为实际案例。 |"
    },
    {
      "id": "SRC-009",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gjc.cdut.edu.cn/info/1011/1905.htm"
      ],
      "description": "| **SRC-009** `CDUT-VERIFIED` | 成都理工大学校园规划与建设处：《榕树园2号学生公寓、东区3号学生公寓施工图审查服务项目比选结果公告》；[原页](https://gjc.cdut.edu.cn/info/1011/1905.htm) | 评选组织、响应、开启；**2026-06-16**；个案 | 工程相关服务比选，记载 3 名评委及 1 名监督、5 家响应；仅证实具体组织做法，不能推为法律通用人数。 |"
    },
    {
      "id": "SRC-010",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://bwc.cdut.edu.cn/info/1033/2373.htm"
      ],
      "description": "| **SRC-010** `CDUT-VERIFIED` | 成都理工大学保卫处：《安防巡逻车购买项目比选结果公告》；[原页](https://bwc.cdut.edu.cn/info/1033/2373.htm) | 公告首段与比选结果；**2026-04-13**；个案 | 校本 2026 年项目仍称依据“采购管理办法”“非政府采购实施细则”，是 2024 细则继续被部门使用的旁证；非全文现行性证明。 |"
    },
    {
      "id": "SRC-011",
      "title": "官网制度列表",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/index.htm",
        "https://jcc.cdut.edu.cn/info/1014/2567.htm"
      ],
      "description": "| **SRC-011** `CURRENTITY-UNKNOWN` | 成都理工大学采购与招标管理中心：《成都理工大学采购代理机构管理办法》；[官网制度列表](https://cg.cdut.edu.cn/index.htm) | 首页“政策法规”列表 12-18；年份、文号、条款、生效/废止待查；2025 考核实际引用可交叉核验 [考核报道](https://jcc.cdut.edu.cn/info/1014/2567.htm) | 学校采购代理机构授权/履约管理；可证文件存在及 2025 年使用，**正文未得，委托方式、职责与回避不能硬编**。 |"
    },
    {
      "id": "SRC-012",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://yb.cdut.edu.cn/info/1042/4531.htm"
      ],
      "description": "| **SRC-012** `CDUT-VERIFIED` | 成都理工大学宜宾校区：《宜宾校区第六届读书月活动物资采购询价公告》；[原页](https://yb.cdut.edu.cn/info/1042/4531.htm) | 供应商报价、递交、开标、评选；**2026-04-16**；个案 | 宜宾校区货物询价，项目采用符合条件的总价最低方式；仅项目级实践，校区共享授权/制度待核。 |"
    },
    {
      "id": "SRC-013",
      "title": "官方 PDF",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://dbxb.cdut.edu.cn/__local/B/A0/BE/AEE3FE9DF44A4382326CAC4E5CA_2979B53E_154C3.pdf"
      ],
      "description": "| **SRC-013** `CDUT-VERIFIED` | 成都理工大学校长办公会：《校长办公会纪要〔2024〕1号》；[官方 PDF](https://dbxb.cdut.edu.cn/__local/B/A0/BE/AEE3FE9DF44A4382326CAC4E5CA_2979B53E_154C3.pdf) | **2024-01-03** 会议主要内容第 9 项：“审定《成都理工大学非政府采购实施细则》相关事宜”；发布上网日未知；会议记录非实施文本 | 验证 2024 细则制定事件，不含细则条文/生效日；官方 PDF 搜索索引可读。 |"
    },
    {
      "id": "SRC-014",
      "title": "原页",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html"
      ],
      "description": "| **SRC-014** `GENERAL-RESEARCH` | 国家市场监督管理总局公布：《中华人民共和国政府采购法》（2014 年修正文本）；[原页](https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_47b5807c40c040368eb5f13b489d6c43.html) | 第 2、22、26 条等；2002 通过，2014 修正；当前后续变动仍需法制库核查 | **国家法**，政府采购法定范围及方式依据；不是成都理工大学内部金额授权表。 |"
    },
    {
      "id": "SRC-015",
      "title": "原页",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gp/xxgkml/tfs/201401/t20140102_2510302.htm"
      ],
      "description": "| **SRC-015** `GENERAL-RESEARCH` | 中华人民共和国财政部：《政府采购非招标采购方式管理办法》（财政部令第 74 号）；[原页](https://www.mof.gov.cn/gp/xxgkml/tfs/201401/t20140102_2510302.htm) | 第 1 条及方式定义；2013-12 发布，**2014-02-01** 施行；修订/效力再核 | **国家法规范**，适用于符合范围的政府非招标采购；不能未经分类直接套校内非政府采购比选。 |"
    },
    {
      "id": "SRC-016",
      "title": "原页",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_1f79dd79321441a0831f3aed697b4535.html"
      ],
      "description": "| **SRC-016** `GENERAL-RESEARCH` | 国家市场监督管理总局公布：《中华人民共和国招标投标法》；[原页](https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_1f79dd79321441a0831f3aed697b4535.html) | 第 3 条及招标文件/竞争程序；1999 通过，2017 修正；现行版本再核 | **国家法**，依法必须招标工程及有关货物、服务的优先分流；不能以低于校内某阈值推免法定招标。 |"
    },
    {
      "id": "SRC-017",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gra.cdut.edu.cn/info/1074/5548.htm"
      ],
      "description": "| **SRC-017** `CDUT-VERIFIED` | 成都理工大学研究生院：《2026年全国硕士研究生招生考试自命题考试网上阅卷技术服务比选结果公告》；[原页](https://gra.cdut.edu.cn/info/1074/5548.htm) | 比选项目编号、响应数、评审组到场、结果及异议段；**2025-11-17**，项目属 2026 年考试服务；个案，不设普遍生效/废止 | 明确 4 家参与/符合、评审组 3 人、结果和该项目**公告后 3 工作日**书面异议窗口；用于证明“结果→异议”阶段出现，不能泛化全校时限。 |"
    },
    {
      "id": "SRC-018",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gjc.cdut.edu.cn/info/1011/1898.htm"
      ],
      "description": "| **SRC-018** `CDUT-VERIFIED` | 成都理工大学校园规划与建设处：《成都理工大学2026年工程律师专项服务采购项目比选公告》；[原页](https://gjc.cdut.edu.cn/info/1011/1898.htm) | 比选文件获取、报名资料、截止、监督；**2026-05-26**；个案 | 具体要求报名经办介绍信或法人授权、身份证及营业执照扫描件；响应截止 2026-06-01，校工会监督；**个人证照字段属敏感材料，不据个案扩充全部采购必要材料**。 |"
    },
    {
      "id": "SRC-019",
      "title": "原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gjc.cdut.edu.cn/info/1011/1832.htm"
      ],
      "description": "| **SRC-019** `CDUT-VERIFIED` | 成都理工大学校园规划与建设处：《油气藏地质及开发工程全国重点实验室建设项目、地质灾害与生态环境科研楼建设项目环境影响评价服务项目（二次）比选公告》；[原页](https://gjc.cdut.edu.cn/info/1011/1832.htm) | 标题“二次”、比选文件获取与递交截止；**2025-12** 公告（精确发布日待页面复核）；个案 | 可证同一采购项目发生二次公告/新轮次，**不能仅凭“二次”推知第一次失败原因、旧响应有效性或复采批准权限**。 |"
    },
    {
      "id": "SRC-020",
      "title": "常用下载",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cg.cdut.edu.cn/cyxz.htm",
        "https://cg.cdut.edu.cn/index.htm"
      ],
      "description": "| **SRC-020** `CURRENTITY-UNKNOWN` | 成都理工大学采购与招标管理中心：[常用下载](https://cg.cdut.edu.cn/cyxz.htm) 与 [中心首页办事指南](https://cg.cdut.edu.cn/index.htm)：《成都理工大学采购需求论证表》《成都理工大学政府采购意向公告》、采购管理流程图、各政府采购方式流程图、单一来源相关指引 | 站点栏目索引及 2025-05-08 通知（SRC-005）列明附件；各文件独立发布日期、字段、版本和现行性未取得 | 确认可在校方渠道寻找这些表单/指南，**未读附件正文与填报字段，不能造必填栏、签字顺序、统一办理期限**；后续应由归口机构提供可验证副本。 |"
    },
    {
      "id": "SRC-021",
      "title": "省内高校转载原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.xcc.edu.cn/cgzx/gzzd48/szzc/721179/index.html",
        "https://czt.sc.gov.cn/scczt/zcjd/2023/11/8/f17f13b9d13a4695aa40fac8d6a75d0c/files/%E3%80%8A%E5%9B%9B%E5%B7%9D%E7%9C%81%E6%94%BF%E5%BA%9C%E9%9B%86%E4%B8%AD%E9%87%87%E8%B4%AD%E7%9B%AE%E5%BD%95%E5%8F%8A%E6%A0%87%E5%87%86%EF%BC%882024%E5%B9%B4%E7%89%88%EF%BC%89%E3%80%8B%E6%94%BF%E7%AD%96%E8%A7%A3%E8%AF%BB.pdf"
      ],
      "description": "| **SRC-021** `GENERAL-RESEARCH` | 四川省财政厅：《关于印发〈四川省政府集中采购目录及标准（2024年版）〉的通知》（川财规〔2023〕9号）；[省内高校转载原文](https://www.xcc.edu.cn/cgzx/gzzd48/szzc/721179/index.html)、[省财政厅官方政策解读 PDF](https://czt.sc.gov.cn/scczt/zcjd/2023/11/8/f17f13b9d13a4695aa40fac8d6a75d0c/files/%E3%80%8A%E5%9B%9B%E5%B7%9D%E7%9C%81%E6%94%BF%E5%BA%9C%E9%9B%86%E4%B8%AD%E9%87%87%E8%B4%AD%E7%9B%AE%E5%BD%95%E5%8F%8A%E6%A0%87%E5%87%86%EF%BC%882024%E5%B9%B4%E7%89%88%EF%BC%89%E3%80%8B%E6%94%B"
    },
    {
      "id": "SRC-022",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://zfxxgk.ndrc.gov.cn/web/iteminfo.jsp?id=18461"
      ],
      "description": "| **SRC-022** `GENERAL-RESEARCH` | 国家发展改革委：《必须招标的工程项目规定》（第 16 号令）；[原文](https://zfxxgk.ndrc.gov.cn/web/iteminfo.jsp?id=18461) | 2018-03-27 发布、2018-06-01 施行，第 2—5 条；2026 版本延续性可由官方法规库再核 | **先判是否落入第 2—4 条范围，才考察第 5 条规模**；勘察、设计、监理等服务单项 100 万及可合并采购是此法域的门槛，不能对“任何工程相关律师、环评、咨询”凭项目题名自动套用。 |"
    },
    {
      "id": "SRC-023",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://zfxxgk.ndrc.gov.cn/web/iteminfo.jsp?id=19808"
      ],
      "description": "| **SRC-023** `GENERAL-RESEARCH` | 国家发展改革委：《必须招标的基础设施和公用事业项目范围规定》（发改法规规〔2018〕843 号）；[原文](https://zfxxgk.ndrc.gov.cn/web/iteminfo.jsp?id=19808) | 2018-06-06 印发，第 2 条列范围；2026 最新修订链继续核 | 第 16 号令第 4 条所涉大型基础设施、公用事业的配套范围；学校工程不能仅因“高校”“基建”两个字自动推定符合/不符合。 |"
    },
    {
      "id": "SRC-024",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.ndrc.gov.cn/xwdt/tzgg/202010/t20201023_1248831.html"
      ],
      "description": "| **SRC-024** `GENERAL-RESEARCH` | 国家发展改革委：《关于进一步做好〈必须招标的工程项目规定〉和〈必须招标的基础设施和公用事业项目范围规定〉实施工作的通知》（发改办法规〔2020〕770 号）；[原文](https://www.ndrc.gov.cn/xwdt/tzgg/202010/t20201023_1248831.html) | 2020-10-23，第 2—4 部分（范围、估价/合并、总承包解释）；2026 时效继续核 | 专门纠正“工程关联就必招”及“拆包即可避招”两个极端：分别核项目法定范围、同项目可合并估价、施工/货物/服务分项规模及总承包性质。 |"
    },
    {
      "id": "SRC-025",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gkml/caizhengwengao/wg2018/wg201802/201804/t20180428_2880863.htm"
      ],
      "description": "| **SRC-025** `GENERAL-RESEARCH` | 财政部：《政府采购代理机构管理暂行办法》（财库〔2018〕2 号）；[原文](https://www.mof.gov.cn/gkml/caizhengwengao/wg2018/wg201802/201804/t20180428_2880863.htm) | 2018-01-04 印发；第 13、14 条，适用于政府采购社会代理活动；是否有新法替代待核 | 已核法定委托协议须写范围、权限、期限、档案及解除等，并按协议活动；**不是**成都理工大学《采购代理机构管理办法》（SRC-011）的替代文本。 |"
    },
    {
      "id": "SRC-026",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gp/xxgkml/tfs/201801/t20180102_2791702.htm"
      ],
      "description": "| **SRC-026** `GENERAL-RESEARCH` | 财政部令第 94 号：《政府采购质疑和投诉办法》；[原文](https://www.mof.gov.cn/gp/xxgkml/tfs/201801/t20180102_2791702.htm) | 2017-12-26 公布，2018-03-01 施行；第 10 条、第 17 条等；后续修订需核 | 对**确属政府采购**的质疑/投诉分别规定起算和主体，例如质疑 7 个工作日、答复期满后投诉 15 个工作日；不得套给普通校内比选的书面异议。 |"
    },
    {
      "id": "SRC-027",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gp/xxgkml/tfs/201707/t20170718_2652766.htm"
      ],
      "description": "| **SRC-027** `GENERAL-RESEARCH` | 财政部令第 87 号：《政府采购货物和服务招标投标管理办法》；[原文](https://www.mof.gov.cn/gp/xxgkml/tfs/201707/t20170718_2652766.htm) | 2017-07-11 公布，2017-10-01 施行；第 8—9、69 条等；时效待法库确认 | 政府采购**货物/服务招标**的委托、公告、评审程序；不能机械移植到校内非政府采购询比价。 |"
    },
    {
      "id": "SRC-028",
      "title": "原文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/gkml/caizhengwengao/wg2016/wg201609/201702/t20170209_2531790.htm"
      ],
      "description": "| **SRC-028** `GENERAL-RESEARCH` | 财政部：《关于加强政府采购活动内部控制管理的指导意见》（财库〔2016〕99 号）；[原文](https://www.mof.gov.cn/gkml/caizhengwengao/wg2016/wg201609/201702/t20170209_2531790.htm) | 2016-06-29 发布；岗位分离、代理协议、采购记录控制部分；政策性质为行政指导 | 政府采购内部控制原则与责任拆分依据；未获取校内现行岗位矩阵时，不得用“采购中心”四字自动授予全部审批权。 |"
    },
    {
      "id": "SRC-029",
      "title": "财政部转载全文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/201502/t20150227_1195516.htm"
      ],
      "description": "| **SRC-029** `GENERAL-RESEARCH` | 国务院：《中华人民共和国政府采购法实施条例》（国务院令第 658 号）；[财政部转载全文](https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/201502/t20150227_1195516.htm) | 2015-01-30 公布、2015-03-01 施行；第 11、16 条，修订效力复核 | 政府采购中采购人内控、委托协议内容的法定依据；只在政府采购法域触发，须查本项目委托具体内容。 |"
    },
    {
      "id": "SRC-030",
      "title": "校方原页",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cie.cdut.edu.cn/info/1048/2026.htm"
      ],
      "description": "| **SRC-030** `CDUT-VERIFIED` | 成都理工大学国际教育学院：《国际学生数字化管理平台建设项目采购服务比选公告》；[校方原页](https://cie.cdut.edu.cn/info/1048/2026.htm) | 2026 年公开服务比选个案，项目资格/文件节点；发布具体日以原网页核 | 更多**服务比选真实案例**，不能把其逐项供应商证照、评价方法或预算移作所有服务项目硬性条件。 |"
    },
    {
      "id": "SRC-031",
      "title": "校方 PDF",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://xxgk.bit.edu.cn/docs/2022-06/dc15dfe70f9a4804b17efe63e9bd835b.pdf"
      ],
      "description": "| **SRC-031** `CROSS-SCHOOL-REFERENCE` | 北京理工大学：《招标代理机构库管理办法（试行）》（北理工发〔2017〕65 号）；[校方 PDF](https://xxgk.bit.edu.cn/docs/2022-06/dc15dfe70f9a4804b17efe63e9bd835b.pdf) | 2017-09-26 原制度，第 2—8 条；该校后续现行性不核 | **仅作代理备选库、委托、项目负责人责任链的结构对照**；学校不同且版本旧，绝不能判成都理工大学代理权限、库名单或抽取方式。 | ### 04.3 本轮证据结论及禁止推断 1. **已证存在**：学校在 2026 年持续实施询价与比选，且不同部门有具体公开公告和结果；T04-T02 可以作为产品的**事实预审模板身份**（SRC-007—010/012），**不是校方独立审批项目的证明**。 2. **较强但有限的 2024 政策证据**：细则在 2024 年被审定、在 2025 年年度报"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-1",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-005",
        "SRC-019"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-008",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-011",
        "SRC-025",
        "SRC-028",
        "SRC-029",
        "SRC-031"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-005",
        "SRC-007",
        "SRC-008",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-012",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-007",
        "SRC-008",
        "SRC-012",
        "SRC-018"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-007",
        "SRC-012",
        "SRC-018"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-018"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-012",
        "SRC-018"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-007",
        "SRC-012",
        "SRC-018"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-008",
        "SRC-012",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-008",
        "SRC-009",
        "SRC-011",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-012",
        "SRC-017"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-008",
        "SRC-009",
        "SRC-017"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-009",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-009",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policySensitive": false
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-014",
        "SRC-016",
        "SRC-017",
        "SRC-026"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-014",
        "SRC-016",
        "SRC-017",
        "SRC-026"
      ],
      "evidenceStatus": "PARTIAL",
      "policySensitive": true
    },
    {
      "sectionId": "rules-08-1",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED",
      "policySensitive": false
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T04-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "招采方式、询比价与供应商选择程序审核",
  "description": "招采方式、询比价与供应商选择程序审核。本地研究模板 · 非校方正式模板。只用于事实与证据预审，未知制度、权限和正式结论由有权人员人工核定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T04-T02 是本地研究/预审定义，非成都理工大学校方正式模板；不得据此宣称校方批准、正式通过、正式拒绝或已接入校方系统。",
  "objectType": "transaction",
  "displayName": {
    "template": "T04-T02 · {{caseOrAssetId}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "string/ID 案卷 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "`F001` string/ID 案卷 ID；Case；L0 起；Sys；CaseAggregate 不可变主键；P1；SU；禁止标题代主键；M001"
    },
    {
      "key": "F002",
      "label": "string/ID 项目编码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F002` string/ID 项目编码；Project；L0 起；Up/Org；采购计划/上游结论原号；P1；NM/SU，跨材料不同号 CF；M001"
    },
    {
      "key": "F003",
      "label": "string/ID 标包编码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F003` string/ID 标包编码；Package；L0/L2 起；Up/Org；分包记录/采购文件包号；P1；无分包可显式“整项目”；错包 CF；M001/M006"
    },
    {
      "key": "F004",
      "label": "string/ID 采购轮次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F004` string/ID 采购轮次；Round；L1 起；Org/Sys；首次、二次及公告版本谱系；P1；NM；二次未关联前轮 CF；M001/M008"
    },
    {
      "key": "F005",
      "label": "string 需求单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F005` string 需求单位；Project；L0 起；Up/Auth；上游立项/机构目录；P1；NM/SU；单位异名人工核；M001/M005"
    },
    {
      "key": "F006",
      "label": "actorRef 经办人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F006` actorRef 经办人；Actor；L0 起；Auth；后端身份标识/任职快照；P2；SU/HD；Renderer 自报不可采信；M005"
    },
    {
      "key": "F007",
      "label": "authorityRef 经办授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F007` authorityRef 经办授权；ActorAuthority；L0/L1；Auth；有效授权范围/委托及有效期；P2；HD/PU；签章无法核 UR；M005/M004"
    },
    {
      "key": "F008",
      "label": "decisionRef 上游立项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F008` decisionRef 上游立项；UpstreamDecision；L0；Up；T04-T01 可信决定 ID/版本；P1；SU；无权威结果 NM，不重审；M001"
    },
    {
      "key": "F009",
      "label": "recordRef 经费项目引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F009` recordRef 经费项目引用；FundRef；L0；Up；G07/校方资金项权威引用；P2；SU/HD；不用经办文本替代；M001"
    },
    {
      "key": "F010",
      "label": "enum 校区/适用单位",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F010` enum 校区/适用单位；Project；L0；Up/Auth；机构目录/项目记录；P1；NM；校区授权未知 PU；M001/M002"
    },
    {
      "key": "F011",
      "label": "enum 采购品目/工程关系",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F011` enum 采购品目/工程关系；Project；L0；Up/Pol；需求明细/品目分类决定；P1；HD/PU；服务与工程关系不明；M001/M002"
    },
    {
      "key": "F012",
      "label": "enum 法域分类",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F012` enum 法域分类；Project；L0/L1；Pol/Auth；政采/非政采/依法必招分类核定；P1；PU+HD；模型不得按金额自行定性；M002/M005"
    },
    {
      "key": "F013",
      "label": "decimal+currency 预算口径",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F013` decimal+currency 预算口径；Package；L0/L1；Up；已批准预算/包价上限引用；P1；SU/NM；累计/拆分口径未知 PU；M001/M002"
    },
    {
      "key": "F014",
      "label": "policyRef 制度版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F014` policyRef 制度版本；PolicyContext；L1；Pol；校规文号、条、适用日及校验记录；P1；PU；仅旧 2023 文本不满足现行性；M002/M005"
    },
    {
      "key": "F015",
      "label": "enum 拟采方式",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F015` enum 拟采方式；ProcurementPlan；L1；Org/Auth；方式提议/确认版；P1；NM/HD；公告方法不同 CF；M002/M003"
    },
    {
      "key": "F016",
      "label": "text/ref 方法理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F016` text/ref 方法理由；ProcurementPlan；L1；Org/Doc；方法论证/市场调查页段；P1/P3；条件需论证却无件 NM；合法性 HD；M003/M024"
    },
    {
      "key": "F017",
      "label": "enum 组织模式",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F017` enum 组织模式；Organization；L1；Auth/Org；自组织、中心、代理的授权依据；P1；PU/HD；实际组织者不一致 CF；M004/M022"
    },
    {
      "key": "F018",
      "label": "orgRef 采购组织主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F018` orgRef 采购组织主体；Organization；L1/L2；Auth/Org；单位/中心/代理身份证明与职责；P1；HD/SU；不能据网页署名直接授全权；M004/M022"
    },
    {
      "key": "F019",
      "label": "mandateRef 代理委托",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F019` mandateRef 代理委托；Organization；L1 起条件；Auth；委托书/代理协议版本；P3；委托触发 NM/HD；非代理 NA；M022"
    },
    {
      "key": "F020",
      "label": "decisionRef 方式核定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F020` decisionRef 方式核定；ProcurementDecision；L1；Auth；有权方式确认记录、签发主体与版本；P2；HD/PU；若学校方式签批要求未确证不强制伪造；M004/M024"
    },
    {
      "key": "F021",
      "label": "fileRef 采购文件版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F021` fileRef 采购文件版本；ProcurementFile；L2；Org/Pub；原文件 ID、SHA/发布时间；P1/P3；L2 NM，未到 L2 NA；版本错配 CF；M006"
    },
    {
      "key": "F022",
      "label": "structured 资格/评审办法",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F022` structured 资格/评审办法；ProcurementFile；L2；Org/Pub；采购文件对应条/页；P1/P3；NM/UR；评分法未知 HD；M006"
    },
    {
      "key": "F023",
      "label": "enum 发布/邀请路径",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F023` enum 发布/邀请路径；Notice；L2；Pub/Org；官网、法定平台或送达记录；P0/P1；NM/PU；私人截图不替代公开记录；M007/M008"
    },
    {
      "key": "F024",
      "label": "noticeRef 公告版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F024` noticeRef 公告版本；Notice；L2；Pub；URL/公告 ID、更正关系；P0；NM/SU；主从版本不一致 CF；M007/M008"
    },
    {
      "key": "F025",
      "label": "datetime 公告/送达时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F025` datetime 公告/送达时间；Notice；L2；Pub/Org；平台时间戳/邀请送达凭证；P0/P1；NM/SU；时区/补发冲突 CF；M007/M008"
    },
    {
      "key": "F026",
      "label": "datetime 响应截止时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F026` datetime 响应截止时间；Notice；L2/L3；Pub/Org；当前有效文件截止条款；P0；NM；更正后未同步 CF，统一期限 PU；M006/M007/M008"
    },
    {
      "key": "F027",
      "label": "supplierRef 供应商身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F027` supplierRef 供应商身份；Response；L3；Supp/Org；营业执照主体/响应封面及登记；P1/P3；L3 NM；跨文件统一信用代码不同 CF；M009/M011/M012"
    },
    {
      "key": "F028",
      "label": "actorRef 供应商授权代表",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F028` actorRef 供应商授权代表；Response；L3 条件；Supp；法定代表人/授权委托及证照；P2；项目文件要求时 NM/UR，否则 NA；M010"
    },
    {
      "key": "F029",
      "label": "responseRef 响应文件及版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F029` responseRef 响应文件及版本；Response；L3；Supp/Org；密封件/上传哈希、标包/轮次；P3；L3 NM/UR；错轮次 CF；M011/M012"
    },
    {
      "key": "F030",
      "label": "datetime 受理时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F030` datetime 受理时间；Receipt；L3；Org/Sys；收件簿/平台回执/拒收记录；P3；NM/SU；迟交认定 HD；M012/M013"
    },
    {
      "key": "F031",
      "label": "decimal+currency 报价",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F031` decimal+currency 报价；Quotation；L3/L4；Supp/Org；响应报价页、轮次/币种；P3；NM/UR；多份价格不一致 CF；M011/M015"
    },
    {
      "key": "F032",
      "label": "enum 资格与响应状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F032` enum 资格与响应状态；EvaluationInput；L3/L4；Org/Auth；资格审查/实质性响应记录；P3；NM/HD；模型不作最终淘汰；M009/M011/M015"
    },
    {
      "key": "F033",
      "label": "actorRef[] 评委/监督身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F033` actorRef[] 评委/监督身份；Evaluation；L4；Auth/Org；组成通知/签到/角色快照；P2；L4 NM/HD；项目人数非通用阈值；M013/M014"
    },
    {
      "key": "F034",
      "label": "authorityRef[] 评委授权回避",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F034` authorityRef[] 评委授权回避；Evaluation；L4；Auth；任命、回避声明、监督凭证；P2/P3；NM/HD；冲突不得默认无回避；M014"
    },
    {
      "key": "F035",
      "label": "evaluationRef 开启/评审记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F035` evaluationRef 开启/评审记录；Evaluation；L4；Org/Auth；现场开启、记录、评分/比较原件；P3；L4 NM/UR；项目版本错配 CF；M013/M015"
    },
    {
      "key": "F036",
      "label": "candidateRef 候选推荐",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F036` candidateRef 候选推荐；Recommendation；L4/L5；Org/Auth；评审结论签署版及对应 F035；P3；NM/HD；不自动将最低价当候选；M015/M016"
    },
    {
      "key": "F037",
      "label": "decisionRef 正式结果决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F037` decisionRef 正式结果决定；Decision；L5；Auth；采购人/有权决定人签批、权限快照；P1/P3；L5 NM/HD；未经签批不能写正式值；M016/M019/M021"
    },
    {
      "key": "F038",
      "label": "noticeRef 结果公告",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F038` noticeRef 结果公告；ResultNotice；L5；Pub；结果 URL/发布日期及更正记录；P0；已需公告而缺 NM/PU；源失联 SU；M017"
    },
    {
      "key": "F039",
      "label": "disputeRef 异议/处理",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F039` disputeRef 异议/处理；Dispute；L5/L6 条件；Org/Supp/Auth；异议书、接收回执、答复/决定；P2/P3；无异议 NA；有异议而失联 SU/NM；M018/M019"
    },
    {
      "key": "F040",
      "label": "changeRef 补件/变更/撤回请求",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F040` changeRef 补件/变更/撤回请求；ChangeRequest；任意阶段条件；Org/Auth；请求主体、日期、范围、理由及原版；P1/P3；无请求 NA；未经核权 HD；M020/M021"
    },
    {
      "key": "F041",
      "label": "lineageRef 版本继承与失效",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F041` lineageRef 版本继承与失效；VersionLineage；L1—L6；Sys/Pub/Org；原/新版本、supersedes、影响对象；P1；更正后缺链 CF/SU；单版可 NA；M008/M020/M021"
    },
    {
      "key": "F042",
      "label": "hash/URI 证据完整性",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F042` hash/URI 证据完整性；EvidenceRef；每份材料；Sys/Pub；来源 ID、hash、取证时刻/页码；随原件最高级；源失联 SU、不可读 UR、哈希变更 CF；M001–M024"
    },
    {
      "key": "F043",
      "label": "archiveRef 归档交接",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F043` archiveRef 归档交接；Archive；L6；Org/Auth；归档清单、签收人/时间、介质索引；P3；L6 NM；未到 L6 NA；归属错 CF；M023"
    },
    {
      "key": "F044",
      "label": "enum/percentage 资金性质及占比",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F044` enum/percentage 资金性质及占比；Project；L0/L1；Up/Auth/Pol；预算资金、国有企事业单位资金或其他资金的权威证据及来源比例；P2；资金事实来源失联 SU，法定类别 PU/HD；M025"
    },
    {
      "key": "F045",
      "label": "structured 工程关联服务性质",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F045` structured 工程关联服务性质；Project+Package；L0/L1；Org/Auth；项目立项、服务标的，勘察/设计/监理/律师/环评等分类依据；P1；材料缺 NM/UR，法定关联解释 PU/HD；M025"
    },
    {
      "key": "F046",
      "label": "decimal+currency 可合并估算价及拆包关系",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F046` decimal+currency 可合并估算价及拆包关系；Project+Package；L0/L1；Up/Org/Auth；同项目相关包估算价、采购合并可行性证据；P2；合并范围 PU/HD，基准原件缺 NM；M025"
    },
    {
      "key": "F047",
      "label": "decisionRef 法域/必招范围核定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F047` decisionRef 法域/必招范围核定；Project；L0/L1；Auth/Pol；有权核定、适用条款版本、项目事实和生效时点；P2；未有核定 PU/HD，可信源失联 SU；M025"
    },
    {
      "key": "F048",
      "label": "enumSet 代理授权动作及标包范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F048` enumSet 代理授权动作及标包范围；Organization；L1—L6；Auth；逐项发布、收件、评审组织、结果公示、答复、归档等动作及包集合；P3；已应有协议却无件 NM，超授权 HD/CF；M026/M022"
    },
    {
      "key": "F049",
      "label": "datetimeRange 委托有效期和签发人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "`F049` datetimeRange 委托有效期和签发人；Organization；L1—L6；Auth；代理协议版本、生效/终止、解除与签发人；P3；原件不可读 UR，期间冲突 CF，效力 HD；M026/M022"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "项目包及上游决定一致",
      "purpose": "`M001` 项目包及上游决定一致；需求单位/采购中心；采购计划、T04-T01 可信决定/项目分包记录；**L0 当前必需**，以后只引用其版本；上游 `decisionId` 和经核原件链接；不重复要求需求审批表；F001–F005/F008–F013/F042；SRC-005；项目/包/批次与决定版本绑定；无件 NM、接口不可用 SU、扫描不可读 UR",
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
        "项目包及上游决定一致"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "确定品目、法域和预算口径",
      "purpose": "`M002` 确定品目、法域和预算口径；有权分类部门；采购分类说明、校本标准适用核定；**L0/L1 当前或条件必需**，法律边界不明必人工；可信分类结论 + 现行法规 URL；不能用经办自选枚举替代；F010–F015/F042；SRC-001/002/003/014/015/016；必须记政策适用日和包价汇总口径；未知 PU+HD，来源 SU，不能读 UR",
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
        "确定品目、法域和预算口径"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "说明所选方式与市场基础",
      "purpose": "`M003` 说明所选方式与市场基础；需求单位经办/组织人；采购方式建议、市场调查或比选说明；**L1 当前必需**（方式说明），市场调查形式随校规条件；2025 需求论证表/可信会议或方案引用（实际字段尚未取得）；F015/F016/F042；SRC-004/005/020；对应项目/包及拟用方式；缺 NM、老规则合法性 PU、不可读 UR",
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
        "说明所选方式与市场基础"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "方式决定/核定路径",
      "purpose": "`M004` 方式决定/核定路径；当前有权采购决定主体；方式确认、批准或会议纪要/系统记录；**L1 条件必需**：仅适用政策确立应签发的节点；未确立不得伪造；有权系统 Decision+授权快照、有效电子签章；F007/F017/F018/F020/F042；SRC-001/004/005；决定人、时间和版本与公告相连；权限不明 HD/PU，无件 NM（仅已证必需时）",
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
        "方式决定/核定路径"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "经办与审批权限、现行制度依据",
      "purpose": "`M005` 经办与审批权限、现行制度依据；组织/人事授权部门及制度发布部门；身份证明、委托、校规版本/授权表的**引用集合**；**L0/L1 条件必需**：需要判断合法身份/现行性即引用；不是要求上传个人证照；后端认证会话、机构角色、校规有效版本索引；不可用时授权函人工核；F005–F007/F012/F014/F020/F042；SRC-001/004/011/013/014/015/016；人/机构权限快照与政策生效日双维度；假 actor HD，政策未知 PU，来源 SU",
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
        "经办与审批权限、现行制度依据"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "公告前采购条件与评审标准",
      "purpose": "`M006` 公告前采购条件与评审标准；采购组织主体/代理；采购文件、技术要求、资格/评审办法；**L2 当前必需**，L0/L1 后续；有权发布的采购文件原版或受控电子版；F003/F021/F022/F026/F042；SRC-007/008/018；绑定公告版本/包；未发布前 NA，到了 L2 缺 NM、不可读 UR",
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
        "公告前采购条件与评审标准"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "证明公平发布或有效邀请",
      "purpose": "`M007` 证明公平发布或有效邀请；采购发布者/平台；公告 URL、发布时间、送达/邀请凭证；**L2 当前必需**；何种发布方式取法域；官方公告平台原链接/电子送达回执，不单凭截图；F023–F026/F042；SRC-002/003/007/008/012/018；版本、发布日期/截止一致；失联 SU；未公告却声称已公告 CF",
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
        "证明公平发布或有效邀请"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "公告更正、澄清、二次轮次",
      "purpose": "`M008` 公告更正、澄清、二次轮次；采购发布者；更正/答疑/补遗/重采公告及送达记录；**L2/L3 条件必需**，无更正 NA；官方更正公告或可信送达回执；F004/F023–F026/F041/F042；SRC-018/019；旧新版本成链，原截止不应覆盖新截止；无件 NM、冲突 CF、不可读 UR",
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
        "公告更正、澄清、二次轮次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "供应商资格证明/审查依据",
      "purpose": "`M009` 供应商资格证明/审查依据；供应商、组织人；登记资质、经营资格、信用证明等；**L3 条件必需**：依当次采购文件资格条件，不一律收证照原件；可信许可/公示系统核验、供应商已提交并经核附件；F027/F032/F042；SRC-007/012/018/014；每供应商、包与轮次单独归属；未触发 NA、触发而缺 NM、无法读 UR",
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
        "供应商资格证明/审查依据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "响应代表授权",
      "purpose": "`M010` 响应代表授权；供应商法定代表人/授权代表；介绍信、委托书、身份证明；**L3 条件必需**，例如 SRC-018 项目报名；可信法人认证/电子授权或该采购文件允许的其他形式；F028/F042；SRC-018；个人证件最小保留且核委托有效期；身份不一致 CF；必要时缺 NM/UR",
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
        "响应代表授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "响应与报价事实",
      "purpose": "`M011` 响应与报价事实；供应商；按采购文件签署的投标/响应文件、报价及附件；**L3 当前必需**，仅对已提交的供应商；采购平台可信原始响应文件；不得人工转录后丢原件；F027/F029/F031/F032/F042；SRC-007/008/012/018；供应商×包×轮次×报价轮次，报价未产生 NA，已提交却不可读 UR",
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
        "响应与报价事实"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "接收/拒收与截止事实",
      "purpose": "`M012` 接收/拒收与截止事实；采购组织人或电子平台；投递回执、收件簿、封存/退回记录；**L3 当前必需**，与是否有效响应分别判断；平台受理记录、现场签收凭证；F027/F029/F030/F042；SRC-007/012/018；时间带时区、地点/平台、版本；无受理凭证 NM，来源失联 SU；迟交效力 HD",
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
        "接收/拒收与截止事实"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "开封、现场过程留痕",
      "purpose": "`M013` 开封、现场过程留痕；采购组织人/监督人；开封/开标记录、录音录像索引；**L4 当前或条件必需**，何种过程记录取方式；可信现场/电子开标日志；录像是否法定必备待查；F030/F033/F035/F042；SRC-008/009；只关联已受理响应及本轮；缺 NM（确定必需时）/HD，不可读 UR",
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
        "开封、现场过程留痕"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "评审人员身份授权与回避",
      "purpose": "`M014` 评审人员身份授权与回避；采购组织人/有权任命人、评委本人；组成通知、签到/回避记录；**L4 条件必需**：评委/监督制度适用时；可信人员任命与签署回避记录、评审平台日志；F033/F034/F042；SRC-008/009/017；人员角色快照和时间；缺 NM/HD，签名冒认 CF",
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
        "评审人员身份授权与回避"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "资格判断、评审与候选推荐",
      "purpose": "`M015` 资格判断、评审与候选推荐；评审/比选小组；审查表、评分/报价比较、评审报告、推荐意见；**L4 当前必需**，有评审才产生；正式评审报告的签署电子版、可信系统纪要；F031/F032/F035/F036/F042；SRC-008/009/017；按当期采购文件办法审、不得用最低价自动替代；缺 NM，争议 HD，不能读 UR",
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
        "资格判断、评审与候选推荐"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "采购人/有权主体正式结果",
      "purpose": "`M016` 采购人/有权主体正式结果；有权决定主体；成交/中选确认、批准记录、签章；**L5 当前必需**（若已进入正式确认阶段），此前后续；可信 `Decision`+授权快照，不接受 AI/Renderer 文本；F036/F037/F042；SRC-001/006/017；与本轮评审推荐和授权版本绑定；未决定 NA，声称已定无签批 NM/HD",
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
        "采购人/有权主体正式结果"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "公告已作结果的证据",
      "purpose": "`M017` 公告已作结果的证据；发布主体；中标/成交/比选结果公告原网页；**L5 条件必需**，以当次制度是否须公告为准；官网页面 URL、法定平台结果公示；F038/F042；SRC-002/003/009/010/017；以真实 URL/更正关系溯源；公告未到期 NA，源失联 SU、缺件 NM",
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
        "公告已作结果的证据"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "异议/质疑申请与受理",
      "purpose": "`M018` 异议/质疑申请与受理；供应商/相应投诉人、受理单位；书面异议、质疑书、收件回执；**L5/L6 条件必需**，有争议才产生；有权部门登记系统/书面签收；F039/F042；SRC-017/014/016；关联被异议结果及受理时间；无异议 NA，申请/回执缺 NM，涉密 P3",
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
        "异议/质疑申请与受理"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "正式答复、复核或投诉办理结论",
      "purpose": "`M019` 正式答复、复核或投诉办理结论；有权受理/监管单位；答复、复核意见、处理决定；**L5/L6 后续且条件必需**，受理后才出现；有权签批/发文系统及送达回执；F037/F039/F042；SRC-017/014/016；引用原案/争议编号与版本；受理中 NA，已决定无证据 NM/SU",
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
        "正式答复、复核或投诉办理结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "补件/撤回/变更/终止请求",
      "purpose": "`M020` 补件/撤回/变更/终止请求；提请的校内授权经办或相关有权主体；请求、补件记录；**任意阶段条件必需**，只在有请求时；可信系统变更事件、授权签署文书；F040/F041/F042；SRC-001/005/019；保留旧件和请求时点，禁止删除历史；无请求 NA、无身份 HD",
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
        "补件/撤回/变更/终止请求"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "请求后的有权处置",
      "purpose": "`M021` 请求后的有权处置；有权决定主体；准予/驳回/更正/重采决定与再公告指令；**后续且条件必需**，L0 前不强制；正式决定、签批及公告版本链；F020/F037/F040/F041/F042；SRC-001/004/019；重新采办与原轮次分开；未决定 NA，未经授权 HD，材料不见 NM",
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
        "请求后的有权处置"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "外部采购代理委托与范围",
      "purpose": "`M022` 外部采购代理委托与范围；采购中心/需求单位/代理机构；委托协议、有效代理资格/任务书；**L1 条件必需**，仅 C04 委托组织；校内委托登记与代理协议原件；F017/F018/F019/F042；SRC-002/003/011；委托授权必须覆盖项目、包、有效期；无代理 NA，委托后缺 NM/HD",
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
        "外部采购代理委托与范围"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "资料交接/归档",
      "purpose": "`M023` 资料交接/归档；采购组织人、档案保管人；目录、移交单、签收记录；**L6 后续才产生**，不为 L0-L5 初申必需；可信档案索引、交接签收事件；F043/F042；SRC-004/005/006；保留全版本引用；未到归档 NA，到期无件 NM，失联 SU",
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
        "资料交接/归档"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "特殊方式的额外论证",
      "purpose": "`M024` 特殊方式的额外论证；需求单位/采购中心及法定有权审批主体；单一来源论证、批准与法定公示（如适用）；**L1 条件必需**，仅经有效法域/校规核实应当进行时；有权论证/审批来源；不可由普通市场询价替代；F016/F020/F042；SRC-004/014/015；单独绑定政策条款、例外理由、审批人；现行依据不明 PU+HD，缺 NM（确定适用时）",
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
        "特殊方式的额外论证"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "工程相关采购的法定分流证据",
      "purpose": "`M025` 工程相关采购的法定分流证据；建设/采购归口及项目业主；批准资金来源、资金比例、工程属性/关联服务、同项目采购估算及有权法域判断；**C03 L0/L1 条件必需**：工程或疑似必招先确认范围后判规模；**非工程路径 NA**；已签项目基础信息、分包汇总、资金证明及有权 R004 法域核定引用；不重复 T04-T09 立项审批；F011–F014/F044–F047/F042；SRC-016/021—024；每项目/关联包、预算版本、法律适用时点绑定；未知 PU/HD，来源失联 SU，原件损坏 UR，不能以项目标题认定必招",
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
        "工程相关采购的法定分流证据"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M026",
      "name": "代理逐动作/包授权快照",
      "purpose": "`M026` 代理逐动作/包授权快照；学校采购中心/需求单位及受托代理；当期岗位授权矩阵、项目委托协议、代理操作人授权、解除变更；**C04 L1 条件必需**：代理或中心职责核验时启动，贯穿 L2—L6 逐动作核对；自办时代理部分 NA；有权签发协议、后端授权记录/电子签章或线下受控原件；代理官网宣传不可替代；F007/F017–F019/F048/F049/F042；SRC-001/011/025/028/029/031；项目+包+动作+期间+签发人版本；协议确定必需却缺 NM，授权未知 PU/HD，原件失联 SU，超包/过期 CF",
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
        "代理逐动作/包授权快照"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-08-1",
      "name": "08.1 候选规则解释与审查界限",
      "description": "来源：原始研究模板 §08；规则仅供事实/证据预审，非校方政策版本。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "L0 项目—标包—轮次唯一归属",
          "requirement": "`R001` L0 项目—标包—轮次唯一归属；T：新采购案建档或新轮次出现；F：无新事项/只读历史；U：项目是否同一标包不能定；SRC-005/019；F001–F004/F042；M001/M008；对上游原号、分包和前轮索引逐层匹配；以首次有效建案/新轮产生时点为准；A 上游引用+B 公告版本；无分包允许显式全项目包；错项目/错轮次 `CF`→采购经办与案卷 Owner；上游源失联 `SU`→数据保管人；未知不得按名称模糊合并",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "L0 立项、需求与经费的权威引用",
          "requirement": "`R002` L0 立项、需求与经费的权威引用；T：进入方式审查；F：纯历史案未重新受理；U：是否属于上游采购案不明；SRC-005/006；F005/F008/F009/F013/F042；M001；比较可信 T04-T01 决定 ID/版本、需求单位和包预算**引用**，G07 只取权威资金结论；按上游决定生效版本；A；上游已批准但本地无接口 `SU`→T04-T01/G07 记录管理者；应有决定却未出具 `NM`→需求单位；与公告预算冲突 `CF`→采购组织人；不复审立项/经费",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "L0/L1 经办人组织身份及权限",
          "requirement": "`R003` L0/L1 经办人组织身份及权限；T：有人提交或请求操作；F：仅展示公开公告；U：权限关系未核；SRC-005/011；F005–F007/F042；M005；后端认证身份、组织岗位、授权时段和包权限交叉核对；当次操作时点；A，文件签名 B 辅证；教师/学生或代理自报职务无权；Renderer `actor` 不可作证；认证源不可用 `SU`→身份系统管理员，权责未明确 `HD`→学校授权管理者，冒用材料差异 `CF`→安全/采购组织人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "L0/L1 政采、非政采、法定招标法域判别前置核定引用",
          "requirement": "`R004` L0/L1 政采、非政采、法定招标法域判别**前置核定引用**；T：将选方式或发生工程关联/资金分类；F：已由可信权威明确不属本模板且转交；U：品目、资金或工程关系未核；SRC-001/002/003/014—016/021—024；F010–F014/F044–F047/F042；M002/M005/M025（C03 条件）；依次核 **①资金性质、占比和项目/品目；②16 号令第 2—4 条与 843 的范围；③如属范围，再核第 5 条单项/可合并估价及 770 号解释；④四川政府采购集中目录、限额；⑤校本 2024 细则**，逐步保存可定位的原文条/有权分类决定、法律适用日和项目包估算版本；A 法域加可信签发；“工程律师/环评”不能只看工程字样推必招；达不到单项额不当然排除可合并规则，`1—30 万` 不是全采购通用值；本校 2024 全文、资金/法域确认缺失→`PU` 由采购中心/法务核，实体分类权由有权主管 `HD`；不能让后续 `PASS_FACT` 覆盖此阻断",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "L1 拟采方式与立项需求、预算、理由同一性",
          "requirement": "`R005` L1 拟采方式与立项需求、预算、理由同一性；T：方式建议已提出；F：尚 L0；U：拟采用何方式不明；SRC-001/004/005/007/008/020；F011/F013/F015/F016/F042；M001/M002/M003；对照上游包、方式建议和说明中品目/金额口径；以提出时的政策/方案版本；A 上游+B 组织人原件；**SRC-020 仅为表单目录线索，非条款来源**；有理由文字一致可 `PASS_FACT`，**方式是否合法/是否超限**仍由 R004/R007；说明缺失 `NM`→经办；理由与品目不符 `CF`→经办；制度要求未知 `PU`→采购中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "L1 单一来源等特殊方式论证的触发和证据",
          "requirement": "`R006` L1 单一来源等特殊方式论证的触发和证据；T：已按可信法域认定须例外论证；F：确认为不采用特殊方式；U：竞争不足、可否变更方式无合法依据；SRC-001/004/014/015；F014–F016/F020/F042；M003/M024/M004；逐例外条件比较有权论证、公示及审批的时间先后、项目/包版本；需对应现行 A 级条文+B 原件；历史“三家/两轮”不可作现行启动条件；现行例外条文未知 `PU`→法务/采购中心；是否准许特殊方式 `HD`→有权人；已证应提交却缺论证 `NM`→经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "L1 采购方式正式核定来源与签发权限",
          "requirement": "`R007` L1 采购方式正式核定来源与签发权限；T：政策要求核定节点或系统宣称已核定；F：未到核定节点且无已批宣称；U：是否需签批/签发主体不明；SRC-001/004/005/013；F007/F014/F020/F042；M004/M005；比较现行授权、签批人身份、签发日期、方式与项目包及后续公告；A 身份/Decision，B 会议原始记录；“经领导同意”或图片公章不能成正式决策；未证审批要求 `PU`→采购中心；有权决定尚未发生 `HD`→正式决定人；伪造/冲突 `CF`→监督与授权管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "L1—L6 自组织、中心组织或代理逐动作/包/期限授权",
          "requirement": "`R008` L1—L6 自组织、中心组织或代理**逐动作/包/期限授权**；T：有代理/中心组织或任一受托行为，后续每个行为时点复核；F：可信确认为自主采购且未发生代理动作，代理 M022/M026 的该分支 `NA`；U：组织和委托权限不明；SRC-002/003/005/011/025/028/029/031（SRC-031 仅对照）；F007/F017–F019/F048/F049/F042；M004/M005/M022/M026；对**采购人/需求单位/中心/代理**四方角色，逐笔匹配 `project+package+actionScope+effectivePeriod+issuerAuthority`；若政府采购适用，按 SRC-025/029 核委托协议存在、范围、期限等，具体校本权限仍要 SRC-011 与项目原件；L2 发布、L3 收件、L4 组织评审、L5 公示、L6 归档的授权各自核，A 签发+B 行为；单看代理公告、机构名录、旧授权或 OCR 印章均不能授成交权；协议确定必需而缺 `NM`→委托人，正文/角色范围未知 `PU`→采购中心，已发生超委托/过期行为的效果 `HD`→有权人，行为与委托的项目包冲突 `CF`→监督/委托方",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "L2 采购文件身份及有效版本",
          "requirement": "`R009` L2 采购文件身份及有效版本；T：进入编制/发布采购文件；F：L0/L1 未形成文件；U：是否有正式文件版本不能确定；SRC-005/007/008/018；F003/F004/F021/F042；M006；采购文件页/哈希与项目包轮次、发布签发时间比对；B 原版、A 若需正式批准；同名不同轮文件不合并；当阶段无文件 `NM`→采购组织人；无法读取 `UR`→提交方；版本冲突 `CF`→发布人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "L2 资格条件与评审办法的明示及后续引用",
          "requirement": "`R010` L2 资格条件与评审办法的明示及后续引用；T：采购文件/邀请已用于竞争；F：仅 L1 拟议稿；U：是否已向供应商生效不明；SRC-007/008/018；F021/F022/F042；M006/M007；取采购文件对应页/条、公布/送达时点，建立评审准则版本锁；B 公告原版优于 OCR；“最低报价中选”仅 SRC-008/012 个案，绝不能替代该项目评分法；文件含混 `HD`→组织人/评审组，文档不可读 `UR`→发布人，政策必须条款不明 `PU`→采购中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "L2 公告或合法邀请的发布/送达事实",
          "requirement": "`R011` L2 公告或合法邀请的发布/送达事实；T：已选择对外发出采购文件；F：仍仅内部拟议；U：公开/邀请方式未核定；SRC-002/003/007/008/012/018；F023–F025/F042；M007；查官方平台 URL/ID 与发布日或逐个邀请送达回执；适用实际发出时点；B 发布记录，发布规则须 A；官网不可达 `SU`→发布平台/组织人，不等于未发；应发未有凭证 `NM`→组织人；是否必须公开 `PU`→采购中心；不公开邀请名单给无权方",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "L2/L3 更正后有效截止与公告版本链",
          "requirement": "`R012` L2/L3 更正后有效截止与公告版本链；T：存在公告/澄清/更正/二次公告或截止变动；F：可信确认无更正；U：公告版本不全；SRC-018/019；F004/F021/F024–F026/F041/F042；M006/M007/M008；对比原版、更正版、生效/送达时间及最终截止，按同一标包轮次排序；B 平台不可变时间戳；“二次”并不证明原轮失败原因；缺新版 `NM`→发布人、源失联 `SU`→平台、旧新冲突 `CF`→组织人；延期效力/是否重收响应 `HD`→有权人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "L3 响应供应商主体/资格凭证一致性",
          "requirement": "`R013` L3 响应供应商主体/资格凭证一致性；T：本轮收到供应商响应且采购文件要求资格；F：未到 L3 或该资格项未要求；U：资格条件/响应主体不明；SRC-007/012/018；F027/F032/F042；M006/M009/M011；比对营业执照统一信用代码/有权资质记录、供应商签名、包与轮次；以响应截止时条件和许可有效期为准；B+可用权威登记 A；同名公司不等于同法主体；身份异码 `CF`→组织人/资格审查员；已要求的证据缺 `NM`→供应商；是否具法律资格或应排除 `HD`→评审人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "L3 代表受托签署和有效期",
          "requirement": "`R014` L3 代表受托签署和有效期；T：本次采购文件要求委托代表或确有代理签署；F：本项目明确不要求且本人签署；U：签署身份/公告要求未知；SRC-018；F027/F028/F042；M010/M011；对法人/授权代表姓名、授权起止日、响应签署人与包，按递交/签署日比对；B 有效授权+证照仅最小可见；SRC-018 是个案条件；姓名不一 `CF`→供应商/组织人；所需授权缺 `NM`→供应商；无法确认代签效力 `HD`→有权审查员，不自动剔除响应",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "L3 报价响应的项目/包/轮次/文件身份",
          "requirement": "`R015` L3 报价响应的项目/包/轮次/文件身份；T：已提交响应；F：未递交任何响应且未到截止；U：提交归属待定位；SRC-007/008/012/018；F003/F004/F027/F029/F031/F042；M011/M012；原始响应 hash、封面项目号、包号、报价轮次/币种、提交主体逐项匹配；以当次提交时刻和有效文件为准；B 原件；两包报价不互替、第二轮不继承第一轮结论；缺响应 `NM`→供应商或组织人核记录、破损 `UR`→持有人、错包 `CF`→组织人；**是否废标** `HD`→评审人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "L3 受理时间、截止、拒收理由的事实",
          "requirement": "`R016` L3 受理时间、截止、拒收理由的事实；T：响应已收到或发生拒收；F：尚未开受理窗口；U：是否送达不可证；SRC-007/012/018；F025/F026/F029/F030/F042；M007/M008/M012；可信收件回执/现场簿与当前有效公告截止精确到时区比较，分开记到达时间和上传时间；B 受理记录；超时事实可 `PASS_FACT`（证明时间比较），**有效或无效**须评审/有权人定；源失联 `SU`→收件平台，回执缺 `NM`→组织人，时刻冲突 `CF`→发布人/收件人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "L3/L4 资格及实质性响应判定记录是否有据",
          "requirement": "`R017` L3/L4 资格及实质性响应判定记录是否有据；T：已进入资格/响应审查；F：尚未评审；U：标准或资格类别含混；SRC-008/012/014/015；F022/F027/F031/F032/F042；M006/M009/M011/M015；对每供应商资格记录逐项链接已公布的本项目条款和原始响应证据；截止时有效文件 B，法定要求 A；模型只能核对依据存在与字段一致，不能自动淘汰；缺审查记录 `NM`→评审组，条款冲突 `CF`→组织人，实体裁量 `HD`→评审组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "L4 开启、比选/询价现场过程",
          "requirement": "`R018` L4 开启、比选/询价现场过程；T：已实际开启或开始评审；F：L3 收件未开启；U：开启时间/方式不明；SRC-008/009；F030/F033/F035/F042；M012/M013；核开启记录的包、轮、出席、所处理响应与收件集合；按开启实际时点、B 现场原始记录；个案出现 3 名小组成员并不形成通用标准；已需记录却缺 `NM`→组织人，录音/PDF 不可读 `UR`→保管人，程序影响 `HD`→组织人/监督",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "L4 评审与监督人员真实授权/回避",
          "requirement": "`R019` L4 评审与监督人员真实授权/回避；T：已组成评审组或监督人在场；F：尚未选定评审人员；U：评委授权或回避制度不明；SRC-008/009/011/017；F033/F034/F042；M013/M014/M005；后端可信任命/签到/回避与签署人身份、有效时点交叉核；A 授权+B 本人记录；监督身份不可替代评审/决策权限；身份冲突 `CF`→监督/人事授权部门，授权政策缺 `PU`→采购中心，回避争议 `HD`→有权监督人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "L4 报价/评分比较遵循本轮已公布方法的记录事实",
          "requirement": "`R020` L4 报价/评分比较遵循本轮已公布方法的记录事实；T：已形成比较表；F：评审尚未开始；U：现行评审方法难以确定；SRC-007/008/009/012/017；F021/F022/F031/F035/F042；M006/M011/M015；逐评审条款核比较项目、有效响应、币种/分值，确认所引标准是响应前发布版本；B 原件，评分授权 A；不能因最低价就自动推荐中选；算术不符 `CF`→评审组，报告损坏 `UR`→组织人，评分裁量 `HD`→评审组；具体低价法是否适用 `PU`→采购中心",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "L4 候选推荐是否由本轮有权评审记录支持",
          "requirement": "`R021` L4 候选推荐是否由本轮有权评审记录支持；T：已有推荐/排序；F：评审尚未结束；U：推荐主体/效力不明；SRC-008/009/017；F033–F036/F042；M014/M015；对签名评审结论、候选名、排名、项目包轮次和 R020 结果；以推荐签发时点为准；A 成员权限+B 评审报告；推荐不等于 F037 正式成交；报告与推荐冲突 `CF`→评审组，是否认可建议 `HD`→采购人，未签发 `NM`→评审组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "L5 正式中选/成交决定的可信存在及权限",
          "requirement": "`R022` L5 正式中选/成交决定的可信存在及权限；T：宣称正式结果已决定或已到确认节点；F：尚处候选推荐阶段；U：最终权限/是否已有决定不明；SRC-001/006/009/010/017；F007/F020/F036/F037/F042；M004/M015/M016；以真实 Decision ID、签发人/授权范围和决定时间对照本轮评审；A 可信 Decision，B 公告不可反推签发权；模型不能生成 Decision；无签批而宣称通过 `HD`→法定/校内有权人，来源失联 `SU`→签批系统，决定与报告冲突 `CF`→采购人/监督；未到 L5 `NOT_APPLICABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "L5 成交/中选结果公告与决定的一致",
          "requirement": "`R023` L5 成交/中选结果公告与决定的一致；T：当前有效制度/项目文件要求结果公开或已发布；F：制度及项目明确无需公告且未发布；U：公告义务不明；SRC-002/003/009/010/017；F036–F038/F041/F042；M016/M017；以结果公告原 URL、发布时点和正式决定供应商/包/轮次核对；B 公告+A 决定；更正保存双版本；不能用公告直接当签批；现行公开义务未知 `PU`→采购中心，已证应公告无证 `NM`→发布人，URL 失联 `SU`→平台，决定不同 `CF`→采购人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "L0—L6 变更、撤回、终止或重采请求及授权处置",
          "requirement": "`R024` L0—L6 变更、撤回、终止或重采请求及授权处置；T：发生请求/新轮次；F：没有变更请求且单轮正常运行；U：请求者权限/原轮状态不清；SRC-001/005/006/019；F004/F007/F020/F040/F041/F042；M008/M020/M021；先核请求签发权限、原对象及版本、时点，再核后续有权处置与对外更正/新轮公告；A 决定+B 事件与公告；登记撤回≠已批准撤销，二次公告≠原采购依法终止；未发生处置不预报缺 M021；效力 `HD`→原有权人，政策 `PU`→采购中心，版本冲突 `CF`→组织人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "L5/L6 异议/质疑的提交、受理与对象归属",
          "requirement": "`R025` L5/L6 异议/质疑的提交、受理与对象归属；T：存在供应商异议/政府采购质疑；F：可信确认无争议且窗口已过或尚未到异议阶段；U：争议法域、受理主体不明；SRC-014/016/017/026；F037–F039/F042；M017/M018；核异议书、回执时点、争议指向的公告/包/轮和主体；政府采购依 SRC-026 核质疑 7 工作日起算等，招投标或校内比选用各自程序；A 适用规范+B 签收；SRC-017 校内个案 3 工作日**不能替换政府采购 7 工作日或招标投标异议时限**；没有有效法域 PU→法务，已收无回执 NM→受理人，是否成立 HD→有权机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "L5/L6 争议处理、复核、再次决定的可信链",
          "requirement": "`R026` L5/L6 争议处理、复核、再次决定的可信链；T：答复/再决定已签或宣称处理完成；F：无争议或已受理仍办理中；U：答复权限、效力不明；SRC-014/016/017/026；F037/F039–F042；M018/M019/M021；将原争议号、答复/复核签发人、送达时间与原 Decision/更正链关联；政府采购质疑不服转法定财政投诉程序，其他法域另行核定；A 有权处理决定+B 回执；政府采购投诉期限可核 SRC-026 第 17 条，但未定法域时不自动倒计时；在办 M019 不得提前报缺，没有签批不可称复核通过；PU→法务，HD→有权机关，CF→归口/案卷 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "L6 全版本归档/移交留痕",
          "requirement": "`R027` L6 全版本归档/移交留痕；T：采购过程进入归档且归档义务已证；F：尚未到归档阶段；U：保管主体、期限/范围不明；SRC-004/005/006；F001–F004/F041–F043；M001/M006/M007/M011/M012/M015/M016/M017/M018/M019/M023；核移交目录与存在的各阶段证据版本/签收人、日期、散列引用；B 档案记录，A 归档授权；按实际移交时点；只归档已经发生的争议，未发生不生成空答复；校本归档细目未知 `PU`→档案/采购中心，确需材料遗失 `NM`→组织人，签收权限 `HD`→档案管理人",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l0",
      "name": "已有采购需求与项目归属",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l1",
      "workflowOwner": "local"
    },
    {
      "id": "l1",
      "name": "方式提议/核定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local"
    },
    {
      "id": "l2",
      "name": "采购文件与公告/邀请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "响应受理/询比价",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "评审和候选推荐",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l5",
      "workflowOwner": "local"
    },
    {
      "id": "l5",
      "name": "正式结果确认、公告与争议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l6",
      "workflowOwner": "local"
    },
    {
      "id": "l6",
      "name": "资料移交与归档",
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
