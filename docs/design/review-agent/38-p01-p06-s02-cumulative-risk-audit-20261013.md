# 38｜P01～P06-S02 累计实现与测试独立风险复核（2026-10-13）

> 用户将风险检查范围明确扩大到 **P01～P06-S02**。本报告检查现有实现、依赖与测试，不重新设计运行框架，不执行 P07/P08，也不关闭既有外部阻断。结论：**发现四项可复现的生产逻辑缺口；累计验收需返工，MERGE NO-GO。** 双轮实机与命令证据见 [37](37-p06-s02-local-acceptance-20261013.md)。

> **后续修复，保留本报告旧版本事实**：2026-10-13 [39｜P06-FIX-01](39-p06-fix01-owner-index-recovery-20261013.md) 已在 `c8c84681` 加入独立 owner UUID deny journal，默认受控 **9/9 PASS**、全仓 3869/5/0。原文 `ef9074e3` 的四项 FAIL **不得改写**；原脚本当前 SHA 精确复跑与真实 Electron 恢复未执行，另三项仍 OPEN，P06-S02 NOT ACCEPTED。新日志容量/冷迁移风险新增，不改变 P04 原安全留存决策。

> **第二批后续修复，保持原始证据不动（2026-10-14）**：[40｜P06-FIX-02](40-p06-fix02-renderer-write-fence-20261014.md) 针对本报告的 `AUDIT-P06-REMOUNT-01` 与 `AUDIT-P06-WORKSPACE-WRITER-01` 补共享 Jotai 写入屏障，真实 Controller/React Hook 受控新增 **5/5 PASS**、全仓 3874/5/0，代码冻结 `414f2066`。以下表格与负例是早先 `ef9074e3` 时点的事实，**不改写**。原独立探针当前 HEAD 精确复跑及实际 Electron E05 复测未执行，E05 FAIL 仍属有效历史，P06-S02 NOT ACCEPTED；`SETTLE-01` 仍 OPEN，先前 FIX-01 真实恢复仍待验。

## 1. 范围与方法

- 原 main 对照 `dd5a553c34a92b559559a7cb3c4e9c3f67fd9c8e`；接手云端 `de1318c5d0d502b66e030e3500e83cc518d389e6`；最终应用/驱动 `ef9074e367d2e7fda5955d8b0d6d9a4812836a6d`。
- 审查上述累计 **62 个代码/测试/脚本文件**的变更和生产调用链，并追踪未改动但实际依赖的 safe-file、assignment 持久化、Workspace Hook 等。清单见 [cumulative-changed-files](acceptance/p06-s02-local-20261013/audit/cumulative-changed-files.txt)与 [review-scope](acceptance/p06-s02-local-20261013/audit/review-scope.json)。不是只检查 P06 最后一个提交。
- 重跑 20 份相关文件 **194/194** 与全仓 **3860 pass / 5 skip / 0 fail**；另外用临时合成数据破坏正常时序/持久化前提，检查正确保护断言。新增负例实际 **0 pass / 4 fail**，独立 I/O 进程确认未捕获 rejection 和未撤销授权。所有数据位于 mkdtemp/profile，没有读取真实学校材料或向飞书发消息。
- 本批修改只加强 QA 与记录证据，**以下生产问题尚未修复**。历史受控 PASS 继续属于其原冻结 SHA/范围；当前新增反例据实登记 FAIL。

## 2. 四项已确认问题

