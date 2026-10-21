# 42｜P06-RECHECK 独立接手交接书（2026-10-14）

> **交接目标：让另一会话直接接手当前 PR #21 的 P06-RECHECK，而不是重复 P06-FIX-01。**
> 本文件记录于 `f7562c0bb825e87c7f3123dc0530b5df2b751439` 的云端事实。任何接手者必须**首先重新查询 HEAD**；本文件里的 SHA 是冻结快照，不是“永远最新”。仅工作于 `Fuck-GH-Admin/cdut-studio-review-agent` 的 Draft PR #21 分支 `feat/review-owned-background-sessions`，不修改原项目仓库、main 或其它 Agent 正在使用的工作树。主状态以 [29](29-background-session-preflight-audit.md)、[30](30-background-session-handoff.md) 和最新实际 CI 为准。

## A. 为什么需要新会话、什么没做

此前会话在开始核查 `AUDIT-P03-P05-INDEX-01` 的原生产代码、旧 `.bak` 恢复和访问守卫时卡住：**该旧会话没有向仓库提交修复代码，也没有亲自跑过真实 Electron/新独立风险重放**。不要把该会话口头拟定的“journal 修复方向”算成提交。

**但是云端已由其它会话实际推进到 FIX-03**：本接手书编写时 PR #21 HEAD `f7562c0bb825e87c7f3123dc0530b5df2b751439`，代码并非停留在 FIX-01。继续重新实现 FIX-01 是重复甚至冲突。当前应从 FIX-01～03 已存在的源码、测试和验收文档上**独立复核**，只有确证存在新失败再修。

## B. 冻结状态与证据索引

