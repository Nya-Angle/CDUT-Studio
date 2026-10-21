# 44｜P06-RECHECK 独立风险复演、E05/E03/E04/E06 实机门禁（2026-10-14）

> **结果：R0 完成；R1 精确旧探针实际 3 PASS / 1 FAIL（原脚本 exit 1）+ 等效真实 Hook 写入 2/2 受控 PASS；R2/R3 真实 Electron/provider 未运行；R4 代码 SHA 960163c7 四套标准 CI SUCCESS、独立旧审计 workflow 按真实失败为 FAILURE。P06-S02 NOT ACCEPTED、P06 PARTIAL、LIVE-07 PARTIAL；PR #21 Draft/Open/MERGE NO-GO。** 本次没有把 38 号历史失败改为通过。

## 1. R0：冻结远程事实与边界

- 工作仓库：Fuck-GH-Admin/cdut-studio-review-agent；仅工作分支 `feat/review-owned-background-sessions`，PR #21 Draft/Open；接手 HEAD `5a7ebfe077b0844f4c195e2980987b1073baa934`，四套 CI：PR #38536846954、D2 #38536846966、Baseline #38536847093、focused #38536847098 全 SUCCESS。
- 本批代码/受控复演冻结 SHA：`960163c785d7ccf0eb2b6a6a6ca51161bfc547c4`；自动化使用 GitHub-hosted ubuntu-latest、Bun 1.4.0、Node 22。`960163c785d7ccf0eb2b6a6a6ca51161bfc547c4` 的 PR CI [#38538206707](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538206707)、D2 [#38538206815](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538206815)、Baseline [#38538206639](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538206639)、focused [#38538206827](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538206827) **全部 SUCCESS**；PR 全仓 **3883 pass / 5 skip / 0 fail，3888 tests / 442 files，16115 expects**；包含 Typecheck / boundaries / skin / Electron main+preload+renderer build。
- 工作环境的 GitHub 连接器支持源码与 CI 读取及分支写入，但当前执行端没有可以授权启动 Pi/provider 的本机图形会话；因此没有运行真实 Electron E05/E03/E04/E06。不将受控 SSR/IPC 当实机。
- 对已完成 FIX-01（9/9）、FIX-02（5/5）与 FIX-03（7/7）不重复重做；仅补独立 2 项 Hook/Controller 生产函数体竞争断言。原 37/38 旧失败、39/40/41 独立受控冻结记录未删除。

## 2. R1：四项精确旧审计探针与证据

运行新的独立 CI [#38538200712](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538200712)；此 workflow 是 **FAILURE（符合旧工作区注入真实非零结果）**，不是全部绿灯。命令和完整日志/exit JSON/UTC/文件 SHA-256 在 [真实 artifact #11881142752](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538200712/artifacts/11881142752)（GitHub artifact retention 30 天）。该工作流跑的是冻结 `960163c785d7ccf0eb2b6a6a6ca51161bfc547c4` 的原 `replay-risk-probes.py` 与未修改的原 `scope-risk-audit.probe.ts`。此前初跑 [#38537687762](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38537687762) 因 wrapper 继承 `bash -e` 在原脚本退出 1 时未生成末尾汇总，已修采集器并**保留首次 FAILURE**；中间补采集 [#38538001585](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538001585) 亦保存红灯和证据。

| 原审计编号 | 本 SHA 原脚本 JSON | 注入命中/验收解释 |
| --- | --- | --- |
| `AUDIT-P03-P05-INDEX-01` | PASS | 损坏原索引并从缺 owner 的 `.bak` 恢复，实际普通 guard 继续 deny、远程事件 false、私有路径 true；**受控有效**。低层 JSONL getter 仍可直接读合成文本，不把它当普通入口许可；真实 Electron/远程灾难恢复 NOT-RUN。 |
| `AUDIT-P06-REMOUNT-01` | PASS | 真实 Controller/Jotai 的旧页慢回读不能覆盖新运行，run 与 running 状态保持；**受控有效**，并非 GUI。 |
| `AUDIT-P06-WORKSPACE-WRITER-01` | **FAIL** | `apiReads=1`，期望 `run-pi-workspace-next`，实际 `run-pi-workspace-old`。旧探针用裸 `store.set` 假装新写入者，未调用 FIX-02 的共享 `beginWorkspaceCaseWrite`，其迟到 Hook 保持可提交资格；**保留真实 FAIL，但该旧写入注入不再等价于新 Controller/Hook 生产写入者**。不能伪造原探针 PASS，也不能直接用此非等价失败认定修复无效。 |
| `AUDIT-P01-P06-SETTLE-01` | PASS | 原脚本把现有指派 JSON 本体 `chmod 0400`；FIX-03 已改经目录中的 `.tmp` + rename 原子写，此操作**没有证明真正制造 revoke I/O 故障**。原脚本 PASS 仅代表正常收尾，**故障注入判定 INVALID**。 |

- 原脚本总退出码 **1**；其 `controlled-protection` 退出 1、独立 `settlement-standalone` 退出 0；`typecheck` 退出 0，聚焦测试退出 0，**36 pass / 0 fail / 145 expects / 4 files**。新文件 `review-workspace-recheck-independent.test.ts` 2/2 在 *真正 Hook refresh* 和 *新 Controller/新 Hook refresh* 触发 `listRunsV2` 后重演晚到旧回复，至少两次实际 API witness，保持新 run；属 **受控等效 2/2 PASS** 而非 Electron E05。
- FIX-03 同次正式聚焦测试中的 EACCES **真正命中** `writeJsonFileAtomic` 对 `review-agent-assignments.json.tmp` 的 `open`：`EACCES errno -13`，且断言当前进程 deny、持久 `revokedAt` 未确认，不吞失效。这是复演已有真实受控测试而非磁盘 ENOSPC；另有 EISDIR、损坏 JSON/正常成功撤销/旧工具拒绝与普通指派正例。**ENOSPC、双持久状态失写、断电并重启恢复仍 NOT-RUN**。

### R1 固定证据 SHA-256（来源：artifact 内 `file-sha256.json`）

| 文件（相对 artifact 根） | SHA-256 |
| --- | --- |
| `focused.log` | `b53386598db8145a2cce147c3b12adc7345d635a65aafbd702513f626ad5ba7d` |
| `original/controlled-protection.log` | `fd89ba5aa78cf4927ea926d0adc60282ec6f06621f9efb3a890c843ff34945b8` |
| `original/controlled-protection-facts.json` | `e83b2732e238c75179c8d4dffe071372f81e7ee82bd8fcb7eea5e51517ce5ebf` |
| `original/settlement-standalone.log` | `7f4b85bb84aa2ed80dc53d43071997282574bda65597d84ec6b5607fa0f48efb` |
| `original/probe-commands.json` | `692387a51b941d47c433767790da22d8a2809583dc166f4954757280b01e477a` |
| `original-risk-replay.log` | `1114dc9d31fb7da326147071f3eb7ffa4186e6ed04c1fe03d1fb633c46eadaeb` |

注意 manifest 对原始日志做 SHA-256；manifest 自身在 artifact 中，30 天保留期过后应由维护者永久归档脱敏证据，不用截取几行日志冒充原件。临时测试的随机合成 ID 仅用于内部运行，不在本文传播用户 profile 或真实材料。

## 3. R2：E05 真实 Electron 跨页旧回复（NOT-RUN）

- **历史事实**：37 号真实 Electron/DeepSeek 在 `ef9074e3` 下 E05 **FAIL**；真实 Main 新 run accepted/running，旧 Main `listRunsV2` 迟到回执将 Jotai 回退旧 run/preparing，截图与时序保留在 `acceptance/p06-s02-local-20261013/runtime/`。本次未启动真实 Electron，不能把 FIX-02 的 5/5 或新 2/2 当真实 E05 PASS。
- **实机入口**：固定待验收的完整 HEAD；独立 Linux Xvfb 1600×1000 / Vite 5176 / 仅 127.0.0.1 CDP 9222；独立 `PROFER_CONFIG_DIR`、`PROFER_USER_DATA_DIR`，合成案卷与授权现有 Pi provider。依 37 号与 36 号 QA 启动路径，先见证旧 Main `listRunsV2` 真响应但延迟交付 → 实际关闭/卸载审核子页 → Main 启动且保留新轮 `accepted/running` → 重进审核页 → 释放旧回复 → 比较 Main V2 与 Jotai `runId/status/phase` 始终为新轮，并验证旧错误/stop feedback 不复活。保留真实事件时间戳、Main 与 Jotai 脱敏摘要、截图/录像 SHA256、失败退出码和最终停止清理。
- **签收**：当前 **NOT-RUN**；仅当真实 Electron GUI/provider/旧回复交付链执行并取得证据才能改 PASS/FAIL。无模型授权不能向生产 executor 注入。

## 4. R3：E03/E04/E06（全部存在未完成门禁）

| 项 | 本次结果 | 下一次可复验操作/必需证据 |
| --- | --- | --- |
| E03 | **NOT-RUN** | 在真实 Main 同轮 stop Promise **仍 pending** 的窗口发 restart，实际见证 busy 拒绝，释放 stop 后立即 restart 成功；记录两个 Promise 时序、ACK、V2 run/assignment、拒绝日志和旧 stop 不伤新轮；未命中则 NOT-RUN。 |
| E04 | **NOT-RUN** | 仅在授权隔离的真实执行链以可控 executor 迟到 outcome 模拟旧轮完成/错误；必须确认新轮 Main V2 不回退、旧指派拒止，记录注入点、调用次数和 V2 前后账本。无授权不碰真实 provider。 |
| E06 | **PARTIAL（沿用 37 原真机普通 Pi 子集）/ 本批新实机 NOT-RUN** | 对普通 Pi、Claude 的 create/list/meta/send/stop/权限/工具/预览/恢复，对原批量 A/B/C 与 Pocket 及桌面平台逐项复测；每个子项分别记录实际 PASS/FAIL/NOT-RUN，不以全仓单测或原 DeepSeek 子集覆盖全部矩阵。 |

## 5. R4：测试、交接与不放行

- 新增 R1 独立 workflow 与新的两个自动化真正写入者回归测试；**没有修改 FIX-01/02/03 的生产代码**，也没有覆写旧 37/38 归档。
- `960163c785d7ccf0eb2b6a6a6ca51161bfc547c4` 的四套标准 CI 全绿；PR CI 全仓 **3883 pass / 5 skip / 0 fail**。新独立风险 workflow **FAILURE**，因为原 38 脚本仍有非等价写入探针 FAIL，已保留日志、退出码与事实；它不是隐藏失败的绿色状态。文档本身产生新提交时，需对文档 HEAD 单独复核 CI 才能宣称同 SHA 通过。
- 整体状态 **P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / MERGE NO-GO**。历史 37 E01/E02 真实 2/2 PASS 不改写；历史 E05 FAIL 不覆盖；38 旧 0/4 FAIL 属旧 SHA。R2/实机门禁未完成时不得进入 P07/P08。
- P05-RELAY-ROUTE-01 生产中心多 viewer/可信 ticket **BLOCKED**；P05-POCKET-FIFO-01 独立 Pocket 补丁 **PATCH READY / TARGET NOT-RUN**。P04-TECHDEBT-01 永久 ID-only tombstone 与 FIX-01 `review-owner-ids.log` UUID journal **不 GC、不 TTL**，容量/迁移/冷启动风险仍要监测；未完成 LIVE-01～08 的原子项继续保留。
- 下一可执行工作编号：`P06-RECHECK-LIVE`，在真实授权本地 Electron 环境继续 **R2 E05、R3 E03/E04/E06**，并专项 ENOSPC/双持久化失败重启验证；不要把当前受控结论升级。PR 保持 Draft/Open，不合并。
