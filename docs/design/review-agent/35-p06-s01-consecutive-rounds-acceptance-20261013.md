# 35｜P06-S01 连续审核轮次、旧授权与迟到回调受控验收（2026-10-13）

> **后续增量（2026-10-13）**：P06-S02 UI 时序受控修补、真实 Electron 双轮驱动已交付，实际双轮运行尚未在当前环境执行，最新边界和本地执行说明见 [36 号](36-p06-s02-ui-race-and-electron-validation-20261013.md)。本文件的 P06-S01 PASS 与下述原定 P06-S02 计划属于历史冻结证据，不代表 E2E PASS。

> **阶段定位**：P06 第一个最小批次，在 PR #21 `feat/review-owned-background-sessions` Draft 分支。复用已由 [34 号](34-pre-p06-main-a0-acceptance-20261013.md) 验证的 Main start/read/stop 与 A0 Electron/Pi，不重建 Runner、SDK 或 V2 数据库。**P06-S01 CONTROLLED PASS / P06 E2E PARTIAL / PR MERGE NO-GO**。本文件与 [29 号主验收台账](29-background-session-preflight-audit.md) 一同读取。

## 1. 冻结提交与可追溯 CI

冻结代码 [`9851998a`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/9851998a1b157c9d5924b9c6387b062838aa4475)；[PR CI #38358640242](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640242)、[D2 #38358640258](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640258)、[Review Baseline #38358640275](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640275)、[Review batch focused #38358640240](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640240) **全部 SUCCESS**；新增 **3/3 PASS**，全仓 **3852 pass / 5 skip / 0 fail（3857 tests / 438 files）**，Typecheck、边界、Electron main/preload/renderer build PASS。

生产/测试更改涉及三个文件：

- `review-agent-assignment.ts`：`findActivePiReviewAssignment` 从按 `createdAt` 毫秒倒序选取，改为按持久 `review-agent-assignments.json` 的**追加顺序倒序**选取最近有效指派；防止同一毫秒内先后两条指派无法可靠选中新的那条。已有数据结构不变，不删历史。
- `review-pi-admission.ts`：执行 Promise 正常/异常收尾时，**仅撤销本轮绑定的 assignmentId**；旧轮次调用即使在结束后迟到，也无法用老 `submit-result` 授权复用。继续使用原 `onRunOwned` 真 ACK、`isCurrent` 身份判断及 `forgetAdmitted` 条件删除；不更改普通 Agent 权限与执行引擎。历史指派留存审计（`revokedAt`），并非硬删除。
- `review-pi-run-bridge.main.test.ts`：真实 Main/V2/assignment/session 接线 + **受控 Agent 执行 Promise**。增加可受控释放的 `stopAgentAndWait` barrier 与三项针对性负例。

本批没有导出内部 review owner 会话 ID 到公开 IPC，没有增加另一套 run/assignment 存储；没有改变生产 Relay、Pocket、飞书或普通 Agent 接口。

## 2. 本批三项新增测试（原始证据在 PR CI job logs）

| 测试 | 实际受控结果 | 验证范围 |
|---|---|---|
| **同毫秒指派冲突** | **PASS** | 实际持久 assignments JSON 强制两条指派 `createdAt` 一样，要求最近追加的有效绑定被查到，而不是旧一轮 |
| **同案 + 复用同 owner 两轮** | **PASS** | 第一轮失败收口撤销其工具授权；`mode:update` 新建不同 runId 且复用原 owner；老 runId 发 stop 必拒绝；第一轮故意在第二轮 ACK 后迟到上报 failed，不改新轮 V2 状态，且不改变旧轮实际失败原因 |
| **延迟 stop + 立即 restart** | **PASS** | 停止 Promise 人为阻塞时，第二轮 start 必拒绝；真实等待停止释放后 `mode:restart` 新 owner/new runId 取得 ACK；随后老 runId stop 拒绝，旧结束/失败回调不能写新 run，旧 run 保留 cancelled，新 run 保持 running |

**验证手段限制**：Main bridge 实际运行路径确实执行，但本批 `runAgent` / `stopAgentAndWait` 使用了可控 mock Promise，并非真实服务商或真实 Electron GUI 长轮次；不据此标 LIVE-07 PASS。P06 的超时/请求杀死/跨进程恢复仍未检验。

## 3. 当前安全判断及剩余风险

- **已通过的局部判断**：最新有效 assignment 顺序稳定；executor settlement 的旧授权撤销；旧 runId 和旧 onRunOutcome 不影响新轮；stop 释放屏障在当前 Main 进程内有效。
- **尚未完成的 P06 验收**：同一案卷在真实 Electron/Pi 中执行两轮真实模型调用、在第一轮运行过程中点击重审/停止、stop 释放瞬间立即重启、同案更新/从头重审语义与历史记录回显、旧 Renderer 请求/旧状态轮询迟到、正在持久化时应用退出。这些需独立实机批次；此外 P07 的真正重启/强杀/删案另有独立阶段，不属于本次。
- **延续阻断**：生产中心 Relay 路由 `P05-RELAY-ROUTE-01` BLOCKED/NOT-RUN，独立 Pocket `P05-POCKET-FIFO-01` PATCH READY/TARGET NOT-RUN；P05 E2E PARTIAL。P04-TECHDEBT-01 的永久 ID-only tombstone 留存、安全不做 GC、容量增长追踪保持不变。29 号 LIVE-07 仍 PARTIAL；其它 LIVE 项保留各自已有判定。跨 OS、普通 Pi/Claude、旧批量 A/B/C 的实机回归未由本批运行。

## 4. 下一批 P06-S02：真实 Electron 双轮边界验证（本轮不执行）

在 [34 号](34-pre-p06-main-a0-acceptance-20261013.md) 已验证的**隔离 profile**和合成案卷基础上进行，不触碰用户日常案卷或真实学校数据。先从当前 HEAD 重跑：
```bash
bun run typecheck
bun test --isolate --timeout 30000 apps/electron/src/main/lib/review/review-pi-run-bridge.main.test.ts
bun test --isolate --timeout 30000
```
然后在真实 Electron/V2/Pi 中至少验证以下独立情况：①同案两轮 `update` 和 `restart` 的 run/owner 归属、旧 run 不被覆盖；②旧 `runId` 停止请求必须拒绝且新 run 持续；③正在 stopping 时的重复开始拒绝，释放后可立即开始；④第二轮受理后旧失败回调不会改写新轮（需使用授权、可控的迟到回执注入或测试钩子，不能在生产账户上随意注入）；⑤当前案卷和切案后过期停止提示、迟到状态响应不污染新轮 UI；⑥正常用户的 Agent 行为和当前审查路径未回归。

记录 OS/环境、Electron/包版本、实际执行 SHA、两个脱敏 case/runId、操作时间、预期/实际、业务 ledger、Main 事件时序、退出码/截图/日志 hash；不能复现的用 **NOT-RUN** 而非根据本批 mock 推断 PASS。若发现冲突再做 P06-S02 针对性修复，完成 P06 阶段验收后才谈 P07。

## 5. 工程停点

**P06-S01 CONTROLLED PASS；P06 整体 PARTIAL。** PR #21 保持 Draft/Open/未合并。没有得到完整 LIVE、外部 Pocket/Relay 证据，不向用户建议合并。记录与状态以 29 号主台账和 PR 实际 HEAD/CI 为准。
