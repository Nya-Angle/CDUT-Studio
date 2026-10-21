# 31｜后台案卷审核：新会话接手和小批次执行提示词

## 当前正式下一批：P06-RECHECK-LIVE-02 / L02-00（2026-10-15）

以 [47｜实测驱动方案](47-p06-evidence-driven-followup-plan-20261015.md) 为顺序合同，[27](27-background-review-session-proposal.md)为架构边界，[29](29-background-session-preflight-audit.md)为唯一LIVE台账，[46](46-p06-recheck-live-local-acceptance-20261014.md)为已完成实机证据。历史下方“下一批P06-RECHECK-LIVE-02”是46号完成时的快照，不优先于本节。

```text
宝宝，接手CDUT Studio后台审核Draft PR #21的P06-RECHECK-LIVE-02 / L02-00。先查远端HEAD、自托管CI、并发worktree，完整读47实测驱动计划、46实机报告、29 LIVE-01～08、27架构边界与28历史产品路线。
本批唯一任务：独立恢复A/B/C尤其三案C的execution-failed所对应的真实V2、assignment、模型回执、工具、材料版本、批次账本，区分CORRECT_DENIAL/BUSINESS_INCOMPLETE/EXECUTION_FAILURE/HARNESS_INVALID/UNDETERMINED。创建可追溯逐案事实与缺口矩阵、初始失败证据、raw/public哈希及L02-01～04准入条件，不猜根因、不改Gold/权限/SourceRef，不修改生产代码。
已通过的E05/E03/E04/ENOSPC/两次真实重启子集不作为本批再次完整重跑的成绩，不重复实现FIX-01～03。同步29台账、30/31交接及PR；缺证据用NOT-RUN或UNKNOWN。P05 Relay BLOCKED、Pocket TARGET NOT-RUN、P04永久tombstone/journal禁止无证明GC，P06-S02 NOT ACCEPTED / P06 PARTIAL / Draft/MERGE NO-GO，不进入L02-01/P07/P08。
```


## 最新继续提示：P06-RECHECK-LIVE-02（本地实机之后）

并发7132新增两项正式写入者测试完整保留后，本地整合 `9cc92bb0e6cec8d2698f5d712a71ecc8b77256e4` 全套22门禁再次exit0：**全仓3894pass/5skip/0fail（3899tests、445files、16161expect）、聚焦89/89（345expect）、batch143/143**；生产与实测b95无差异。最终发布HEAD CI按PR最后验收评论查询，新版current gate可SUCCESS而原legacy脚本依旧exit1，两者分开登记。

```text
接手 cdut-studio-review-agent Draft PR #21 的 feat/review-owned-background-sessions；先查最新远程HEAD、工作树和真实CI，优先隔离checkout。读取46本地实机报告、29唯一台账、30交接与本节；旧37/38/44首败保留。
本轮最终生产源码 b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027，0.15.161。E05真实旧IPC响应确实交付、新Main/Jotai不回退9断言PASS；E03真实stop Promise闸门pending/busy/释放restart8断言PASS；E04真正旧outcome闭包两次迟到调用7断言PASS。真实ENOSPC/双持久化+owner失写/故障保持真实重启拒止/可写再重启failed落盘8/5/2/3断言PASS，不用再重新开发FIX-01～03。
实机选定16场景77断言PASS，普通Pi5布尔判词；全仓3892pass/5skip/0fail（3897tests、16150expect）、聚焦87/87、batch143/143；b95四套标准CI SUCCESS，独立原风险 #38597799385 FAILURE（裸store旧探针仍FAIL，脚本exit1）。最终证据文档HEAD与其CI必须另查PR最终评论，不借不同SHA绿灯。
生产已最小修四个真实反例：启动失写后的旧授权恢复、Pi遗漏canUseTool、outcome终态失写立即隔离、case/group无subject的错误fallback。公开raw/public哈希在独立acceptance目录，真实原日志在本机private目录；密钥/profile/transcript/private binding未上传。Main/daemon已停止，8MiB卷已卸载，新会话重新建隔离环境。
下一批仅P06-RECHECK-LIVE-02：完整E06原A/B/C正式人工处置/补件回流/代批正向与幂等、Claude授权配置、严格扫描PDF模型原件回执/PNG/压缩、双窗口/fork/自动恢复与其他未验LIVE。当前普通PDF/Office预览、普通会话跨进程恢复、批量队列与B/C拒止子集PASS不能扩展为完整E06；三案C真实execution-failed需如实保留/重试，不放宽工具或引用门禁。
P06-S02 NOT ACCEPTED、P06 PARTIAL、LIVE-07 PARTIAL、Draft/Open/MERGE NO-GO。P05-RELAY-ROUTE-01 BLOCKED、P05-POCKET-FIFO-01 PATCH READY/TARGET NOT-RUN，P04永久tombstone/FIX-01 owner UUID journal禁止无安全证明TTL/GC。只改本PR分支，保留并发提交，不force push、不undraft/merge、不进入P07/P08、不写独立上游Pocket或原项目。
```

