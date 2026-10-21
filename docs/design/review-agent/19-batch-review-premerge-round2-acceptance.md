# 19｜B+C 批量审核合并前收口：第二轮可靠性与验收

> 2026-10-11 · 对象：`feat/batch-review-triage-v1`（等待使用者验收）  
> 本文件更新并补充 18 号质量报告：18 号报告的“可以直接合并”结论**已被第一、二轮独立复核取代**。  
> 第二轮不新增审批业务能力；主要收口 Outbox 中断恢复、主线基线一致性和端到端验收。  
> 代码仍属于 Draft PR #1；除非使用者验证并同意，否则不要合入 `main`。

## 1. 已完成：Outbox 原始载荷 WAL 与可靠恢复

原问题：只保存 `payloadHash`，`recoverPendingPushes()` 恢复时构造 `recovery-placeholder`，因此既不能重放正确业务动作，还会触发“相同 actionId 不同载荷”的冲突。

修复约束：

1. **落盘在发送之前**：OutboxEntry 保存原始完整 `PushPayload` 与 SHA-256 `payloadHash`，然后才执行 `SchoolPort.push`。
2. **原样恢复**：`recoverPendingPushesDetailed` 校验 actionId、载荷结构和哈希；只能使用落盘的 `payload` 重新发同一个 actionId。不得猜测 `caseId`、`actionKind`、外部版本或 `body`。
3. **未知结果安全**：端口网络异常、进程中断、`awaiting-receipt` 均保持 `pending`；外部动作可能已经执行，恢复依赖外部端口的 actionId 幂等契约，不另造业务动作 ID。
4. **终态不重放**：`accepted`、`conflict`、`rejected` 保留原始回执；同 actionId、同内容直接返回回执；不同内容拒绝。
5. **旧版本兼容**：没有 payload 的旧 `pending` 条目，不允许自动恢复；详细恢复报告中列入 `needsManualReplay`。经人工核对后，原调用方可用哈希一致的原始载荷重放；绝不能构造占位载荷。
6. **拒绝不可信快照**：载荷哈希错误、文件名和动作 ID 不匹配、actionId 路径遍历，以及同进程相同 actionId 并发提交均会被阻断。
7. **校方端口边界**：本轮验证的是适配器合约和模拟端口。真正的外部系统需要以 actionId 实现稳定幂等和回执查询；本轮**没有**完成校方生产端口联调，也不声明跨多 Electron 进程的分布式锁。

对应代码：`apps/electron/src/main/lib/review/batch-store.ts`；针对性测试：`batch-store.test.ts`。

## 2. 已完成：与已通过 CI 的 main 基线对齐

最初 B+C 分支从 `7fb26b5f` 创建，期间主线新增模板初始化、旧测试、运行产物等修复；此前看到的旧全库失败不应简单归因于当前 B+C 业务代码。

- 本轮已经核对当时主线上的全量 PR CI 成功记录，随后通过 **同步 PR #7，方向严格是 `main → feat/batch-review-triage-v1`** 同步最新主线；未把 B+C 提前合入主分支。
- 需要以主线同步后的 PR CI 重新判定全库失败；旧报告对“主线只有两项文档更新”的记载不再有效。
- 如果后续 `main` 再次前进，合并前应重新检查 ahead/behind、变更冲突和最新 CI 状态。

## 3. 自动化验证范围

| 检查 | 验收目标 |
| --- | --- |
| Outbox 恢复 | 端口首发失败后，持久完整 payload，重复发送同 actionId；最终记录正确状态 |
| Outbox 旧记录 | 没有原始 payload 的旧记录列出人工处理，不虚构重放 |
| Outbox 改写与并发 | 伪造证据/变更哈希和非法路径被拒，活跃 actionId 不重复执行 |
| 外部待确认回执 | `awaiting-receipt` 不冒充最终成功；下一次恢复仍用原 actionId |
| 单案业务权限 | 不允许本地 reviewer 代签教师/评委，不能经自由快照绕过正式决定而定稿 |
| 混合批次 | 自动通过、自动补件、需人工复核、技术异常逐案隔离，留真实事务回执 |
| 补件回流 | 全部未结束请求获核验后才重新入队，旧运行不能作为新批准 |
| 批次全链路 | 队列执行 → 正式业务决定 → 审计快照定稿 → 定稿后拒绝再次执行 |
| 全仓库 CI | Bun 锁文件安装、typecheck、边界/皮肤契约、Electron main/preload/renderer 构建、完整测试 |

