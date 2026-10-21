# 48｜源项目与云端审核进度整合到我方 main（2026-10-15）

## 授权与冻结基线

用户本次明确指定更新我方 `main`，覆盖此前只允许写审核分支的限制；原项目仍只读。

| 来源 | 完整提交 SHA |
| --- | --- |
| 原项目 `Nya-Angle/CDUT-Studio` main | `c179f2575d5bb5abdc883268fb885d1a6449325e` |
| 我方 `feat/review-owned-background-sessions` | `60e805cfa5b55865add80856f2e9a27f6271de08` |
| 我方 main 同步前 | `dd5a553c34a92b559559a7cb3c4e9c3f67fd9c8e` |
| 原项目与审核分支共同祖先 | `f2c7347de97465351cf3c39b8f37670336a40606` |

开工重新 fetch；原项目较共同祖先新增16个提交，审核分支新增531个提交。所有整合在独立 clone 中完成，未改动用户原工作树与其他 Agent 工作树。`upstream` push URL 设置为 `DISABLED`。

通过 GitHub 连接器发布内容整合提交，以我方既有 main 为父提交；这是完整受控文件树的同步，不声称将原项目完整提交历史导入我方。审核分支及其提交历史继续保留，PR #21 不执行合并或解除 Draft。远程 main 更新使用预期旧 SHA 和非强制更新；发布后 fetch 并核对远程树与本地树完全一致。

## 冲突处理与兼容修正

8个冲突文件均逐项整合，未使用整仓 ours/theirs 覆盖：

| 文件 | 整合决定 |
| --- | --- |
| Main `ipc.ts` | 保留上游新工具类型，文件搜索继续核验 ordinary session，审核 owner 不走普通入口 |
| `document-parser.ts` | 通用 Office 解析用上游 `@profer/core/office-engine`；审核专用 DOCX/XLSX 结构定位保留，移除废弃的通用 officeparser 分支 |
| `review/pi-review-executor.ts` | 保留审核严格工具/引用/视觉要求，接入上游按用户语言输出要求 |
| `review/v2-executor-factory.ts` | 保留审核材料按需读取、规则范围、结构化引用、零分项有效提交与执行失败区分 |
| Renderer `preview-opener.ts` | 采用上游只读侧栏，所有入口继续执行 owner/撤销保护与 Main 授权兜底，迟到响应再次核验资格 |
| `FilePreviewDialog.tsx` | 审核引用仍依赖此组件，保留并接入新 OfficePreview；删除已被上游移除的 docxToHtml/officeToHtml IPC 调用 |
| `useGlobalAgentListeners.ts` | 上游侧栏行为与现有 owner/异步序号保护同时保留，不恢复旧 preview Tab |
| `useOpenSession.ts` | 保留 ordinary owner 授权及上游会话 MRU，移除已退役 preview Tab 类型分支 |

同步调整现有 `agent-tab-access.test.ts` 的正例期望：文件路径、只读侧栏状态和无顶栏 Tab；保留内部/删除/伪造 owner、迟到授权、撤销等拒止断言。此处未本地运行单元测试，自动 CI 的结果另行核实。

旧弹窗 ODT/ODS/ODP 的 HTML fallback 随上游 IPC 退役，显示不支持内嵌预览并提供系统默认应用打开；后台 Office 文本提取仍由新引擎处理。本次不新增绕过文件权限的解析 IPC。

`mammoth` 与 `@xmldom/xmldom` 恢复审核分支原版本约束，供专用结构提取使用；不再引入 officeparser。冻结安装通过。受影响包版本：Electron `0.15.162`、shared `0.1.68`（首轮 `0.1.67`）、core `0.2.15`、ui `0.2.1`；锁文件与 CHANGELOG 同步。

## 本地静态检查与构建

Linux x86_64；Bun `1.4.0`；Node `v22.23.2`。精确命令、时间、退出码、原始 stdout/stderr SHA-256 见 [validation.json](evidence/upstream-main-sync-20261015/validation.json)。命令运行于未提交的整合工作树，采集器中的 sourceSha 是当时 HEAD 的上游基线，不能将结果归属为未修改的上游代码。

| 项目 | 最终结果 / 退出码 |
| --- | --- |
| `ELECTRON_SKIP_BINARY_DOWNLOAD=1 bun install --frozen-lockfile` | PASS / 0 |
| `bun run typecheck` | PASS / 0 |
| `bun run check:boundaries` | PASS / 0 |
| `bun run electron:build`（Main、Preload、Renderer、CLI、resources） | PASS / 0 |
| `bun run --filter=@profer/electron check:skin-contract` | PASS / 0 |

首轮安装因专用解析依赖被上游移除而退出1；首轮/二轮类型检查因退役 IPC 与 preview Tab 类型引用退出2。修正后冻结安装和类型检查通过，失败日志保留在本地独立日志目录。构建仍有既有动态 import、浏览器 Node 模块外部化与大 chunk 警告；未把构建成功扩展为实机功能通过。

推送后自动检查入口：[main Actions](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions?query=branch%3Amain)。本报告不预填未来 CI 为 SUCCESS。

## 验收与后续边界

29号仍是唯一正式 LIVE 台账。37/38/44/46号原始失败、修复和实机证据保持历史归属，未覆盖或重算。此次同步不产生新的 E03/E04/E05/E06、ENOSPC、重启恢复或外部服务验收结论。

P06-S02 NOT ACCEPTED、P06 PARTIAL、LIVE-07 PARTIAL 保留。P05-RELAY-ROUTE-01 BLOCKED，P05-POCKET-FIFO-01 PATCH READY / TARGET NOT-RUN，P04-TECHDEBT-01 永久 tombstone/owner UUID journal 禁止无证明 TTL/GC。P06 正式签收仍未满足，PR #21 维持 Draft / MERGE NO-GO。后续按[47号计划](47-p06-evidence-driven-followup-plan-20261015.md)从 `P06-RECHECK-LIVE-02 / L02-00` 开始；不进入P07/P08。

## 首轮 main CI 与兼容断言修正

首次内容提交为 `6ff93be71399683fb21c9b5e36cedce05d1945b8`，tree 为 `b33c6511ab8d3dba2aa4c8b0fa6b2e8bd8452241`，本地与云端逐字节一致。[PR CI #38748810136](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38748810136) 的安装、类型、边界、皮肤和三端构建均通过；全仓回归实际3988项 / 456文件、3982 PASS / 5 SKIP / 1 FAIL、16448次 expect，退出1。唯一失败为上游内置身份提示词已改英文、身份检查仍要求旧中文产品名称原句。

`system-prompt.test.ts` 的桌面身份断言改为当前原句 `CDUT Studio desktop app`，继续要求 `CDUT Studio Agent`，保留 Profer/别名拒止与产品名断言。无生产提示词、受控风险脚本和 P06 证据修改。首败事实、日志 SHA-256 见 [ci-first-run.json](evidence/upstream-main-sync-20261015/ci-first-run.json)，原始日志另存本地独立日志目录。后续 main CI 结果不能覆盖首轮失败。