| ID / 优先级 | 影响阶段 | 实际问题 | 当前状态 |
| --- | --- | --- | --- |
| AUDIT-P03-P05-INDEX-01 / **P1** | P03 owner、P04 路径/事件、P05 远程隔离 | 从不含新 owner 的旧 `.bak` 恢复后，残留私有 transcript/路径无法再按 owner 分类，普通守卫和远程事件放行 | **CONFIRMED / OPEN** |
| AUDIT-P06-REMOUNT-01 / **P1** | P03 跨页、P06-S02 迟到回读 | generation 只属于 Controller 实例；旧页面请求跨过卸载后仍能覆盖新页面新 run | **CONFIRMED / OPEN**；另有真实 Electron 证据 |
| AUDIT-P06-WORKSPACE-WRITER-01 / **P1** | P06-S02、RightPanel 停止/人工操作后的刷新 | `useReviewWorkspaceActions.refresh/apply` 直接写相同 Jotai 缓存，未采用 Controller generation；外层 stillCurrent 检查晚于内层写入 | **CONFIRMED / OPEN**，refresh 路径负例已复现；apply 路径待补独立断言 |
| AUDIT-P01-P06-SETTLE-01 / **P2** | P01 Main Promise 收尾、P03 授权、P06 释放 | revokeAssignment 写盘抛异常后，discarded `.then()` 链产生未捕获 rejection，之后的内存清理未执行、持久授权未撤销 | **CONFIRMED / OPEN** |

### 2.1 Owner 分类在索引恢复后失效

入口：[agent-session-manager.ts](../../../apps/electron/src/main/lib/agent-session-manager.ts) `readIndex` / `isReviewOwnedOrDeletedAgentSessionId` / `assertOrdinaryAgentSession`；依赖 [safe-file.ts](../../../apps/electron/src/main/lib/safe-file.ts)、[review-private-file-access.ts](../../../apps/electron/src/main/lib/review-private-file-access.ts)、[remote-service.ts](../../../apps/electron/src/main/lib/remote-service.ts)。

合成普通会话先写索引，再创建 review owner；生产原子写入的 `.bak` 是创建前索引。直接写入合成 transcript，破坏主索引，让生产 safe-file 自己回退 `.bak`。实测：

- 恢复前普通 guard 拒绝；恢复后 metadata 缺失、guard 放行。
- 同一 SDK JSONL 仍能读到数据，远程 sdk_message 出口 predicate 返回 true。
- 已知私有工作目录的 deny predicate 返回 false。

这是**索引损坏/旧备份恢复条件下的受控反例**，没有声称生产已经发生泄漏，也没有把直接低层读取冒充整条网络请求。实际 Main GET_SDK_MESSAGES 按“普通 guard → SDK getter”调用，恢复后该 guard 缺少分类依据；路径/事件复用同一依据，影响跨 P03～P05。

现有健康索引、删除后 tombstone、缓存失效和重启测试没有覆盖“备份不含新身份但文件/事件仍存在”。建议先确定索引恢复的信任边界：owner/tombstone 不完整时拒绝无法确认的私有访问，或从既有可信持久记录恢复身份；不能将索引为空等同普通会话，也不能删除 tombstone 来缓解。关闭门槛：旧备份、三文件全损坏、格式合法但缺字段/旧 schema、恢复后 SDK/路径/事件/Pocket 普通正负例都通过。

### 2.2 旧 Controller 跨页面生命周期写入新视图

入口：[review-actions-controller.ts](../../../apps/electron/src/renderer/components/content-review/review-actions-controller.ts) 的实例局部 `workspaceRefreshGenerations`，以及 [use-review-actions.ts](../../../apps/electron/src/renderer/components/content-review/use-review-actions.ts) 的 effect 清理。

同一个 Jotai store：旧 Controller 发出未返回的 listRuns，新 Controller 已保存新 run/running，旧请求随后返回旧 failed run。实测缓存回到旧 run，执行态变 failed。现有两项 generation 测试只在**同一个 Controller**里安排乱序，没有重建实例。

真实 Electron 另验证：旧请求捕获真实 Main 第一轮数据后，实际关闭审核子页、停止旧轮、重进并启动新轮，再释放旧回复。**Main 仍指向新 run accepted/running，Jotai 已指向旧 run/preparing。** 这是 E05 FAIL；没有向生产 executor 注入回调，新轮最终由实际 stop 清理为 cancelled。

建议把同案视图提交的资格放在同一 Jotai store 的有效生命周期/刷新身份上，卸载时撤销未完成显示请求；重进和另一写入者也要使旧资格失效。Pi 持续执行仍由 Main 持有。关闭门槛：同实例乱序、卸载/重进、A→B→A、两窗口、旧成功/失败/取消回复均不可回退最新 run。

