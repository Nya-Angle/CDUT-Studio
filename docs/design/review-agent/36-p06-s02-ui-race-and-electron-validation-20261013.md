# 36｜P06-S02 双轮前台时序修复、实机驱动与执行门禁（2026-10-13）

> **后续本地实机已执行**：见 [37｜逐项验收](37-p06-s02-local-acceptance-20261013.md)、[38｜P01～P06-S02 累计风险](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。E01/E02 PASS；E05 FAIL；E03/E04 尚未签收、完整 E06 PARTIAL；S02 NOT ACCEPTED / P06 PARTIAL。原“环境不可运行”是本文件冻结批次的历史事实，现已获得独立本地证据，不用旧 A0 或静态合同替代。以下历史记录和首败均保留。

> **本次判定：CODE/CONTROLLED PASS；REAL ELECTRON/PI = NOT-RUN；P06 整体 PARTIAL；PR MERGE NO-GO。** P06-S01 的 Main/V2 旧授权/旧 run 竞态见 [35 号](35-p06-s01-consecutive-rounds-acceptance-20261013.md)；A0 真实 Electron/Pi 4/4 见 [34 号](34-pre-p06-main-a0-acceptance-20261013.md)。不能把 A0、P06-S01 mock 证明或本次脚本“语法 PASS”冒充本次 P06-S02 双轮实机通过。

## 1. 实际代码改动、提交及 CI

代码冻结 [`5d5e25e5`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/5d5e25e5db20bbe90a5f367481f3ca982b3162ad)；[PR CI #38361717837](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717837)、[D2 #38361717930](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717930)、[Review Baseline #38361717713](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717713)、[focused #38361717452](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717452) **全部 SUCCESS**；**3855 pass / 5 skip / 0 fail（3860 tests / 439 files）**，Typecheck、边界、Electron main/preload/renderer 构建通过。新增 **2/2 前台乱序回调测试 PASS + 1/1 真机脚本静态语法合同 PASS**，不是实际 Electron/Pi E2E。

| 交付 | 实际行为 | 本轮验证 |
| --- | --- | --- |
| `review-actions-controller.ts` | 为同一 caseId 的多次 `refreshWorkspaceV2` 建立仅前台的代次屏障；所有关键异步读取（迁移、聚合/模板、`listRunsV2`、有效性、观察值、真实 admission）返回后先确认仍为最新刷新，旧回复不得覆盖新轮次业务缓存/运行态；selectCase 异步 admission 返回后再检查选择代次 | **受控 2/2 PASS**（见下） |
| `RightPanel.tsx` | 停止/人工操作的通知绑定当前 caseId + runId + 异步操作代次；切案/换轮后旧 Promise 的成功和失败回执不得写入当前 UI，旧 finally 不能清掉新操作的 busy 状态；切换时清理过期 busy/提示 | 全仓类型、构建 PASS；**真实 UI 迟到 stop 仍 NOT-RUN** |
| `review-actions-controller.test.ts` | 强制旧 `listRunsV2` 先发后到、新快照先落位；强制上一轮 admission 查询迟到返回，断言当前页面仍保存新 run | **2/2 PASS**（单测明确可编排时序） |
| `scripts/qa/review-background-p06.mjs` | 继承已经用于 A0 的本机 CDP 操作方式，在隔离 profile 的真实 Electron 中点按启动/停止/`更新审核结果`/`重新审核`，观察 Main 的真实 `accepted`、旧 run stop 拒绝、历史及当前 V2 run、owner 复用/创建策略、旧绿色回执不残留。失败即时退出、保存截图及 JSON | **脚本已交付；未在本环境启动 Electron/provider** |
| `review-p06-driver-contract.test.ts` | 在 CI 用 `node --check` 解析真实 CDP 驱动，并检查必需入口，不加载任何个人凭据 | **静态 1/1 PASS**；非运行时签收 |

## 2. 当前执行环境及为什么实机项不能判 PASS

当前可用 GitHub PR 源码写入及云端 CI；执行沙箱中没有 `bun`、没有已签入的 Electron 工作树、没有授权渠道/模型配置，且不能直接从 GitHub 访问/clone 该仓库。因此本轮**未启动实际 Electron、未向 DeepSeek 发出 Pi 请求、未进行 CDP 操作、未产生 P06-S02 实机日志或截图**。不使用模拟返回制造“成功”的验收记录。

这不影响前面的真实 A0 证据：34 号的冻结版本、实际环境和 A0 4/4 仍然有效，但该证据没有覆盖本轮 P06 双轮端到端。

## 3. 在你本地真正执行 P06-S02 的标准步骤

以当前 Draft 分支的最新 HEAD 为准，在**新隔离工作树/独立 profile**执行。事先通过应用在该隔离 profile 正常配置、授权一个 Pi 渠道和模型；不要把 API key 或原始 transcript 提交到 Git。复用 [34 号 A0 的 Linux/Xvfb/CDP 启动方法](34-pre-p06-main-a0-acceptance-20261013.md#5-真实-electron-a0)，CDP 调试接口仅绑定本机受控环境，不能向公网开放。

```bash
# 在 cdut-studio-review-agent 工作树执行
git fetch origin feat/review-owned-background-sessions
git switch feat/review-owned-background-sessions
git rev-parse HEAD
bun run typecheck
bun test --isolate --timeout 30000 apps/electron/src/main/lib/review/review-pi-run-bridge.main.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts apps/electron/src/main/lib/review/review-p06-driver-contract.test.ts
bun test --isolate --timeout 30000

# 用 34 号成功过的隔离实例启动方式，换用全新 P06 profile，
# 打开独立 Vite 5176 / 仅本机 CDP 9222。预先在应用中配置有效模型。
# PROFILE 是实际隔离 profile 根，须已有 config/review-module-settings.json。
export QA_PROFILE_ROOT=/path/to/isolated-p06-profile
export QA_SOURCE_PATH="$PWD/docs/design/review-agent/acceptance/pre-p06-a0-20261013/synthetic-source.txt"
export QA_REPORT_DIR="$QA_PROFILE_ROOT/p06-artifacts"
mkdir -p "$QA_REPORT_DIR"
node scripts/qa/review-background-p06.mjs
```

驱动要求真实渲染器与 preload；必须用真实应用的 `开始审核`、`停止审核`、`更新审核结果`、`重新审核`按钮。参考 A0 的真实 Demo 登录和 `Controller.selectCase` 用于隔离案卷切换：**这不签收完整建案/选案用户界面**。驱动会写 `p06-summary.json`、`electron-ui-results.json`、合成案卷 ID 和成功/失败截图；失败会写 `FAIL` 和退出码非零。结果不保存内部 owner 会话原始 ID 或 token，敏感配置仍只留本机。

## 4. 实机验收矩阵：只根据真实执行结果更新

| ID | 目标 | 当前状态 |
| --- | --- | --- |
| P06-S02-E01 | 同案第一轮真实 ACK → GUI 停止并 V2 cancelled → `update` 第二轮真实 ACK、同 owner 新 runId；旧 runId stop 拒绝、当前 run 保持 running；最终再正常停止 | **NOT-RUN**，驱动已备 |
| P06-S02-E02 | 同案第一轮 stop 释放 → `restart` 新 owner、新 runId；旧 runId stop 拒绝、历史仍 cancelled、第二轮不受影响；旧绿色停用回执不残留 | **NOT-RUN**，驱动已备 |
| P06-S02-E03 | 在真实 stop 正等待释放时并发发起 restart，必须返回 busy，释放后正常开始 | **NOT-RUN**；P06-S01 mock barrier 不能冒充真机 |
| P06-S02-E04 | 第二轮 ACK 后让**已取得授权的受控旧执行回调**迟到到达，并证明新业务状态不受影响 | **NOT-RUN**；仅 P06-S01 mock 验证，现有脚本没有安全注入入口，不得擅自向生产 provider/账户注入 |
| P06-S02-E05 | 旧轮次 UI 回读/停止提示晚于新轮次时不可覆盖新状态；切案后旧回执不污染别案 | **受控 2/2 PASS；真实 UI NOT-RUN** |
| P06-S02-E06 | 正常 Agent/Pi/Claude/批量 A/B/C/桌面文件路径和其他 LIVE 不回归 | **现有 CI PASS；真实产品矩阵 NOT-RUN** |

**可升级规则**：必须留测试人、准确应用/驱动 SHA、OS/Node/Bun/Electron、脱敏 caseId/runId、时间序列、实际按钮行为、主进程/V2 证据、两张运行截图及日志 SHA-256；脚本出错立即保留 FAIL，不能靠重跑成功抹掉首次失败。完成后再逐项更新 29 号 LIVE-07；此前**只保留 A0 已证明的 PARTIAL**。

## 5. 未改动的外部和后续门禁

- P06-S01 [35 号](35-p06-s01-consecutive-rounds-acceptance-20261013.md) 依旧受控 PASS，P06 总体 **PARTIAL**；本次没有进行 P07 强杀/重启/删案或 P08 全量实机。
- P05-RELAY-ROUTE-01 = **BLOCKED / NOT-RUN**，P05-POCKET-FIFO-01 = **PATCH READY / TARGET NOT-RUN**；P05 E2E PARTIAL。不可把本地 Electron 测试与 Pocket/Relay 真实多 viewer 测试混记。
- P04-TECHDEBT-01 持久 ID-only tombstone 与不做未经证明的 GC 策略不变；容量增长风险仍开放。LIVE-01/04/05/06/07 PARTIAL，LIVE-02/03/08 NOT-RUN。

**停点：保持 PR #21 Draft/Open/未合并。下一步是执行本文件 E01/E02 真机脚本、以真实结果修复或关闭 P06-S02，其余项目级门禁不自动放行。**
