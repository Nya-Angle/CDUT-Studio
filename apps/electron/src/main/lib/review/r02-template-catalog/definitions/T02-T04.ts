import type { TemplateVersion as SharedTemplateVersion } from '@profer/shared'

export type TemplateVersion = SharedTemplateVersion

export const r02Metadata = {
  "templateId": "T02-T04",
  "name": "专业技术职称评审与申报材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T04.md",
  "sourceDocumentSha256": "3aebb4d189003e8c065f56c97c54a62b6ea1d66658d4e813cfc481fabcacecdd",
  "originalSourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T02-T04.md",
  "originalSourceSha256": "ff104145df658417296a8fa77f2757d4ffb42f33a8551ac055013209015e885e",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "部分历史校方和国家/省级资料具有研究参考价值；本批次适用范围、现行校本政策、签批授权及源时效仍须人工确认。",
  "restrictedReferenceOnlySlotIds": [
    "M003",
    "M004",
    "M011",
    "M013",
    "M014",
    "M020",
    "M028"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-001 CDUT-VERIFIED | 成都理工大学职改办／[《关于组织开展2023年职称评审工作的通知》9月8日页面](https://news.cdut.edu.cn/info/1005/46129.htm) | 正文一至五部分；发布 2023-09-08；生效/废止未核，仅2023批次 | 本校四系列及转系列、代表作、师德、各级核验、公示、评审链有完整索引正文；原站打开 HTTP 412。是否替代 9月7日版本未见明确公告；不外推2026 |"
    },
    {
      "id": "SRC-002",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-002 CDUT-VERIFIED | 成都理工大学职改办／[《关于组织开展2023年职称评审工作的通知》9月7日页面](https://news.cdut.edu.cn/info/1005/46127.htm) | 正文一至五部分/流程表；落款 2023-09-07；网页索引显示 9月8日前后；生效/废止未核，仅2023批次 | 用户给定线索，经检索索引核到代表作内外送审、职能审核、学科组、评委会、学校发文备案流程；原站打开 HTTP 412。与 SRC-001 同名异页，待查修订关系 |"
    },
    {
      "id": "SRC-003",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-003 CDUT-VERIFIED | 中共成都理工大学委员会／[成理党发〔2024〕42号《成都理工大学科研诚信建设与管理办法（试行）》原文 PDF](https://kjc.cdut.edu.cn/__local/C/90/0C/8E08F60D57A4E04B6373A762F9E_C297C32C_67265.pdf) | 印发页1；第2–3、5–10、16、20–26条约第2–7页；附件负面清单第8–12页；发布/试行 2024-07-08；废止未见 | 本校全体教职工及以学校名义科研人员，明确涵盖职称晋升/评定；PDF 12页原文可读。科研诚信认定、处理及档案只能由授权主体产生；是否后有修订待年度校内核 |"
    },
    {
      "id": "SRC-004",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-004 CDUT-VERIFIED | 成都理工大学国际教育学院（牛津布鲁克斯学院）／[《2026年4月职称认定申请材料公示》](https://cie.cdut.edu.cn/info/1048/1840.htm) | 正文第102–111行、两 ZIP 附件标题；发布 2026-04-17；生效/废止不适用 | 本校二级学院，证实“职称初定材料”“职称确认材料”办理存在；没有证明全校申报政策或附件内容（未下载/查验个人数据），不得由此推断其与评审同流程 |"
    },
    {
      "id": "SRC-005",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-005 CDUT-VERIFIED | 成都理工大学人事处（师资科）／[《学校召开2023年高级职称评审委员会会议》](https://rsc.cdut.edu.cn/info/1011/3473.htm) | 正文开头/会议报道；发布 2024-01-22；生效/废止不适用 | 校方新闻正文索引表明 2024-01-17 至18日召开 2023 年四系列高级评委会。只证明评审组织实际运行，不代替会议授权、评审决议原件；原站直接打开受限 |"
    },
    {
      "id": "SRC-006",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-006 CDUT-VERIFIED | 成都理工大学党政办公室／[《成都理工大学强化科技成果转化培育新质生产力》](https://dbxb.cdut.edu.cn/info/1064/4736.htm) | “科技成果转化为主型”段；发布 2024-04-25，转述四川省教育厅 2024-04-17 信息；生效/废止不适用 | 本校类型存在性佐证；没有量化条件、当期适用范围，不是职称管理办法原件 |"
    },
    {
      "id": "SRC-007",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-007 CDUT-VERIFIED | 成都理工新闻网／[《中国教育报》刊发我校教师和人才队伍建设体制机制改革成效](https://news.cdut.edu.cn/info/1003/37585.htm) | 师德长效机制与职称评审段；约 2019 年（页面精确日未核）；生效/废止不适用 | 本校师德考核联动职称评聘的实践佐证；不可由新闻自行推定个案师德处分 |"
    },
    {
      "id": "SRC-008",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-008 CDUT-VERIFIED | 成都理工大学／[成理校人〔2013〕16号《专业技术职务评审管理办法（修订）》PDF](https://ccsa.cdut.edu.cn/__local/7/EF/A9/3920D73E4AE19C7B1B4A25647F0_41847F8D_10D50F.pdf?e=.pdf) | 印发第1页、办法第2–8页起及附件；发布/实施 2013-06-17；当时废止 2011 版；后续被更新，当前效力不可确认 | 学校历史原文 PDF 34页可读，仅研究机构演进；严禁援引其资历、年龄、考核年限、票数、公示天数作为现行硬条件 |"
    },
    {
      "id": "SRC-009",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-009 CURRENTITY-UNKNOWN | 成都理工大学／《成都理工大学专业技术职务评审管理办法》（成理校人〔2021〕24号）；间接出处 [SRC-001 所在校方通知](https://news.cdut.edu.cn/info/1005/46129.htm) | 2023 通知开头引述；正式全文、条号、发布/生效/废止均待获取 | 校本核心门槛文件被明确援引，尚无独立可访问全文；不能从 2013 版填充新办法。2023 年还存在修订/发布报道，须进一步比对 |"
    },
    {
      "id": "SRC-010",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-010 CURRENTITY-UNKNOWN | 成都理工大学／《〈成都理工大学专业技术职务评审管理办法〉补充规定》（成理校人〔2023〕36号）；间接出处 [SRC-002 校方通知](https://news.cdut.edu.cn/info/1005/46127.htm) | 2023 通知开头；另见 [校长办公会纪要〔2023〕20号公开索引](https://dbxb.cdut.edu.cn/__local/C/BF/17/2656EBF5DDE8E4DDDC5D94153D9_473DBE96_F853.pdf) 第9项；正式条款/生效/废止待核 | 证实文件名称及讨论线索，未取得补充规定正文，不得虚构破格/送审/期刊/工作量要求 |"
    },
    {
      "id": "SRC-011",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-011 GENERAL-RESEARCH | 教育部／[《新时代高校教师职业行为十项准则》等通知](https://www.moe.gov.cn/srcsite/A10/s7002/201811/t20181115_354921.html) | 通知及高校教师十项准则；发布 2018-11（页面日待核）；生效/废止待官方核查 | 全国高校教师师德基线；网页检索正文可见，直接打开超时；不产生个人师德结论 |"
    },
    {
      "id": "SRC-012",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-012 GENERAL-RESEARCH | 人社部／《职称评审管理暂行规定》（人社部令第40号）；[司法部公布规章原文](https://www.moj.gov.cn/pub/sfbgw/flfggz/flfggzbmgz/202101/t20210105_146353.html)；[部规章 PDF](https://www.mohrss.gov.cn/xxgk2020/gzk/gz/202112/P020220105496584650740.pdf) | 第6–8、13–18、19–29、38–39条；公布 2019-07-01，施行 2019-09-01；未查到后续废止 | 国家部门规章原文与其他政府机关全文转载相互核对。第15条内部核查免重复证明、第16/26条单位及结果公示最低5个工作日、第18条一次性告知补正、第25条回避、第27条复查、第28条委托；具体受理、申报标准仍依合法权限，不把其当 CDUT 当期细则 |"
    },
    {
      "id": "SRC-013",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-013 GENERAL-RESEARCH | 四川省人社厅／川人社发〔2020〕31号《四川省职称评审管理暂行办法》；[省级文件在兄弟学校的原版 PDF 镜像](https://www.abvc.edu.cn/__local/C/D7/57/A1E77D4D8D02608FC7ECB33F057_C2CEFC60_2FCB0.pdf)；[省厅原站线索](https://rst.sc.gov.cn/rst/xzgfxwj/2020/12/28/ef75dda74f6e4845a9e4e3639eb0031f.shtml) | 原版 PDF 第1–4页含第1–8条；发布 2020-12-21；施行日/废止未核 | 四川省上位程序，原版 16页在外校镜像可读，省厅原站打开超时；虽名为“兄弟学校镜像”，文书制定者是省人社厅而非外校校规。第4条“申报→审核推荐→逐级审查→受理→专家评审→公示→确认备案”可作基本框架 |"
    },
    {
      "id": "SRC-014",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-014 GENERAL-RESEARCH | 四川省人社厅／《四川省职称评审工作行为规范》（川人社规〔2024〕15号）；[广元市人社局转载标题](https://srsj.cngy.gov.cn/New/Detail/20250108112944882.html)；[省厅原站线索](https://rst.sc.gov.cn/rst/gsgg/2024/12/10/6120659569554dffb9099baa7d40d5e6.shtml) | 第3条适用对象及申报人、评委、工作单位行为规范；二次公开第21条为 2025-01-01 起施行、有效期5年；省级印发 2024-12-04（次级转载） | 省级现近年监督线索，原站无法直接读取，参考 [四川在线报道](https://sichuan.scol.com.cn/xwtg/202412/82859455.html)；需要核对标准原件与后续修改后才能参数化惩戒时限 |"
    },
    {
      "id": "SRC-015",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-015 GENERAL-RESEARCH | 四川省人社厅／[《四川省职称评审工作操作规程（2025年版）》全文转载](https://edu.scjxjypx.com/policy_list/detail/12487_693645ae0585b57f095c63c1) | 2025-11-20 省厅落款；第三至第五阶段：资格审核、专家评议/投票、公示/复查、确认备案，网页正文可读；生效/废止未核 | 四川省较新的通用办理研究：补件、复查、确认程序清晰，来源是非官方承载的转发，尚待省厅正式原文核验，且学校自主评审另有确认备案路径；不得直接覆写校内当年流程 |"
    },
    {
      "id": "SRC-016",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-016 CURRENTITY-UNKNOWN | 成都理工大学／[《成都理工大学章程》公开页](https://www.cdut.edu.cn/info/1366/7658.htm) | 检索索引提及第40条职称评审委员会；发布网页时间约 2022–2023，章程批准/施行/修订时间待核 | 正式条款全文因原站 HTTP 412 未能直接校验，仅支持“应继续核校内评委会制度性地位”的检索线索；不据此列具体授权名单 |"
    },
    {
      "id": "SRC-017",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-017 CURRENTITY-UNKNOWN | 可能涉及成都理工大学党委教师工作部门／2025 上半年珠峰引才计划专业技术职务“聘任”通知；目前仅见 [第三方转引](https://www.163sichuan.cn/article/63986.html) | 第三方页面声称 2025 年上半年人事管理系统办理；校方原件发布日期、生效、附件未核 | 只作为“珠峰聘任与一般职称评审可能不同”检索线索；不认定该网址、模块路径或评审权在 2026 年仍有效，不能据此建立线上服务默认入口 |"
    },
    {
      "id": "SRC-018",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-018 CDUT-VERIFIED | 成都理工大学校长办公室／[《校长办公会通报》校长办公会纪要〔2024〕26号 PDF](https://dbxb.cdut.edu.cn/__local/5/46/5B/1D4AC8C8F65E2720BA47CF07625_52BC6F62_293D0.pdf) | 第1页第10项；会议 2024-09-11，校长办公室发布 2024-09-13；办法本身生效/废止日期未见 | 原站校方 PDF 共2页可读，确认会议审定《成都理工大学职称初定与确认管理办法》相关事宜；只证明制度对象/审议事实，不是该办法全文、申报门槛、操作细则或授权签署名单 |"
    },
    {
      "id": "SRC-019",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-019 GENERAL-RESEARCH | 人力资源社会保障部／[人社部发〔2024〕56号《职称评审监管暂行办法》，中国就业网原文](https://chinajob.mohrss.gov.cn/c/2024-09-27/415609.shtml)；[国务院公报载录](https://www.gov.cn/gongbao/2024/issue_11586/202409/content_6975085.html) | 第5–9、16–19、22–27条；落款 2024-07-25，官方公开 2024-09-27；废止未见 | 已读主管部门全文：个人申报真实性、专家保密/回避、组建单位授权、投诉办理、诚信承诺和违规记录均有全国监管依据。模型不得自行认定违规或启动处罚；须有权机关有效结论 |"
    },
    {
      "id": "SRC-020",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-020 GENERAL-RESEARCH | 四川省教育厅／[川教函〔2025〕245号两份高校师德办法原版14页 PDF（省内高校存档）](https://zpb.cdgmxy.edu.cn/uploads/136/file/public/202509/20250928164152_dt8p3hoj21.pdf)；[省厅正式目录](https://edu.sc.gov.cn/scedu/cjhfwjk/zfxxgk_gknrz.shtml)；[内江师院全文及解读](https://rsc.njtc.edu.cn/info/1017/7112.htm) | 《师德评价考核办法》第三、五、六、七部分；《失范处理实施细则》第2、6–10、13–16条；印发 2025-08-06，2025-09-06 施行，有效期五年 | 原版 PDF 与同省多校转发一致，省级适用基线：师德考核四等级、不合格至少24个月职称评聘限制、师德失范受理调查/复核职责。学校具体认定、限制起止、延长/解除及授权结论仍须 T02-T05/有权部门签发，不能 AI 评德"
    },
    {
      "id": "SRC-021",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "title": "| SRC-021 GENERAL-RESEARCH | 人社部、教育部／[《关于深化高等学校教师职称制度改革的指导意见》教育部官网](https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202101/t20210126_511116.html) | 高校教师分类评价、评审组织、师德与教学科研业绩评价段；2021-01 发布，具体后续修订未核 | 国家政策指导，支持按岗位/学科/研究类型分类、强调教学与师德，不提供某个申报人的数值资格，也不能生成 CDUT 2026 校内指标；原站打开失败，检索原文片段可核，标可读取局限 |"
    },
    {
      "id": "SRC-022",
      "label": "R02_RESEARCH_REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "| SRC-022 CROSS-SCHOOL-REFERENCE | 四川师范大学人事处／[《关于开展2026年度职称评审工作的通知》](https://rsc.sicnu.edu.cn/p/68/?StId=st_app_news_i_x639241395612995420) | 第一至六部分；发布 2026-09-04；仅四川师范大学2026批次 | 校外同省对照：不同系列、送审份数、截止期、初/终评与申诉渠道均在其自己通知中精确定义，反证不可用 2023 CDUT 或别校 2026 参数填本案；不引入任何川师人数、日期、指标或审批链为 CDUT 规则 |"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-006",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-011",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-009",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-004",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012",
        "SRC-015",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-012",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-012",
        "SRC-013",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-012",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-009",
        "SRC-010",
        "SRC-018",
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-012",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R035",
      "sourceIds": [
        "SRC-012",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R036",
      "sourceIds": [
        "SRC-012",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T02-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "专业技术职称评审与申报材料审核",
  "description": "本地研究模板 · 非校方正式模板。仅辅助事实核验、材料分类、补件与人工复核；校本规则未获现行授权，不作自动正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策适用范围和审批权限待确认，全部规则为人工或语义候选，禁止自动正式决定。",
  "objectType": "person",
  "displayName": {
    "template": "{{F001}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "不可复用的案卷/申报实例 ID；L0 建案后全阶段",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F001 string:CASE；不可复用的案卷/申报实例 ID；L0 建案后全阶段；Main/Host 生成并审计；CASE.id/建案事件；P1；N（须后台建案）",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F002",
      "label": "当期受理批次与归口；L0 起",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F002 string:BATCH；当期受理批次与归口；L0 起；职改办正式 M001，BATCH.notice_id；P1；U/S",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F003",
      "label": "现行政策版本、限定系列、阶段截止点与规则指纹；L0 起",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F003 object:BATCH；现行政策版本、限定系列、阶段截止点与规则指纹；L0 起；校本 M001 原文版本、授权配置/签收记录；P1；U/S，禁默认 2023 截止日",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F004",
      "label": "学校唯一人事主键/受限身份关联键；L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F004 string:PERSON；学校唯一人事主键/受限身份关联键；L1；学校认证＋人事主档 M003:record_id；不公开原始身份证号；P3；S/H",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F005",
      "label": "法定/档案姓名、姓名变更关联；L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F005 string:PERSON；法定/档案姓名、姓名变更关联；L1；M003:姓名、校方人事变更档案；P2；N/S；不同名须人工桥接",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F006",
      "label": "聘用/在岗/编制或外聘关系及生效期间；L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F006 enum:PERSON；聘用/在岗/编制或外聘关系及生效期间；L1；HR 主档 M003:关系/期间；P2；S/H，不能由账号推定",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F007",
      "label": "当前工作单位及归口推荐单位；L1、L4",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F007 string:PERSON；当前工作单位及归口推荐单位；L1、L4；HR 组织关系 M003、单位正式变更；P2；S/H",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F008",
      "label": "已认证申请者/代理及授权作用域；提交/撤回/异议时",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F008 object:PERSON；已认证申请者/代理及授权作用域；提交/撤回/异议时；Host/Main 已认证会话＋代理正式授权，EVENT.actor_ref；P3；H；拒绝 Renderer 自报",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F009",
      "label": "目标职称系列；L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F009 enum:APPLY；目标职称系列；L1；M002:申请系列 与 M001:开放系列 交叉核；P1；U/N",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F010",
      "label": "申报学科/专业分类；L1、L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F010 string:APPLY；申报学科/专业分类；L1、L3；M002 声明＋职改办当期分类表 M001；P1；U/N",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F011",
      "label": "申报等级/层级；L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F011 enum:APPLY；申报等级/层级；L1；M002＋M001 本批次设置；P1；U/N",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F012",
      "label": "常规/转系列/成果转化/破格/初定/确认/校外委托子型；L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F012 enum:APPLY；常规/转系列/成果转化/破格/初定/确认/校外委托子型；L1；M002/M026，职改办确认受理的路由；P1；U/H",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F013",
      "label": "已有职称系列、级别及原始确认机关；C01/C02/C05b/C10 的 L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F013 object:PERSON；已有职称系列、级别及原始确认机关；C01/C02/C05b/C10 的 L1；HR 主档、原资格决定 M004/M016；P2；S/H",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F014",
      "label": "任现职/资格生效起点（区别聘任与资格）；L1",
      "kind": "date",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F014 date:PERSON；任现职/资格生效起点（区别聘任与资格）；L1；HR 任职档案、原决定 M004；P2；S/H；阈值 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F015",
      "label": "已核学位/学历与取得时间；适用时 L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F015 object:PERSON；已核学位/学历与取得时间；适用时 L1；人事教育背景档案/可核证书 M005；P2；S/N；硬门槛 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F016",
      "label": "既有资格文件及有效/更正状态；C02/C05b/C10 的 L1",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F016 object:PERSON；既有资格文件及有效/更正状态；C02/C05b/C10 的 L1；原职称认定文件、HR 归档 M004/M016；P2；S/H",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F017",
      "label": "教学工作量、教学质量等正式核验事实；要求时 L2/L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F017 object:ACH；教学工作量、教学质量等正式核验事实；要求时 L2/L3；教务/研究生有权记录 M006:record_ref；P2；S/H，具体额度 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F018",
      "label": "论文、著作、项目、奖项等成果清单；L1 声明、L3 核验",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F018 array:ACH；论文、著作、项目、奖项等成果清单；L1 声明、L3 核验；M007:条目/DOI/项目号＋职能部门 M010；P2；N/S；等级不自评",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F019",
      "label": "作者署名、实际贡献、权利归属与核定主体；L1/L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F019 object:ACH；作者署名、实际贡献、权利归属与核定主体；L1/L3；成果原件与机构确认 M007/M010；P2/P3；N/H，争议须权威认定",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F020",
      "label": "成果转化的有效业绩认定与适用类别；C03 L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F020 object:ACH；成果转化的有效业绩认定与适用类别；C03 L3；科研/转化主管正式记录 M008/M010；P2；S/H；分类阈值 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F021",
      "label": "代表作 ID、源文件版本/哈希及作者归属；C06a 送审当前",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F021 array:ACH；代表作 ID、源文件版本/哈希及作者归属；C06a 送审当前；申请者 M009 原件、单位核验记录；P2；N/UNREADABLE",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F022",
      "label": "代表作匿名化、完整页及送审脱敏检查状态；C06a L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F022 enum:ACH；代表作匿名化、完整页及送审脱敏检查状态；C06a L3；M009 原件+匿名版本、可信人工抽检；P3；N/H；不得向专家泄密",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F023",
      "label": "代表作专家评议有效引用、其出具阶段/版本；送审完成后 L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F023 object:AUTH；代表作专家评议有效引用、其出具阶段/版本；送审完成后 L3；专家/委托送审机构 M011 正式意见；P3；S/H；非申请初始必填",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F024",
      "label": "送审豁免资格的原机关正式批准；C06b 已决定后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F024 object:AUTH；送审豁免资格的原机关正式批准；C06b 已决定后；职改办/法定授权方 M012；P2；U/H，不允许 AI 授予豁免",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F025",
      "label": "师德/思想政治考核有效等级、适用期间、处分效力/解除及复核状态（不含无关案情）；L2 完成后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F025 object:AUTH；师德/思想政治考核有效等级、适用期间、处分效力/解除及复核状态（不含无关案情）；L2 完成后；党委教师工作/有权单位 M014；省级制度 SRC-020 仅管基线、非个人事实；P3；S/H，不由自述生成，省规的资格影响由原机关确认",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F026",
      "label": "科研诚信正式处理/审核状态及生效范围；L2，发生争议随时",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F026 object:AUTH；科研诚信正式处理/审核状态及生效范围；L2，发生争议随时；科研诚信有权机关 M013；SRC-003 职权链；P3；S/H，不能自动定性",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F027",
      "label": "规定期间年度考核/履职评价引用；按批次 L2/L3",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F027 object:AUTH；规定期间年度考核/履职评价引用；按批次 L2/L3；HR/考核主管正式记录 M015；P2；S/H，年限 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F028",
      "label": "单位真实性核验、推荐/排名与授权签发；L4 后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F028 object:STAGE；单位真实性核验、推荐/排名与授权签发；L4 后；单位正式 M018、组织成员授权 F037；P2；S/H，L1 不要求",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F029",
      "label": "单位/学科/结果公示的阶段、受理异议记录；L4–L7",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F029 object:STAGE；单位/学科/结果公示的阶段、受理异议记录；L4–L7；单位/职改办公示及处置 M018–M021；P2/P3；S/H，阶段不可混写",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F030",
      "label": "职改办资格复核/送审组织结论；L5 后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F030 object:STAGE；职改办资格复核/送审组织结论；L5 后；职改办签发 M019；P2；S/H，非批准",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F031",
      "label": "学科组或评委会正式评议/决议引用；L6 后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F031 object:STAGE；学科组或评委会正式评议/决议引用；L6 后；当届有权机构 M020、F037；P3；S/H，禁止 AI 投票",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F032",
      "label": "学校正式审定文号、效力及必要备案；L7 后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F032 object:STAGE；学校正式审定文号、效力及必要备案；L7 后；有权学校机关 M021、备案记录；P2；S/H；非模型结果",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F033",
      "label": "委托评审函、受托权限及外部正式结果；C10 L4–L7",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F033 object:STAGE；委托评审函、受托权限及外部正式结果；C10 L4–L7；职改办及外部有权机关 M025；P2/P3；S/H，不以截图代函",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F034",
      "label": "补正通知、受影响材料键、前后版本哈希和重审范围；C07",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F034 object:EVENT；补正通知、受影响材料键、前后版本哈希和重审范围；C07；M022＋系统不可变版本日志；P2；N/H，旧结论失效",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F035",
      "label": "撤回请求、本人认证、受理与是否生效；C08",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F035 object:EVENT；撤回请求、本人认证、受理与是否生效；C08；M023＋有权机关回执；P2；H，禁止自动删案",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F036",
      "label": "公示异议/复查/投诉及正式答复状态；C09",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F036 object:EVENT；公示异议/复查/投诉及正式答复状态；C09；M024＋受理机关回执/决定；P3；S/H，期限 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F037",
      "label": "机构签发权限、可信 Actor、有效期、签名/证据哈希；每个正式动作",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F037 object:EVENT；机构签发权限、可信 Actor、有效期、签名/证据哈希；每个正式动作；岗位授权清单、签章验证和后台审计；M018–M025 关联；P3；H，拒绝前端 actor 和图片假章",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F038",
      "label": "有权决定的生效/中止/更正/撤销及归档状态；L7/L8",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F038 enum:CASE；有权决定的生效/中止/更正/撤销及归档状态；L7/L8；仅引用学校/备案机关 M021 后续正式更正；P2；S/H，不能从 PASS_FACT 派生",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F039",
      "label": "申报人真实性/诚信承诺的签署主体、承诺内容版本与受理批次；L1 当前申报材料提交时",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F039 object:APPLY；申报人真实性/诚信承诺的签署主体、承诺内容版本与受理批次；L1 当前申报材料提交时；M027 本人有权签署的原始承诺与后台验签；法定诚信承诺基线 SRC-019；P2；N（评审申报已确定时），C05是否适用 U",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F040",
      "label": "专家/评委与具体申请事项的回避、保密承诺及受理处置（仅有权可查的最小状态）；L3/L6 审议启动后",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F040 object:STAGE；专家/评委与具体申请事项的回避、保密承诺及受理处置（仅有权可查的最小状态）；L3/L6 审议启动后；M028 原评审组织或监督机关有效记录；SRC-012/019；P3；S/H，泄漏评委身份不得向申请人展示",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F041",
      "label": "评委会组建/备案权、系列层级授权范围、有效期、委托/变更版本；L0备案校验及L5–L7正式评议",
      "kind": "text",
      "required": false,
      "extractionHint": "T02-T04 原稿第06节：F041 object:AUTH；评委会组建/备案权、系列层级授权范围、有效期、委托/变更版本；L0备案校验及L5–L7正式评议；M029 核准备案及有效授权记录；SRC-012/019；P2/P3；S/H；无法验权不得以2023评委会实例作为当前授权",
      "visibility": "internal",
      "scope": "subject"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当期职称评审/初定/确认正式通知、附件及受理授权",
      "purpose": "T02-T04 原稿第07节：M001 当期职称评审/初定/确认正式通知、附件及受理授权；校职改办/有关学校机关持有（盖章文件或可核官网/OA 原版）；L0 现必，机构提供；正式版本/受理授权书可替代网页摘录；F002/F003/F009–F012；SRC-001/002/004/009/010/018；按批次及发文机关归属、政策版本冻结；未取得当期→POLICY_UNCONFIRMED，官网失联→SOURCE_UNAVAILABLE，扫描不可读→UNREADABLE；不能拿 2023 版顶替",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "本人职称申报表/申报声明及系列、专业、级别、成果索引",
      "purpose": "T02-T04 原稿第07节：M002 本人职称申报表/申报声明及系列、专业、级别、成果索引；本人持有（当期学校认可表单或正式电子提交）；C01–C04/C06/C10 在 L1 现必的申请意图，具体表单未核，合法替代仅当学校接受的同内容申请记录；F008–F012/F018；SRC-001/002；绑定本人 F004、批次、签收版；未提交→NEEDS_MATERIAL，不可读→UNREADABLE，表单版本无现行依据→POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "人事关系、真实身份、组织归属证明",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M003 人事关系、真实身份、组织归属证明；人事部门持有（HR 主档/授权核档记录）；L1 核身份时现必，优先机构自取；经 HR 签发的证明/档案核验记录可替代接口；F004–F008；SRC-001/002/012；本人与人事有效期绑定；源断开→SOURCE_UNAVAILABLE，冲突→CONFLICT，禁止自行要求裸身份证照片；不可读→UNREADABLE",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "既有职称资格/聘任生效凭据",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M004 既有职称资格/聘任生效凭据；人事档案或原决定机关持有（原文号/归档扫描）；C01/C02/C05b/C10 按政策条必，内部优先；原签发机关可核决定替代证书复印件；F013/F014/F016；SRC-001/002/009；本人、原级别/系列、资格与聘任两日期分别记录；缺源→SOURCE_UNAVAILABLE，冲突→CONFLICT；不可读→UNREADABLE",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "学历学位、取得时间权威记录",
      "purpose": "T02-T04 原稿第07节：M005 学历学位、取得时间权威记录；HR 档案/证书颁发机关持有；L1 政策条件触发条必，内部优先；可验学历学位登记替代本人复印件，是否认可由学校定；F015；SRC-008 仅历史材料示例、SRC-009/010；本人及证书核验记录版本绑定；缺少当年要求→POLICY_UNCONFIRMED；材料缺失→NEEDS_MATERIAL，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "本/研究生教学量及课程评价的部门结果",
      "purpose": "T02-T04 原稿第07节：M006 本/研究生教学量及课程评价的部门结果；教务/研究生主管持有；当期系列要求且进入 L2/L3 时条必；主管部门签章汇总/可信记录可替代明细截图；F017；SRC-001/002；课程、学期、申报人、审核口径锁定；源失联→SOURCE_UNAVAILABLE，主管数据冲突→CONFLICT，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "论文、著作、项目、奖项等业绩主张与可核佐证",
      "purpose": "T02-T04 原稿第07节：M007 论文、著作、项目、奖项等业绩主张与可核佐证；本人提供索引，成果原始机构/数据库持有原证据；C01/C03/C06 在 L1 视申报成果条必；DOI、著作版权/获奖/立项官方记录可依法替代重复扫描；F018/F019/F021；SRC-001/002/003；一项一成果 ID、署名版本/页码与个人贡献声明；缺被主张的关键材料→NEEDS_MATERIAL，不可读→UNREADABLE，归属争议→CONFLICT/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "成果转化具体业绩及官方确认",
      "purpose": "T02-T04 原稿第07节：M008 成果转化具体业绩及官方确认；科研/成果转化主管、合同/验收原机关持有；C03 被有效分类规则触发的 L3 条必；已核主管部门业绩认定可替代合同敏感正文；F020；SRC-006/009/010；按项目、权属、发生时间、个人贡献版本锁定；标准未获校规→POLICY_UNCONFIRMED，来源失联→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "代表作原件、必要匿名副本与完整性证明",
      "purpose": "T02-T04 原稿第07节：M009 代表作原件、必要匿名副本与完整性证明；本人原件/单位抽核及送审工作组持有；C06a 当期明确送审时 L1/L3 条必；正式数字出版记录＋经单位验证的匿名副本可按学校规则替代纸本；F021/F022；SRC-001/002；作品 ID＋源原件哈希与匿名版哈希分开；缺→NEEDS_MATERIAL，不可读→UNREADABLE，泄密或匿名失败→CONFLICT/NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "教学科研成果真实性及分管部门核验意见",
      "purpose": "T02-T04 原稿第07节：M010 教学科研成果真实性及分管部门核验意见；原单位、职能部门持有；有关成果进入 L3 验证才后产；本部门可信业务结果/签章文书可替代扫描表；F017–F020；SRC-001/002/003；部门签发版本对应具体成果；尚未完成→NEEDS_HUMAN_DECISION 而非申请人缺件，不可读→UNREADABLE，部门冲突→CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "代表作内外专家送审/评阅有效意见",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M011 代表作内外专家送审/评阅有效意见；职改办或受托送审机构持有；C06a 送审后 L3 后产；只能引用原专家/组织正式保密记录；F023；SRC-001/002/012；绑定代表作源版本及匿名版、回避/授权范围；缺因尚未审→NEEDS_HUMAN_DECISION，源断开→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "代表作免送审的正式审核凭证",
      "purpose": "T02-T04 原稿第07节：M012 代表作免送审的正式审核凭证；职改办/原授权机关持有；C06b 正式豁免获批后产/已有有效决定可引用；原机关带编号有效记录为合法替代；F024；SRC-001/002/009/010；按申报人、批次、适用范围绑定；无现行豁免条款→POLICY_UNCONFIRMED，无有权决定→NEEDS_HUMAN_DECISION，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "科研诚信处理/调查/申诉结论的必要有效状态",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M013 科研诚信处理/调查/申诉结论的必要有效状态；科研诚信有权机关持有；L2 条必为权威查询/核验动作，不是本人须交“无不端证明”；正式有效决定或授权状态接口为替代；F026；SRC-003/011；最小化引用案号、效力及限制范围，原卷严格 P3；无法取源→SOURCE_UNAVAILABLE，尚在调查→NEEDS_HUMAN_DECISION，不可读→UNREADABLE",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "师德/思想政治考核正式结论",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M014 师德/思想政治考核正式结论；党委教师工作部门/授权单位持有；按当期 L2 审核后产；有权数据库的等级、限制期、是否复核/解除的最小正式状态或签发文书替代纸表；F025；SRC-001/002/007/011/020；区分“未作出/正在复查/有效/已变更或解除”，不存无关敏感事实；无结论→NEEDS_HUMAN_DECISION，源失联→SOURCE_UNAVAILABLE，不可读→UNREADABLE，后续更正不删除原件",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "年度考核及履职评价正式结果",
      "purpose": "T02-T04 原稿第07节：M015 年度考核及履职评价正式结果；HR/考核机关持有；申报标准明确考察期间才条必，机构优先；权威考核档案替代本人重复上传；F027；SRC-001/002/008（旧版不得定年限）；每考核年及版本/机关绑定；年限不明→POLICY_UNCONFIRMED，源失联→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "转系列说明及原资格有效证明/确认记录",
      "purpose": "T02-T04 原稿第07节：M016 转系列说明及原资格有效证明/确认记录；本人陈述＋HR/原评定机关持有；C02 L1 条必（须当期允许此通道）；既有 M004 的原决定引用可替代重复上传；F012/F013/F016；SRC-001/002/009/010；原系列和目标系列均记录，不能误标为 C05b；政策未核→POLICY_UNCONFIRMED，原资格不可核→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "破格/特殊通道适用的正式批准及资格证据",
      "purpose": "T02-T04 原稿第07节：M017 破格/特殊通道适用的正式批准及资格证据；人才/HR 与专项授权机关持有；C04 有校本专项政策时条必；签发机关的人才资格决定/豁免函可替代自述；F012/F037；SRC-009/010/017；按权力依据、适用申请人/批次绑定；政策未得→POLICY_UNCONFIRMED，尚待决定→NEEDS_HUMAN_DECISION；不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "单位真实性审核、推荐意见/排序与单位公示异议记录",
      "purpose": "T02-T04 原稿第07节：M018 单位真实性审核、推荐意见/排序与单位公示异议记录；院系有权单位持有；L4 后产；学校认可电子流程结果/正式盖章审核单可替代扫描件；F028/F029/F037；SRC-001/002；推荐单位、签发人及版本/公示期绑定；未产生→NEEDS_HUMAN_DECISION，签章不可核→CONFLICT，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "职改办资格复核与进入下一环节的名单/公示",
      "purpose": "T02-T04 原稿第07节：M019 职改办资格复核与进入下一环节的名单/公示；学校职改办持有；L5 后产；职改办正式归档结果为唯一可信替代；F029/F030/F037；SRC-001/002/012；批次、申请版本、复核人员权限绑定；尚未审→NEEDS_HUMAN_DECISION，来源失联→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "学科组/评委会经授权的评议决议及公示处理",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M020 学科组/评委会经授权的评议决议及公示处理；原评议/评委会组织者持有；L6 后产；依法可核的会议决议引用替代非授权个人票据；F029/F031/F037；SRC-001/002/005/012；评委会系列/当期授权及保密级别绑定；无决定→NEEDS_HUMAN_DECISION，签发不合权→CONFLICT，不可读→UNREADABLE",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "学校最后审定/发文/备案及后续更正撤销",
      "purpose": "T02-T04 原稿第07节：M021 学校最后审定/发文/备案及后续更正撤销；学校有权决定机关/备案机关持有；L7/L8 后产；学校正式文号和可核有效记录可替代不完整截图；F032/F038/F037；SRC-001/002/012/013；学校权力范围、文号、效力日期、被更正文书链绑定；未决→NEEDS_HUMAN_DECISION，真伪不可查→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "退补通知、被要求修正的材料及送达回执",
      "purpose": "T02-T04 原稿第07节：M022 退补通知、被要求修正的材料及送达回执；原审查单位/本人分别持有；C07 补正触发时现必（原意见由机关生成，回应由本人提交）；只需替换受影响 M 版本，其他可复用；F034；SRC-015（仅通用参考）；old_hash/new_hash/supersedes 不可省；原件缺→NEEDS_MATERIAL，不可读→UNREADABLE；过期/是否可补校本 U/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "撤回申请、身份授权、受理决定",
      "purpose": "T02-T04 原稿第07节：M023 撤回申请、身份授权、受理决定；本人/代理提出，原受理机关处理；C08 提请时申请现必，受理决定后产；可信实名送达回执可替代自传签名图；F008/F035；SRC-012/015；案卷、撤回范围、请求时间、有效裁决分开版本化；申请缺→NEEDS_MATERIAL，受理权限未知→NEEDS_HUMAN_DECISION，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "公示异议/复查/投诉陈述与受理/处理结果",
      "purpose": "T02-T04 原稿第07节：M024 公示异议/复查/投诉陈述与受理/处理结果；本人或合法提出者＋有权机构；C09 申诉时本人陈述现必，机关答复后产；可核受理号或原公示记录作合法引用；F029/F036；SRC-012/015；涉及第三人信息限阅，证据版本和送达时间绑定；初始未提理由→NEEDS_MATERIAL，受理口径未知→POLICY_UNCONFIRMED，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "外部委托授权函、送审、外部结果/备案",
      "purpose": "T02-T04 原稿第07节：M025 外部委托授权函、送审、外部结果/备案；校方委托机关及外部授权评委会持有；C10 有正式外评路径才条必；委托函由学校形成，外部结果后产；带权限的原函/正式回传可替代普通扫描；F033/F037；SRC-012/013/015；发函机关、外评专业/级别、受托机构与版本绑定；无授权→NEEDS_HUMAN_DECISION，外源失联→SOURCE_UNAVAILABLE，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "初定/确认申请表及现行校本材料清单",
      "purpose": "T02-T04 原稿第07节：M026 初定/确认申请表及现行校本材料清单；申请人提交、学院/人事处核对，办法由学校持有；C05a/C05b L1 条必；SRC-004 的公布附件系个人公示材料，不是已核空白表；只有学校认可的表单/受理记录能合法替代；F012/F015/F016；SRC-004/018；初定与确认分子型存储、不得与 C02 混同；办法/空白表未取得→POLICY_UNCONFIRMED，当前确需资料缺→NEEDS_MATERIAL，不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "个人职称申报诚信承诺",
      "purpose": "T02-T04 原稿第07节：M027 个人职称申报诚信承诺；由申报人本人或依法有权主体签署，受理机关核对（当期承诺书或具有法律效力的正式电子签署记录）；属于职称评审申报的L1现必，国家监管办法有诚信承诺制度；C05初定/确认是否按该类申报收取待政策定性，不无条件强要；F008/F039；SRC-012/019；与申报人、案卷、批次、承诺文本版本和签署时间绑定；确应提交而未交→NEEDS_MATERIAL，签章/身份不符→CONFLICT，可得不可读→UNREADABLE；是否触发处罚由有权机构决定",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "专家及评审工作人员的回避/保密承诺、利益冲突核查与处置记录",
      "purpose": "受限证据：仅允许有权人工核验后的最小状态引用；禁止向通用上传/模型提交敏感原文。T02-T04 原稿第07节：M028 专家及评审工作人员的回避/保密承诺、利益冲突核查与处置记录；由评委会办事机构/监管机关保密持有；L3/L6组织评议后由有权机关形成，不是申请人前置补件；官方最小结果/核查记录代替披露全员身份；F040/F037；SRC-012/019；绑定当届委员会/专家作用域、涉案人与会议轮次、签名/回避处置版本；未组织→NOT_APPLICABLE，已组织但无可核状态→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，不对申报人公开匿名名单",
      "acceptedKinds": [],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "评委会核准备案、系列/层级权限清单与合法委托授权",
      "purpose": "T02-T04 原稿第07节：M029 评委会核准备案、系列/层级权限清单与合法委托授权；由核准备案机关、学校职改办/有权组建单位持有；L0 有拟办理的评议路径时校方前置核权限，L5/L6正式评议前再次校验；可由备案机关可信查询结果替代扫描公文；F041/F033/F037；SRC-012/019；按委员会、专业/级别、有效期、学校/校外代理授权及当期版本锁定；不能访问→SOURCE_UNAVAILABLE，范围不合→CONFLICT，当前路线不明→POLICY_UNCONFIRMED；自报委员名无效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "研究原稿第08节逐条审核规则（人工核验）",
      "order": 0,
      "required": false,
      "criteria": [
        {
          "id": "R001",
          "title": "L0；T=有本期职改/初定受理公告；F=有权明确不受理本类型；U=无有效公告",
          "requirement": "R001 L0；T=有本期职改/初定受理公告；F=有权明确不受理本类型；U=无有效公告；SRC-001/002/009/010/018；F001–F003/F009–F012；M001；比对发文机关、发布/废止、申请范围及阶段日期；2023 仅历史参照，2024 纪要不等于初定办法现行原文；符合 PASS_FACT（仅公告元数据）；F→NA；U→PU；发文来源失联 SOURCE_UNAVAILABLE；职改办确认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "L1/L8；T=申报/撤回/复查请求；F=无需本人动作的机构内部步骤；U=代理范围未核",
          "requirement": "R002 L1/L8；T=申报/撤回/复查请求；F=无需本人动作的机构内部步骤；U=代理范围未核；SRC-001/002/012；F001/F004/F008/F037；M002/M003/M023/M024；对 Host/Main 认证 Actor、请求人与案卷主键、代理范围/有效期间；前端 role/签名图低信任，不与审批授权相混；一致 PASS_FACT；伪造 CONFLICT；U→NEEDS_HUMAN_DECISION；可信身份管理员/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "L1；T=属于需校内人事资格的申请；F=经有权文件不归校内受理；U=关系性质未明",
          "requirement": "R003 L1；T=属于需校内人事资格的申请；F=经有权文件不归校内受理；U=关系性质未明；SRC-001/002/012；F004–F007；M003；人事主键、姓名、单位、关系有效期与主档核对；重名或曾用名须 HR 桥接；合同不自动给职称申请资格；一致 PASS_FACT；不同主键 CONFLICT；源断 SOURCE_UNAVAILABLE；U→人工核定；人事处",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "L1；T=当前批次公开受理目标系列/专业/级别；F=有权确认该子型不适用；U=开放范围未核",
          "requirement": "R004 L1；T=当前批次公开受理目标系列/专业/级别；F=有权确认该子型不适用；U=开放范围未核；SRC-001/002/009/010；F009–F012/F002/F003；M001/M002；申请表与当期正式系列字典比较；不把 2023 四系列清单推广到 2026；C02 转系列与 C05b 确认不可仅按标题匹配；相符 PASS_FACT；目标描述冲突 CONFLICT；F→NA；U→PU；职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "L1；T=该路线需原职称/资格；F=有效批次证实无需；U=原资格适用性不明",
          "requirement": "R005 L1；T=该路线需原职称/资格；F=有效批次证实无需；U=原资格适用性不明；SRC-001/002/009；F013/F016；M004；比较资格文号、等级、原确认机关、有效/更正记录；资格与岗位聘任是不同事实；以 HR/原机关为准；一致 PASS_FACT；冲突 CONFLICT；F→NA；U→PU；人事处/原发证机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "L1；T=当期明文设置任职资历；F=明文免资历核；U=起算/门槛未知",
          "requirement": "R006 L1；T=当期明文设置任职资历；F=明文免资历核；U=起算/门槛未知；SRC-001/002/008/009/010；F014/F003；M001/M004；核任职起止、生效日，区分资格日与聘任日；只在现行条款给出年限算法时计算；2013/2023 不移植；日期一致 PASS_FACT（非阈值合格）；冲突 CONFLICT；F→NA；U→PU；HR/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "L1；T=当期规定需某学历/学位；F=正式免核；U=所需学历条件未明",
          "requirement": "R007 L1；T=当期规定需某学历/学位；F=正式免核；U=所需学历条件未明；SRC-008/009/010；F015；M001/M005；只核颁发机构、时间和本人归属；2013 历史支撑材料不能创建 2026 本科/硕博门槛；事实相符 PASS_FACT；材料缺 NEEDS_MATERIAL；F→NA；U→PU；HR/学历核验经办人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "L1；T=C02 转系列且当前制度允许；F=非转系列；U=初定/确认与转评权责未分",
          "requirement": "R008 L1；T=C02 转系列且当前制度允许；F=非转系列；U=初定/确认与转评权责未分；SRC-001/002/009/010/018；F012/F013/F016；M002/M004/M016/M026；原系列、目标系列、原正式资格与申请法律性质一致；明确 C05b 不是因名称相同自动转评；相符 PASS_FACT（仅证据对应）；F→NA；U→PU/H；HR/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "L2/L3；T=当期需要任现职年度考核；F=明文不适用；U=考察年数/有效期间不明",
          "requirement": "R009 L2/L3；T=当期需要任现职年度考核；F=明文不适用；U=考察年数/有效期间不明；SRC-001/002/008/009/010；F027/F003；M001/M015；按年度比 HR/考核机关正式结果、保留原结论和有效更正；不得将旧规三年考核移作现行标准；记录一致 PASS_FACT；年限 U→PU；S 源断；考核主管/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "L2/L3；T=申报系列需教学业绩；F=有效规则不要求；U=课时/评价口径不明",
          "requirement": "R010 L2/L3；T=申报系列需教学业绩；F=有效规则不要求；U=课时/评价口径不明；SRC-001/002/009/010；F017；M006/M010；对教学主管课程、学期、工作量正式记录；T06 课程任教权仅作邻接输入而不从职称反推任教资格；事实一致 PASS_FACT；教学主管冲突 CONFLICT；口径 U→PU；教务/研究生院",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "L1/L3；T=主张论文/项目/著作等奖励成果；F=此案明确无该类主张；U=成果识别不明",
          "requirement": "R011 L1/L3；T=主张论文/项目/著作等奖励成果；F=此案明确无该类主张；U=成果识别不明；SRC-001/002/003；F018；M007/M010；凭 DOI/项目号、卷期或证书号查权威原件与主管记录；区分主张与已认定成果，时间截点取批次政策；实体对应 PASS_FACT；缺支撑 NEEDS_MATERIAL，不符 CONFLICT；科研/社科主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "L1/L3；T=成果计入本人业绩；F=未主张归属；U=共同署名/贡献争议",
          "requirement": "R012 L1/L3；T=成果计入本人业绩；F=未主张归属；U=共同署名/贡献争议；SRC-001/002/003；F004/F019；M003/M007/M010；按人员主键、原始署名、共同作者与主管贡献认定对照；不能由姓名相似、AI 引文识别判份额或不端；权威一致 PASS_FACT；原文与主管冲突 CONFLICT；争议 NEEDS_HUMAN_DECISION；科研主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "L3；T=C03 且有本期成果转化型规则；F=非成果转化型；U=成果分类/归属标准未得",
          "requirement": "R013 L3；T=C03 且有本期成果转化型规则；F=非成果转化型；U=成果分类/归属标准未得；SRC-006/009/010；F012/F020；M001/M008/M010；比转化项目、权属、结项/到账等实际经主管认可的事实；宣传报道不能给分数门槛；核验相符 PASS_FACT；F→NA；U→PU；转化管理部门/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "L1/L3；T=当前要求送代表作；F=有权不送/已豁免；U=送审要求/份数未知",
          "requirement": "R014 L1/L3；T=当前要求送代表作；F=有权不送/已豁免；U=送审要求/份数未知；SRC-001/002/009/010；F021；M001/M007/M009；比作品 ID、完整正文、原件与送审副本 hash、该批截止时间；OCR 仅抽取线索；版本一致 PASS_FACT；缺 NEEDS_MATERIAL、不可读 UNREADABLE；F→NA；U→PU；本人/送审单位",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "L3；T=需要匿名送审；F=有权采用非匿名流程；U=匿名要求未知",
          "requirement": "R015 L3；T=需要匿名送审；F=有权采用非匿名流程；U=匿名要求未知；SRC-001/002；F021/F022；M009；核匿名副本无姓名、工号、批注、可识别元数据，并映射原件；由送审人员确认，不主动泄露；可送审的形式事实 PASS_FACT；泄漏 CONFLICT／退补；U→PU；送审管理员",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "L3；T=代表作已正式完成送审；F=未触发送审；U=送审是否发生不明",
          "requirement": "R016 L3；T=代表作已正式完成送审；F=未触发送审；U=送审是否发生不明；SRC-001/002/012；F021/F023/F037；M009/M011；检原送审机构权责、作者匿名关系、报告签发及对应作品版本；专家学术判断不能 OCR 复算；对应性 PASS_FACT；不对应 CONFLICT，未评 NEEDS_HUMAN_DECISION；送审组织/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "L1/L3；T=请求或援引豁免；F=未申请豁免；U=豁免条款未证实",
          "requirement": "R017 L1/L3；T=请求或援引豁免；F=未申请豁免；U=豁免条款未证实；SRC-001/002/009/010；F024/F037；M001/M012；查有权豁免文书、条件及批次/作品效力；自称已豁免不成立，豁免批准为原机关决定；凭据相符 PASS_FACT（不授豁免）；F→NA；U→PU/H；职改办/原签发机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "L2；T=需师德考核结论；F=依法不属相应师德考核对象/阶段；U=个案评价与限制效力状态不明",
          "requirement": "R018 L2；T=需师德考核结论；F=依法不属相应师德考核对象/阶段；U=个案评价与限制效力状态不明；SRC-001/002/007/011/020；F025；M014；核有权师德主管的考核等级及生效/复查/处理解除状态是否属本人、适用期间；省级办法已载不合格至少24个月职称评聘资格限制，但须由原部门确认起止与适用，禁止模型定档、自执行处罚；有权记录对应 PASS_FACT（仅证明记录）；需定档、资格影响或复查中 NEEDS_HUMAN_DECISION，权威源断 SOURCE_UNAVAILABLE；师德主管/T02-T05",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "L2；T=此人依校规须核科研诚信；F=有权豁免该核验；U=结论可用性不明",
          "requirement": "R019 L2；T=此人依校规须核科研诚信；F=有权豁免该核验；U=结论可用性不明；SRC-003 第2–3、5–10、16、20–26条；F026；M013；只查有效机构结果、是否复查/撤销；投诉截图不可作为已认定学术不端；不能“无记录=无不端”；有权状态可核 PASS_FACT；源断 SOURCE_UNAVAILABLE，案件未决 NEEDS_HUMAN_DECISION；科研诚信机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "L0/L1；T=C04 特殊/破格通道有正式授权；F=常规申报；U=专项规则未得",
          "requirement": "R020 L0/L1；T=C04 特殊/破格通道有正式授权；F=常规申报；U=专项规则未得；SRC-009/010/017；F012/F037；M001/M017；人才身份和豁免范围须按原人事/人才决定及当期政策比对；“珠峰聘任”不是职称结果；授权信息对应 PASS_FACT；F→NA；U→PU；人才/职改办有权机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "L0/L1；T=C05a 初定或 C05b 确认，且校本办法/表单已明确；F=其他类型；U=办法正文/法律性质缺失",
          "requirement": "R021 L0/L1；T=C05a 初定或 C05b 确认，且校本办法/表单已明确；F=其他类型；U=办法正文/法律性质缺失；SRC-004/018；F012/F015/F016；M001/M004/M005/M026；区分初定与确认不同的申请表、教育与既有资格引用；2024 办公会只证审定事实，不提供条件/决定机关；可核申报字段 PASS_FACT；F→NA；U→PU；学院/人事有权机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "L4；T=该案依批次进入单位审核推荐；F=无需单位推荐的有权路径；U=当前推荐组织授权不明",
          "requirement": "R022 L4；T=该案依批次进入单位审核推荐；F=无需单位推荐的有权路径；U=当前推荐组织授权不明；SRC-001/002；F028/F037；M018；核单位、考核组、签名岗位、所审材料快照及正式推荐意见；院系推荐是独立人工决定；签发与案件相符 PASS_FACT；假章 CONFLICT；未开会 NEEDS_HUMAN_DECISION；单位推荐组",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "L4–L7；T=单位推荐或评委会结果等依法应公示阶段；F=该阶段经现行授权法规不公示/尚未进入；U=校内更长期限、异议处置或阶段归属未知",
          "requirement": "R023 L4–L7；T=单位推荐或评委会结果等依法应公示阶段；F=该阶段经现行授权法规不公示/尚未进入；U=校内更长期限、异议处置或阶段归属未知；SRC-001/002/012/015/019；F029/F003；M018/M019/M020/M024；核公告机关、事项、披露最小范围、起止日期和正式异议处置；国家第40号令第16/26条对单位及评委会组建单位公示各有至少5个工作日下限，校内如有更严期限从其规定；不拿2013/2023校方旧天数代替；可核公告事实 PASS_FACT，未核校内期限→POLICY_UNCONFIRMED，异议未处理→NEEDS_HUMAN_DECISION；原公示单位/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "L5；T=进入职改办资格复审；F=未入该阶段；U=当期复审权责未知",
          "requirement": "R024 L5；T=进入职改办资格复审；F=未入该阶段；U=当期复审权责未知；SRC-001/002/012；F030/F037；M019；核签发机关、资格复审对哪个申请快照、是否准予送学科组；不得让上游预审取代；凭据对应 PASS_FACT；F→NA；权责 U→PU/H；职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "L6；T=须由已核准评委会/学科组处理且已到该阶段；F=初定等经核可跳过；U=评委会权限/路线未知",
          "requirement": "R025 L6；T=须由已核准评委会/学科组处理且已到该阶段；F=初定等经核可跳过；U=评委会权限/路线未知；SRC-001/002/005/012/019；F009/F011/F031/F037/F041；M001/M020/M029；校准评委会批准的系列级别、会议签发、表决结果来源/版本；不得模型票决、推举或借用其他系列委员会；记录对应 PASS_FACT；越权 CONFLICT；未评 NEEDS_HUMAN_DECISION；评委会/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "L7/L8；T=学校有权机关已形成正式结果/变更；F=尚未到决定阶段；U=结果签发/生效或备案权限未核",
          "requirement": "R026 L7/L8；T=学校有权机关已形成正式结果/变更；F=尚未到决定阶段；U=结果签发/生效或备案权限未核；SRC-001/002/012/013；F032/F038/F037；M021；核正式文号、人员、系列、级别、时间、学校/备案机关的当前有效状态；推理和截图不能产生决定；文书存在一致 PASS_FACT（仅核文书事实）；F→NA；伪造 CONFLICT，未决 H；学校有权机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "L0/L4–L7；T=C10 确需委托外部评审；F=在校内合法评审；U=委托核准不明",
          "requirement": "R027 L0/L4–L7；T=C10 确需委托外部评审；F=在校内合法评审；U=委托核准不明；SRC-012/013/015；F009/F011/F033/F037；M001/M025；委托函、受托评委会系列/级别和外部回函与权限交叉核；本人不能代学校发委托；函件对应 PASS_FACT；F→NA；授权 U→PU/H；学校职改办/外评机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "L1–L8；T=有有效补正/更正事件；F=未修改；U=当阶段是否可改未核",
          "requirement": "R028 L1–L8；T=有有效补正/更正事件；F=未修改；U=当阶段是否可改未核；SRC-001/002/015；F021/F023/F034/F037；M009/M011/M022 及实际被替换 M；校验补正通知、old/new hash、签收时点、依赖 R；后续意见指向旧版须标不适用并交原机关决定重评，禁止删除旧记录；当前版本链相符 PASS_FACT；错配 CONFLICT；可补期限 U→PU/H；原审查/送审机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "L1–L8；T=已收到撤回申请；F=无撤回；U=是否可撤/有权受理人未核",
          "requirement": "R029 L1–L8；T=已收到撤回申请；F=无撤回；U=是否可撤/有权受理人未核；SRC-012/015；F001/F008/F035；M023；核请求人、案号、提交时间，保留受理与生效分离；申请后、学校受理前不能把案卷删除或自动判撤销；请求事实 PASS_FACT；F→NA；受理 H；原受理机关/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "L4–L8；T=公示异议/复查/投诉有正式请求；F=无救济请求；U=路径或受理期限未知",
          "requirement": "R030 L4–L8；T=公示异议/复查/投诉有正式请求；F=无救济请求；U=路径或受理期限未知；SRC-012/015；F008/F029/F036；M024；分流本人复查、第三人异议、科研诚信/师德举报，核签收送达与原结果；不得模型改票；请求对应 PASS_FACT；F→NA；校本期限 U→PU；受理/调查 NEEDS_HUMAN_DECISION；对应有权机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R031",
          "title": "L2–L8；T=收到带签章/有权结论材料；F=未到机构决定步骤；U=岗位授权链不可取",
          "requirement": "R031 L2–L8；T=收到带签章/有权结论材料；F=未到机构决定步骤；U=岗位授权链不可取；SRC-001/002/003/012/018；F008/F028–F033/F037；M010–M014/M017–M025；比 issuer、主体、授权范围、有效期、签署版、案卷及个人；OCR 印章图不具有独立权威，专家匿名限授权核验；签发属性一致 PASS_FACT；伪造/越权 CONFLICT；U→SOURCE_UNAVAILABLE/H；可信权限核验机构",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R032",
          "title": "任阶段；T=材料实际已提交/合法核档；F=该材料未触发；U=是否当前必需未证实",
          "requirement": "R032 任阶段；T=材料实际已提交/合法核档；F=该材料未触发；U=是否当前必需未证实；SRC-001/002/003/004/009/010/018/019/020；F018/F021/F034/F039–F041；M002–M029（仅本阶段触发且有读取授权的槽）；检页锚/原件与版本完整性；M028/M029 仅由有权机关处理保密状态，前端/OCR无权取得专家名单；无法提取不等于未提交；可读 PASS_FACT（仅读取事实）；已在场不可读 UNREADABLE，源失联 SOURCE_UNAVAILABLE；资料持有人/保密核验人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "L0–L8；T=从 G50/邻接 S/T 复用正式事实或存在后续文书；F=没有可复用结果且无需后续；U=原决定主体/阶段未核",
          "requirement": "R033 L0–L8；T=从 G50/邻接 S/T 复用正式事实或存在后续文书；F=没有可复用结果且无需后续；U=原决定主体/阶段未核；SRC-001/002/003/012；F001/F003/F017/F026/F028–F038；M003/M006/M010/M013–M015/M018–M025；比权威原系统 ID、效力、阶段及版本；M011/M014/M018–M021 等未来物在 L1 不构成缺件；只引用 G50/T06/T08/G05 原业务权威结果，T02-T04 不重写其决定；引用对应 PASS_FACT；未到阶段 NOT_APPLICABLE；权责不明 NEEDS_HUMAN_DECISION；原记录签发部门/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R034",
          "title": "L1；T=当期事项为职称评审申报且申报人已提交；F=尚未提交/有权确认非该制度覆盖的独立初定业务；U=C05法律性质或承诺文件样式未知",
          "requirement": "R034 L1；T=当期事项为职称评审申报且申报人已提交；F=尚未提交/有权确认非该制度覆盖的独立初定业务；U=C05法律性质或承诺文件样式未知；SRC-012/019；F008/F039；M002/M027；核本人实际诚信承诺、签署身份、承诺文本版本与本案批次；签名影像只作线索，需可信验签或经办核原件；承诺真假/处罚只能由有权机关另案调查决定；事实一致 PASS_FACT；当前确应交但缺 NEEDS_MATERIAL，假签/错人 CONFLICT，C05适用未知 POLICY_UNCONFIRMED；本人/职改办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R035",
          "title": "L3/L6；T=已合法启动专家送审/评委会议并有回避、保密核验职责；F=尚未进入或不存在专家环节；U=相关成员授权及保密核查范围不清",
          "requirement": "R035 L3/L6；T=已合法启动专家送审/评委会议并有回避、保密核验职责；F=尚未进入或不存在专家环节；U=相关成员授权及保密核查范围不清；SRC-012/019；F031/F037/F040；M011/M020/M028（实际激活阶段）；核原主管机关是否记录利益冲突声明、回避处置及保密承诺，每场会议/个案分别关联，不公开专家身份；本模板不评价应回避者或取代原机关处理；有权记录可核 PASS_FACT，实际冲突 CONFLICT，尚待处理 NEEDS_HUMAN_DECISION，源失联 SOURCE_UNAVAILABLE；评委会办事机构/监督机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R036",
          "title": "L0/L5/L6；T=当批次确须某评委会或委托评审权；F=经有效政策确证不需评委会的初定等路径；U=权限名录及适用年/系列未核",
          "requirement": "R036 L0/L5/L6；T=当批次确须某评委会或委托评审权；F=经有效政策确证不需评委会的初定等路径；U=权限名录及适用年/系列未核；SRC-012/019；F009/F011/F033/F037/F041；M001/M025/M029（按校内/委托分支）；比核准备案机关、系列/级别、任期、权限起止、委托授权与目前案卷范围；2023评委会会议存在性不证明2026有效备案，任何代理/下级不得互签；权限链相符 PASS_FACT（仅资质记录），越权 CONFLICT，失联 SOURCE_UNAVAILABLE，路线未核 POLICY_UNCONFIRMED；职改办/备案机关",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "stage-01",
      "name": "L0 · 批次政策与权限",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "stage-02"
    },
    {
      "id": "stage-02",
      "name": "L1 · 申请和资格材料",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-01",
      "nextStageId": "stage-03"
    },
    {
      "id": "stage-03",
      "name": "L2 · 师德及职能核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-02",
      "nextStageId": "stage-04"
    },
    {
      "id": "stage-04",
      "name": "L3 · 成果/代表作送审记录",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-03",
      "nextStageId": "stage-05"
    },
    {
      "id": "stage-05",
      "name": "L4 · 单位审议推荐",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-04",
      "nextStageId": "stage-06"
    },
    {
      "id": "stage-06",
      "name": "L5 · 职改办复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-05",
      "nextStageId": "stage-07"
    },
    {
      "id": "stage-07",
      "name": "L6 · 评委会阶段记录",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-06",
      "nextStageId": "stage-08"
    },
    {
      "id": "stage-08",
      "name": "L7 · 正式审定结果引用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "stage-07",
      "nextStageId": "stage-09"
    },
    {
      "id": "stage-09",
      "name": "L8 · 后置归档与复核",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "stage-08",
      "skippableReason": "仅核对已形成的有权决定或后置记录；本地模板不代替学校签批"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-action-list",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "human-review-summary",
      "kind": "item-feedback",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00+08:00"
}

export default templateVersion
