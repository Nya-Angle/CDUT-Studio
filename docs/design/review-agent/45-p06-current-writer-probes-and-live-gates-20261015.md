# 45｜P06-RECHECK-R1B：旧探针归档与当前生产写入者独立门禁（2026-10-15）

> 分支：`feat/review-owned-background-sessions` / Draft PR #21。接手前 HEAD：`b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027`。**本报告绝不把旧红灯改写成绿灯。** 当前新门禁以真正 Hook/Controller 执行路径为准，旧 38 号失败与故障探针失效证据原样保留；远端 CI 尚待新 HEAD 实际核对。**真实 Electron/Pi 本轮仍 NOT-RUN。**

## 1. R0 最新源与受控边界

旧 R1 报告见 [44](44-p06-recheck-independent-acceptance-20261014.md)，原历史完整报告见 [37](37-p06-s02-local-acceptance-20261013.md)/[38](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。原始失败事实：
- `AUDIT-P06-WORKSPACE-WRITER-01` 精确原 38 脚本 FAIL：期望新 run，但得到旧 run；其“新写入者”以裸 `store.set(reviewWorkspaceRunsByCaseAtom)` 伪造，并未执行新的生产 `beginWorkspaceCaseWrite`，所以不等价。
- `AUDIT-P01-P06-SETTLE-01` 原脚本 PASS，但只对 `review-agent-assignments.json` 文件 chmod；现代代码原子写经 `.tmp` 和 rename，故旧 PASS 并未证明有意制造过 I/O 错误；**fault-injection = INVALID**。
- INDEX-01 的备份恢复和 REMOUNT-01 的旧 Controller 新 Controller 生产路径已受控 PASS。FIX-03 正式 EACCES 测试曾真正命中 `.tmp` 并 fail-closed；仍缺真实 ENOSPC 与双失写重启。
- 最新 HEAD 已出现 `scripts/qa/review-live-{e05,races,e06,io,...}`、`review-startup-io-recovery.p06.test.ts`、Pi permission 接线补丁。**脚本存在不等于已运行；不把这些不同来源的本地改动重新包装为已通过的实机验收。**

## 2. R1B 新增的生产等效独立反例矩阵

文件：`apps/electron/src/renderer/components/content-review/review-workspace-recheck-independent.test.ts`。原两项保留，加两项，不修改生产 Hook、Controller 或 shared token，不移除原旧探针。

| Witness | 真正调用的生产写入链 | 最终必需断言 |
| --- | --- | --- |
| `R1_EQUIV_HOOK_CONTROLLER` | 旧 React Hook 慢 `refresh` → 新 Controller `refreshBackgroundReview` | Jotai 新 run、execution=running；旧返回不可覆盖 |
| `R1_EQUIV_HOOK_HOOK` | 旧 Hook → 新 Hook，两者使用同一 Jotai Store | 新 run 保留，两个实际 IPC reads |
| `R1_EQUIV_CONTROLLER_HOOK` | 旧 Controller → 新 Hook | 新 run 保留；Hook 自身不写 execution 槽，旧 Controller 迟到也不得复活旧 execution 状态 |
| `R1_EQUIV_DELAYED_VALIDITY` | 旧 Hook 已取得旧 run，但卡在 `getWorkspaceRunValidityV2` → 新 Controller 完整提交 → 旧 stale 迟到 | 新 run/status 与 `runStale=false` 不被旧结果污染，验证第二个异步竞态边界 |

这些是 **真实代码函数体/Jotai + 合成可控 IPC**，不是 Electron GUI/真实 Pi provider。

## 3. CI 双轨及防“假绿”策略

自托管 `[self-hosted, Linux, X64]` 工作流 `.github/workflows/p06-recheck-independent.yml` 每次严格执行：

1. `typecheck`、已有 `focused`、单列的 `current-writers`（上述四项）**退出码必须全为 0**。
2. **完整执行未修改的** `replay-risk-probes.py`：原四个 verdict、stdout、exit 0/1、时间、源 SHA 和 SHA256 存工件；不篡改原脚本以求绿灯。
3. 后处理验证四项 ID 完整，INDEX/REMOUNT 保持 PASS、旧 SETTLE 冒烟 PASS 但故障注入判为 INVALID；若旧 WORKSPACE 仍 FAIL，仅当 `actualRun=run-pi-workspace-old`、`expectedRun=run-pi-workspace-next`、`apiReads>=1` 精确重现已知非等价场景时允许作为**历史报告中的失败**存在；未知/扩大的旧失败绝不静默豁免。原退出码必须与四项判定一致。
4. 四个明确 `R1_EQUIV_*` witness 必须在独立当前测试日志中出现。缺失任何一个则 workflow FAIL。最终测试工件清楚区分 `CURRENT_WRITERS=PASS` 与 `LEGACY_VERDICT=FAIL`、`SETTLE_FAULT_INJECTION=INVALID`。
5. 该安全门禁若 SUCCESS，**仅代表现行独立写入者受控通过与历史审计完整归档**，绝不意味着原 38 号审计全 PASS 或 E05 实机 PASS。不得篡改 37/38 首败归档。

CI 结果登记（**在代码提交 `7132ca65` 上已精确复核，见下方原日志和 PR**）：
- 初次新增独立用例版本 `3227bc715fc99005d54495967dbcbe8b277c8295`：独立 [CI #38600505432](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600505432) **FAILURE**，`typecheck=0`，`focused=1`（38 pass/1 fail），`current-writers=1`（3 pass/1 fail）。新增 Controller→Hook 错误预期 `executionByCase.status=running`，但 Hook 不写这个槽；当时 **新 run 已正确保持**。这是探针职责误判，未改生产代码。
- 新代码 SHA：`7132ca658ffc64c1f3bc44146ef9bddedae950e5`；[自托管 CI #38600843457](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600843457) **SUCCESS**；`typecheck=0`；`focused=0`，**39 pass/0 fail/4 files**；`current-writers=0`，**4 pass/0 fail/1 file**，四个 `R1_EQUIV_*` 真实 Hook/Controller witness 均到达。
- 原 38 号旧脚本 **不变**，三项原 PASS、一项原 FAIL，`original-risk-replay=1`，完整原始 verdict/exit 精确一致。原 `SETTLE` PASS 故障注入无效（只 chmod 本体），独立真实目录级 tmp EACCES 仍由正式测试覆盖。
- 工件：[artifact #11913746159](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600843457/artifacts/11913746159)；`current-writers.log` SHA256 `33dc2e1e8c51505b37dc096a0b75e677ff982b7c2a5c3fe16017b07ca2b90496`；`focused.log` SHA256 `b1b092720e60ec646d8fba4de23faf0c1c24433344592a0204781f480045b23a`。
- 标准六套 CI 对 `7132ca65` 状态：**PENDING（不预记 SUCCESS）**；待逐项核验。真实 E05/E03/E04/E06/ENOSPC/双 I/O+重启仍 **NOT-RUN**。

## 4. R2/R3 真实门禁与风险限制

真正下一步为 `P06-RECHECK-LIVE`：采用已存在的 `scripts/qa/review-live-*`，先审查与调试 **隔离授权** profile、xvfb/CDP 127.0.0.1、真实 Pi/provider 及 Main/Jotai 时序证据；不借 GitHub Actions 自动拿用户主 profile/密钥，不把真凭据上传 artifact。按 **E05 → E03/E04 → E06 → ENOSPC + 双失写/重启** 执行（已运行子集逐项注明），保留合成 UI 录像截图 SHA256、Main/Renderer V2、原始退出码、用户隐私脱敏。缺授权或缺实际可执行环境一律 NOT-RUN。

真实 E01/E02 历史 PASS 仅对旧 SHA 有效；E05 旧 FAIL 不被本轮受控测试抹除。E03/E04 完整 E06、Pocket/Relay/跨平台继续阻断，P05、P04 永久 tombstone/owner journal 安全限制不变。

## 5. 阶段签收

**P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / PR #21 Draft/Open/MERGE NO-GO。** 不进入 P07/P08、不升级用户隐私权限、不把 CI 成功替代真实 Electron。