| 环节 | 已实际取得的证据 | 仍不允许宣称 |
| --- | --- | --- |
| P06-S02 原实机 | [37](37-p06-s02-local-acceptance-20261013.md)：真实 Electron/Main/Pi/DeepSeek E01 update 与 E02 restart **2/2 PASS**；E05 跨页面迟到回读 **FAIL**；E03 stop 竞态未命中，E04 迟到真实 executor outcome 未注入，E06 普通 Pi 局部正例 | 整个 P06-S02 PASS |
| 累计独立风险 | [38](38-p01-p06-s02-cumulative-risk-audit-20261013.md)：旧版 `ef9074e3` 四项保护负例 **0 pass / 4 fail**，原始日志/JSON/哈希已归档 | 当前 HEAD 四项仍必然失败，或已经因 CI 绿灯而全部关闭 |
| **P06-FIX-01** | [39](39-p06-fix01-owner-index-recovery-20261013.md)：代码 `c8c84681`，9/9 正式受控 PASS；UUID-only `review-owner-ids.log` 单调安全 deny，先 fsync 后索引，旧 `.bak` / 非法索引 / 跨进程受控回归 | 已在真实 Electron 灾难恢复完成验收；可以删除 owner journal 或 tombstone |
| **P06-FIX-02** | [40](40-p06-fix02-renderer-write-fence-20261014.md)：代码 `414f2066`，5/5 受控 PASS；Jotai store + case 共享写入令牌，覆盖 Controller remount、Hook refresh 和 apply | E05 真实 Electron 已从 FAIL 变 PASS；跨窗口全部覆盖 |
| **P06-FIX-03** | [41](41-p06-fix03-settlement-io-resilience-20261014.md)：代码 `b5f9db17`，7/7 受控 PASS；revoke I/O 失败时内存 deny、可观察 Promise 收尾、原子授权账本写入/后补，V2 未确认则 fail-closed | 实际 ENOSPC、双持久化不可写后重启恢复、原独立保护脚本已精确重放 |
| 最新 GitHub 工作流 | `f7562c0bb825e87c7f3123dc0530b5df2b751439` 的 [PR CI #38525310475](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38525310475)、[D2 #38525310519](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38525310519)、[Baseline #38525310669](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38525310669)、[focused #38525310501](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38525310501) **全 SUCCESS**；3881 pass / 5 skip / 0 fail（3886 tests / 441 files）是上一个代码冻结版的全仓数字 | CI PASS 代表本批 4 个旧审计探针在此 HEAD 通过；证明真实 Live E03/E04/E05/E06 通过 |

**总判定（截至交接）**：FIX-01/02/03 各自 **CODE/CONTROLLED PASS**；**P06-S02 NOT ACCEPTED、P06 PARTIAL、LIVE-07 PARTIAL、PR Draft/Open/MERGE NO-GO**。P07/P08 未执行。

## C. 下一会话必须先读（优先级）

1. [本文件 42](42-p06-recheck-independent-takeover-handoff-20261014.md)、[43 正式执行提示](43-p06-recheck-next-session-prompt-20261014.md)。
2. [41](41-p06-fix03-settlement-io-resilience-20261014.md) → [40](40-p06-fix02-renderer-write-fence-20261014.md) → [39](39-p06-fix01-owner-index-recovery-20261013.md)：看已实现什么、实际断言是什么。
3. [38 原累计四项失败审计](38-p01-p06-s02-cumulative-risk-audit-20261013.md)、[37 原实机 E05 失败](37-p06-s02-local-acceptance-20261013.md)：**先保留旧失败**，不能改写旧冻结证据。
4. [29 主台账](29-background-session-preflight-audit.md)、[30 交接](30-background-session-handoff.md)、[31 历史/最新提示词](31-background-session-continuation-prompts.md)；[36](36-p06-s02-ui-race-and-electron-validation-20261013.md) 是初版实机方法，实际首次失败与修订优先以 37 的最终脚本/命令为准。

源码检查至少涉及：
- `apps/electron/src/main/lib/agent-session-manager.ts`, `safe-file.ts`, `remote-file-access.ts`, `review-private-file-access.ts`, `remote-service.ts`；
- `review-owner-index-recovery.p06-fix01.test.ts`, `review-tombstone-index-scale.p04.test.ts`；
- `apps/electron/src/renderer/components/content-review/review-workspace-write-fence.ts`、`review-actions-controller.ts`、`use-review-actions.ts`、`use-review-workspace-actions.ts`、`review-workspace-write-fence.p06-fix02.test.ts`；
- `apps/electron/src/main/lib/review/review-agent-assignment.ts`, `review-pi-admission.ts`, `review-background-reuse.probe.test.ts`；
- 原四项负例 `docs/design/review-agent/acceptance/p06-s02-local-20261013/audit/scope-risk-audit.probe.ts` 和 `replay-risk-probes.py`；原真实截图、失败 JSON 和 manifest 在 `acceptance/p06-s02-local-20261013/` 下。

## D. P06-RECHECK 执行合同（不能跳步）

**R0｜云端基线**：在独立工作树 `git fetch`、检出 PR #21 实际最新 SHA，记录 PR Draft/是否已被并发推进、完整 `git rev-parse HEAD`、Bun/Node/Electron/OS；保存云端 4 套 CI 结论和链接。发现其他会话有新增提交，停止以旧 SHA 写入，先重新核对增量，勿 force push。

**R1｜四项原始审计重放**：在新的隔离输出目录执行原始重放，**必须逐项提供原始日志、exit code、JSON 原始结果和 SHA-256**：
```bash
git fetch origin feat/review-owned-background-sessions
git switch feat/review-owned-background-sessions
git rev-parse HEAD
bun run typecheck
bun test --isolate --timeout 30000 \
  apps/electron/src/main/lib/review/review-owner-index-recovery.p06-fix01.test.ts \
  apps/electron/src/renderer/components/content-review/review-workspace-write-fence.p06-fix02.test.ts \
  apps/electron/src/main/lib/review/review-background-reuse.probe.test.ts
REVIEW_ACCEPTANCE_ROOT="$PWD" REVIEW_RISK_OUT=/path/to/new-isolated-p06-recheck \
  python3 docs/design/review-agent/acceptance/p06-s02-local-20261013/replay-risk-probes.py
```
核查 `AUDIT-P03-P05-INDEX-01`, `AUDIT-P06-REMOUNT-01`, `AUDIT-P06-WORKSPACE-WRITER-01`, `AUDIT-P01-P06-SETTLE-01` 四项。**旧审计脚本是修复前设计的故障注入**：当前代码若改变原子写入路径或结构，不能将“旧注入失效/没有命中”标成安全 PASS，也不能悄悄修改 38 的历史证据。必须记录 API/IO 调用见证，必要时在新 test/runner 中改用等效真实故障，按“触发保护逻辑并守卫 PASS”闭环，保留原版本文件不动。FIX-03 目录 EACCES 与受控 EISDIR 是已证实路径；真实磁盘 ENOSPC 未跑。

**R2｜真实 Electron 重演 E05**：复用 37 号原环境步骤，**新独立 profile、合成案卷、已授权现有 Pi provider**。先获取真实 Main 旧 `listRunsV2` 返回并延迟交付，确实卸载审核子页，第二轮真实受理并保留新 run；重进、释放旧回执，核对 Jotai store `runId/phase` 与 Main `runId/status` 仍一致；核对旧错误/stop feedback 不复活。保留旧 E05 FAIL 及新执行结果、时序、截图/日志哈希。**无 GUI/provider 授权则 NOT-RUN**，不可用仅 React SSR 或 mock 替代。

**R3｜E03/E04/E06**：E03 必须实际观察 stop 尚未释放时的 busy 拒绝，然后释放并立即 restart；窗口没命中记 NOT-RUN。E04 必须在获授权隔离执行链中人为控制旧 executor 迟到回调，记录新轮 Main V2 不变；不可向正式 provider 无授权注入。E06 包含普通 Pi/Claude/原批量 A/B/C/桌面预览与授权路径；只通过哪个子集就记录哪个子集，没跑不升格。注意 E01/E02 已有原 37 号真实 PASS，除非代码回归或实机计划必要，**不要重复刷这两项代替 R2/R3**。

**R4｜正式 CI + 文档关闭条件**：任何生产修补都最小范围修改，并将可观察失败断言纳入默认 CI。最终 `typecheck`、`check:boundaries`、Electron main/preload/renderer build、全仓和 D2/Review Baseline/focused 真正绿灯后，才按当次 SHA 报告其 PASS 范围。更新 [29 主台账](29-background-session-preflight-audit.md)、[30](30-background-session-handoff.md)、[31](31-background-session-continuation-prompts.md)、PR #21 body 及新增 RECHECK 报告。将旧失败继续作为旧 SHA 的历史事实保存，不覆盖证据归档。

## E. 严禁误关的边界

- `P05-RELAY-ROUTE-01`：真实中心路由服务端、可信多 viewer ticket 与定向回执未验证，**BLOCKED**。
- `P05-POCKET-FIFO-01`：独立 Pocket 仓库补丁已准备，但未在目标仓库运行，**PATCH READY / TARGET NOT-RUN**。
- `P04-TECHDEBT-01`：永久 ID-only tombstone 与 FIX-01 owner UUID journal **不做不安全 TTL/GC**；容量与冷启动/迁移成本仍属跟踪风险。
- 原始私有 profile、API key、原始 transcript、owner/assignment 内部 ID 不写入仓库；只传脱敏摘要、哈希、日志/截图。
- 不自动开始 P07/P08；不修改原仓库/main；不解除 Draft；**用户未明确许可时不合并 PR**。

## F. 本次交接交付和工作停点

本次交接只新增/更新文档与提示词，**没有在本会话运行任何本地 Electron/provider 或修复源码**。移交给下一会话的唯一任务是 **P06-RECHECK**；全部项目验收/合并仍 **NO-GO**。如果最新 HEAD 已经包含 RECHECK 后续提交，先检查而不是重复执行。