### 2.3 Workspace Hook 是另一个未设屏障的写入者

入口：[use-review-workspace-actions.ts](../../../apps/electron/src/renderer/components/content-review/use-review-workspace-actions.ts) 第 56 行 `refresh`、第 80 行 `apply`，调用方 [RightPanel.tsx](../../../apps/electron/src/renderer/components/content-review/RightPanel.tsx) 的 `perform`。

实际 Hook 使用 Promise.all 取得 aggregate/runs/observations 后立即写缓存；后续有效性读取也直接落位。RightPanel 的 stillCurrent 在 await refresh 后才再次检查，此时旧 run 已写入。用真实 Hook/React SSR/Jotai、受控旧 listRuns 回复，先保存新 run，再释放旧结果，实测旧 cancelled run覆盖新 running run。

探针增加 **apiReads > 0**，确认实际 Hook 已执行；早期 SSR pilot 的 Provider 与 Hook 模块不一致，refresh 没有进入 API，那个表面 PASS 已作废，不作为本报告证据。这也是测试需要“调用发生见证”的例子。

建议盘点所有对 `reviewWorkspace*ByCaseAtom` 的写入者，给 refresh/apply/Controller/停止后刷新采用一致提交条件。关闭门槛：真实组件级操作、inner refresh/apply 晚到、旧 finally 和新 busy 并存、新 run 进入期间旧 aggregate/observations/stale 都不回退；不能只拦成功提示。

### 2.4 收尾授权文件写入失败会越过 Promise 观察

入口：[review-pi-admission.ts](../../../apps/electron/src/main/lib/review/review-pi-admission.ts) 第 131/140 行，调用 [review-agent-assignment.ts](../../../apps/electron/src/main/lib/review/review-agent-assignment.ts) 的同步 writeAll。

在临时合成案卷中取得真实 admission contract ACK，受控 executor 正常结束；将该临时授权文件设为只读，实际 writeFileSync 报 EACCES。Bun 保护断言失败，独立进程补录：**unhandledRejection=true、grantRevoked=false**。`.then()` 的两个收尾处理器内均可能抛错，后面没有 catch；runningAssignments.delete/forgetAdmitted 位于抛错之后。

证据证明撤销失败和异常越出收尾链；并未测得实际 Electron 崩溃，也未凭未撤销单独断言工具已越权。其它 binding/run 状态校验仍需分别核对。建议持久化错误明确上报、内存清理用 finally、最终 rejection 被实际观察，失败时保持工具准入拒绝；禁止把“尝试撤销”记为持久成功。关闭门槛：EACCES/ENOSPC、JSON 损坏、finish 写盘失败、成功/拒绝处理器异常与下一轮准入均有断言。

## 3. 按 P01～P06-S02 对照测试严密性