下面提示为相应日期的历史事实；当前以46/29和最新HEAD/CI为准。

## 2026-10-15｜P06-RECHECK-R1B：旧探针归档与有效生产写入者门禁

见 [45｜现行独立写入者矩阵和 CI 分流验收](45-p06-current-writer-probes-and-live-gates-20261015.md)。2026-10-15 接手分支 `b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027`，此前新增本地真实 Electron/Pi 专项驱动和三笔生产安全补丁，勿因旧 44 号的历史 SHA 覆盖最新代码。

本批 **仅进行真实 Controller/Hook 独立竞争矩阵增强（原独立 2 例→4 例），及 CI 原审计证据/现行安全门禁分流**：
- 原 `docs/design/review-agent/acceptance/p06-s02-local-20261013/audit/*`、`replay-risk-probes.py` **不修改**；仍完整运行、保存真实 JSON/verdict/exit/log/hash。其裸 Jotai `store.set` 导致 WORKSPACE-WRITER FAIL 是 **历史原脚本失败，不自动推断生产写入失败**；其 SETTLE `chmod` 探针未命中原子 tmp 故障，原 PASS **故障注入无效**。
- 有效当代门禁要求独立真实 Hook→Controller、Hook→Hook、Controller→Hook，及旧 Hook `getWorkspaceRunValidityV2` 迟到这 **4 个生产写入者/双异步边界** 的显式见证标记和 PASS；另严格要求 typecheck/focused PASS、原四条事实 ID 完整且原 exit/verdict 一致。未知原脚本失败不能放行。
- 上述验收的 **本批代码/CI 结果以新提交与真实 run 为准**；若尚未取得，仍记 `PENDING`，不得预记 PASS。旧 37 E05 实机 FAIL、E03/E04/E06 不完整，真正授权 Electron 重跑仍 **NOT-RUN**；新 `scripts/qa/review-live-*` 已入仓但**存在脚本不等于获得执行证据**。禁止未经授权将 provider/用户密钥复制到公共工件或通用 CI；现场执行应使用独立本机 profile、脱敏日志、真实 CDP/主进程与 provider witness。
- 状态不变：**P06-S02 NOT ACCEPTED；P06 PARTIAL；LIVE-07 PARTIAL；PR #21 Draft/Open、MERGE NO-GO。** P05 Relay/Pocket 外部阻断、P04 owner/tombstone UUID 永久保留（不安全 GC 禁止）、P07/P08 未启动。


