# 33｜P05 本地自动化复验记录（2026-10-13）

> 按 [32 号本地门槛](32-p05-stage-acceptance-and-local-gates.md) §4 执行；开始前依次阅读 32、30、29 号文档。仅复跑现有自动化，不重新设计 P05，不重新审查历史问题。本报告记录本地执行，后随 Main/A0 交付归档到测试仓库；不改变当时冻结 SHA 的适用范围。

## 1. 本次结论

**P05 LOCAL AUTOMATION PASS：六专项 43/43、0 fail、0 skip；全仓 3830 pass、5 skip、0 fail，3835 项 / 436 文件；类型、边界、皮肤契约和 main/preload/renderer 构建全部通过。** 九步退出码均为 0。

该结论覆盖本地受控自动化。P05 END-TO-END 仍为 **BLOCKED / PARTIAL**，PR MERGE 仍为 **NO-GO**。没有把模拟中心、桌面服务测试或构建结果记为真实中心、Pocket、飞书或 Electron LIVE 通过。

## 2. 环境与冻结版本

| 项目 | 实际值 |
| --- | --- |
| 执行人 | Codex，本地自动化执行 |
| 执行起止（北京时间） | 2026-10-13 01:50:29 CST → 2026-10-13 01:52:41 CST |
| OS / 架构 | Ubuntu 26.04.1 LTS / Linux x86_64 |
| Kernel | `Linux Bot 7.0.0-38-generic #38-Ubuntu SMP PREEMPT_DYNAMIC Fri Sep  4 09:10:14 UTC 2026 x86_64 GNU/Linux` |
| Bun / Node | `1.4.0` / `v22.23.2`；符合 Bun 1.4.0、Node 22 的组合 |
| 验收分支来源 | `feat/review-owned-background-sessions`，测试仓库 [Draft PR #21](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/21) |
| 实际测试 HEAD | `df0c0d5740d4522c2ea4663c8e8b93a497a70b7f` |
| 32 号冻结代码 SHA | `ce992f90880ecde1954e925b63585692a085f621` |
| 版本 | Electron 应用 0.15.153 / shared 0.1.65 / core 0.2.14 |
| 工作树 | `/home/miku/Bot/CDUTStudio/.workdir/p05-local-acceptance-20261013`，detached at 已拉取的分支 HEAD |
| 原始证据目录 | `/home/miku/Bot/CDUTStudio/.workdir/p05-local-acceptance-20261013-artifacts` |

已查询 PR #21 实际 HEAD，测试开始前与本地一致；结束时再次通过 `git ls-remote mine refs/heads/feat/review-owned-background-sessions` 核对，仍为同一 SHA。`ce992f90..df0c0d57` 只有 27/29/30/31/32 五份文档变化，没有代码变化。

新建隔离 worktree；原项目 main 未切换、未合并。开始前工作树干净，九步执行后仍干净；随后新增本报告及验收导航记录。Bun 安装产生的两个 workspace bin 执行位按该冻结提交的模式还原，未改变依赖版本、源码或锁文件。

运行环境覆盖如下；全量测试中的专项会另建各自临时合成数据目录：

```text
ELECTRON_SKIP_BINARY_DOWNLOAD=1
PROFER_CONFIG_DIR=/home/miku/Bot/CDUTStudio/.workdir/p05-local-acceptance-20261013-artifacts/profile/config
PROFER_USER_DATA_DIR=/home/miku/Bot/CDUTStudio/.workdir/p05-local-acceptance-20261013-artifacts/profile/user-data
PROFER_DEV_INSTANCE=p05-local-acceptance-20261013
CI=true
NO_COLOR=1
```

## 3. 命令、结果与完整日志

命令按以下顺序执行；表中除注明外均在工作树根目录运行。记录了 UTC 起止时间、耗时、argv、cwd、退出码和日志 SHA-256，见 [results.json](acceptance/p05-local-20261013/results.json)。

| 顺序 | 命令 | cwd | 结果 / exit | 耗时（秒） | 原始日志 |
| --- | --- | --- | --- | ---: | --- |
| 01-install | `ELECTRON_SKIP_BINARY_DOWNLOAD=1 bun install --frozen-lockfile` | 仓库根 | PASS / 0 | 2.27 | [log](acceptance/p05-local-20261013/01-install.log) |
| 02-p05-focused | `bun test --isolate --timeout 30000 apps/electron/src/main/lib/review/*.p05.test.ts` | 仓库根 | 43 pass / 0 skip / 0 fail / 0 | 3.673 | [log](acceptance/p05-local-20261013/02-p05-focused.log) |
| 03-typecheck | `bun run typecheck` | 仓库根 | PASS / 0 | 37.125 | [log](acceptance/p05-local-20261013/03-typecheck.log) |
| 04-boundaries | `bun run check:boundaries` | 仓库根 | PASS / 0 | 0.365 | [log](acceptance/p05-local-20261013/04-boundaries.log) |
| 05-skin-contract | `bun run check:skin-contract` | apps/electron | PASS / 0 | 0.064 | [log](acceptance/p05-local-20261013/05-skin-contract.log) |
| 06-build-main | `bun run build:main` | apps/electron | PASS / 0 | 0.672 | [log](acceptance/p05-local-20261013/06-build-main.log) |
| 07-build-preload | `bun run build:preload` | apps/electron | PASS / 0 | 0.032 | [log](acceptance/p05-local-20261013/07-build-preload.log) |
| 08-build-renderer | `bun run build:renderer` | apps/electron | PASS / 0 | 62.701 | [log](acceptance/p05-local-20261013/08-build-renderer.log) |
| 09-full-tests | `bun test --isolate --timeout 30000` | 仓库根 | 3830 pass / 5 skip / 0 fail / 0 | 25.576 | [log](acceptance/p05-local-20261013/09-full-tests.log) |

P05 命令中的 shell glob 展开为以下六个文件，实际 argv 保存在 JSON 中，没有增删测试或调整断言。

| 阶段 | 文件 | pass | fail | skip |
| --- | --- | ---: | ---: | ---: |
| S01 | `review-remote-indirect-access.p05.test.ts` | 5 | 0 | 0 |
| S02 | `review-feishu-owner-boundary.p05.test.ts` | 7 | 0 | 0 |
| S03 | `review-remote-path-access.p05.test.ts` | 7 | 0 | 0 |
| S04 | `review-remote-reconnect-search.p05.test.ts` | 8 | 0 | 0 |
| S05 | `review-remote-websocket-relay.p05.test.ts` | 8 | 0 | 0 |
| S06 | `review-relay-multi-viewer-contract.p05.test.ts` | 8 | 0 | 0 |
| 合计 | 6 文件 | **43** | **0** | **0** |

S05/S06 中的 TCP/WS 是本机 loopback，中心路由与 ticket 仍是受控 fixture/mock；S02 飞书仍为模拟连接。没有接入生产中心、真实 Pocket 或真实飞书群。

### 全量 5 项 skip

P05 专项没有 skip。全量测试的五项平台条件跳过如下，未将 skip 记为 PASS；Bun 末尾重复列出的 skipped 名称不重复计数。

| 来源文件 | 被跳过的测试 |
| --- | --- |
| `apps/electron/src/main/lib/shell-env.test.ts` | shell environment loading > loads environment from macOS zsh without interactive zle initialization |
| `apps/electron/src/main/lib/adapters/pi-powershell-tool.test.ts` | Pi Windows PowerShell tool > Given a native Windows PowerShell command When executing Then returns its stdout without requiring PATH lookup |
| `apps/electron/src/main/lib/adapters/pi-powershell-tool.test.ts` | Pi Windows PowerShell tool > Given stderr and a non-zero exit code When executing Then preserves both for the tool result |
| `apps/electron/src/main/lib/adapters/pi-powershell-tool.test.ts` | Pi Windows PowerShell tool > Given a command exceeding its timeout When executing Then terminates it and reports the timeout |
| `apps/electron/src/main/lib/adapters/pi-powershell-tool.test.ts` | Pi Windows PowerShell tool > Given an aborted signal When executing Then terminates the command and reports cancellation |

### 构建警告

main 构建记录 `pdf.worker.mjs` 的 require.resolve external 警告；renderer 记录 emf-converter 的 `fs/promises`、`path`、`os` 浏览器 externalization，以及大于 500 kB 的 chunk 提示。均未使构建退出失败。本轮记录警告，没有重审或修改对应历史模块；构建不替代运行时验收。

## 4. 当次 HEAD 的远端 CI 快照

以下是本轮只读核对到的当前 HEAD CI，不是本地命令的替代证据，也没有新触发 workflow：

- [Review Baseline CI #38285516120](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38285516120)：completed / success，HEAD `df0c0d5740d4522c2ea4663c8e8b93a497a70b7f`。
- [D2 Scoped Pi Review Tests #38285516108](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38285516108)：completed / success，HEAD `df0c0d5740d4522c2ea4663c8e8b93a497a70b7f`。
- [PR CI #38285516138](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38285516138)：completed / success，HEAD `df0c0d5740d4522c2ea4663c8e8b93a497a70b7f`。

## 5. 原门禁状态保留

| 项目 | 本轮结束后的状态 |
| --- | --- |
| P05-RELAY-ROUTE-01 | **BLOCKED（生产中心）/ NOT-RUN**；没有新增中心源码、部署或真实多 viewer 证据 |
| P05-POCKET-FIFO-01 | **PATCH READY / TARGET NOT-RUN**；本轮不验证独立 Pocket 仓库，没有应用 patch 或 Pocket CI/发布证据 |
| P05 END-TO-END / 完整 P05 | **BLOCKED / PARTIAL** |
| PR #21 合并 | **NO-GO；Draft / Open / 未合并** |
| Main 业务 IPC、A0、P06/P07/P08 | 未推进，不凭全量回归宣称对应阶段验收完成 |
| LIVE-01～LIVE-08 | **全部 NOT-RUN**；未执行真实模型/扫描 PDF/跨窗口/移动端实机流程 |
| Windows/macOS 实测 | **NOT-RUN**；Linux 自动化不能替代跨平台验收 |
| P04-TECHDEBT-01 | 保留性能优化、永久 ID-only tombstone 与容量增长风险的既有结论；没有实行 TTL/GC |

Pocket patch 的读取条件没有触发：本轮范围只有 32 号 §4 的桌面本地自动化。以后执行 §5 时仍须额外读取 `P05-POCKET-FIFO-01-Profer-pocket.patch`，核对独立仓库目标 SHA 后按该仓库门槛验证。

## 6. 证据索引

- [environment.json](acceptance/p05-local-20261013/environment.json)：OS、工具路径/版本、提交、配置隔离、文档哈希与测试前后状态。
- [results.json](acceptance/p05-local-20261013/results.json)：每一步完整命令、argv、退出码、时间与日志哈希。
- [p05-file-counts.json](acceptance/p05-local-20261013/p05-file-counts.json)：原始专项日志逐文件计数。
- [skipped-tests.json](acceptance/p05-local-20261013/skipped-tests.json)：五项平台 skip。
- [head-ci-snapshot.json](acceptance/p05-local-20261013/head-ci-snapshot.json)：实际测试 HEAD 的远端 CI 快照。
- [run_acceptance.py](acceptance/p05-local-20261013/run_acceptance.py)：本次命令执行和证据采集器，不属于产品代码或新测试。

本次没有修改产品代码、测试或依赖，也没有变更远端 PR 状态。验收结束点为本地自动化证据记录；外部阻断解除和实机验收需另一次明确安排。
