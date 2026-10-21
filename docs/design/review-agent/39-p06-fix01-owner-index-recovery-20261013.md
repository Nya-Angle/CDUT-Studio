# 39｜P06-FIX-01 审核 owner 索引回滚安全修复及独立验收门禁

> 2026-10-13；**FIX-01 CODE / CONTROLLED PASS 9/9**。38 号原始 AUDIT-P03-P05-INDEX-01 失败证据继续保留，原独立探针重新运行及真实 Electron 故障恢复 **NOT-RUN**；其它三项风险仍 **OPEN**。P06-S02 **NOT ACCEPTED**、P06 **PARTIAL**，PR #21 **Draft / Open / MERGE NO-GO**。

## 1. 原因与修复

原 `agent-sessions.json.bak` 保存**上一次写入前**的元数据。审核 owner 新建后主索引发生损坏，`readJsonFileSafe` 恢复的合法旧备份可能不含最新 owner；普通 Agent 身份校验、Remote event 和私有路径判断继而误把该 ID 当普通会话。见 [38 号原失败审计](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。

本批只修改现有身份边界，**没有重造 Runner、Session DB、权限服务或事件总线**：

- `agent-session-manager.ts` 在配置根中持久化 **`review-owner-ids.log`**：只追加审核 owner UUID，不包含案卷、文本、运行与模型信息。owner 创建遵循**安全 UUID append+fsync → 原子写会话索引**；安全日志不能确认持久化时拒绝创建。这个 deny 记录不可按旧 `.bak` 回滚。
- 读取可用旧索引时，把其中活动 owner 和原 P04 删除 tombstone ID 回填安全日志。旧索引缺 `owner` 或后续回退不再将已经见过的 owner ID 降级为普通。索引三份副本全坏、结构非法、日志截断或读写异常均遵循 **fail-closed**，不再按空普通索引继续授权。
- `remote-file-access.ts` 把日志文件本身纳入普通文件/预览 deny，`review-tombstone-index-scale.p04.test.ts` 将历史“删掉 owner 字段可变普通”的旧断言改为**永不降级**，保留正常普通会话正例与 100k 原性能测试。
- 本文 journal 只是**永久身份拒绝证据**，绝不是案卷轮次的 `runId/assignmentId` 工具授权。原 P04 tombstone 安全不 GC 决策不变。

## 2. CI 与九项正式受控回归

[代码 `c8c84681`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/c8c84681f201f8911731b50b9f991bd51cddb9fa)：新增 **9/9 PASS**；全仓 **3869 pass / 5 skip / 0 fail**（3874 tests、440 files），Typecheck、边界和 Electron main/preload/renderer 构建通过。四套 CI **SUCCESS**：[PR #38421280083](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280083)、[D2 #38421280011](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280011)、[Baseline #38421280010](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280010)、[focused #38421279980](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421279980)。

`apps/electron/src/main/lib/review-owner-index-recovery.p06-fix01.test.ts` 已加入默认全仓测试，不再仅作为独立未执行的审计快照。九项均由 CI 实际执行：

| 场景 | 结果 |
| --- | --- |
| owner 创建前的合法旧 `.bak` 回滚，普通校验/远程事件/私有路径拒绝，普通会话正常 | PASS |
| tombstone 从索引消失时仍永久 deny | PASS |
| 合法索引被剥掉 owner 字段后仍 deny | PASS |
| 主文件/`.tmp`/`.bak` 三副本损坏时拒绝未知普通身份 | PASS |
| **新 Bun 子进程**从磁盘读取旧索引仍拒绝遗漏 owner | PASS |
| 身份日志不可走普通文件预览，正常工作区可用 | PASS |
| 旧版有效索引 owner 自动回填后经恢复仍 deny | PASS |
| 日志非可写普通文件时 owner 创建失败，不留下新普通索引记录 | PASS |
| 日志存在截断非法行时 fail-closed，恢复后普通 ID 正常 | PASS |

首次失败保留：[PR #38419430520](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38419430520) 测试夹具覆写仓库 Electron mock，模块导出不全；[PR #38420059406](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38420059406) 生产恢复器删除了损坏 `.tmp`，测试清理二次 `unlink` 导致 ENOENT。两次仅修测试夹具、未放宽生产守卫；[PR #38420499998](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38420499998) 7/7 通过，最终 `c8c84681` 增加跨进程与日志路径两项，**9/9 PASS**。

## 3. 边界、容量和不能关闭的项

- **安全结论限定于受控回滚**：普通 Main 入口使用的 `assertOrdinaryAgentSession`、Remote event predicate、私有路径 predicate 正反例已覆盖。直接调用内部低层 SDK JSONL getter 本身不是“普通入口已放行”的充分证明；本批未在真实 Electron/Pocket/Feishu/网络执行完整 E2E 破坏索引验收。
- **历史已丢的身份不可凭空重建**：如果升级此保护前，所有可用索引和 tombstone 已经失去某个 owner 且没有 journal，本补丁无法从无记录状态推断它是审核会话。这类旧损坏 profile 必须先隔离并单独验证，不能承诺普遍自动恢复。
- **新安全日志永久增长、首次升级有成本**：原 P04 的 100k 索引体积 **4,400,288 bytes** 历史不变，100k ID-only journal 是额外持久负担。当前 CI Linux/x64、512 样本中，100k 冷读含回填约 **90.346 ms**，热判定 p50 **0.0083 ms**，索引更新 **15.986 ms**；旧 P04 冷读历史约 16.871 ms，属于不同运行，**不能作为严格同机 A/B 倍数**。首次迁移性能与磁盘增长需后续重复压测；不准为性能擅自删 journal/tombstone。
- **原审计重放**：38 号 `0 pass / 4 fail` 是修复前 `ef9074e3` 的事实，**不改写**。原 `replay-risk-probes.py` 在当前 SHA 精确复跑仍待本地执行；脚本另含三项尚未修复失败，整体非零依然预期，需逐 probe 看最新结果。
- **其他 OPEN**：`AUDIT-P06-REMOUNT-01`、`AUDIT-P06-WORKSPACE-WRITER-01`、`AUDIT-P01-P06-SETTLE-01` 未处理。真实 E05 FAIL、E03/E04 NOT-RUN、E06 PARTIAL、P05 Relay BLOCKED/Pocket PATCH READY TARGET NOT-RUN、P07/P08 NOT-RUN，PR NO-GO 均不变。

## 4. 下一独立批次

**P06-FIX-02**：针对跨卸载 Controller 与 Workspace Hook 两条旧 Jotai 写入路径使用共享有效代次/提交资格，先复现 38 号旧负例，再修复并加入正式 CI，最后真实 Electron 复验 E05。**P06-FIX-03** 才处理授权撤销 EACCES/ENOSPC 与收尾 Promise。每次独立冻结 SHA、CI、失败证据与 29/30/31 台账；未经用户要求不开始 P07、解除 Draft 或合并。
