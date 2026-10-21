# 41｜P06-FIX-03 撤销指派 I/O 故障、后台 Promise 收尾与受控验收（2026-10-14）

> **阶段结论：P06-FIX-03 CODE / FORMAL CONTROLLED 7/7 PASS；原独立审计重放、真实 Electron 恢复/双磁盘故障 = NOT-RUN；P06-S02 NOT ACCEPTED、P06 PARTIAL、PR #21 MERGE NO-GO。** 原 `AUDIT-P01-P06-SETTLE-01` 的 0/4 失败历史见 [38 号](38-p01-p06-s02-cumulative-risk-audit-20261013.md)，不要删除或改成历史 PASS。前两项返工分别见 [39](39-p06-fix01-owner-index-recovery-20261013.md) / [40](40-p06-fix02-renderer-write-fence-20261014.md)。

## 1. 冻结代码、CI 与失败保留

[代码 `b5f9db17`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/b5f9db179b358d0405a1d0868133f11064edc93a)；[PR CI #38524782294](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782294)、[D2 #38524782315](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782315)、[Baseline #38524782350](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782350)、[focused #38524782373](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782373) **四套 SUCCESS**，全仓 **3881 pass / 5 skip / 0 fail（3886 tests / 441 files）**，类型、包边界、Electron main/preload/renderer build PASS。

- 最初 [PR CI #38523276636](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38523276636) **FAIL**：新增 EISDIR 测试误以为无法读取指派账本时一定已把 V2 终态写成 failed；另一测试因直接 Pi 运行校验放错层，破坏 P06-S01 通用指派查找契约。纠正测试对**持久状态未确认**的真实预期，将 V2 活跃性限制放在工具授权及 Main 真正 admission，而非历史指派元数据查找。
- 第二轮 [PR CI #38524287740](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524287740) **FAIL**：仅剩新增断言错误要求通用历史 assignment 查找返回 undefined。最终改为核对 `getPiReviewBindingForSession` 确实拒绝已终止的 V2 绑定，同时保留历史元数据供审计。
- 最终 `b5f9db17` 的七项 **7/7 PASS**，全仓零失败；没有通过删除失败测试或隐藏历史 FAIL 取得绿灯。

## 2. 实施及不可越过的边界

**涉及的生产文件**：

- `review-agent-assignment.ts`：对要撤销的 `assignmentId` 先加**进程内待撤销 deny 标记**；磁盘读取/写入失败仍阻止 `checkAssignment`、后续当前权限受理。检查直接 Pi 的 `activeRunId` 对应 V2 为 `running`，否则旧授权不能操作；**不改变** `findActivePiReviewAssignment` 返回既有历史元数据的语义。文件存在但 JSON 损坏不再默认为空数组并覆盖授权账本。
- 对整个 `review-agent-assignments.json` 使用既有 `writeJsonFileAtomic` 临时文件/rename **原子替换**，避免磁盘空间耗尽时直接截断最后一份有效账本；写入同时把此前失败的 `pendingRevocations` 合并为持久 `revokedAt`。只有原子写成功后才清除该进程内待撤销标记。**标记存在 ≠ 已经持久撤销**。
- `review-pi-admission.ts`：仅在真实 V2 运行 `running` 且 binding/当前用户轮次相符时受理；对 executor 兑现/拒绝使用始终可观察的 Promise；正常、拒绝或持久化异常都在最终 `finally` 释放 `runningAssignments` 和 Main ACK 标记。对 `onRunOutcome` 检查实际 V2 持久状态，失败写日志并保留未确认结果，不能伪造已成功完成。
- **不重造** Pi executor、RunStore、owner、P04 tombstone、P05 Relay/Pocket 或 Renderer；不扩大普通 Agent 权限。

## 3. 七项正式受控测试（已由 PR CI 实际执行）

测试文件：`apps/electron/src/main/lib/review/review-background-reuse.probe.test.ts` 的 `P06-FIX-03 durable revoke-failure containment`。

| 用例 | 结果 |
| --- | --- |
| V2 已终止，但旧 `revokedAt` 尚未写入：旧工具与当前 Pi binding 不得重新授权，历史 assignment 元数据仍可审计 | **PASS** |
| 持久指派 JSON 损坏：不能自动覆盖损坏账本或继续授权 | **PASS** |
| 真实 `onRunOwned` ACK 后 I/O EISDIR：无未处理 Promise，ACK 清理、旧工具 deny，持久 `revokedAt` 如实未确认；恢复 I/O 后下一笔合法写入补齐撤销 | **PASS** |
| ACK 前 executor 拒绝 + 损坏 JSON：返回失败而非永久等待，不保留重复受理 token、拒绝工具权限 | **PASS** |
| 非 root 的 CI runner 上将账本**所在目录**设为不可写：复现原子路径的 EACCES，拒绝旧指派且不虚报持久撤销 | **PASS** |
| V2 终态文件无法可信写入：不保留进程内 ACK，旧授权 deny，遗留 `running` 明确属于未确认持久终态 | **PASS** |
| 正常成功撤销产生持久 `revokedAt`；独立普通指派继续可用 | **PASS** |

上述均为隔离 profile、合成案卷/受控执行器测试；**没有实际耗尽文件系统触发 ENOSPC**，只在代码路径使用既有原子替换避免截断。没有真实 Electron 串行/强杀测试。原审计 `replay-risk-probes.py` 的四项真实保护断言尚未在最终 HEAD 精确运行；本次 7/7 是同一缺口的新正式受控证明，**不能反写旧失败记录**。

## 4. 剩余安全限制及下一次实机动作

- **双持久化失败的恢复**：若 V2 终态与 assignment 撤销都无法落盘，Main 当前进程会隔离旧指派并清除 ACK，但 V2 可能仍保持 `running`。进程重启后必须确认既有 `markStaleRunsInterrupted` 在任何普通工具准入前完成；本批未验证极端 I/O 恢复、设备断电或两者同时损坏的真实启动顺序。不能把这个剩余风险写成已彻底解决。
- **原审计复演**：在隔离的完整本地工作树按 [38 号](38-p01-p06-s02-cumulative-risk-audit-20261013.md) `replay-risk-probes.py` 运行，分别核对 INDEX/REMOUNT/WORKSPACE-WRITER/SETTLE 四项当前结果，保存新 SHA、原日志/新日志和哈希；不得仅因综合脚本退出码与旧版不同就宣称全部关闭。
- **真实 E05**：依 [37](37-p06-s02-local-acceptance-20261013.md)/[40](40-p06-fix02-renderer-write-fence-20261014.md) 对最新 HEAD 做真实 Electron 关页/重进后迟到回复复验；本次没有运行真实 Electron。
- **P06 E03/E04/完整 E06** 与 P02 扫描 PDF、跨 OS/LIVE、P05 真实中心 Relay 和独立 Pocket 均仍存在原阻断。P04-TECHDEBT-01 tombstone + FIX-01 owner journal 的永久留存/容量风险原样保留；不以不安全 TTL/GC 消除。
- **建议后续阶段**：`P06-RECHECK`（FIX-01～03 四项原审计精确重放 + 真机 E05 + E03/E04/E06），以新旧实机/进程日志签收；不自动开始 P07/P08。

**停点：FIX-03 CODE/CONTROLLED PASS 7/7，P06-S02 NOT ACCEPTED，P06 PARTIAL，PR Draft/Open/未合并。**
