# 40｜P06-FIX-02 跨页面 Controller / Workspace Hook 共享写入屏障与受控验收（2026-10-14）

> **结论：CODE FIX / FORMAL CONTROLLED 5/5 PASS；独立原审计脚本重放与真实 Electron E05 复测 NOT-RUN；P06-S02 NOT ACCEPTED、P06 PARTIAL、PR #21 MERGE NO-GO。** 原始失败事实在 [38 号](38-p01-p06-s02-cumulative-risk-audit-20261013.md)，真实 Electron 首败在 [37 号](37-p06-s02-local-acceptance-20261013.md)。不可用本批单测覆盖或删除这些历史证据。

## 1. 为什么需要本批修复

原 `review-actions-controller.ts` 的 `workspaceRefreshGenerations` 只属于单个 Controller 对象，关闭审核子页后旧实例异步 `listRunsV2` 可以晚于新实例写入旧案卷运行。原 `use-review-workspace-actions.ts` 的 `refresh` 和 `apply` **另有不受这个本地 generation 约束的 Jotai 写入链**：旧 `RightPanel.perform()` 虽然拒绝显示迟到消息，却来不及阻止内部 Hook 写缓存。38 号独立反例此前均失败；37 号 E05 真实 Electron 亦证实 Main 为新 run、页面回退到旧 run。

## 2. 修复与范围

- 新增 `review-workspace-write-fence.ts`：以 **`WeakMap<JotaiStore, Map<caseId, generation>>`** 为所有前台写入者提供共享资格。令牌在**发起**异步请求/业务操作时取得，新写入意图让旧令牌失效；旧 Promise 结束时必须先检查资格。这是纯 Renderer **展示一致性屏障**，不是 Main 的运行授权、任务账本、模型停机或业务审核结果。
- `review-actions-controller.ts`：V2 轮询改用共享令牌，所有 migrate、aggregate/template、runs、validity、observations、真实 `getBackgroundPiReviewStateV2` 异步返回后的相关 Jotai 写入都检查当前资格。公开 `invalidateRefresh(caseId)` 供页面卸载/切案取消旧显示请求；允许 Main 持有的 Pi 在页面外继续运行。
- `use-review-actions.ts`：轮询 effect 清理不仅停止 timer，也使旧案卷刷新失效。离开页面不会 stop/cancel 真正审核运行。
- `use-review-workspace-actions.ts`：`refresh` 在取得 aggregate/runs/observations 和 validity **全部返回后**校验令牌，再统一提交四个缓存槽。修改型 `apply` 从过去 `apply(await IPC)` 调整为 `apply(IPC Promise)`，**在远程命令完成前先取得资格**；迟到业务命令的后续读回无法夺走新运行缓存。保留 Main expectedRevision/角色/业务授权验证，前台不会将分析完成当审批通过。
- 不重造 Runner、owner、RunStore、Electron 通道或额外数据库；原普通 Agent/P05 Relay/Pocket 代码未改。持久索引 FIX-01 的安全 UUID 日志亦未改。

## 3. 冻结提交、CI 与正式受控五项

