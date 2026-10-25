# 25｜上游项目与审核模块整合记录

> 后续状态见 [26 号同步/dev 复验](26-upstream-refresh-dev-acceptance.md)：上游继续前进至 `f2c7347d`，自动压缩已从本文记载的旧设置调整为任务结束后的空闲态处理。本文保留 `a3305d4c` 初次整合的历史证据。

> 2026-10-11；完整项目交付到 `Fuck-GH-Admin/cdut-studio-review-agent` 的 `main`，供继续开发。使用者明确要求不向 `Nya-Angle/CDUT-Studio` 创建 PR。

## 1. 整合基线

- 上游：`Nya-Angle/CDUT-Studio/main@8126059c0a475e968dd3d173171a89891d9b5673`，含最新 PDF 高精解析、文档产物、预览、RAG 与 benchmark 更新。
- 我方：`Fuck-GH-Admin/cdut-studio-review-agent/main@0b9bf9bfe58300aa0860d1ebf10c782f7b4ab641`，含已合并的批量审核 A+B+C、V2 路径与权限修复、D2 技术预审，以及后续 G01 原始 Markdown 模板档案。
- 使用双父合并提交保留双方历史，完整代码、资源与已跟踪文档随项目一并交付。原测试仓库历史与新模板档案均保留。
- 独立整合工作树：`/home/miku/Bot/CDUTStudio/.workdir/upstream-review-integrated-20261011`。

## 2. 六个冲突文件的处理

| 文件 | 处理 |
| --- | --- |
| README | 更新上游通用介绍/团队布局，审核部分保留当前案卷式工作台、材料能力与批量权限边界；增加本整合记录入口 |
| Electron package | 上游去除旧 pdf-parse 依赖的变更保留；版本从我方 0.15.151 顺延为 0.15.152 |
| CHANGELOG | 保留我方历次审核记录，并在 0.15.152 记载上游 PDF 更新；避免把两个不同来源的 0.15.141 记录互相覆盖 |
| Pi 适配器 | 保留上游文档产物、压缩后固定产物句柄和能力组激活；保留审核运行账本、审核专用压缩/续跑提示、图像输入与禁止自动重试写事务 |
| 通用文档解析 | PDF 接入上游 `@profer/core/pdf-engine`；保留我方 DOCX 标题/表格/嵌入图像、Excel 工作表/单元格等结构解析能力 |
| 审核 document-service | 合并真实 PDF 页码/bbox/阅读顺序与我方 DOCX/Excel/HTML/EML、解析失败及人工复核语义 |

Pi 自动压缩设置按会话区分：审核会话保留运行账本驱动、约 70% 阈值的压缩；普通会话沿用上游当前暂时关闭自动压缩的设置，手动压缩仍可用。

共享类型合并了 PDF 版面数据与既有审核契约，shared patch 升为 `0.1.65`；core 保留上游已递增的 `0.2.14`。锁文件的 workspace 元数据已对齐，使用冻结锁文件安装，没有另选依赖版本。

## 3. 整合检查

| 项目 | 结果 |
| --- | --- |
| `bun install --frozen-lockfile` | PASS，1261 packages |
| 全仓 `bun run typecheck` | PASS，包含新增 benchmark workspace、core、shared 与 Electron |
| `bun run check:boundaries` | PASS |
| Electron `check:skin-contract` | PASS |
| `bun run electron:build` | PASS，main/preload/renderer/CLI/resources 全部构建成功 |
| Git 合并标记、版本与历史 | 提交前核对全部冲突已解决；完整合并提交保留双方父提交 |

本次为上游整合交付。24 号的 3653 个通过测试与六项桌面回放对应此前批量审核基线，不冒充这次 PDF/RAG 整合的完整回归。测试仓库主线推送会触发现有 PR CI，最终整合的类型、构建与全量回归结果以该合并提交的 Actions 为准。

本地日志保留在 `/tmp/cdut-upstream-review-sync-20261011/`。上游仓库在本轮仅用于读取与 fetch；推送目的地是使用者的测试仓库。访问凭据从本机 bashrc 读取，不写入项目、提交或日志。

## 4. 继续开发的范围

批量审核的离线演示入口、逐案事务、角色/证据/版本校验和 D2 禁止行政审批的约束保留。真实模型准确性、学校角色与生产 SchoolPort、原生安装包等部署验收继续按 24 号的边界办理。G01 档案是原始模板资料，不能因为随项目同步就称为已实现或已验收的正式业务模板。