**R1B 自托管实测确认（受控代码 `7132ca658ffc64c1f3bc44146ef9bddedae950e5`）：** [独立 CI #38600843457](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600843457) **SUCCESS**，本地 `ghrunner-cdut-studio-review-agent`；`typecheck=0`、`focused=0`（**39 pass/0 fail**）、`current-writers=0`（**4 pass/0 fail，4 个 witness 均到达**）、未改原 38 号 `original-risk-replay=1`（**3 PASS/1 FAIL**，WORKSPACE-WRITER 仍得旧 run，与原始注入一致）。旧 SETTLE `chmod` 原脚本 PASS 但**注入 INVALID**。校验源 SHA、原 verdict/exit、一致性和工件全部保存：[artifact #11913746159](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600843457/artifacts/11913746159)，`current-writers.log` SHA256 `33dc2e1e8c51505b37dc096a0b75e677ff982b7c2a5c3fe16017b07ca2b90496`，`focused.log` SHA256 `b1b092720e60ec646d8fba4de23faf0c1c24433344592a0204781f480045b23a`。首次 [CI #38600505432](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600505432) **FAILURE 保留**：新增 Controller→Hook 用例错误要求 Hook 写 executionAtom，实际 Hook 只写 workspace 投影；后在 `7132ca65` 更正为旧 Controller 不能复活旧 execution，未修改生产实现。**标准六套 CI 对这次代码 SHA 仍逐项核对，未完不记全绿。真正 E05/E03/E04/E06 与 ENOSPC、双故障重启本轮 NOT-RUN；P06-S02 NOT ACCEPTED、P06 PARTIAL、PR Draft/MERGE NO-GO。**

## 最新执行停点：P06-RECHECK R1 独立复演后（2026-10-14）

以 [44 号](44-p06-recheck-independent-acceptance-20261014.md) 和 29 号唯一台账为准。独立执行代码 SHA `960163c785d7ccf0eb2b6a6a6ca51161bfc547c4`，原 38 脚本 3 PASS / 1 FAIL、exit1（旧 WORKSPACE-WRITER 用裸 Jotai store.set，现已非生产写入者）；修正证据采集完整保留原 FAIL。新增真实 Hook 对 Controller/Hook 回归 2/2 PASS，聚焦 36/36 PASS；FIX-03 已有原子写 `.tmp` 目录 EACCES 真故障断言通过，原 chmod 文件本体旧 SETTLE 注入不再有效。标准四套 CI SUCCESS、全仓 3883 pass / 5 skip / 0 fail；独立原审计 CI #38538200712 保持真实 FAILURE。**不可以根据这些受控证据宣布真实 E05 PASS**。

下一步仅 `P06-RECHECK-LIVE`：在有授权真实 Pi 和隔离 Electron profile 的设备按 37/44 号复演 E05 → E03（真正 stop pending 时 busy）→ E04（授权可控迟到 outcome）→ E06 完整 Pi/Claude/批量/预览/Pocket 矩阵，并在可控设施验证真实 ENOSPC、双持久化失败后重启恢复；没有条件就 NOT-RUN。每项将 SHA、原日志、exit code、Main/Jotai V2 与证据 SHA256 追加 29 号。37 的 E05 FAIL 及 38 老 FAIL 保留；P05 Relay/Pocket、P04 tombstone+UUID journal 不安全 GC 禁令、LIVE、PR Draft/Open/MERGE NO-GO、P07/P08 不启动不变。

## 当前最新接手提示：P06-RECHECK（2026-10-14）

请优先使用 [43｜P06-RECHECK 正式提示](43-p06-recheck-next-session-prompt-20261014.md) 和 [42｜独立接手交接书](42-p06-recheck-independent-takeover-handoff-20261014.md)，再读 41/40/39/38/37/29。**不是重新实施 FIX-01**；当前云端已经完成 FIX-01～03 受控代码修复，下一步是独立复演与真实 E05/E03/E04/E06。历史下面的小批次提示仍为各冻结时间的实况，不代表现在的最新 HEAD。

## 当前接手提示：P06-FIX-03 之后（2026-10-14）

```text
接手 Draft PR #21 最新 HEAD，先读 41-p06-fix03-settlement-io-resilience-20261014.md，再读 40 号 FIX-02、39 号 FIX-01、38 号原独立失败、37 号 E05 真机首败和 29/30 号台账。FIX-03 冻结 b5f9db179b358d0405a1d0868133f11064edc93a；正式 7/7 受控 PASS，全仓 3881 pass / 5 skip / 0 fail，PR #38524782294、D2 #38524782315、Baseline #38524782350、focused #38524782373 SUCCESS。
权限撤销异常分三态：持久 revokedAt、仅进程内 pendingRevocations、V2 终态未确认。绝不把后两者写成持久化 PASS；EACCES 本地受控故障与 EISDIR、坏 JSON、ACK 前拒绝有正式回归，真实 ENOSPC/同时损坏/重启验证不充分。
下一批 P06-RECHECK，先精确执行 38 号原独立审计四项探针，保存当前 HEAD/环境/逐项原始报告与新旧差异；再在真实 Electron 隔离 profile 重跑 E05 及 E03/E04/完整 E06。不得仅拿 FIX-01 9/9、FIX-02 5/5、FIX-03 7/7 受控通过宣称 P06-S02 验收通过。
P05 中心 Relay BLOCKED、Pocket PATCH READY/TARGET NOT-RUN 不动，P04 tombstone/journal 不执行危险 GC，LIVE-07 PARTIAL、P06-S02 NOT ACCEPTED、PR Draft/Open/未合并、P07/P08 未启动。
```

## 当前接手提示：P06-FIX-02 之后（2026-10-14）

```text
先核对 Draft PR #21 最新 HEAD、四套 CI，读取 40-p06-fix02-renderer-write-fence-20261014.md、39 号 FIX-01、38 号原失败审计、37 号真实 E05 首败，以及 29/30 号台账。P06-FIX-02 冻结代码 414f20669b06513064ff9f84e9ccfb92f7a9001e，新增跨 Controller/卸载/真实 React-Jotai Workspace Hook refresh/apply 保护断言 5/5 PASS，PR #38496467696、D2 #38496467716、Baseline #38496467778、focused #38496467754 均 SUCCESS，全仓 3874 pass / 5 skip / 0 fail。
本轮代码级修复了 REMOUNT-01 与 WORKSPACE-WRITER-01 的已知路径，但原独立 replay-risk-probes.py 当前 HEAD 精确运行和真实 Electron E05 新轮次未复测，不可把旧 E05 FAIL 改为 PASS。FIX-01 已受控 9/9，但真实索引故障恢复尚未签收。
下个独立批次 P06-FIX-03：只修 review-pi-admission 中 revokeAssignment 写盘失败导致的未观察 Promise rejection / 后续内存清理跳过和授权未持久撤销；补 EACCES、ENOSPC、损坏 JSON、finish 故障与旧/新轮次权限准入负例。修前先阅读原 AUDIT-P01-P06-SETTLE-01 证据和真实调用链，先做故障注入，再最小修。勿放宽安全守卫、勿吞掉 durable failure、勿重建 Runner。
继续保留 P05 Relay/Pocket 外部阻断、P04 永久 tombstone/owner journal 容量与无不安全 GC 规则、LIVE-07 PARTIAL、P06-S02 NOT ACCEPTED、P07/P08 未启动、PR Draft/Open 不合并。
```


## 当前接手提示：P06-FIX-01 之后（2026-10-13）

```text
先查 Draft PR #21 的 HEAD/CI，读 39-p06-fix01-owner-index-recovery-20261013.md、38 号原审计、37 号真实 P06-S02 失败、29 号验收台账与 30 号交接。
P06-FIX-01 代码冻结 c8c84681f201f8911731b50b9f991bd51cddb9fa，新增审核 owner 永久 UUID-only deny journal、先持久后索引、坏备份/缺 owner/tombstone 仍 fail-closed。9/9 正式受控 PASS，PR CI #38421280083、D2 #38421280011、Baseline #38421280010、focused #38421279980 SUCCESS，全仓 3869 pass/5 skip/0 fail。原 38 号 0/4 FAIL 是旧冻结版历史，原离线脚本和真实 Electron 恢复尚未重新验收；三个剩余风险 OPEN。
下一小批 P06-FIX-02 只解决跨卸载 Controller 与 Workspace Hook 共享 Jotai 写入资格，复现 REMOUNT 与 WORKSPACE-WRITER 两条旧反例并加入默认 CI，实机 E05 复核。其后 P06-FIX-03 修收尾授权异常。保留 P04 永久 tombstone/journal 的额外容量风险、P05 中心 Relay/Pocket 阻断及 E03/E04/E06 未完成。不要重造执行器，不执行 P07/P08，不解除 Draft、不合并。
```

## 当前接手提示：P06-S02 本地实测与累计风险之后

```text
接手公开仓库 Fuck-GH-Admin/cdut-studio-review-agent 的 Draft PR #21。
先读 37-p06-s02-local-acceptance-20261013.md、38-p01-p06-s02-cumulative-risk-audit-20261013.md 及 29/30，核对真实 HEAD/CI。不要只读 main 或复用旧 A0 当双轮证据。
最终应用/驱动冻结 ef9074e367d2e7fda5955d8b0d6d9a4812836a6d，E01/E02 真实双轮 PASS，E05 关页重进旧回复覆盖新 UI FAIL；E03 未命中重叠、E04 没有实际 SDK 注入，普通 Pi 只有 IPC/provider 局部正例。
P01～P06-S02 累计复核有四项 CONFIRMED/OPEN：索引备份恢复缺 owner 后普通读/路径/事件放行；旧 Controller 跨卸载覆盖新页；Workspace Hook 另一路无屏障写缓存；收尾撤销写盘 EACCES 越出 Promise 且跳过清理。38 号有真正失败的可复跑保护断言，不把它们写成已知问题 PASS。
当前验收动作完成、S02 NOT ACCEPTED/P06 PARTIAL。后续按用户授权先最小修复四项，把正确保护断言加入 CI，复验 E05，再取得 E03/E04/完整 E06 证据。不重造执行框架，不自动推进 P07/P08。
只推送我们的公开仓库测试分支；不写 Nya-Angle/CDUT-Studio、不合并、不解除 Draft。P05 Relay BLOCKED、Pocket PATCH READY/TARGET NOT-RUN 保留；验证独立 Pocket 前额外读 patch 并核对目标 SHA。P04 tombstone 永久保留和容量风险不变。
每项记录真实 SHA、环境、命令、退出码、时序和日志哈希，保留首败；既有回归绿灯不能关闭新审计失败项。
```

> 本文件的提示词用于 **Draft PR #21** 的连续工程工作。它不替代仓库源码、CI 或 [27](27-background-review-session-proposal.md)/[29](29-background-session-preflight-audit.md)/[30](30-background-session-handoff.md) 文档。任何阶段完成与否以**当次 PR HEAD、实际 GitHub CI 和证据**为准。

## 历史接手提示（2026-10-13；A0 后、P06-S01 前）

```text
接手测试仓库 Draft PR #21 / feat/review-owned-background-sessions。
先读 34-pre-p06-main-a0-acceptance-20261013.md、29/30 与 32/33，核对真实 PR HEAD 和当次 CI。
Main start/read/stop、Renderer 后台 ACK 接线和本地 A0 已完成；冻结代码 14bc7d6c3625aaa6eec2675aa9ce4dc446475297。不要重复接线或重新设计 P05。
用户本轮只要求补齐 P06 前置并推送、不合并；本轮结束。后续用户授权继续时，下一批做 P06 的同案两轮、迟到旧 stop/失败回调及释放后重启负例，沿用当前 Main/V2/Pi，普通路径回归。
真实 Relay BLOCKED、独立 Pocket PATCH READY/TARGET NOT-RUN；没有验证 Pocket，勿关闭阻断。如果要验证 Pocket，额外阅读 P05-POCKET-FIFO-01 patch 并核对独立仓库 SHA。
LIVE 表中 A0 子集仅 PARTIAL；扫描 PDF、完整工具/PNG、压缩、跨窗/移动端、重启强杀删案和普通 Agent 实机矩阵尚未完成。保留永久 tombstone 的容量风险。
每批记录实际 SHA/命令/环境/退出码/日志/CI，更新 29/30/34 与 PR。保持 Draft/Open，不合并。
```

## P06-S01 之后接手（2026-10-13）

```text
接手 Draft PR #21 当前 HEAD，先核实 35-p06-s01-consecutive-rounds-acceptance-20261013.md、34 号 Main/A0、29 号唯一台账和 30 号交接。P06-S01 已受控通过：冻结代码 9851998a1b157c9d5924b9c6387b062838aa4475，三项新测试，PR CI #38358640242、D2 #38358640258、Baseline #38358640275、focused #38358640240 均 SUCCESS，全仓 3852 pass/5 skip/0 fail。
下一小批只做 P06-S02：在隔离的真实 Electron/Pi/合成案卷中逐项验证同案连续 update/restart、旧 runId stop、停止阻塞后释放、迟到旧错误/旧状态不能覆盖新轮；复核 Main/V2 ledger 与 UI 旧提示、普通 Agent 正例。无法授权安全模拟迟到回调的，明确 NOT-RUN，不声称生产 E2E 通过。针对实测缺陷最小修复，再跑新 HEAD CI。
保留 P05 中心 Relay BLOCKED 与 Pocket patch TARGET NOT-RUN，P04 tombstone 永久 ID-only 不 GC，LIVE-07 目前 PARTIAL。P06/P07/P08 和整 PR 未完全通过；不进行 P07、不解除 Draft、不合并。
```

## P06-S02 受控修补后的实机接手（2026-10-13）

```text
接手 Draft PR #21 当前 HEAD，先读 36-p06-s02-ui-race-and-electron-validation-20261013.md、35 号 P06-S01、34 号 A0、29 号唯一 LIVE 台账及 30 号交接。P06-S02 已完成 UI 异步状态 generation 守卫、旧 stop 迟到回执隔离和真实 CDP 双轮驱动，代码冻结 5d5e25e5db20bbe90a5f367481f3ca982b3162ad，新增 2/2 时序及 1/1 脚本静态合同 PASS，全仓 3855 pass / 5 skip / 0 fail，四套 CI SUCCESS。
本次没有真实 Electron/Pi 运行权；在本地全新隔离 profile 用已授权模型运行 scripts/qa/review-background-p06.mjs 的 E01（同 owner update）/E02（新 owner restart），并以日志、业务账本和截图逐项验收。真实 stop 释放期间 busy 竞态、迟到旧 onRunOutcome 与普通 Agent 实机矩阵需另外明确证据，不能从 mock 或脚本语法推断。
真实测试后按 29 号台账记录 PASS/FAIL/NOT-RUN、确切 SHA、时间/环境、失败根因及脱敏证据。继续保留 LIVE-07 PARTIAL、P05 中心 Relay/Pocket 阻断、P04 tombstone 安全留存；不自动转 P07/P08、不解除 Draft、不合并 PR。
```

## A｜历史首次接手提示（以当前接手提示与最新账本为准）

```text
宝宝，接手我们的 cdut-studio-review-agent「直接案卷审核 Pi 后台会话」项目，继续以前一个会话的工程进度，不要重新从头设计。

仓库：https://github.com/Fuck-GH-Admin/cdut-studio-review-agent
正在开发的 Draft PR：https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/21
分支：feat/review-owned-background-sessions
最近一次 P04-TECHDEBT-01 冻结代码 SHA 是 dccaf6ce96072eac9404c3957742555916bd62f1（PR CI #38273510150、D2 #38273510227、Baseline #38273510354 SUCCESS：3822 pass / 5 skip / 0 fail；热路径 Set + 索引失效与跨进程恢复 5/5）；P04-PATH-01 目标路径补丁冻结代码 SHA 是 7c5e003c5c1a01dc295e1ff0e4c6ce15e4da42f0（PR CI #38269830272 SUCCESS：3817 pass / 5 skip / 0 fail；D2、Review Baseline SUCCESS）；先前 P04-PATH-01 专项 `9eec2311` 的 9/9 仍为有效历史证据；P05-S05 历史冻结代码 SHA 仍是 88b941337749028ae3c51ff0db117c44ceb4d7aa；后续已有交接文档提交，必须以 GitHub 当前 HEAD 为准；这只是参照，不代表当前 HEAD，必须从 GitHub 重新核验。

开始前必须用 GitHub 连接器完整阅读下列 PR 分支内文档，不能只读 main：
- docs/design/review-agent/27-background-review-session-proposal.md
- docs/design/review-agent/29-background-session-preflight-audit.md
- docs/design/review-agent/30-background-session-handoff.md
- docs/design/review-agent/31-background-session-continuation-prompts.md
还要核对 PR 描述、最新 HEAD、实际 changed files 与 CI，针对下一批再阅读相关真实生产源码、测试和调用链。若文档与源码冲突，以当前源码/测试事实为准，同时指出并修正文档，不能凭记忆认定已实现。

现状：P01/P02 与 P03-S01～S03 已有受控测试；P04-S01 桌面主路径 8/8、S02 Tab 恢复/重开 7/7、S03 删除后 tombstone 5/5、S04 桌面 IPC/早到预览/旧队列 8/8 受控 PASS（全仓 3768 pass / 5 skip / 0 fail；D2 与 Review Baseline SUCCESS），PR #21 保持 Draft。P04-PATH-01 旧 9/9 与追加磁盘变更 5/5 PASS；P04-TECHDEBT-01 缓存 Set 及规模基准新增 5/5 受控 PASS（安全留存不 GC，容量随历史删除数增长），P04 整体仍因真实 Electron LIVE PARTIAL，P05-S01/S02/S03/S04/S05 已受控 PASS，P05 整体及 P06～P08 与真实后台 IPC/跨页 E2E 仍未完成。29 号文档 LIVE-01～LIVE-08 的八项实机验收均 NOT-RUN，必须留到最终统一验证，不可自动勾选。

P04-TECHDEBT-01 已完成本批受控性能修补与安全不 GC 决策；容量持续增长属已知风险，真实 LIVE 保持 NOT-RUN，详见 29 号。

最近已完成 P05 六批阶段级受控复核：代码 SHA ce992f90880ecde1954e925b63585692a085f621，PR CI #38284532497 / D2 #38284532492 / Baseline #38284532487 全部 SUCCESS，P05 六份专项 43/43 PASS，全仓 3830 pass / 5 skip / 0 fail。完整交接与本地手册见 docs/design/review-agent/32-p05-stage-acceptance-and-local-gates.md；Pocket 上游修复补丁 docs/design/review-agent/patches/P05-POCKET-FIFO-01-Profer-pocket.patch 已生成且源 hunk 匹配，但未应用/验证；生产 Relay 无服务端与授权票据，仍 NOT-RUN。本次接手优先解决 **P05-RELAY-ROUTE-01**（生产中心缺少服务端路由契约/授权多端证据）和 **P05-POCKET-FIFO-01**（独立 Pocket 客户端非匹配 ID 仍可 FIFO 错配），务必获取确切服务端与 Pocket 回归证据；若仍不可达记录 BLOCKED/NOT-RUN，不重复本地模拟以冒充真实中心路由。S05 已使用真实本地 LAN socket、模拟中心 Relay 与 mocked ticket 完成 8/8 受控 PASS，不重复已有工作。只能把真实运行证据标 PASS；无法接入生产或缺少中继端源代码需标 NOT-RUN/阻断。P04-PATH-01 的已枚举通用文件入口与四个 rename/move 最终目标路径受控 PASS（旧 9/9 + 新 5/5，共享生产变更函数实际操作测试；真实 Electron IPC NOT-RUN），但 A0、LIVE-01～08 真实 Electron/Pocket 仍待验；不做 Main IPC、P06/P07 或合并。

执行习惯：先看代码验证真实缺口，复用现有 owner、Session Manager、Tab/窗口现成机制，不另造会话系统。只改本批必要生产代码与测试，补已删除 owner 的异步事件/旧快照负例、可信 tombstone 的必要时序与普通会话不受影响的正反例。按实际冻结 SHA 查 GitHub CI（全仓、D2、Review baseline），失败必须修复后重跑，不能把未运行当 PASS。

每批结束必须更新 29 号文档的阶段状态、代码/CI SHA、通过/失败/NOT-RUN、P04 剩余入口及 LIVE-06 缺口；同步维护 27/30、PR #21 说明。不要改动 LIVE-01～08 的 NOT-RUN，除非真的取得对应实机证据。总结列出改动、测试证据、剩余风险、下一小批次建议；本轮完成即停止，不擅自推进 P05-S07、P06 或合并/解除 Draft。未经我明确验收，不合并 PR。

如果最新 HEAD 已包含本轮能力，先做差距核验，不重复造轮子；如果无法访问 GitHub 或 CI，要明确写未验证，不能推断成功。
```

## B｜后续每个小批次重复使用（替换尖括号）

```text
宝宝，按照仓库 Draft PR #21 的 27/29/30/31 号文档，继续 <阶段与小批次 ID>，仅做 <本批唯一目标>，不要跨阶段。

先重新核对 PR HEAD、已有源码、测试/CI、上一批已完成和未完成记录，避免重复实现；尤其验证与 P01～P04 既有 owner、Main ACK、V2、桌面/Pocket 保护的兼容性。

按「实际入口核验 → 最小复用实现 → 负例/旧普通会话回归 → 本 HEAD 全仓+专项 CI → 更新 29 号证据账本和 27/30 交接说明以及 PR」完成。给每一项写明 PASS/FAIL/NOT-RUN 与 SHA，不以旧提交的 CI 冒充新 HEAD。用户手工实机验证统一登记 29 号 LIVE-01～08，本轮没有实机证据就继续 NOT-RUN。

特别注意失败/取消/异步迟到、旧缓存恢复、缺失 owner 元数据、按 ID 绕过、跨窗口与普通 Agent 的正常路径。不要新造执行引擎、会话数据库或通用权限框架；不要开发未要求的 UI、模板/批量审核；不要合并或解除 Draft。完成 <小批次 ID> 后停止，向我汇报下一建议。
```

## 历史 P03-MAIN-S01 后的下一批提示（已由 Main/A0 交付覆盖）

```text
恢复 Draft PR #21 当前 HEAD，先读 docs/design/review-agent/29-background-session-preflight-audit.md 中的 P03-MAIN-S01 小节，以及 27/30 和 P05 的 32 号手册。上批只读业务态 IPC 和真实 onRunOwned ACK 标记已经受控通过；下一批只做 P03-MAIN-S02 的 Main-only 可信后台启动入口。

先核对本地 Agent 验收记录是否已推送：没有冻结 SHA/实际步骤/日志时维持 P05 生产中心、Pocket、LIVE-01～08 的 NOT-RUN。不要把用户口头本地完成等同逐项签收。

严格复用 createReviewOwnedAgentSession、preparePiReviewRunV2、admitPreparedPiReviewTurn、runAgent 与现有 Model/assignment 校验，不改通用 Agent 内核；验证成功、busy、重复、旧 binding、无 ACK 假 running、普通 Agent 正例。代码改动、CI 与 29 台账闭环后停止，不直接做 stop、Renderer、P06/P07/P08、合并 PR。
```

## C｜最终统一实机验收时使用（不是现在运行）

```text
宝宝，我们准备验收 PR #21。请从当前 Draft HEAD 读取 27/29/30/31 号文档，并逐条核验 29 号 LIVE-01～LIVE-08；先对照实际实现生成可执行的合成案卷测试步骤和证据要求，标明哪些可以 CI 完成、哪些只能我在实机完成。

严格使用隔离的 PROFER_CONFIG_DIR/PROFER_USER_DATA_DIR、合成材料和授权的真实 Pi provider，核对工具隔离、扫描 PDF 视觉回执、真实 ACK/跨页、Pocket 和桌面搜索/事件/恢复、取消/重启/删案竞态、普通 Pi/Claude 及原批量 A/B/C 回归。每项记录 PASS/FAIL/NOT-RUN、执行者、日期、SHA、日志/录像及缺陷复测。任何未通过不许将 PR 宣告已验收，更不能未经我明确确认合并。
```

## 新会话应该交回的固定结构

1. 当前 PR HEAD / Draft / CI 状态（区分当次与历史证据）。
2. 本批具体入口与风险、最小实现方案（代码可核查，不凭猜测）。
3. 修改清单、测试负例与普通 Agent 回归、实际运行证据和 SHA。
4. 29 号账本/27+30 交接/PR 是否已同步。
5. 明确列出 **NOT-RUN** 的 LIVE 项、P04/P05 剩余入口、下一小批次建议；本轮停止。

**警告**：`owner:review-case` 是隐藏内部会话的**元数据归属**，而 `runId/assignmentId` 是审核运行的**业务授权**，不能互相替代。不能只依赖 Renderer 把会话隐藏；普通 Main IPC、Pocket/Feishu、WS、历史快照及异步事件均要检查相应边界。