代码冻结 [`414f2066`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/414f20669b06513064ff9f84e9ccfb92f7a9001e)；[PR CI #38496467696](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467696)、[D2 #38496467716](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467716)、[Baseline #38496467778](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467778)、[focused #38496467754](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467754) **全部 SUCCESS**；新增 **5/5 PASS**（PR CI 日志逐项可见），全仓 **3874 pass / 5 skip / 0 fail（3879 tests / 441 files）**，typecheck、边界和 Electron main/preload/renderer 构建均通过。

测试文件 `review-workspace-write-fence.p06-fix02.test.ts` **纳入默认全仓**，以真实 Jotai store、React SSR Provider 和真实 Workspace Hook 回调配合受控延迟 IPC（非静态字符串检查）；强制 `witness()` 确认 Hook 的 API/业务命令确实运行，避免 38 号已作废的“没进真实 Hook 却 PASS”样板。

| ID | 真实受控场景 | 状态 |
| --- | --- | --- |
| FIX02-01 | 同一 Jotai store、同一 case 的新写入撤销旧令牌；不同 case 不受影响 | **PASS** |
| FIX02-02 | 旧 Controller 在未显式撤销条件下，跨实例慢返回不得覆盖新 Controller 已接受的 running run | **PASS** |
| FIX02-03 | 卸载且不重建页面，旧请求结束仍不得写入 `reviewWorkspaceRuns` 或执行态 | **PASS** |
| FIX02-04 | 真正 React/Jotai Hook `refresh` 已发起并被阻塞后，新 Controller 落下新 run，旧 cancelled/failed 回复不能覆盖 | **PASS** |
| FIX02-05 | 真正 Hook `apply` 在远程修改命令返回前捕获资格；业务回执迟到后不覆盖新 run、修订版本、observations | **PASS** |

**限制**：以上使用可控制的合成 IPC 值，确实执行 React/Jotai/Controller 正式函数体，但不是完整 Electron 重新开页或真实模型/运行回调。原 `replay-risk-probes.py` 精确重放、本地真实 E05 关闭/重进/释放旧 Main 回复仍须补录脱敏证据。未验证两窗口及 UI 页面动画/导航时序，不据此直接标 LIVE-07 PASS 或 P06-S02 ACCEPTED。

## 4. 剩余缺口、实机复验指令

- 在 [37 号](37-p06-s02-local-acceptance-20261013.md) 的原隔离 profile 操作办法基础上，使用**当前 FIX-02 新 HEAD**重新运行 E05：旧 `listRunsV2` 先发后阻塞 → 真正关闭审核子页 → 第二轮真实 Main ACK/业务账本 running → 打开审核页 → 释放旧回复。必须对照 Main runId 与 Jotai runId/phase，均保持最新；旧错误、旧停止提示不能复活。记录实际 SHA、设备/OS/版本、时序和日志/截图哈希。原首败保留，不因后续成功覆盖历史。
- 受控原风险复跑：
```bash
REVIEW_ACCEPTANCE_ROOT="$PWD" REVIEW_RISK_OUT=/path/to/new-isolated-fix02-replay \
  python3 docs/design/review-agent/acceptance/p06-s02-local-20261013/replay-risk-probes.py
```
  该综合脚本还包含 **FIX-03 尚未修复的 SETTLE-01**，所以即使本批两项 UI 防护正确，脚本整体仍可能返回非零；应逐项判断 `AUDIT-P06-REMOUNT-01` / `AUDIT-P06-WORKSPACE-WRITER-01`，不可用整体退出码简单宣称本批失败或通过。
- 仍开放：`AUDIT-P01-P06-SETTLE-01`（撤销授权 I/O 失败/未观察 rejected Promise）、FIX-01 真实损坏索引恢复、P06 E03/E04/完整 E06、P05 生产中心 Relay 与上游 Pocket、P04 永久 tombstone/journal 容量监测，以及 P07/P08。**不合并**。
- 下一独立批次 `P06-FIX-03` 聚焦 `review-pi-admission.ts` 中的 `revokeAssignment` 抛异常后清理、可观察终态及 deny-by-default 准入；测试 EACCES/ENOSPC、损坏 JSON、finish 异常、授权未撤销时不可恢复准入。不要为了让测试绿而忽略真正写盘失败。

## 5. 当前停点

**P06-FIX-02 CODE/CONTROLLED PASS 5/5；REAL E05 NOT-RUN（旧 FAIL 保留）；P06-S02 NOT ACCEPTED / P06 PARTIAL / MERGE NO-GO。** 本批只推进 UI 一致性，所有对外端与发布门禁维持原判定。主状态以 [29 号](29-background-session-preflight-audit.md) 和最新 PR HEAD/CI 为准。
