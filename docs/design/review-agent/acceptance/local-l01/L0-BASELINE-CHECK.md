# L0｜主线基线核验与历史遗产缺口

**基线**：`main` @ `30f8597ff`（其父为交接指定基线 `24603d875`，差异仅为本轮 L2 修复）
**范围**：仅核验 L0 指定项，不重复 PR #133–#139 全仓考古。

| 核验项 | 结论 | 证据 |
|---|---|---|
| Dev-A 执行适配（direct / hidden / graph / batch 四模式） | `ALREADY_PRESENT` | 主线 `review-v3-main-sdk-turn-bridge.ts` 定义同一组 `V3ASDKMode` 四模式；生产链已接线：`review-v3-background-technical-coordinator` → `review-v3-technical-sequence-driver` → `review-v3-sdk-physical-turn-port` → turn bridge |
| Dev-A `review-execution-event-adapter-driver.ts`（`V3ExecutionHostAdapter`） | `ALREADY_PRESENT`（等价实现，非同名文件） | 该 driver 在 Dev-A 分支中**也只被自己的测试引用**，从未有生产调用方；其三个依赖 `V3ReviewOwnerAdapter` / `V3ExecutionEventAdapter` / `V3ExecutionCompletenessAdapter` 均已在主线，并分别被 `sdk-turn-bridge`、`a25-local-execution-ports`、`execution-proposal-producer` 真实使用。同能力已由 turn bridge 组合承担，**不移植该文件** |
| 跨 PID Owner 状态 | `ALREADY_PRESENT` | `review-v3-durable-host-fence.ts` + `.worker.ts`：由独立 Bun OS 进程从磁盘核验 Run 级围栏；另有 `review-v3-sdk-dispatch-fence.ts` 与 owner adapter 的 lease/generation 校验 |
| 执行检查点、取消与恢复 | `ALREADY_PRESENT` | 取消：`cancelRunV2` / `stopBackgroundPiReview`；案卷级磁盘锁恢复：`recoverC2AbandonedCaseDiskLock`；批次恢复：`recoverInterruptedBatch`；运行态对账：`reconcilePiReviewRunsWithReadReceipts`（读时按真实回执收敛，中断的 `running` 不会永久滞留） |
| V2 聚合业务服务、批次、离线包 | `ALREADY_PRESENT` | `application-service` / `run-service-v2` / `workspace-business-service-v2` / `plan-binding-v3`；`batch-store` + `batch-automation-service` + `batch-group-action-service`；`offline-roundtrip` + `review-import-checkpoint-v3-b2` + `review-import-handoff-v3-b2` |
| IPC / Preload 的 V3 读写覆盖 | `ALREADY_PRESENT` | preload 暴露 102 个 review 通道，含 `LOCAL_D4_*`、`LOCAL_B1_ATTACH_PLAN_V3`、`AUTHOR_*_V3`、`B20_*_V3`、`RESTORE_CASE_V3`、`ASSIGNMENT_*_V2`、`CREATE_NATIVE_REVIEW_ITEM_V3` |
| A 轨技术执行编排器 `review-v3-main-local-execution-orchestrator.ts` | `PRESENT_NOT_CONNECTED` | 代码存在且内部链完整，但**无生产调用方、无 IPC/Preload 入口**；`runBatchV2` 走的是 V2 `batch-store` 队列，不是 `a24-bounded-technical-batch`。**本轮不接线**：该链是 A 轨技术执行（不产出正式决定），暴露它需要先定义入口契约与授权主体，属功能线范围 |

## 结论

L0 指定范围内**未发现 `MISSING_REUSABLE`**，因此 L1 不需要移植任何历史执行能力。
唯一「存在但未接通」的是 A 轨技术执行编排器，按职责边界记录给功能线，不自行接线。

## 未纳入本轮

- 十条线（T01–T10）的业务功能：不自行实现，等待交付。
- V1/V2 架构研究、全仓历史考古：不在范围。
