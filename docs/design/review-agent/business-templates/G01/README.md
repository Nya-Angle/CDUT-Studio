# G01｜师生共有业务审核模板原始 Markdown 存档

本目录存档 G01 五份**完整业务模板原件**，是模板编辑器研发、语义模块抽取、测试金标制作和后续回归验收的**来源基线**。此前工作交流中也称“五套 G0 模板”；仓库已有设计文档采用 `G01` 标识，故沿用 G01 目录名。

- **原件位置**：[`originals/`](originals/)；保留原来的文件名和原文，不为了适配现有模板 Schema 拆分或重写。
- **来源索引**：[`source-manifest.json`](source-manifest.json)；记录标准名称、版本、原始字节数、SHA-256 和 Git Blob SHA，供后续机器校验。
- **模板数量**：5 套。每份原件内部的主体类型、办理情形、证据替代和程序阶段属于同一套模板的条件分支，不应机械拆成更多用户可选模板。
- **治理边界**：这些是**业务设计与测试基线**，并非已发布的本校校规、生产系统内的可执行模板或已通过真实端到端验收的证明。跨校参考、校本待核、设计建议、人工审批权限仍按各原件中的约束处理。
- **后续更新**：已经用于测试的原始版本不得静默覆盖。升级业务模板时新增带版本号的原件，修改索引并在对应测试中记录变更；模块化产物、独立 Gold、合成案例和运行报告应独立存储，勿混入 `originals/`。

## 五套模板

| 编号 | 标准业务名称 | 原始版本 | 完整 Markdown 原件 |
| --- | --- | --- | --- |
| 1 | 学籍身份信息更正审核 | v1.7 | [`g01_student_identity_complete_template_v1.7.md`](originals/g01_student_identity_complete_template_v1.7.md) |
| 2 | 档案利用申请审核 | v1.5 | [`g01_archive_utilization_template_editor_spec_v1_5.md`](originals/g01_archive_utilization_template_editor_spec_v1_5.md) |
| 3 | 特殊校园卡资格审核 | v1.4 | [`special_campus_card_template_v1.4.md`](originals/special_campus_card_template_v1.4.md) |
| 4 | 专项证明与用印审核 | v1.4 | [`G01_special_proof_seal_review_template_v1.4.md`](originals/G01_special_proof_seal_review_template_v1.4.md) |
| 5 | 政审材料程序审核 | v0.3 | [`G01_political_review_template_v0.3.md`](originals/G01_political_review_template_v0.3.md) |

## 原件完整性

2026-10-11 将五份文件从原始 Markdown 资料库归档；经校验，GitHub 中的文件 Git Blob SHA 与归档前的源文件一致。完整的 SHA-256、大小及 SHA-1 Blob 标识记录在 `source-manifest.json`。

在仓库根目录执行：

```bash
sha256sum docs/design/review-agent/business-templates/G01/originals/*.md
```

## 相关工作

- [五套 G01 原件横向拆解与模块抽取研究](../../16-template-editor-five-g01-gap-and-module-extraction-v0.1.md)
- [D3-MD-Q1 Agent A 原件转换与技术测试](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/tree/test/d3-md-full-author-archive/docs/design/review-agent/acceptance/d3-md-full/agent-author)
- [D3-MD-Q1 Agent B 独立质量金标](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/tree/test/d3-md-independent-gold-archive/docs/design/review-agent/acceptance/d3-md-full/agent-oracle)

**不要将业务设计稿、转换结果、金标预期和正式行政规则混为一谈。**