| 阶段 | 当前有效证据 | 本次复核发现的缺口 / 必补测试 |
| --- | --- | --- |
| P01 | 真实 runAgent 函数体/V2 的受控终态探针；A0 真实 provider 正例；本次真实四轮取消与普通 Pi 回复 | 受控正常磁盘掩盖收尾 handler 自己抛错；新增 EACCES 反例已 FAIL。缺 fs 持久化故障与异常清理矩阵 |
| P02 | 14 项 strict-tools/正文/图像/压缩受控探针；A0 正文引用；本次真实 review_read_documents 回执 | 受控渲染器/静态工具装配没有证明真实 PDF/PNG、完整提供给模型的工具清单、压缩长轮次；先前 dev 原件导航被阻断仍未关闭 |
| P03 | 可信 owner、Main ACK/start/read/stop、预检和普通入口既有回归；真实两轮与授权撤销 | 健康索引的 owner 原子落盘不证明旧备份恢复安全；模型无配置负例不覆盖中途 prepare/授权/finish 写盘失败。恢复身份反例已 FAIL |
| P04 | 搜索/归档/Tab/删除 tombstone/pending/路径与目标变更/缓存规模受控测试 | 相同 owner predicate 在坏索引恢复时同时失效；真正多窗口、跨平台路径/TOCTOU/早到权限及完整普通预览仍缺。Renderer 迟到队列仅逐 ID 限 4096，缺总体容量/未返回 RPC 的压力证明 |
| P05 | 43 项 Pocket/飞书/路径/搜索/本地 WS/合成 Relay 测试 | 本机 socket 和 mock ticket 无法签收生产中心或独立 Pocket；恢复后出口 predicate 放行已在受控反例重现。生产协议和客户端 patch 未运行，继续 BLOCKED/NOT-RUN |
| P06-S01 | 同毫秒指派顺序、同 owner/新 owner、旧 callback/stop 的 Main 受控屏障 | mock stop barrier 是有价值的确定性探针；真实 stop 重叠窗口本次未命中，实际 SDK 迟到 outcome 没有注入；不能据此覆盖真实全部时序 |
| P06-S02 | 原两项同 Controller 乱序；修补后驱动 6 项；实机 E01/E02 2/2、普通 Pi IPC 正例 | 原 owner 断言可假通过，已补实际绑定；ACK 不等于 provider 已响应，已补本轮见证；旧控制器跨卸载和另一个 Hook 写缓存两个反例仍 FAIL。静态字符串合同不是组件行为验收 |

容量与唯一性还有候选风险：assignment 全量 JSON 同步读写且撤销历史长期保留，增长后可阻塞 Main；assignmentId 使用 UUID 前 8 位，没有碰撞重试。这里仅为源码确认的风险条件，**没有压测或碰撞故障注入，不标实机 FAIL**。P04 已有永久 tombstone 的规模数据继续保留，不能用不安全 GC 消除。大事件递归预算、未知 ID 队列总体容量和普通长轮次兼容也需后续压力验证。

## 4. 证据复跑与范围边界

公开反例：[scope-risk-results](acceptance/p06-s02-local-20261013/audit/scope-risk-results.json)、[保护断言日志](acceptance/p06-s02-local-20261013/audit/scope-risk-probes.log)、[独立收尾日志](acceptance/p06-s02-local-20261013/audit/settle-risk-standalone.log)、[真实 Electron E05](acceptance/p06-s02-local-20261013/runtime/p06-extra-results.json)。日志中的临时合成 UUID 已脱敏，原始和公开哈希都有记录；没有伪造错误或裁掉失败断言。

```bash
# 默认 Root 从仓库定位；输出到新的本机目录。当前未修实现应返回非零。
REVIEW_ACCEPTANCE_ROOT="$PWD" REVIEW_RISK_OUT=/path/to/new-isolated-report \
  python3 docs/design/review-agent/acceptance/p06-s02-local-20261013/replay-risk-probes.py
```

采集器将 `.probe.ts` 复制到仓库外临时 `.test.ts` 执行，避免审计快照被默认全仓自动枚举。**这不豁免失败**：它们保持 FAIL/OPEN，当前 feature 不能因 CI 绿灯宣称完整验收通过；修复批次必须把对应正确保护断言纳入正式测试。

## 5. 返工顺序与关闭条件

1. 先修 P03～P05 恢复后的身份拒绝，以及 P06 两条旧 UI 写入路径；每项把当前反例复验为 PASS，并验证普通会话/文件和新运行不回归。
2. 修 P01/P06 收尾持久化异常的观察与清理，保留 durable failure 事实；同步补 prepare/finish 故障注入，防止新的永久 running。
3. 再取得 E03 真正停止重叠、E04 获授权迟到回调、完整 E06 与原 LIVE 证据。不要重复 E01/E02 掩盖其它开放项。
4. 原 P05 Relay/Pocket 阻断和 P04 安全留存不变。P06 整体 PARTIAL；P07/P08 未推进；PR #21 Draft/Open/未合并。四项新问题尚未关闭，本轮完成的是验收、独立审查、驱动修补和公开证据交付。