命令：

```bash
git fetch origin
git switch feat/batch-review-triage-v1
git pull --ff-only origin feat/batch-review-triage-v1
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
(cd apps/electron && bun run check:skin-contract && bun run build:main && bun run build:preload && bun run build:renderer)
bun test --isolate --timeout 30000
```

> 对于具体 pass/fail 数字与准确提交 SHA，以 **PR #1 当前 HEAD 对应的 Actions Run** 为准。不能用旧提交的绿色状态给新提交背书。

## 4. 本地 UI 人工验收清单（尚未由本轮 Linux Actions 自动执行）

需要在**隔离配置目录**与**合成材料**环境进行；绝不能用正式学生档案或校方生产端口直接试验自动审批。

桌面入口使用项目内置的离线演示账户，按 [B 阶段验收入口](16-batch-review-stage-b-local-acceptance.md#离线桌面验收入口) 登录后进入 **CDUT 专区 → 材料审核 → 批次管理**。2026-10-11 实际桌面补验记录见 [21 号报告](21-batch-review-offline-ui-acceptance.md)。

1. **创建 4 案批次**：同一已发布模板和政策版本，涵盖符合、规则明确可补正、需要人工核实、检查执行异常。启动后看逐案队列状态与分流、聚类是否对应。
2. **辅助模式验证**：默认 `assist` 仅展示建议，没有 `BusinessDecision`；候选标签与正式决定严格区分。
3. **按组人工操作**：选择问题组与子集，填核实依据，预览排除项，逐案确认；退出再进入检查审计日志、真实业务改变和幂等回执。
4. **自动补件**：对仅符合 `onFail='supplement'` 的案卷自动 `return`；其他不符合、无来源证据或角色不匹配的案卷必须阻断。
5. **自动通过**：仅在全局、模板与批次授权全部开启且没有任何人工必审项时，检查实际 `decisions` 和 `actorSource='system'`；关闭权限后不应继续写入。
6. **补件重新审核**：申请人回复并不足以回流；审核员完成所有补件核验后重新入队；再次执行时必须生成新运行并核对引用，不得复用旧结果。
7. **异常恢复**：人为构造未结束批次、失败单案与 Outbox pending，检查是否能够安全恢复，不得在没有有效载荷时向校方发送占位数据。
8. **正式定稿**：任何案卷存在未结束补件/申诉、开放任务或缺乏最终业务决定都不能定稿；全部满足条件时定稿并查看快照；再次运行必须拒绝。
9. **恶意 IPC 输入**：尝试教师、评委、school/agent/system 身份和 `../` 路径；预期拒绝，且真实案卷没有产生副作用。

以上 UI 操作、Electron 原生控件和 Windows/macOS 发布包依然需要运行在对应环境的人工/自动化桌面验收；**不是**服务级单元测试能够替代的证据。

## 5. 合并规则

- 第一轮 P0：定稿统一门槛、批次/操作 ID 路径、安全身份与阶段权限，专项负例回归通过。
- 2026-10-11 第三轮本地验收发现：上述路径负例未覆盖 V2 案卷 `caseId`；案卷存储路径仍可被相对路径越界。见 [第三轮本地 QA 报告](20-batch-review-qa-round3.md)。修复并回归前，合并结论保持阻断。
- 第二轮 P1：Outbox 原载荷持久化与安全恢复、主线基线同步、主进程完整事务链路回归。
- 在同一 HEAD 上通过全量 CI，且完成必要的本地 UI 验收后，才建议将 Draft PR 交付合并；目前保持 Draft，不自动合并。
