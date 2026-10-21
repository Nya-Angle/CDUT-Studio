# 37｜P06-S02 本地实机验收与不合格项（2026-10-13）

> **验收已执行；P06-S02 NOT ACCEPTED / P06 PARTIAL / PR MERGE NO-GO。** E01/E02 双轮核心通过，E05 发现可复现的旧页面回复覆盖新轮 UI；E03/E04/完整 E06 尚未签收。用户进一步要求检查 **P01～P06-S02 累计实现和测试**，结果见 [38 号风险复核](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。只更新公开仓库 `Fuck-GH-Admin/cdut-studio-review-agent`，不写入原项目，不合并。

## 1. 输入、冻结版本和环境

先阅读 36/35、29/30/31 及 34。云端在上轮 `0589750f` 后已有 P06-S01/S02 提交，实际接手 HEAD 是 `de1318c5d0d502b66e030e3500e83cc518d389e6`。保留这些产物，在新 worktree 与全新 profile 中复验。

| 项目 | 实际值 |
| --- | --- |
| 执行者 / 日期 | Codex / 2026-10-13 CST |
| 最终应用/驱动源码 | [`ef9074e367d2e7fda5955d8b0d6d9a4812836a6d`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/ef9074e367d2e7fda5955d8b0d6d9a4812836a6d) |
| 版本 | 应用 0.15.157 / Electron 43.2.0 / shared 0.1.66 / core 0.2.14 |
| OS / 工具 | Ubuntu 26.04.1 LTS、Linux 7.0.0-38-generic x86_64；Bun 1.4.0、Node v22.23.2 |
| worktree / 本地分支 | `/home/miku/Bot/CDUTStudio/.workdir/review-p06-s02-acceptance-20261013` / `audit/p06-s02-20261013` |
| 公开推送目标 | `mine` → `feat/review-owned-background-sessions` / [Draft PR #21](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/21)；没有推送 main |
| 最终私有 profile | `.workdir/review-p06-s02-acceptance-20261013-artifacts/accepted-profile`，独立 config/user-data |
| provider / model | 既有授权 DeepSeek / `deepseek-flash`；没有改用模拟模型或代理响应 |
| 实机双轮时间 | 21:15:23 起建立最终 profile；四轮最后停止 21:15:57 CST；精确时序见 runtime/timeline |
| 九步自动化时间 | 21:15:26 → 21:17:33 CST；每步 UTC/argv/退出码/哈希见 JSON |

本批修正**验收驱动与断言**、增加 5 个驱动纯函数负例、按项目规则递增应用 patch；没有修改四项风险所在的生产逻辑。最终代码在运行前冻结；原项目 main 保持原 SHA，私有 profile 的配置、API key 和原始 SDK/dev 日志不上传。

## 2. E01～E06 逐项结果

| ID | 实际执行 / 结果 | 当前判定 |
| --- | --- | --- |
| E01 | 同案第一轮 GUI 启动，真实 ACK/provider 回复，GUI 停止 cancelled；替换为预算 120 元的合成新版本，GUI `更新审核结果` 得到新 runId；从**本轮有效 assignment**解析到同 owner。旧 runId stop 被拒，新轮当时 running；两个输入 hash 不同、旧快照未改；第二轮真实 provider 回执后 GUI 停止，两个授权均撤销 | **PASS** |
| E02 | 同案第一轮真实 ACK/provider 回执后 GUI 停止；GUI `重新审核` 新 runId、新 owner，真实指派归属与 owner 数量一致；旧 stop 被拒，新轮 running；第二轮真实 provider 回执后 GUI 停止，两轮历史 cancelled、授权撤销 | **PASS** |
| E03 | 在真实 Pi ACK 后，同一 renderer 并发发 stop/restart。第一轮正常 cancelled；本次没有观察到 busy，停止已在下一请求受理前释放。已清理可能受理的新轮，没有人为延长 Main stop | **NOT-RUN（所需重叠窗口未命中）**；不能拿“尝试过”当 PASS |
| E04 | 未向真实 executor 注入迟到 onRunOutcome；P06-S01 的可控 mock 证据保留 | **NOT-RUN** |
| E05 | 人工延迟先页从真实 Main 取得的 listRuns 回复；实际关闭审核子页，停止旧轮，重进并启动新轮，然后投递旧 Controller 回复。Main 仍是新 run accepted/running，UI 却回到旧 run/preparing；已截图，最后停止清理新轮 | **FAIL**；真实 Electron + 受控旧回复交付，不是 SDK/provider 回调注入 |
| E06 | 真实普通 create/list/meta/send/SDK IPC + Pi/DeepSeek 回复 `P06_NORMAL_AGENT_OK` 通过；普通会话可见、可读且无 owner。全仓回归通过。完整聊天 UI、权限、工具、Claude、批量 A/B/C、桌面文件/Pocket 与跨平台矩阵未执行 | **PARTIAL**；普通 Pi 局部正例 PASS |

主驱动执行 E01 → E02，共 **2/2 PASS、四轮 provider 回执**，四轮终态账本均记录材料为 read、completedChecks 为 0；模型回复包含 `review_read_documents` 请求，随后停止；没有把零 token 的占位 assistant 或单纯 Main ACK 记为模型证明。E01 的第二轮使用新材料，特意验证 `update` 的输入快照语义，预算检查结果本身不是本轮业务审批验收目标。

证据：[p06-summary](acceptance/p06-s02-local-20261013/runtime/p06-summary.json)、[timeline](acceptance/p06-s02-local-20261013/runtime/timeline.json)、[四轮业务账本](acceptance/p06-s02-local-20261013/runtime/selected-run-ledger.json)、[owner 数量与归属证明](acceptance/p06-s02-local-20261013/runtime/owner-policy-counts.json)、[E03/E05 补测](acceptance/p06-s02-local-20261013/runtime/p06-extra-results.json)、[普通 Pi 正例](acceptance/p06-s02-local-20261013/runtime/ordinary-pi-positive.json)。不包含内部 owner/assignment 原始 ID。

截图：[update 第二轮](acceptance/p06-s02-local-20261013/runtime/p06-success-second-accepted.png)、[update 两轮停止](acceptance/p06-s02-local-20261013/runtime/p06-success-both-retired.png)、[restart 第二轮](acceptance/p06-s02-local-20261013/runtime/p06-stop-second-accepted.png)、[restart 两轮停止](acceptance/p06-s02-local-20261013/runtime/p06-stop-both-retired.png)、[E05 旧页面回复回退 UI](acceptance/p06-s02-local-20261013/runtime/p06-e05-old-page-response-regression.png)。E05 的状态以同时采集的 Main/Jotai JSON 为准，后续显示轮询可能恢复 UI，截图不代替这个时序证据。

## 3. 本地自动化

[accepted-automation/local-gates-results.json](acceptance/p06-s02-local-20261013/accepted-automation/local-gates-results.json)记录冻结 `ef9074e3` 的完整 argv/cwd、环境、时间、退出码与日志 SHA-256。九步**全部 exit 0**：

| 命令 | 实际结果 / 日志 |
| --- | --- |
| `bun run typecheck` | [全包 PASS](acceptance/p06-s02-local-20261013/accepted-automation/01-typecheck.log) |
| `bun test --isolate --timeout 30000` + 36 号三文件 | [48 pass / 0 fail](acceptance/p06-s02-local-20261013/accepted-automation/02-p06-focused.log)（Main 10 + Controller 32 + 驱动 6） |
| 同命令 + P01～P06 相关 20 文件 | [194 pass / 0 fail](acceptance/p06-s02-local-20261013/accepted-automation/03-p01-p06-focused.log)；实际文件清单见 argv |
| `bun test --isolate --timeout 30000` | [3860 pass / 5 skip / 0 fail](acceptance/p06-s02-local-20261013/accepted-automation/04-full-tests.log)，3865 tests / 439 files / 16014 expects |
| `bun run check:boundaries` | [PASS](acceptance/p06-s02-local-20261013/accepted-automation/05-boundaries.log) |
| `bun run check:skin-contract`，apps/electron | [PASS](acceptance/p06-s02-local-20261013/accepted-automation/06-skin-contract.log) |
| `bun run build:main`，apps/electron | [PASS](acceptance/p06-s02-local-20261013/accepted-automation/07-build-main.log) |
| `bun run build:preload`，apps/electron | [PASS](acceptance/p06-s02-local-20261013/accepted-automation/08-build-preload.log) |
| `bun run build:renderer`，apps/electron | [PASS](acceptance/p06-s02-local-20261013/accepted-automation/09-build-renderer.log) |

五项仍是 Linux 下一个 macOS shell、四个 Windows PowerShell 条件 skip；没有将其记为通过。原 `de1318c5` 基线也完成九步，3855 pass / 5 skip / 0 fail，见 [baseline-automation](acceptance/p06-s02-local-20261013/baseline-automation/local-gates-results.json)。

**这组正常回归没有覆盖新增审计缺口。** 38 号四个保护负例实际 **0 pass / 4 fail，exit 1**；独立收尾进程同样 exit 1。它们以可复跑审计产物保存，不属于上述 439 个默认 CI 文件，不能把本节的全绿解释为这些问题已修复。后续修复须把对应保护断言加入正常 CI。

## 4. 首次失败与驱动修补

| 执行 | 实际失败 / 处理 | 留档 |
| --- | --- | --- |
| 原 `de1318c5` | V2 已 cancelled，脚本在 React 完成回显前立即找“更新审核结果”而失败；稍后实测 UI 正常恢复 | [首次 FAIL](acceptance/p06-s02-local-20261013/attempts/de131-original/p06-summary.json) |
| `3d2f63d6` | 首次引导 reload 后 document.body 暂时为 null；增加真实文档/preload 就绪等待 | [bootstrap FAIL](acceptance/p06-s02-local-20261013/attempts/3d2-reload/p06-summary.json) |
| `72a55441` | 等第二轮 provider 回复后模型已自然 completed；“非 running”被旧判词错误归因给旧 stop | [自然完成时的驱动 FAIL](acceptance/p06-s02-local-20261013/attempts/72a-model-completed/p06-summary.json) |
| `ef9074e3` | 先在新 ACK 后检查旧 stop，再取得本轮 provider 回执；update 使用替换的合成材料。补齐实际 run→assignment→owner、owner 增量和两轮授权撤销检查 | E01/E02 **PASS** |

原 owner 断言也有假通过条件：update 只在 owner 数组里找旧 ID，restart 只找任意不同 ID，均未证明第二轮实际绑定。现按本轮有效 assignment 解析身份，新增纯函数测试明确拒绝这两种伪正例及缺失/撤销/重复/跨案指派。

本次新增 5 个行为负例，驱动合同共 6/6；`node --check` 仍仅表示语法。所有首败保留，后续 PASS 没有覆盖或抹掉它们。

## 5. 复跑入口

复用 [36 号](36-p06-s02-ui-race-and-electron-validation-20261013.md)启动合同：Xvfb 1600×1000、Vite 5176、仅本机 CDP 9222；wrapper 的 no-sandbox/disable-gpu 只属于本机容器，不修改产品默认值。全新隔离 config 中配置已授权的 Pi 模型；脚本要求无历史 owner/assignment，且验证实际 CDP 引导设置写入指定 profile。

```bash
# 工作树根目录；P06_PROFILE 指向新隔离实例。
QA_PROFILE_ROOT="$P06_PROFILE" QA_REPORT_DIR="$P06_PROFILE/p06-artifacts" \
  QA_SOURCE_PATH="$PWD/docs/design/review-agent/acceptance/pre-p06-a0-20261013/synthetic-source.txt" \
  node scripts/qa/review-background-p06.mjs

# 必须在同一隔离实例完成核心回放后执行。
QA_REPORT_DIR="$P06_PROFILE/p06-artifacts" QA_APPLICATION_SHA="$(git rev-parse HEAD)" \
  node docs/design/review-agent/acceptance/p06-s02-local-20261013/p06-supplement.mjs

QA_PROFILE_ROOT="$P06_PROFILE" QA_REPORT_DIR="$P06_PROFILE/p06-artifacts" \
  QA_APPLICATION_SHA="$(git rev-parse HEAD)" \
  node docs/design/review-agent/acceptance/p06-s02-local-20261013/p06-ordinary-pi-check.mjs
```

案卷选择依旧通过真实 Controller/Jotai，开始/更新/重审/停止点按真实按钮；不签收完整建案/选案 UI。补测 E03 是真实 business IPC 并发；E05 是受控延迟回复，失败后恢复显示并真正停止新轮，没有留下进行中的 Pi。普通 Pi 正例没有覆盖完整聊天 UI。

## 6. 交接与原门禁

本轮验收动作完成，**功能仍需返工**：优先修复 38 号 UI 两条旧写入路径与 owner 恢复边界，并补收尾 I/O 异常保护，再复验 E05 与四个保护断言；E03/E04 必须取得自己的证据。P07/P08 不自动开始。

P05-RELAY-ROUTE-01 保持 **BLOCKED / NOT-RUN**；P05-POCKET-FIFO-01 保持 **PATCH READY / TARGET NOT-RUN**。未验证独立 Pocket、未应用其 patch。扫描 PDF/完整工具清单/PNG/压缩/跨窗/移动端/跨平台仍保留原 LIVE 状态。P04 永久 ID-only tombstone 的性能结论、安全不 GC 和容量风险不变。

文档/证据归档后产生新 HEAD，其四项 CI 需另核对并登记 [PR #21](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/21)；本报告只把实际执行绑定到 `ef9074e3`。公开证据哈希见 [manifest](acceptance/p06-s02-local-20261013/manifest.json)。PR 保持 Draft/Open/未合并。
