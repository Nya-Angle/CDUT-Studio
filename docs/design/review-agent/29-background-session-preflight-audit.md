# 29｜审核受控后台会话：开工前依赖审计与阻断门禁

> **新会话/新负责人必读**：[30｜项目交接快照](30-background-session-handoff.md)、[31｜接手提示词](31-background-session-continuation-prompts.md)、[32｜P05 阶段完整验收与本地手册](32-p05-stage-acceptance-and-local-gates.md)。**P05-S01～S06 六专项 43/43 受控 PASS；中心实际多 viewer 路由 BLOCKED、Pocket 上游补丁尚未应用/运行，P05 整体 PARTIAL、合并 NO-GO。**P04 路径型文件 IPC 原已枚举路径和本次最终目标变更均有受控补丁，但真实双窗口、IPC 与 LIVE-06/08 仍是开放门禁。

> 2026-10-12；初始源码审计基线 `main@dd5a553c34a92b559559a7cb3c4e9c3f67fd9c8e`；后续代码与受控探针仅在 Draft PR #21 分支实施。配套 [27 号实施规范](27-background-review-session-proposal.md)、[28 号阶段交付](28-review-stage-delivery-status.md)。**文档中的 PASS 只对所附冻结提交、测试环境与覆盖范围有效；真实 Pi/Electron/Pocket 验收尚未完成，不得据此合并。**

## 结论

### 2026-10-15｜实测驱动的P06-RECHECK-LIVE-02新顺序（PLANNED）

[47｜L02-00～04修订计划](47-p06-evidence-driven-followup-plan-20261015.md)只改变**工作排序/证据细则**，本文件LIVE-01～08仍是**唯一验收状态台账**：`L02-00`先归因A/B/C尤其C的`execution-failed`，`L02-01`既有A/B/C完整业务闭环，`L02-02`真实审核PDF/PNG原件及压缩，`L02-03`普通Agent/多窗/平台，`L02-04`跨仓条件可并行协调后统一签收。五批仅**PLANNED**，不得改动下方8行LIVE状态。46号 E05/E03/E04及ENOSPC/双失写/两次重启实机PASS仅对已验范围有效；E06仍PARTIAL，旧38号原FAIL仍保留。冻结`f716d2efaed0dcd8924d5acc30cd3012eb093348`的7条自托管CI全SUCCESS、[PR CI #38602829396](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38602829396) 3894pass/5skip/0fail，不代表新文档HEAD。**P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / Draft/Open/MERGE NO-GO**；P04不安全GC禁令、P05 Relay BLOCKED/Pocket TARGET NOT-RUN、不进入P07/P08全部保留。


### P06-RECHECK-LIVE 本地实机最新（2026-10-14～15）

并发7132新增两项正式写入者测试完整保留后，本地整合 `9cc92bb0e6cec8d2698f5d712a71ecc8b77256e4` 全套22门禁再次exit0：**全仓3894pass/5skip/0fail（3899tests、445files、16161expect）、聚焦89/89（345expect）、batch143/143**；生产与实测b95无差异。最终发布HEAD CI按PR最后验收评论查询，新版current gate可SUCCESS而原legacy脚本依旧exit1，两者分开登记。

[46｜本地独立实机验收](46-p06-recheck-live-local-acceptance-20261014.md) 为本轮证据说明；**本文件29仍是唯一正式台账**。开工重新 fetch 确认 `4ba61fad77b18f8fa9a25babeb25e9c08d5304fe`，保留并发 `d39857e7` workflow 路由变更；最终生产源码 `b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027`（0.15.161）。真实 Electron43.7.7/Main Node24.21.0/Pi provider，独立 profile/合成资料、Xvfb1600×1000/localhost5176/CDP9222/诊断9230。

- **E05 PASS，9断言**：真实旧 listRunsV2 响应已交付到生产 Controller，实际关页/页面外新 ACK/重进，新 Main/Jotai runId 与状态未回退，旧错误/stop反馈不复活，新轮操作正常。
- **E03 PASS，8断言**：真实 stop Promise 显式闸门保持 pending，restart busy 真拒绝，释放后立即受理，新旧 assignment 与 V2 一致。**E04 PASS，7断言**：捕获并实际调用真实旧 executor outcome 闭包 completed/failed，新轮不回退/旧工具拒止。两项范围为隔离真实环境的可控闸门/闭包复演，不冒称自然 SDK 网络迟到。
- **真实 ENOSPC / 双持久化+owner失写 / 故障保持重启 / 可写恢复重启均 PASS（8/5/2/3断言）**：8MiB tmpfs 实际原子tmp write=-ENOSPC，assignment原件保留、当前进程deny、恢复后后补revokedAt；run和assignment同时失写时内存deny，故障保持新进程仍拒止，恢复可写再次新进程将中断failed原子落盘。磁盘仍running阶段没有冒称持久撤销。
- **E06 PARTIAL**：普通Pi create/list/meta/send/stop、Read、Write权限拒绝/恢复、文本/Office/扫描PDF真实Renderer、普通会话跨进程恢复/页面切换均有子集PASS；真实三案批次队列/B过期组/C未授权代批拒止子集PASS。完整原A/B/C人工处置/补件回流/正向审批/幂等、Claude、双窗/fork/自动Tab恢复、严格审核扫描视觉原件回执、Pocket/Relay及跨平台仍未签收。三案资料C仍execution-failed/技术异常，绝不写成业务审核成功。
- **最终选定可执行实机16/16 PASS、77显式断言/0失败，另普通Pi5布尔判词**；这不含NOT-RUN/BLOCKED/历史失败。四个真实新反例均先保留首败后最小修：启动失写授权复活、canUseTool漏接、同步outcome失写授权窗口、case/group无subject错误fallback。本轮新增唯一正式用例9条；聚焦87/87（334expect）、全仓3892pass/5skip/0fail（3897tests/445files/16150expect）、batch143/143。全部原始输出/退出码/脱敏状态/截图/native I/O与raw/public哈希见46和独立证据目录。
- `b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027` [PR CI #38597805963](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805963)、[D2 #38597806005](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597806005)、[Baseline #38597805953](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805953)、[batch #38597805971](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805971) SUCCESS。本地22标准命令及补聚焦exit0。**原38四探针仍3PASS/1FAIL、exit1；[独立workflow #38597799385](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597799385) FAILURE**，裸store失败和旧无效chmod注入事实保留，不删检测。最终文档HEAD CI另在PR最终评论核对。

**P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / Draft/Open/MERGE NO-GO。** E05原37首败保留，当前复验新增PASS；不将此细项通过升级为P06全验收。下一步 `P06-RECHECK-LIVE-02` 只补剩余矩阵与LIVE证据。P05-RELAY-ROUTE-01 BLOCKED、P05-POCKET-FIFO-01 PATCH READY/TARGET NOT-RUN、P04-TECHDEBT-01永久tombstone/journal不安全TTL/GC禁令不变；P07/P08未进入。下方带旧日期的段落均为冻结历史事实。

### 并发受控历史快照（实机最新见46）｜P06-RECHECK-R1B：旧探针归档与有效生产写入者门禁

见 [45｜现行独立写入者矩阵和 CI 分流验收](45-p06-current-writer-probes-and-live-gates-20261015.md)。2026-10-15 接手分支 `b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027`，此前新增本地真实 Electron/Pi 专项驱动和三笔生产安全补丁，勿因旧 44 号的历史 SHA 覆盖最新代码。

本批 **仅进行真实 Controller/Hook 独立竞争矩阵增强（原独立 2 例→4 例），及 CI 原审计证据/现行安全门禁分流**：
- 原 `docs/design/review-agent/acceptance/p06-s02-local-20261013/audit/*`、`replay-risk-probes.py` **不修改**；仍完整运行、保存真实 JSON/verdict/exit/log/hash。其裸 Jotai `store.set` 导致 WORKSPACE-WRITER FAIL 是 **历史原脚本失败，不自动推断生产写入失败**；其 SETTLE `chmod` 探针未命中原子 tmp 故障，原 PASS **故障注入无效**。
- 有效当代门禁要求独立真实 Hook→Controller、Hook→Hook、Controller→Hook，及旧 Hook `getWorkspaceRunValidityV2` 迟到这 **4 个生产写入者/双异步边界** 的显式见证标记和 PASS；另严格要求 typecheck/focused PASS、原四条事实 ID 完整且原 exit/verdict 一致。未知原脚本失败不能放行。
- 上述验收的 **本批代码/CI 结果以新提交与真实 run 为准**；若尚未取得，仍记 `PENDING`，不得预记 PASS。旧 37 E05 实机 FAIL、E03/E04/E06 不完整，真正授权 Electron 重跑仍 **NOT-RUN**；新 `scripts/qa/review-live-*` 已入仓但**存在脚本不等于获得执行证据**。禁止未经授权将 provider/用户密钥复制到公共工件或通用 CI；现场执行应使用独立本机 profile、脱敏日志、真实 CDP/主进程与 provider witness。
- 状态不变：**P06-S02 NOT ACCEPTED；P06 PARTIAL；LIVE-07 PARTIAL；PR #21 Draft/Open、MERGE NO-GO。** P05 Relay/Pocket 外部阻断、P04 owner/tombstone UUID 永久保留（不安全 GC 禁止）、P07/P08 未启动。



**R1B 自托管实测确认（受控代码 `7132ca658ffc64c1f3bc44146ef9bddedae950e5`）：** [独立 CI #38600843457](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600843457) **SUCCESS**，本地 `ghrunner-cdut-studio-review-agent`；`typecheck=0`、`focused=0`（**39 pass/0 fail**）、`current-writers=0`（**4 pass/0 fail，4 个 witness 均到达**）、未改原 38 号 `original-risk-replay=1`（**3 PASS/1 FAIL**，WORKSPACE-WRITER 仍得旧 run，与原始注入一致）。旧 SETTLE `chmod` 原脚本 PASS 但**注入 INVALID**。校验源 SHA、原 verdict/exit、一致性和工件全部保存：[artifact #11913746159](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600843457/artifacts/11913746159)，`current-writers.log` SHA256 `33dc2e1e8c51505b37dc096a0b75e677ff982b7c2a5c3fe16017b07ca2b90496`，`focused.log` SHA256 `b1b092720e60ec646d8fba4de23faf0c1c24433344592a0204781f480045b23a`。首次 [CI #38600505432](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38600505432) **FAILURE 保留**：新增 Controller→Hook 用例错误要求 Hook 写 executionAtom，实际 Hook 只写 workspace 投影；后在 `7132ca65` 更正为旧 Controller 不能复活旧 execution，未修改生产实现。**标准六套 CI 对这次代码 SHA 仍逐项核对，未完不记全绿。真正 E05/E03/E04/E06 与 ENOSPC、双故障重启本轮 NOT-RUN；P06-S02 NOT ACCEPTED、P06 PARTIAL、PR Draft/MERGE NO-GO。**
### P06-RECHECK 独立复演（2026-10-14；R0/R1 受控已执行，真实 R2/R3 NOT-RUN）

本轮 [44｜独立风险复演与实机门禁](44-p06-recheck-independent-acceptance-20261014.md) 在代码 `960163c785d7ccf0eb2b6a6a6ca51161bfc547c4` 精确执行 38 号原脚本：**3 PASS / 1 FAIL，脚本 exit 1**。原 WORKSPACE-WRITER-01 的旧裸 Jotai store 写入绕过新写令牌，FAIL 保留，两个实际 Hook/Controller 等效写入者回归 **2/2 PASS**；SETTLE 原只读单文件注入未命中新的原子 tmp 写，旧 PASS 对故障场景 **INVALID**，但正式 7 项里目录级 `.tmp` EACCES 真正命中并 fail-closed。独立聚焦 **36/36 PASS**，原风险 workflow [#38538200712](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38538200712) **FAILURE 且已归档原日志/退出码/JSON/SHA-256**；四套标准 CI `960163c785d7ccf0eb2b6a6a6ca51161bfc547c4` 全 SUCCESS，全仓 3883 pass / 5 skip / 0 fail（3888 tests / 442 files）。

**实机复验 E05、E03、E04、完整 E06、本地 ENOSPC/双持久化重启均未运行**；37 号旧 E05 FAIL、38 号旧四项失败原样保留。现阶段 **P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / PR Draft/Open/MERGE NO-GO**。P05 中心 Relay BLOCKED、Pocket TARGET NOT-RUN；P04 tombstone+owner journal 永久安全不 GC、容量问题仍在；不做 P07/P08。29 号本节和下方 LIVE-01～08 仍是唯一台账，细项证据在 44 号。

**P06-FIX-03 本批受控（2026-10-14）**：[代码 `b5f9db17`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/b5f9db179b358d0405a1d0868133f11064edc93a)；[PR CI #38524782294](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782294)、[D2 #38524782315](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782315)、[Baseline #38524782350](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782350)、[focused #38524782373](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782373) **四套 SUCCESS**，全仓 **3881 pass / 5 skip / 0 fail（3886 tests / 441 files）**，类型、包边界、Electron main/preload/renderer build PASS。原 `AUDIT-P01-P06-SETTLE-01` 已按正式受控代码路径加固：持久化失败进程内隔离 + 下一次成功写盘补齐 `revokedAt`、授权 JSON 损坏 fail-closed、原子写防部分截断、Main Promise 始终观察且最终清理。新增 **7/7 PASS**；但原审计脚本精确复跑、真实 EACCES/ENOSPC 恢复、双磁盘异常重启与 E05 Electron 复验仍 NOT-RUN。详情 [41 号](41-p06-fix03-settlement-io-resilience-20261014.md)。**P06-S02 NOT ACCEPTED、P06 PARTIAL、P05 Relay/Pocket 阻断和 PR MERGE NO-GO 仍不变**。

**P06-FIX-02 受控最新（2026-10-14）**：代码冻结 [`414f2066`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/414f20669b06513064ff9f84e9ccfb92f7a9001e)；[PR CI #38496467696](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467696)、[D2 #38496467716](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467716)、[Baseline #38496467778](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467778)、[focused #38496467754](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467754) **全部 SUCCESS**；新增 **5/5 PASS**（PR CI 日志逐项可见），全仓 **3874 pass / 5 skip / 0 fail（3879 tests / 441 files）**，typecheck、边界和 Electron main/preload/renderer 构建均通过。原 `AUDIT-P06-REMOUNT-01` 与 `AUDIT-P06-WORKSPACE-WRITER-01` 现为 **CODE FIX / FORMAL CONTROLLED PASS（新增五项）**，但原 38 号审计复跑及真实 37 号 Electron E05 **NOT-RUN**，历史 **E05 FAIL 不能覆盖**。详见 [40 号](40-p06-fix02-renderer-write-fence-20261014.md)。FIX-01 9/9 原结果和安全永久记录不变；`AUDIT-P01-P06-SETTLE-01` 仍 CONFIRMED/OPEN。P06-S02 **NOT ACCEPTED**，P06 整体 PARTIAL、LIVE-07 PARTIAL、P05 外部阻断/PR NO-GO。

**P06-FIX-01 本批最新（2026-10-13）**：[代码 `c8c84681`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/c8c84681f201f8911731b50b9f991bd51cddb9fa)：新增 **9/9 PASS**；全仓 **3869 pass / 5 skip / 0 fail**（3874 tests、440 files），Typecheck、边界和 Electron main/preload/renderer 构建通过。四套 CI **SUCCESS**：[PR #38421280083](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280083)、[D2 #38421280011](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280011)、[Baseline #38421280010](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280010)、[focused #38421279980](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421279980)。原 `AUDIT-P03-P05-INDEX-01` = **CODE FIX / FORMAL CONTROLLED 9/9 PASS / 原审计脚本精确复跑与真实恢复 E2E NOT-RUN**，详见 [39 号](39-p06-fix01-owner-index-recovery-20261013.md)。修复为 UUID-only 单调安全日志（先 fsync 后索引，旧 owner/tombstone 回填，坏索引/坏日志 fail-closed）；其他三个审计缺口仍 OPEN，旧 E05 FAIL 与 LIVE 原状态不变。P04 永久 tombstone 不 GC，新增 journal 引入额外永久容量和首次冷回填成本。S02 NOT ACCEPTED / PR MERGE NO-GO。

**2026-10-13 最新：P06-S02 本地验收已执行，E01/E02 PASS、E05 FAIL；P01～P06-S02 累计复核确认四项 OPEN 缺口。P06 整体 PARTIAL、S02 NOT ACCEPTED、合并发布 NO-GO。** 证据见 [37｜实机验收](37-p06-s02-local-acceptance-20261013.md)、[38｜累计风险与返工](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。只更新公开测试仓库，保持 Draft；P05 外部端原阻断不变。Main/A0 与历史受控证据保留，优先修复新反例再补 E03/E04/完整 E06，不自动进入 P07/P08。27 号 v1 的复用边界不变。

目标：前台只呈现“可开始审核 / 审核中 / 需要你处理 / 审核已结束 / 本次审核未完成”及原有业务结果、依据、人工补件/确认；技术步骤和原始 transcript 仅供授权诊断，不暴露给普通用户。审核分析结束 **不代表业务审批通过**。

## 历史验证证据（2026-10-12；当前进度见 2026-10-13 Main/A0 台账）

- `apps/electron/src/main/lib/review/review-background-reuse.probe.test.ts`：真实 `runAgent()` **函数体**与真实 V2 案卷/指派/存储连通；使用受控模拟编排器（非真实 Pi 模型），完整提交、部分完成、错误、取消、busy 五项均 **PASS**。不调用 `openSession`，模拟 WebContents 只是运行事件接收器。
- [PR CI #38164270451](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38164270451)，基线 `1e076ea84889d8f29aaff2deffe1078e1c57c1ff`：3714 pass、5 skip、0 fail；类型检查、架构边界、皮肤契约与 Electron main/preload/renderer 构建成功。
- [D2 Scoped Pi CI #38164270457](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38164270457) 与 [Review Baseline CI #38164270496](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38164270496) 均成功。
- **P01 受控契约 PASS，真实 Pi/Electron NOT-RUN；P02 受控工具/接线探针 14/14 PASS，真实模型与 PDF Electron 视觉 NOT-RUN；P03-S01 2/2、S02 6/6、S03 4/4 受控契约 PASS，真实 Main IPC/桌面切页 NOT-RUN；P04-S01 8/8、S02 7/7、S03 5/5、S04 8/8 受控 PASS，P04 整体仍 PARTIAL；P05–P07 功能验收 NOT-RUN；P08 仅普通 Agent 现有回归基线 PASS，新功能回归 NOT-RUN。** 后续 HEAD 需重新检查 CI，不能把以上数字冒充不同提交的验证结果。

### P02 验证结论：接口已接通，真实执行仍待验收

- **提交与证据**：在 `42fd57fd5d751cbee2416de6cc16ff03b0493415`，[`review-strict-profile.p02.probe.test.ts`](../../../apps/electron/src/main/lib/review/review-strict-profile.p02.probe.test.ts) **14/14 PASS**；[PR CI #38173768799](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38173768799) **SUCCESS**，全仓 **3728 pass / 5 skip / 0 fail**，typecheck / boundaries / skin / Electron main+preload+renderer 构建均成功；[D2 CI #38173768773](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38173768773) 与 [Review Baseline #38173768777](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38173768777) 均成功。
- **最小生产接线（仅 Draft PR #21）**：
  1. `agent-orchestrator.ts` 仅对 `review-operator + triggeredBy=user + getPiReviewBindingForSession` 的活动案卷轮次传 `toolProfile:'review'`，并调用 `selectDirectReviewStrictTools`。普通 Pi 仍走原有 builtin + MCP 注册路径，**本案不将额外 MCP 传给 Adapter**。
  2. `review-strict-pi-tools.ts` 只允许 `review_read_documents`、`review_inspect_document_image`、`review_submit_result` 和 `review_inspect_original`；`CompactContext` 由 Pi Adapter 自带。缺失或重复审核工具 **fail closed**。`auto` 权限对有效案卷指派只放行上述五个工具，禁止技术弹窗挂起，其余全部拒绝。
  3. 原件视觉工具只收 `documentVersionId`，用 V2 当前激活材料、realpath 及案卷根目录验证后，调用原有 `executeAgentPreviewTool`/渲染服务；异步渲染结束后重新验证 `caseId/sessionId/runId/assignmentId`，才登记 V2 预览回执。无任意文件路径入参、跨案读取或过期指派写入。提示词已改用 `review_inspect_original`。
  4. 原有 V2 正文/PNG 图像读取、部分提交、跨轮续审、检查点摘要与空闲压缩都复用且有独立受控探针。
- **验证范围限制**：探针直接执行真实审核工具/V2 持久化与路径授权，Pi 严格工具装配走已存在函数的受控构造测试；预览使用受控渲染器返回假页面图像。**没有在真实 Electron 隐藏 renderer 中打开扫描 PDF、没有真实 provider/model 的 Pi 完整工具调用，也没有跨视图运行。** 因此本轮只能标记 **P02-SAFE-WIRING PASS / P02-LIVE-E2E NOT-RUN**。不能把全仓 CI 通过等同于这些 E2E 成功。
- **剩余 P02 门禁**：使用隔离 `PROFER_CONFIG_DIR` 和虚构合成案卷，实际启动 Pi，确认模型真的收到且只收到受控工具、完成一次正文及扫描 PDF 原件审查、提交/续审/上下文压缩，并验证真实预览结果与材料覆盖账本；按真实 API 费用、凭据授权和可用测试环境执行。若无法运行就继续保留 **BLOCKED**，不能默认为 PASS。
- **回归守护**：此次接线属于现有直接案卷审核的行为变化；虽只有 Draft 分支，仍需真实桌面回放，确认原先的图像、PDF、预览及完成状态没有因为严控工具而失效。普通 Agent/批量 A/B/C 不受本案逻辑分支影响，仍需在最终验收回归中确认。

## 源码事实与影响边界

| 领域 | 已查证的事实 | 必须考虑的影响 |
| --- | --- | --- |
| 执行入口 | `agent-service.ts` 的 `runAgent()`/ `runAgentHeadless()` 共用 `AgentOrchestrator`；`runAgent()` 通过 `createAgentRunOutcomeReporter` 处理 `onRunOutcome`，Headless 没有对等收口；现有 `ipc.ts` `SEND_MESSAGE` 按有效绑定附加 `finishPiReviewRunV2` 回调 | 新 Main 入口不能直接把 send 改成 headless 后丢失 run 终态；必须检验忙碌拒绝、启动失败、正常结束、已完成提交、部分完成、停止、崩溃各分支 |
| 审核启动前步骤 | `review-actions-controller.ts:842+` 的 `runFullReview()` 除启动 Pi 外，还刷新案卷、重新解析旧 HTML/EML 材料、触发逐事项识别；`use-review-actions.ts` 负责模型选择、会话创建、打开普通 Tab、准备运行与轮询 | **v1 只后台化 Pi 运行阶段**：准备流程仍留在现有 Renderer，清楚区分“准备中”和“Pi 已受理”。切换页面时不能声称预处理仍在后台持续；更大范围的后台预处理另议。 |
| 工具权限 | `review-operator` 预设只关闭部分产品能力组；普通 `AgentOrchestrator` 并未给直接审核传 `toolProfile:'review'`。但 `pi-agent-adapter.ts` 已具备此严格档案（不装通用 read/bash/write），`pi-review-ops-tools.ts` 在有效案卷绑定时只注入读文档、核图页、提交结果三个审核工具 | 必须进行 A/B 工具列表与真实案卷提交试验，确认严格档案与直接审核的压缩、跨轮和视觉能力兼容；不能以“UI 不显示技术弹窗”作为权限豁免 |
| 指派与轮次 | `review-agent-assignment.ts` 绑定 `sessionId/turnId/caseId/activeRunId`，`checkAssignment` 拒绝非用户发起的写操作，工具还验证当前有效指派；`agent-orchestrator.ts` 的直接审核绑定也依赖 `triggeredBy='user'` | UI 点击由可信 Main 转换为用户发起轮次，不允许任意普通/远程发送伪装，不能改变 assignment、D2、材料/模板/证据快照准入 |
| 停止语义 | `stopAgentAndWait(sessionId)` 等待运行真正释放；普通停止以 session 为索引，审核 runId/assignmentId 是另一层标识 | 审核取消先按 `caseId+runId+sessionId` 校验当前 run，再停止；必须保证迟到的旧 run 取消不能停止后来复用 session 的新 run |
| 重启恢复 | `run-store-v2.ts` 的 `markStaleRunsInterrupted` 启动时把 queued/running 置为 failed，已存检查点保留；Pi 还有单独 SDK transcript/resume 机制 | “会话可 resume” != “运行自动恢复”。首版建议重启标记中断，用户明确点击继续/重新审核，按版本/证据门禁重走新任务；不提供自动跨进程继续跑 |
| 会话元数据 | `agent-session-manager.ts` 的索引 v1 支持可选字段且已有 revision/快照；通用 `listAgentSessions`、`getAgentSessionMeta`、`searchAgentSessionMessages` 分离不充分；`isVisibleAgentSession` 只按 draft 判断 | 建议加由 Main 设置的可选业务 owner 判别字段，普通旧会话缺省继续可见；会话完整查询保留维护功能，所有普通展示、搜索与按 ID 操作需额外访问策略 |
| 事件与 UI | `useGlobalAgentListeners.ts` 可以通过 session_projection、external_run_started、session_updated、异步重拉、单条 upsert 反复重新插入会话；Tab 持久化与自动导航另有独立路径 | 不能只过滤 LIST_SESSIONS；必须在 UI 数据入口和导航入口均做限制，维护既有竞态/删除墓碑语义 |
| Pocket / 远程 | `remote-service.ts` 既有列表/按 ID 读取/发送/停止/删除/修改模型/问答等命令，又订阅所有 `agentEventBus` 事件、写入重放日志 | 在写入重放日志**之前**过滤内部审核会话；普通远程 API 按 ID fail closed，不因 sessionId 已知而可访问。未来若有审核专用远程能力，应另行授权与建模 |
| 交互请求 | 通用 `permissionService`、`askUserService` 持有 pending promise；普通通知导航到聊天；审核三工具正常不需要普通聊天审批 | 首版可以选择无中途通用交互：审核预设/严格工具集自动执行受控读取，缺信息按审核结果转待补件/人工核实；若确需非白名单工具则拒绝/安全失败。若产品要求保留 AskUser/计划确认，必须另行完成请求投影和响应端到端验证，不可半做 |
| 工作区/删除 | 旧审核会话使用当前 Agent workspaceId；会话被工作区删除时可能级联清理，`deleteCase` 不负责关闭持久 Pi 会话；用户工作区与案卷生命周期不同 | 新后台审核会话要有独立稳定的工作目录/归属策略，避免用户切工作区导致失联；删除案卷时先阻止并等待运行结束，再安全处理历史和会话，不产生孤儿 |
| 模型设置 | `use-review-actions.ts` 的“跟随全局”依赖 Renderer 的 `agentChannelIdAtom/agentModelIdAtom`；`module-settings-store.ts` 只保存审核模型 ID；审核网关还有独立解析逻辑 | Main 必须能确定一致且合法的渠道/模型，冻结每次运行的选择；不能从无状态的主进程随意选择“第一个可用”替换用户默认 |
| 双审核路径 | `pi-review-agent-client.ts` 是批量/语义节点使用的临时 `toolProfile:'review'` Pi transcript，直接案卷审核是另一种持久 session | PR #21 只改直接审核路径；批量 A/B/C 的模型运行、执行门禁与结果不可顺带重构 |

## 开工前必须冻结的设计决策（建议默认值，不视为已验收）

1. **首版任务类型**：只覆盖用户主动点击的单案“开始 / 更新 / 重审 / 停止”，不改批量队列与普通聊天。
2. **中间交互**：建议 v1 不提供通用 Agent 中途问答/权限审批；使用严格审核工具集，缺材料或不清楚的事实写为待补件、待核实；需交互时在本轮结束后的案卷业务动作中处理。若不接受此裁剪，必须先设计完整的异步业务待办/响应/超时/权限身份契约，再开工。
3. **工具隔离**：`toolProfile:'review'` **自身不会过滤上游 customTools**；本 Draft 已在有效 active binding 下用 `selectDirectReviewStrictTools` 严格筛为三案卷工具 + 案卷版号视觉预览，由 Adapter 加 `CompactContext`；Main 权限只放行这五项，其它 MCP/云/预设/Write/Bash/Read 不传入或被拒绝。扫描 PDF 已有路径授权与受控模拟预览，**真实 Electron 全页视觉回放仍是 P02 必要门禁**。
4. **会话生命周期**：专用 Main coordinator 是单一启动、停止和状态拥有者；新会话用由 Main 设置、不可通过普通 IPC 覆盖的 owner，绑定单一案卷；禁止普通 send、queue、fork、move、archive、delete、权限修改等入口对它操作。
5. **会话隐私**：服务端拥有非公开完整查询；普通 UI / Pocket / 消息搜索 / 会话引用 / 归档与统计 / 通知 / 事件重放均不包含内部会话。原始运行 transcript 仍为审计材料保留，但需受授权诊断接口才可取。
6. **前置输入准备**：v1 保留当前 Renderer 驱动的 HTML/EML 解析修复、事项识别、V2 同步；这些属于“准备阶段”，**不**承诺切换页面后还能继续。仅当准备完成、Pi 被 Main 成功受理后，才进入本 PR 的后台运行保障。禁止将完整点击流程伪称全链路后台化。
7. **停止、退出、重启**：按当前 run token 身份做 stop，未获得执行所有权或过时请求不产生终态；关闭页面不中断，应用退出不保证继续执行，重启时中断需用户显式续审；旧版部分完成原 runId 续交仍保留原校验。
8. **设置快照**：Main 的模型、渠道、review preset、工作目录与工具策略从主进程可验证来源读取并冻结到本轮；与旧 UI 的“跟随全局”设置语义一致。渠道/模型不可用时清晰失败，不猜测替代。
9. **历史处理**：首次只对新创建的后台审核会话生效；不批量自动迁移旧普通审核会话，不删除历史 transcript；历史新旧两类结果共存并可读。
10. **删案与清理**：建立会话/运行/assignment 的失效与清理顺序，删除中的案卷不能继续提交结果；审计要求决定是否保留/单独导出历史，不允许误删普通会话。
11. **回滚机制**：新路径通过开发期开关显式启用，回退必须保留运行与案卷状态一致性；开关不构成对权限、身份或工具审查的绕过。

### P02 真实运行验收的延期决定（2026-10-12）

用户选择将 P02 的真实 provider Pi 与 Electron 扫描型 PDF 回放纳入后续完整 Main 后台链路的端到端验收，减少为临时入口建模后再次测试的重复成本。**这属于调整执行顺序而非豁免质量标准。** 当前 P02 的安全接线已测试通过，P02-LIVE-E2E 仍为 **NOT-RUN / BLOCKED FOR MERGE**；可以先做 P03 的小批次受控测试、Main 接线、会话隔离设计，但在首次合并/交付前必须实测真实 Pi 工具清单/凭据、跨页继续执行、扫描 PDF 原件预览回执及安全降级，全部留证。

### P03-S01 明确的握手/生命周期边界

- Renderer 继续在 `review-actions-controller.ts:842+` 完成旧 HTML/EML 修复、逐事项识别和案卷刷新；预处理状态不得描述为“后台 Pi 已受理”。已有 Controller 回归涵盖这两类准备顺序。
- `preparePiReviewRunV2` 在真正执行前就写入 `running` 和 assignment；不可仅以账本状态/IPC 请求送出作为 ACK。主进程现有 `agent-service.ts:runAgent` 内部收到 `onRunOwned` 时才有真实执行所有权，但是此信号尚未向业务 Main Bridge 公开。下一批次只在最小适配层暴露明确受理/拒绝结果，不新增新事件总线或第二套任务存储。
- ACK 拒绝/并发失败：必须以准确 `caseId/sessionId/runId/assignmentId` 收口本轮，并使临时准备中的 running 不悬挂；`onRunOutcome` 单次收尾仍是权威。**未受理不等于模型失败，不得停止已获得所有权的其他 Run。**
- ACK 成功：Main 保持执行 Promise 持有者，React Hook 卸载只影响显示；再次打开页面时通过 V2 账本恢复状态。整个应用退出则依旧遵守 `markStaleRunsInterrupted`。
- P03-S01 受控探针：复用真实 `runAgent` 函数体、模拟延迟 Orchestrator、真实 V2 账本，验证 sender 生命周期退出后收尾与 `running` 先于 `onRunOwned`。在 `3a34522706289f4f7f36d11f965da43ca1a705e0` 上 [PR CI #38175575480](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38175575480) **PASS（P03-S01 2/2，全仓 3730 pass / 5 skip / 0 fail）**；D2 #38175575468、审核基线 #38175575476 通过。**仅证明 API 契约，不是 Electron/真实模型切页 E2E。**

## 先证伪、再开工：最小技术预验证

以下测试按小批次依次推进，使用隔离 `PROFER_CONFIG_DIR` / `PROFER_USER_DATA_DIR` 和合成材料；**实际完成/NOT-RUN 状态以逐条证据和对应提交 SHA 为准**：

| ID | 预验证 | 阻断条件 |
| --- | --- | --- |
| P01 | **契约探针 PASS（5/5）**：真实 `runAgent()` 函数体、V2 run/assignment 在受控模拟编排器里覆盖完整提交、部分完成、失败、取消、busy；**真实 Pi 和 Electron UI NOT-RUN** | 不能据此认定真实模型已跑通；尚须最小真实 Main/Pi 案卷实验检验无 Tab 启动、工具提交及失败收尾 |
| P02 | **SAFE-WIRING PASS / LIVE-E2E BLOCKED**：严格工具白名单、案卷限定预览委托、后验轮次核验、主进程权限闸门和 V2 续审/压缩探针均已通过。**真实模型调用、真实扫描 PDF Electron 渲染未运行** | 在合成案卷的实际 Pi/桌面测试证明前不能宣称 P02 全部完成，尤其不能据受控 renderer 假图片标记真实视觉能力通过 |
| P03 | **S01 2/2、S02 6/6、S03 4/4 受控测试 PASS**：Main 真实执行权 ACK / V2 收尾仍复用；新 session 的可信 `owner:review-case` 原子落盘，普通更新不可伪造；普通桌面列表/单条元数据/发送及关键修改入口开始阻断，Pocket 列表/按 ID 命令和重放前写日志进行最小隔离。**真正审核 IPC、桌面 Tab/搜索/异步投影全覆盖尚未完成** | 未拥有执行权就回复 ACK，普通/远程入口仍能按 ID 读写内部会话，或被普通 UI/重放重新暴露，不得放行 |
| P04 | **S01 8/8、S02 7/7、S03 5/5、S04 8/8 受控 PASS，P04 整体 PARTIAL**：Main 侧普通全文/引用搜索、归档计数/自动归档、按 ID 常用读取与修改、普通 Stop/进程/任务入口已加 owner 守卫；普通桌面投影、流事件转发/刷新恢复按 owner 抑制；Renderer 列表合并/迟到投影不会复活已知 owner。**S02 已守住旧 Agent Tab 持久化/未知 ID 重开、Preview/Browser 运行期恢复；S03 在现有索引加入删除后 ID tombstone 并守住 Main/投影/远程迟到出口；其余桌面 IPC、跨窗事件与普通会话早到预览仍待 S04/实机**，真机 LIVE-06 未运行 | 任一普通入口仍能读取/控制 owner，旧 Tab/异步上报重新出现 owner，或破坏普通会话既有回归与 sender 鉴权 |
| P05 | Pocket 列表、按 ID 读取与变更、WS 实时事件、事件重放与远程搜索完全隔离；普通会话仍可使用 | 任一 API 通过内部 sessionId 读取/控制或记录敏感事件到远程重放 |
| P06 | 同一案卷连续两轮运行，旧运行的迟到停止/失败回调不会改写或中止新的运行 | 任何旧 run 影响新 run |
| P07 | app 重启、进程被杀、删除案卷、工作区切换及模型禁用等异常流程 | 永久 running、伪完成、孤儿权限、跨案 transcript |
| P08 | 普通 Agent 回归（会话、权限、预览、停止、fork、子会话、Pocket、离线桌面回放） | 任何现有公共行为因审核专用分支意外改变 |

### P03-S02 Main 受理 ACK 小批次验收记录（2026-10-12）

- **冻结验证 SHA**：`0180a08742210a47f78cbad2f69eff1c8fe298eb`。[`PR CI #38176324329`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38176324329) **SUCCESS**，P03-S02 **6/6 PASS**；全仓 **3736 pass / 5 skip / 0 fail**，typecheck、package boundary、built-in skin surface contract、Electron main/preload/renderer 构建通过；[`D2 CI #38176324267`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38176324267) 与 [审核基线 #38176324308](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38176324308) 均成功。
- **测试**：`review-background-reuse.probe.test.ts` 注入受控 Orchestrator 并执行**真实 `runAgent()` 函数体**，另接 `review-pi-admission.ts` 与真实 V2 运行/指派。验证（1）仅实际拥有 onRunOwned 才 ACK，ACK 后 Main 异步收尾且窗口消失仍能写入运行终态；（2）busy 拒绝只失败当前准备 run，不伪造前台事件；（3）未获执行权的早退不留 running；（4）同 assignment 重复启动不取消首轮；（5）获得所有权后预检失败最终写 failed；（6）非用户来源/轮次不匹配不能启动。
- **生产改动边界**：`agent-service.ts` 仅增加可选第四参数 `onRunOwned`，普通 IPC、普通会话调用保持原状；新增 `review-pi-admission.ts` 仅为 Main 内部工具，可由未来可信审核 IPC 桥接委托现有 `runAgent`；**未接入实际审核 IPC、未创建 owner session，也未验证真实 Electron 切页和真实 provider。**
- **后续小批次**：先完成 owner 的可信持久化与防漏入口守卫，再接专用审核 IPC/受理回执。避免未隔离 owner 时就暴露内部会话给普通列表/远程消息；实际 Main IPC/交互测验统一列在 `LIVE-04/05`，不能凭此自动化结果代签。

### P03-S03 可信归属与基本访问门禁记录（2026-10-12）

- **冻结证据**：代码提交 `759606afec50eeda4943f8c35b7a560e6668e3e2`，[`PR CI #38182548136`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38182548136) **SUCCESS**：P03-S03 **4/4 PASS**，全仓 **3740 pass / 5 skip / 0 fail**，typecheck、package boundaries、skin contract、Electron main/preload/renderer build 均通过；[`D2 #38182548105`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38182548105) 与 [审核基线 #38182548088](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38182548088) 均成功。
- **最小实现**：共享 `AgentSessionMeta.owner?: {kind:'review-case',caseId}`，`isVisibleAgentSession` 对内部 owner 不展示；`agent-session-manager.ts` 的可信 Main 工厂 `createReviewOwnedAgentSession` 将 owner 与会话元数据**同一次索引写入**，普通创建 IPC 不接受 owner 参数；`updateAgentSessionMeta` 明确拒绝注入/修改 owner，原始低层 `getAgentSessionMeta` / `listAgentSessions` 仍保持内部维护能力。
- **第一层常规入口屏障**：`ipc.ts` 的普通 LIST/GET_SESSION_META/SEND_MESSAGE 及 DELETE/UPDATE_MODEL/MOVE 均拦截已有 owner；`remote-service.ts` 的列表和按 `sessionId` 基础命令拒绝内部 owner，runtime context 过滤；事件在 `remoteAgentEventLog.append` **之前**过滤，避免新内部流进入 Pocket 重放日志。
- **负例证据**：[`review-owned-session.p03.test.ts`](../../../apps/electron/src/main/lib/review/review-owned-session.p03.test.ts) 包含 owner 持久化与普通会话差异、运行时恶意 owner 更新被拒、已知 sessionId 的 Pocket 读取/修改/删除被拒、基础实时/重放预过滤。**这不等于全量 Desktop IPC 或 Pocket/Feishu 入口枚举完成**；目前不会创建/启动真正后台 owner session。
- **不可提前放行**：P04 必须继续覆盖桌面全套单条/检索/引用/归档/历史 Tab/异步 session_projection 与流事件重新插入；P05 必须继续覆盖所有 Pocket 命令别名/嵌套 ID/事件队列和重放/远程搜索/Feishu 等远程入口。**LIVE-06 仍 NOT-RUN**；尤其不能把此轮测试的“基本阻断”宣称为全表面隔离。

### 跨会话交接校验（2026-10-12）

- **当前交接基线**：截至制作 30/31 号文档前，Draft PR #21 HEAD 为 `cbdd0a8c86bafc6bff60781de466b0ba963d27e2`，对应 [PR CI #38184974138](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184974138)、[D2 #38184974152](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184974152)、[Review Baseline #38184974119](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184974119) **三项均 SUCCESS**。此后交接文档提交产生更新的 HEAD；这三条历史 CI **不可冒称覆盖文档更新后的 HEAD**。接手者必须重新查询 PR 最新 HEAD 与当次 CI。
- **阶段状态**：P04-S01/S02/S03/S04 均有受控验证（下节）；P04 整体 PARTIAL。S04 针对已知会话 ID 入口、未知流短队列及正常 Preview/Browser 早到时序有自动化门禁；通用路径 IPC、跨窗 sender 的真实 Electron 行为及正式预览回执的实机效果仍待专项和 LIVE-06/08。P05-S01/S02 受控 PASS、P05 整体 PARTIAL；实际后台审核 IPC 未启用。**LIVE-01～08 均 NOT-RUN**。
- **交接工作流**：新会话先读 [30｜交接指南](30-background-session-handoff.md)，复制 [31｜首轮提示词](31-background-session-continuation-prompts.md)；每批必须同步本文件及 27/30/PR，记录 PASS/FAIL/NOT-RUN、冻结 SHA 和 CI run ID，不得仅凭用户上一段聊天或历史 CI 放行。

### P04-S01 桌面主路径隔离与异步回填受控验证（2026-10-12）

- **冻结代码 SHA**：`3096ba6fc60c0d95a149f2279d5437a2dc0c548f`。[`PR CI #38184686298`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184686298) **SUCCESS**：P04-S01 **8/8 PASS**（Main 3、Renderer 4、普通 Stop 负例 1），全仓 **3748 pass / 5 skip / 0 fail**。TypeScript、包边界、界面契约、Electron main/preload/renderer build 全通过；[`D2 #38184686276`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184686276) 和 [审核基线 #38184686293](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184686293) 均 SUCCESS。
- **源代码改变**：`agent-session-manager.ts` 的消息全文检索、标题/正文引用、归档计数与过期归档排除 review owner；`ipc.ts` 对 GET_SDK_MESSAGES、普通标题/置顶/归档、fork/rewind、浏览器按 session 访问、Stop/Queue、模型/权限/推理档位、后台任务与进程操作等增加 `assertOrdinaryAgentSession`。敏感 IPC 在发送者校验**之后**执行 owner 守卫，不泄漏内部归属检查结果。
- **异步入口**：`agent-session-ui-projection-publisher.ts` 在投影事件上行前排除 owner；`agent-service.ts` 过滤普通桌面事件总线转发、刷新重放和直发 fallback；`renderer/lib/agent-session-list.ts` 防止混合/陈旧列表、optimistic upsert、revision 迟到投影把**已知**内部 owner 再插回普通侧栏。
- **负例与回归**：[`review-desktop-isolation.p04.test.ts`](../../../apps/electron/src/main/lib/review/review-desktop-isolation.p04.test.ts)、[`agent-session-list.test.ts`](../../../apps/electron/src/renderer/lib/agent-session-list.test.ts) 与 [`goal-ipc-routing.test.ts`](../../../apps/electron/src/main/lib/goal-ipc-routing.test.ts)。首轮 PR CI #38184389961 暴露旧 Goal/Stop 源码测试夹具漏注入新守卫，2 项失败；已保留真实安全守卫、修复夹具并增加普通 Stop 不可控制 review owner 的负例，最终冻结版本回归全部通过。
- **P04-S04 当前结果与剩余风险**：按 ID 桌面 IPC/目标消息、已投递但未消费的 Renderer 常用事件、跨窗口通知、普通 Preview/Browser 早到时序已做最小修补；通用路径文件读取、真机双窗口重绑、历史完成直发时序及重启后恢复仍需额外证据，详见 P04-PATH-01 与 LIVE-06/08。**P04 阶段整体不是 PASS，LIVE-06 仍 NOT-RUN**。
- **执行顺序**：P04-S04 受控提交完成后，下一小批 P05 Pocket/Feishu 全入口及重放审计；P04-PATH-01 和 LIVE-06/08 在解除 Draft 前闭环；全部隔离覆盖前仍不注册真正的后台审核公共 IPC、不合并 Draft。

### P04-S02 历史 Agent / Preview / Browser Tab 恢复与重新打开（2026-10-12）

- **冻结代码 SHA**：`68ef5128025c61b6c737be9baa82f69aefb042fc`（本轮补写文档会产生新的 HEAD，不能混为一谈）。[PR CI #38186002063](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38186002063) **SUCCESS**：**7/7 新增受控测试 PASS**，全仓 **3755 pass / 5 skip / 0 fail（426 文件，3760 项）**；Typecheck、包边界、皮肤契约、Electron main/preload/renderer 构建均通过。[D2 #38186002055](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38186002055) 和 [Review Baseline #38186002095](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38186002095) **SUCCESS**。CI 是代码自动化，不是 Electron 实机录像。
- **入口链路与修复矩阵**：
  1. `renderer/main.tsx:TabStatePersistenceInitializer` 从 `settings.tabState.tabs` 读取旧 Agent Tab；恢复资格在 `renderer/lib/agent-tab-access.ts:selectRestorableAgentTabs` 统一交叉核对 Main `listAgentSessions(true)`、`owner`、ID 结构和可见工作区。旧 splitLayout/group 继续走既有焦点/组合恢复；历史 Preview/Browser 或伪造 Agent ID 不得冒充可持久化会话。已删除/缺失元数据 fail-closed；普通 archived/项目 draft 保留兼容。
  2. `renderer/hooks/useOpenSession.ts` 过去可以在单条元数据未知时先 `openTab` 再读取 Main；现在未知 ID 必须先 `getAgentSessionMeta`（Main 对 review owner 返回 null）确认身份，才打开普通会话；本地已知 review owner 也拒绝。普通归档会话可经过 Main 授权重新打开，读取时使用当前 tab store 防止覆盖期间新增标签。
  3. `renderer/components/diff/preview-opener.ts`、`renderer/lib/browser-tab.ts` 对运行期打开/手动重绑/浏览器状态推送使用已有 `agentSessionsAtom` 里的普通会话资格判断；未知、已删或隐藏 owner 不得靠工作 Tab 再造 Agent 宿主。Main `ipc.ts:assertBrowserSessionAccess` 已有 `assertMainRenderer` 与 `assertOrdinaryAgentSession`，覆盖前台、状态、布局等受管浏览器 IPC；**此处复用现成鉴权，不把纯函数测试冒称为真实跨窗口测试**。
- **针对性测试**：新增 `renderer/lib/agent-tab-access.test.ts` **7 项**，分别覆盖历史含 review owner/旧快照/伪造工作 Tab、隐藏工作区和 ID 不一致、Preview/Browser 本地归属校验、Main 异步返回内部/删除/错 ID/异常、普通已归档会话重新打开、Preview opener 旧事件、Browser reconcile 旧状态恢复及普通正例。原普通 Agent 相关全仓回归通过；没有修改 Pi Adapter、AgentOrchestrator、公共 Session Manager 或通用 Tab 引擎。
- **本批未闭合的风险，后续必须保留**：
  - **P04-S03**：删除 owner 元数据后迟到 `session_projection` / `external_run_started` / stream / SDK completion、旧列表合并、异步权限与标题事件；需使用持久或进程期 tombstone/等效可信阻断，禁止已删除 owner 因缺失元数据而被当作普通会话，补竞态测试。**本批没有实现 tombstone。**
  - **P04-S04**：逐项复核其余普通桌面按 sessionId IPC（含目标任务/引用/浏览器工具边缘入口）、跨窗口重绑/通知/队列与 stale foreground 状态，补 Sender、错窗口、旧上下文负例。Main 受管浏览器已有基础鉴权不等于完成所有桌面入口审计。
  - **LIVE-06 / LIVE-08 实机 NOT-RUN**：用隔离配置和合成案卷实测重启、旧 settings 快照、两个 Electron 窗口切换、运行期 Preview/Browser 迟到推送、普通会话恢复。运行期工作 Tab 对尚未进入 `agentSessionsAtom` 的正常早到事件也会 fail-closed，其兼容性须实机检验并在后续修复（如需）。
- **阶段结论**：仅 **P04-S02 受控门禁 PASS**，P04 全阶段 **PARTIAL**，P05 未推进、公共后台审核 IPC 未开放，LIVE-01～08 八项仍全部 **NOT-RUN**。本轮在 S02 停止。

### P04-S02 兼容性观察点复核：普通工作 Tab 元数据早到/晚到（2026-10-12）

- **静态根因确认（不是实机复现）**：`renderer/main.tsx:AgentSettingsInitializer` 和 `TabStatePersistenceInitializer`、侧栏/全局监听器的会话列表水合相互异步；`useGlobalAgentListeners.ts` 的事件监听并无先等待 `agentSessionsAtom` 就绪的全局屏障。P04-S02 的 `canOpenOrdinaryWorkTab` 只认 `agentSessionsAtom` 当前列表，普通 session 在 Main 存在但尚未进入 renderer 列表时返回 false。
- **具体后果路径**：`components/diff/preview-opener.ts:openFilePreviewTab` 在此情况直接返回 `''`、不创建 Tab；`lib/browser-tab.ts:reconcileBrowserTabs` 返回 `null`，即使 `MainArea` 通过 Main `getAgentBrowserState` 收到合法状态也可丢失本次恢复（该效果未仅因后续会话列表水合而必然重试）。`useGlobalAgentListeners.ts:preview_requested` 在异步预览成功后调用 `openFilePreviewTab`，没有对空 tabId 产生显式失败回执；它可能影响正式预览的等待/回执。
- **结论等级**：**代码上竞态条件与缺乏补偿路径 CONFIRMED；真实设备触发次数/影响程度 NOT-RUN**。S02 的 owner 安全门禁必须保留，不可恢复“未知 ID 也直接开 Tab”的旧行为。**跟踪号 P04-S04-COMPAT-01**：审计会话元数据和 Preview/Browser 状态的先后；在 Main 可信 `GET_SESSION_META` 确认普通 owner 后进行受限补偿/重试，给正式预览明确成功或失败回执；旧会话/归档/跨窗与内审 owner 做正反例。需要真实 Electron 录像时仍属于 LIVE-06/08 NOT-RUN。

### P04-S03 删除后迟到事件 tombstone 小批次受控记录（2026-10-12）

- **冻结代码 SHA**：`3ca7a6726bfefc3e5a8496ff873203ea6d0018c0`。[PR CI #38192286740](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38192286740) **SUCCESS**：`review-deleted-owner-tombstone.p04.test.ts` 新增 **5/5 PASS**，全仓 **3760 pass / 5 skip / 0 fail（427 文件，3765 项）**；Typecheck、包边界、皮肤契约、Electron main/preload/renderer 构建成功。[D2 #38192286741](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38192286741)、[Review Baseline #38192286739](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38192286739) **SUCCESS**。此前中间代码提交的 CI 不作为冻结 SHA 的 PASS。
- **原因与最小修补**：过去 Main/Remote 的过滤只检查 `getAgentSessionMeta(id)?.owner`，删除后 metadata 丢失，迟到事件从未知 ID 误判为普通会话。现在 `agent-session-manager.ts` 的既有 `agent-sessions.json` 索引增可选 **ID-only** `reviewOwnerDeletionTombstones`，在删除 review owner 时与索引移除同次原子写入；旧索引无字段不影响普通会话。统一 `isReviewOwnedOrDeletedAgentSessionId` 为现存/已删除内部 ID 判定，普通 `assertOrdinaryAgentSession` 及委派子会话 ID 重用均拒绝旧内部 ID。此 tombstone 持久保存；后续体积/保留策略另行评估，不擅自清除安全记录。
- **迟到出口**：`agent-service.ts` 的 desktop EventBus stream/refresh restore/fallback 和绕过 EventBus 的 STREAM_ERROR/COMPLETE/TITLE_UPDATED 直发使用同一 owner/tombstone 门禁；`agent-session-ui-projection-publisher.ts` 拒绝 owner 即便丢失 owner 字段的旧 upsert 和删后 delete 投影；`remote-service.ts` 的实时/延迟 partial **写 replay log 之前**、按 ID 命令和 runtime context 使用 tombstone，阻断已删 owner 泄漏。**此处只是 P04-S03 必需的定点远程出口保护，不能算 P05 全量 Pocket/Feishu 验收。**
- **5 项针对性负例/普通回归**：删除后持久化 tombstone 且 no meta；普通删除/陌生 ID 不误判；迟到 ownerless 旧投影及删除事件受阻、普通删除投影保留；远程 replay-append gate/按 ID 访问拒绝已删 owner、普通 session_detail 不受影响；委派 ID 不得复用 tombstone。全仓普通 Agent 自动回归通过。**没跑真实 Pi、Electron、已投递的 renderer 队列。**
- **遗留与阶段状态**：**P04-S03 受控 PASS，但 P04 全阶段 PARTIAL**。P04-S04 继续枚举剩余 desktop IPC、已投递/尚未消费的窗口队列与历史缓存、跨窗口 Sender/重绑及 `P04-S04-COMPAT-01`；P05 另审 Pocket/Feishu 全入口，P06/P07/P08 不前置。所有 LIVE-01～LIVE-08 **NOT-RUN**，尤其 LIVE-06/07/08 必须用户实机统一验证。

### P04-TECHDEBT-01｜已删除内部审核会话 tombstone 容量、热路径与安全清理策略（原始立项记录；执行结论见下方）

- **状态 / 归属（2026-10-12）**：`OPEN / DESIGN-REVIEW REQUIRED`；**第一责任方为当前直接案卷审核 Pi 后台会话项目**（P04-S03 新增的 owner 隔离补丁），代码落在公共 `apps/electron/src/main/lib/agent-session-manager.ts`。若需要修改通用索引格式、全局会话生命周期或远程事件重放协议，再邀请 **Session Manager / Agent 平台维护者共同评审**；不应未经协调把新技术债解释为其他模块原有缺陷。
- **当前客观事实**：`AgentSessionsIndex.reviewOwnerDeletionTombstones?: string[]` 仅在删除 `review-case` owner 时追加 UUID，没有自动过期、大小上限、压缩或清理机制。原 `agent-sessions.json` 与它一起原子写入。普通会话删除不会追加 tombstone，正常桌面小规模使用空间压力预计较低。
- **容量与热路径风险**：永久数组使 JSON 索引按累计已删除内部会话数线性增长；索引读写会处理整份 JSON。门禁 `isReviewOwnedOrDeletedAgentSessionId` 调用 `readIndex()`（缓存命中仍同步 `statSync` 校验 mtime/size）、在活动会话数组 `find`，并在 tombstone 数组 `includes`，单次查找复杂度约 O(活动会话数 + tombstone 数)。该函数位于 Main stream EventBus、桌面/远程事件广播等**可高频触发**路径。**无真实规模 benchmark，不能据此声称已出现卡顿或容量故障**。
- **为何不可直接 TTL**：tombstone 是阻断已删 review ID 被迟到投影、历史重放/队列及恢复路径误认为普通 ID 的安全凭据。仅靠 7/30/90 天过期不能证明最后一个旧事件已消失；若错误清理，将重引 P04-S03 泄漏。旧版本若未记录 tombstone 的历史删除身份也不能单凭现有索引恢复。
- **建议验收方案**：① 合成 0 / 1k / 10k / 100k 个 UUID tombstone 测定索引体积、冷/热读取、主进程每事件 guard 耗时、写入/启动成本（记录环境、p50/p95、基线）；② 优先评估与现有索引版本同步失效/重建的内存 `Set` 或等效索引以降低热路径查找开销，禁止使用永不刷新的独立缓存；③ 评估是否确需 tombstone 删除/分段存档/压缩，只有证明所有存量重放及可恢复事件都无法再次命中旧 ID、且能回归核验后才考虑 GC，不允许未经证明按年龄自动删除；④ 覆盖原子写失败、进程重启、外部修改索引、旧索引缺字段、普通会话、新/旧 owner ID、伪造与远程重放安全回归。
- **调度建议**：先保持 P04-S03 安全门禁，**不在 P04-S04 顺手重构公共 Session Manager**；安排一轮本项目独立的小批次评估（可在 P04-S04 后、解除 Draft 前决策是否实施），若规模基准暴露明显主线程阻塞则升级优先级并协调平台维护者。技术债记录不改变 P04 阶段 PARTIAL，也不改变 LIVE-01～08 **NOT-RUN**。

### P04-S04 剩余桌面 IPC、跨窗口队列与正常预览早到兼容性（2026-10-12）

- **代码冻结与门禁**：P04-S04 冻结代码 `4c458d24bd73dc3221bc1d13333b50f7752d3054`：[PR CI #38194874977](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38194874977) **SUCCESS**（S04 新增 **8/8 PASS**、全仓 **3768 pass / 5 skip / 0 fail**，3773 tests / 428 files；Typecheck / boundaries / Electron main/preload/renderer build PASS），[D2 #38194874914](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38194874914)、[Review Baseline #38194874938](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38194874938) 均 **SUCCESS**。 仅为 GitHub 隔离 runner 的受控验收，不代表真实双窗口 Electron、真实 Pi 或原件 PDF E2E。先前中途提交 `4d6764e6` 因 Jotai `Store` 类型不兼容发生 CI 类型检查失败；已在 `b369b43f` 用 `ReturnType<typeof getDefaultStore>` 修复，**不把失败的中途 CI 当作 PASS**。
- **Main IPC 审计与定点修补**：`RESTORE_ACTIVE_STREAMS` 现校验主窗口 sender；会话 Graph 的 get/summary/append、Retrospective、Chat→Agent 迁移、会话文件保存、文件路径、目录/文件附件增删均补普通 owner/tombstone 门禁，重点迁移路径不再绕过 owner。SDKMessage 读取、删除、分叉、回退、权限模式、部分会话文件操作增加既有 `assertSensitiveAgentIpcSender`（明确禁止旧 detached 窗口越界）。`FILE_PREVIEW_REPORT/INSPECTION_RESULT` 不可替内部审核会话完成回执。已存在的 GET_TASK_OUTPUT/STOP_TASK、进程管理与受管浏览器按 sessionId 操作继续复用现有检查。
- **无需 sessionId 的 requestId 间接入口**：普通 `GET_PENDING_REQUESTS` 过滤现存/已删除 review owner 请求；`PERMISSION_RESPOND`、`ASK_USER_RESPOND`、`EXIT_PLAN_MODE_RESPOND` 在修改 Main 权限/审批状态**之前**按可信 pending request 的真实 sessionId 校验 owner。普通请求、已删 review owner 请求与未知 requestId 受控回归新增 2 例。
- **普通列表和浏览器推送**：`findOrphanSessions` 的健康报告不再返回内部案卷 ID/标题（新增 1 例）；`browser-controller.ts` 的 `BROWSER_STATE_CHANGED`、文件划词回投与下载拦截通知按 owner/tombstone 在投主窗口前过滤。原 `assertBrowserSessionAccess` 主窗口 + session 检查保持，不扩权到 detached 窗口。
- **Renderer 迟到事件/兼容性**：`ensureOrdinaryWorkTabOwner` 只在本地元数据未知时向 Main `GET_SESSION_META` 查一次，验证 id/非 owner 后补水合；普通归档/草稿/Preview/Browser 正例与隐藏/已删/错 ID/请求失败负例。删除信号触发 `revokedAgentSessionIdsAtom`，阻止正在等待异步结果的预览创建、旧快照列表 merge、SessionUpdate/外部 run/Todo Agent 窗口交接再插入。普通流先到时，最多暂存 4096 条未知会话事件，Main 识别普通 owner 后按接收顺序回放，内部/删除 ID 直接放弃。正式 PPTX `preview_requested` 成功才更新可见刷新版本；无法创建 Tab 会回报明确错误。对应 renderer 测试新增 4（早到正常、伪造/失效、查验途中删除、归档草稿），旧快照 merge 新增 1。
- **已通过的新增例数**：**8/8** = pending/授权 2 + renderer 早到与撤销 4 + revoked 快照 merge 1 + orphan 健康报告 1。全仓标准自动测试回归绿灯；由于没有实机 Electron harness，跨窗口 sender、Main IPC wiring、正式 PPTX 和未知流短队列目前只做静态调用链+类型/构建及相关纯逻辑测试，**不能声称这些路径逐项真实 E2E PASS**。
- **P04-PATH-01（P04-S04 时的历史开放项；2026-10-12 由后续专项受控修补，详见下方 P04-PATH-01 专节）**：`LIST_DIRECTORY`、`READ_DIRECTORY_RECURSIVE`、`OPEN_FILE`、`READ_ATTACHED_FILE`、`FILE_PREVIEW_REVISION` 等**仅按文件路径**授权的公共 IPC 不带 sessionId，无法直接复用 owner/tombstone 校验；即使已有 FileAccessOptions/路径根检查，也尚未证明绝对路径/链接指向 review 私有沙箱时无法通过普通文件预览链路访问。**漏洞可利用性未证实**，必须在以后独立的路径级权限审计中收口或证实安全，验收前不得标全覆盖 PASS。
- **P04-S04-COMPAT-01 状态**：静态原因已确认、修补代码及受控正反例 **PASS**；实际合法普通会话的 Main 响应延迟、4096 条队列上限、预览工具正式 ready/error 回执和多窗口前台重绑 **NOT-RUN**。必要时在真实 LIVE-06/08 发现问题后局部修复，不回退为未知 ID 默认允许。
- **阶段判定**：**P04-S04 受控代码/测试 PASS，P04 总体 PARTIAL**（`P04-PATH-01` 与 LIVE-06/08 未闭环）。P05 全入口仍未执行；真实审核 Main IPC 尚未开放。**LIVE-01～LIVE-08 全部 NOT-RUN**。不合并、不解除 Draft。

### P05-S01 Pocket 间接 ID + 旧版文件预览 + WS 重放定点隔离（2026-10-12）

- **代码冻结与受控结果**：P05-S01 冻结代码 `2a08e439d19a0d2eea572003b6ad2d71d33ca3c0`：[PR CI #38198346287](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38198346287) **SUCCESS**（本批 **5/5 新增受控 PASS**、全仓 **3773 pass / 5 skip / 0 fail**，3778 tests / 429 files；Typecheck、包边界、Electron build PASS），[D2 #38198346297](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38198346297)、[Review Baseline #38198346361](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38198346361) **SUCCESS**。 此结果只证明本批受控文件/请求路由及 replay 过滤，**不是 Pocket 真实 WS 连接或 Feishu 真实群 E2E**。
- **审计发现 / 定点修补**：`remote-service.ts` 原 `get_pending_interactions` 未按 owner 过滤权限、AskUser、ExitPlan 请求快照（不提供 sessionId 即可读所有）；三条 `respond_permission/respond_ask_user/respond_exit_plan_mode` 仅按 requestId 触发 Main 服务。现在先使用真实 pending request 的 sessionId 进行 owner/tombstone 筛选，再答复；已删 owner 同样无法响应，正常普通请求仍允许。Pocket 文件预览 `resolve_and_read_file` / `read_file_as_data_url` 的顶层 sessionId 已有旧守卫，但兼容分支 `access.sessionId` 与连接级 `activeSessionId` 原先未再次判定 owner，现在在取得 meta/读取路径前拒绝。旧事件在写日志前已有 S03 保护，但**删除后**历史内存 replay/正在等待握手的 queued live records 可能含旧 payload；新增 `selectOrdinaryRemoteReplayRecords` 并在 `sendAgentEventRecord` 发送前二次检查，同时保留普通事件 ID 顺序。进程内 replay log 本身不落盘。
- **5 项新增受控测试**：① 三类全局/按普通会话待审请求快照只包含普通 owner；② 隐藏 permission requestId 不执行 respond，普通仍执行；③ 隐藏 AskUser 与 ExitPlan 不执行 respond，普通仍执行；④ 两个旧版文件命令别名、`access.sessionId`、连接上下文、live/deleted owner 拒绝而普通不被误拒；⑤ replay/queued owner 删除前后均拒绝、普通事件顺序保持。测试路径：`apps/electron/src/main/lib/review/review-remote-indirect-access.p05.test.ts`，使用合成会话/隔离 `PROFER_CONFIG_DIR` + Main service spy。
- **中途 CI 记录**：`b827c869` 的首版测试因测试代码访问 `CommandResult` 联合类型未经 narrowing，D2 Typecheck FAIL；`2a08e439` 已修复，以上冻结 CI 三套全部 SUCCESS。不得把失败中途提交算作通过。
- **P05-S02 历史计划（现已执行，以下 S02 记录为准）**：`feishu-bridge-manager.ts` 的 `ensureSessionMirror`/`startSessionMirrorRun` 未主动拒绝 owner；`feishu-bridge.ts` 的旧 chat binding 恢复、`updateBinding`、`listBindings`、`handleAgentPayload` 及 stop/用户发消息路径需要按隐藏/删除 owner 逐条验证。飞书 `/list`/`/switch` 当前复用 `isVisibleAgentSession`，不可用此证明镜像和旧绑定安全。保持真实飞书连接 **NOT-RUN**。
- **P05-REMOTE-PATH-01 S01 记录（已由 P05-S03 定点修补，见下方新证据）**：远程 `chat_read_attachment` 的 `localPath` 为独立 Chat/附件读取入口；`resolve_and_read_file` 已加嵌套 ID 拒绝，但尚未验证所有路径型附件命令、软链接以及工作区共享根的 review 沙箱隔离。连同 `P04-PATH-01` 待后续专项审计，不能以本批覆盖。
- **重放剩余风险**：`hello` / `agent_events_resumed` 的 cursor、oldest/latest Event ID、relay 与真实多客户端握手尚未建立整条端到端证据；当前按发送 ID 拦截主要防止 payload 泄漏，不宣称历史 cursor 元信息全部最小化。P05 仍 **PARTIAL**。
- **验收安排**：用户已倾向 **P05 全部小批与 Main 真实后台审核 IPC 接通、安全门禁收口之后，P06/P07 前进行 A0 首次功能实机验收**；A0 只是计划，尚未运行或代签。29 号 LIVE-01～LIVE-08 全部 **NOT-RUN**，尤其 LIVE-06/08 不变。PR #21 保持 Draft / Open / NOT MERGED；本轮在 P05-S01 停止。

### P05-S02 飞书旧绑定、镜像、事件及群消息 owner 隔离（2026-10-12）

- **代码冻结 / 测试**：P05-S02 冻结代码 `ae8d6398b3f818abd2d648ea14876c6c5800e164`：[PR CI #38200646046](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38200646046) **SUCCESS**（本批 **7/7 新增受控 PASS**、全仓 **3780 pass / 5 skip / 0 fail**，3785 tests / 430 files；Typecheck、边界、Electron main/preload/renderer build 均通过），[D2 #38200646047](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38200646047)、[Review Baseline #38200646059](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38200646059) 均 **SUCCESS**。 新增测试 `apps/electron/src/main/lib/review/review-feishu-owner-boundary.p05.test.ts`。七项分别覆盖 ① 旧 chat 绑定落盘恢复 owner vs 普通，② 已删 owner 残留绑定对列表/状态不可见，③ 绑定设置更新拒绝隐形 owner 目标/源，④ 模拟连接正常普通会话可创建镜像而隐藏/已删 owner 不触发建群，⑤ 旧绑定禁止群内 `/stop`、启动 Agent、`/now`、`/model` 访问，⑥ Agent EventBus 的 live/deleted owner 消息拒绝，普通通知保留，⑦ manager 层镜像创建/启动/停止不向 Bridge 转发隐藏 owner。
- **实际修补**：`feishu-bridge.ts` 在持久化绑定恢复、返回绑定快照与状态数、`updateBinding`、直接镜像创建及运行前、镜像停止、`findBindingBySessionId`、群消息入口、停止/状态/模型命令、EventBus、`handleFeishuSessionComplete`、`sendAgentReply`、主动通知 `sendCardToChat` 与镜像群名称更新处复用 `isReviewOwnedOrDeletedAgentSessionId`；`feishu-bridge-manager.ts` 在镜像创建/开始/停止入口同样先拒绝。**owner 元数据即使在调用方被剥去也不能绕过 ID/tombstone 门禁。** `/list`、`/switch` 原有 `isVisibleAgentSession` 守卫保留，不靠 Renderer 隐藏。
- **范围与未证事实**：受控测试采用隔离 `PROFER_CONFIG_DIR`、合成案卷/工作区和虚拟连接桩，没有启动真实飞书 Bot 或网络回调。未测试真实飞书群创建、群成员权限、断线重连、卡片推流/完成、旧版群卡片 ACK、多个 Bot 同时在线，均 **NOT-RUN**。异步发送与删除同时发生的真实端到端时间窗仍待联调。P05-S02 是**局部受控 PASS，不是完整 P05 PASS**。
- **P05-S03 旧计划（已执行，本项证据以新增 S03 专节为准）**：独立审计 `P05-REMOTE-PATH-01`：Pocket `chat_read_attachment` 等仅凭路径调用与旧版 `access.sessionId`、连接级回退、软链接/共享 workspace 根组合，确认正常普通会话可读、内部 review 沙箱不可越界。若需修补仅针对发现的边界。后续再核对 WS/relay/snapshot 全量重连、Feishu 真实 E2E；不得在 S03 偷跑 Main 审核 IPC。
- **长期开放门禁**：`P04-PATH-01` 普通桌面无 sessionId 文件 IPC 尚未证实安全；`P04-TECHDEBT-01` tombstone 热路径/GC 未排期；LIVE-01～08 **全部 NOT-RUN**。用户同意的 A0 首次实机节点是 **P05 防护闭环 + Main 审核 IPC 接通后、P06/P07 前**；本轮未执行 A0，PR #21 **Draft / Open / 未合并**，本轮到 S02 即停。

### P05-S03 远程 Chat 附件、共享工作区根及符号链接路径隔离（2026-10-12）

- **冻结代码、CI、例数**：P05-S03 冻结代码 `fe89861a52a99836d5d458a528f1d8d9e885ff70`：[PR CI #38201737608](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38201737608) **SUCCESS**（本批 **7/7 新增受控 PASS**、全仓 **3787 pass / 5 skip / 0 fail**，3792 tests / 431 files；Typecheck、包边界及 Electron main/preload/renderer build PASS）；[D2 #38201737615](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38201737615)、[Review Baseline #38201737635](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38201737635) **SUCCESS**。 新增 `apps/electron/src/main/lib/review/review-remote-path-access.p05.test.ts` 共 **7 项**（使用隔离的 `PROFER_CONFIG_DIR`、真实临时磁盘目录与合成会话，不使用真实案卷/凭据）。
- **缺口确认**：旧 `chat_read_attachment` 调用 `readAttachmentAsBase64` 接受 app config 根内任意绝对路径（单凭 remote token，未建立与特定 Chat 附件目录的授权边界）；`chat_delete_attachment` 接收未经严格限制的 localPath；`resolve_and_read_file/read_file_as_data_url` 原真实 realpath/工作区授权虽阻挡“逃出 root 的符号链接”，但 `getAgentWorkspacePath(slug)` 本身包含隐藏 review owner's `<sessionId>/`，所以同工作区普通 Pocket 可经父目录命中隐藏材料。均属于**代码上的确认问题**，不等于已在真实 Pocket 终端成功利用。
- **最小修复**：`resolveAuthorizedRemoteChatAttachmentPath` 仅接受 realpath 后仍落在 dedicated `attachments/` 根内的本地附件（既保留根内相对路径，也兼容根内绝对路径）；remote `chat_read_attachment` / `chat_delete_attachment` 使用同一校验，越界一律拒绝、不执行读删。普通 Pocket 文件预览的 `resolveAuthorizedRemoteFilePath` 增加可选 `denyPath`，在**拼接候选路径和 realpath 目标**均执行 `isReviewPrivateConfigPath`，按 existing Main `isReviewOwnedOrDeletedAgentSessionId` 检查 `agent-workspaces/<slug>/<reviewSessionId>/`、`agent-sessions/<reviewId>.jsonl` / `remote-uploads/<reviewId>/` 和 `agent-checkpoints/<reviewId>/` 等已知布局。绝不借用户提交的 `candidateBasePaths` 授权。
- **7 项受控正反例**：① Chat 相对及 `attachments/` 内绝对路径读取/合法删除；② Chat 不能读删 owner 私有文件、其它 app 配置、前缀相似目录或指向私有区的符号链接；③ 普通 Pocket 两种别名仍能读正常会话和共享文件；④ 同工作区隐藏 sibling 的绝对/相对/旧版 `access.sessionId` 路径拒绝，删后残留目录仍按 tombstone 拒绝；⑤ 符号链接别名和显式 attachedFiles/attachedDirectories 指向私有区依旧拒绝；⑥ 跨工作区与外链拒绝，原普通共享文件仍可读；⑦ owner 文件、SDK transcript/checkpoint known layouts、已删 tombstone 能被纯路径守卫识别。
- **范围结论**：`P05-REMOTE-PATH-01` 在本批审计的 **Chat 读删及两种 Pocket 文件预览命令**得到受控正反例的封闭证据；其它未枚举的远程文件搜索、WS/Relay、真实 Pocket 回放、别的配置路径布局和实际文件修改并发时序尚未全覆盖，P05 整体 **PARTIAL**。Legacy Chat 的任意 app config 绝对路径读取能力被有意收紧；若旧客户端依赖 Agent 工作区任意绝对路径调用 `chat_read_attachment`，需要迁移到携带普通 sessionId 的 Pocket 文件预览指令，真实兼容性列 LIVE-06/08。
- **不能连带放行**：桌面 `P04-PATH-01` 无 sessionId IPC 未改变，仍是阻断级安全证据缺口；`P04-TECHDEBT-01` tombstone 性能/安全回收另存。Main 业务后台接线、A0、LIVE-01～08 均 **NOT-RUN**；PR Draft/Open/未合并。
- **P05-S04 历史计划（现已执行，详细结果见后面的 S04 专节）**：审计 Pocket/relay/WS 重连与快照、Agent event history、按 ID 远程命令/工作区搜索和残存文件型入口的隐藏/已删 owner 隔离；开展同样的普通会话正例和 owner/tombstone 负例。之后再谈首次 Main IPC 接线及 A0；不提前做 P06/P07。

### P05-S04 Pocket 搜索快照、事件 replay/续传与嵌套会话 ID 隔离（2026-10-12）

- **冻结代码与 CI**：P05-S04 代码冻结 `fa6a2a250e6fee0d956ab2ad045812bacd5f3c2c`：[PR CI #38232065193](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38232065193) **SUCCESS**（新增 **8/8 受控 PASS**；全仓 **3795 pass / 5 skip / 0 fail**，3800 tests / 432 files；类型检查、边界和 Electron main/preload/renderer build 均通过）；[D2 #38232065271](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38232065271)、[Review Baseline #38232065165](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38232065165) 均 **SUCCESS**。 文件变更：`remote-workspace-file-search.ts`、`remote-service.ts`、`remote-file-access.ts` 与新增 `review-remote-reconnect-search.p05.test.ts`。本批修改范围限定为普通远程 metadata/队列引用边界，不改 Agent 运行内核或 Renderer。
- **确认的缺口**：`search_workspace_files` 原先会返回普通会话/工作区显式附加的 owner 目录、文件名与绝对路径，虽然 S03 最终读取命令会拒绝，**搜索结果已产生元数据泄漏**；`queue_message` 原仅检查顶层 `sessionId`，但嵌套 `mentionedSessionIds` 能把 hidden/deleted owner ID 提交给普通会话的消息队列，具体下游实际读取结果未获实机验证。另经代码审查确认：搜索私有目录本身必须过滤，不能只过滤它下面的文件；`isReviewPrivateConfigPath` 的工作区布局判定已扩展到目录根。
- **修复**：`searchRemoteWorkspaceFiles` 添加 opt-in `denyPath`，目录扫描/附加 root 文件/符号链接均同时对候选和 realpath 做 Main owner/tombstone 判定；正常 session、workspace-files 和普通附加路径不被阻断。`remote-service.ts` 向远程搜索传同一私有路径判定，向 `queue_message` 添加嵌套 owner ID 拒绝。旧 `access.sessionId` 文件预览、Chat 读删权限仍由 S01/S03 门禁负责，未重复实现。
- **新增 8 个受控测试**：① `list_sessions` + `get_agent_runtime_contexts` 在删除前后不泄漏 owner；② 附加 owner 路径与共享正常文件搜索结果隔离；③ private 文件名检索与删后残留子目录拒绝；④ 文件/目录 symlink 别名及显式 attachedPaths 拒绝；⑤ 纯搜索保留普通文件正例；⑥ `queue_message` 嵌套 live/deleted review ID 拒绝、普通 ID 不被 owner 门禁误拒；⑦ 合成旧事件日志在重放 cursor 时过滤 owner，正常顺序保持；⑧ 日志窗口过期要求 snapshot，不能盲补不完整事件。测试用隔离 `PROFER_CONFIG_DIR`、合成目录/会话、`RemoteAgentEventLog` 进程内重放逻辑；**未启动真实 WS/Relay 连接**。
- **受控结论**：S04 所列搜索/嵌套 ID/快照及进程内 replay 验证 **PASS**。现有 WS 本地握手与 replay gating、Relay `resume_agent_events` 显式 `requiresSnapshot` 降级在源码上存在，但真实连接互交、同一条连接多个请求、断连重连、丢包、异步竞态、Relay 跨 viewer 路由及事件 payload 间接跨 owner 仍没有端到端证据，不得称 S04 完成真实网络验收或 P05 总体 PASS。
- **P05-S05 历史下一小批（现已执行；见后续 S05 专节）**：专门做受控真实 socket/loopback 与 Relay 适配层的握手、cursor、乱序/旧事件、过期 snapshot、同/多 Pocket viewer 等传输边界及其它 `AgentStreamPayload` 嵌套会话引用审计；只修确认问题。真实飞书群、实际异地网络、手机 Pocket 验证统一保持 LIVE / 实机 NOT-RUN。
- **阻断门禁不变**：`P04-PATH-01`（桌面无 sessionId 通用路径型 IPC）仍未闭环；`P04-TECHDEBT-01` 单列。`P05` 整体 **PARTIAL**；Main 真实后台审核 IPC、A0、LIVE-01～08 均 **NOT-RUN**，PR #21 持续 Draft/Open/未合并。

### P05-S05 本机 LAN WS + 模拟 RelayClient 真实 socket、重连与结构化 payload 隔离（2026-10-12）

- **代码冻结/受控证据**：P05-S05 冻结代码 `88b941337749028ae3c51ff0db117c44ceb4d7aa`：[PR CI #38254196437](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38254196437) **SUCCESS**（新增 **8/8 real-loopback/受控 PASS**，全仓 **3803 pass / 5 skip / 0 fail**，3808 tests / 433 files；Typecheck、package boundaries、Electron main/preload/renderer build PASS）；[D2 #38254196484](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38254196484) 与 [Review Baseline #38254196442](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38254196442) 均 **SUCCESS**。 新增 `apps/electron/src/main/lib/review/review-remote-websocket-relay.p05.test.ts` 共 8 项；实际启动 `remote-service` LAN WebSocket server 与两个 socket 客户端，另启动模拟中心 `WebSocketServer` 供真正的 `RemoteRelayClient` 建连、断线再连。测试数据均为隔离 `PROFER_CONFIG_DIR` 下的普通/内部合成会话和模拟 Relay ticket，不依赖手机、真实飞书或生产中心。
- **确认修复 #1 / Relay 多 viewer**：`remote-service.ts` 原 `remoteRelayCommandContext` 在一个 desktop relay 连接上跨 viewer 复用，会把后一个不带 `sessionId` 的旧版 Pocket 文件预览指向其他 viewer 上次声明的 `activeSessionId`。现在统一由新增 `handleRemoteRelayCommand` 不带会话回退上下文处理，legacy Relay 无 ID 的文件预览返回缺参；携带普通 ID 的 Relay 预览仍成功。本地 LAN 每条连接独立的 legacy `activeSessionId` 回退**保留**，真实 socket 正例通过。**兼容性变化**：旧 Relay viewer 必须升级到明确传 `sessionId` 的文件命令；真实旧端行为待 LIVE。
- **确认修复 #2 / 普通外层事件夹带内部 ID**：此前 remote 只校验 event envelope 的 `sessionId`，普通会话的 `profer_event` 若在结构化 metadata 的 `targetSessionId`、`relatedSessionIds` 等字段引用内部 owner，仍可能在 WS/relay/旧 replay 暴露。现在 `mayPublishAgentEventToRemote` 对 `profer_event.event` **结构化 ID 字段**做 owner/deleted tombstone 检查；广播前、单客户端发送前、RemoteAgentEventLog 重放前复核。没有无界解析 SDK 文本/任意 tool payload；深层动态/字符串编码引用尚无完整证明，需在后续集成审计中评价。
- **8 项实际 socket 与协议测试**：① 真 LAN WS token `hello` 与错误 token 4001；② 两个 viewer 独立 replay gate、owner 事件拒绝、正常事件放行；③ 断连重连按 cursor 有序补 ordinary 事件、返回 ACK；④ 删除后的 owner、普通事件中的嵌套 owner ID 在 live/reconnect 中拒绝；⑤ 无效 cursor 显式 `requiresSnapshot`，不发送旧 replay；⑥ 本地 LAN 旧版 session_detail→无 sessionId 文件预览兼容正例；⑦ Relay 无 ID 文件拒绝、带显式普通 ID 允许、内部 ID 拒绝；⑧ 实际 `RemoteRelayClient` 到本机模拟 Relay socket 的 `relay_auth`、`hello`、断线后重新建连与关闭 sink。代码提交过程中初次 D2 因测试脚手架 WS TypeScript 声明失败（[#38253917752](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38253917752)），已最小修补，**冻结代码三套 CI 成功**。
- **真实 vs 尚未执行**：本轮是真正的**本机 TCP/WS socket + 模拟 Relay server**，不是只调用 replay 纯函数；但 Relay ticket 为 spy 测试桩，未接生产中心 `profer.cn`，没有验证中心端将多个 viewer 的 `command_result` 定向给正确客户端、真实重登/多网络、流式跨端延迟与票据轮转，没有手机 Pocket 或真实飞书群。因此 Relay **传输受控 PASS / 生产网络与多 viewer 路由 NOT-RUN**，不可声称 P05 全阶段或 LIVE-06/08 PASS。
- **P05-S06 下一小批（本轮不执行）**：聚焦真实中心 Relay 协议契约或可运行的端到端多 viewer relay service fixture，核验 `command_result` 的 `requestId/commandId` 隔离、跨 viewer 消息路由和重连、剩余 `AgentStreamPayload` 深层结构化 ID 来源；仅修有证据的缺口，保留普通会话正例。不新增 Main 审核业务 IPC，不推进 P06/P07。若生产中心不可访问，应写明阻断，不能模拟 PASS。
- **阶段/门禁**：S05 **受控 PASS**，P05 整体 **PARTIAL**；`P04-PATH-01` 桌面无 sessionId 文件 IPC、`P04-TECHDEBT-01`、真实 Electron/飞书与 A0 均待验。LIVE-01～LIVE-08 **全部 NOT-RUN**；PR #21 持续 Draft/Open/未合并。

### P05-S06｜桌面 Relay 多 viewer 回执契约、深层 payload 隔离与生产中心阻断（2026-10-13）

- **受控结果与阶段状态**：**P05-S06 DESKTOP ADAPTER / LOCAL ROUTING FIXTURE CONTROLLED PASS；PRODUCTION CENTER ROUTING NOT-RUN / BLOCKED；P05 整体仍 PARTIAL**。本批未获取 `profer.cn/remote/ws` 中心 Relay 服务端源码、正式 viewer→desktop→viewer 路由合同、获授权的生产多 viewer 会话/票据，因此**不得把模拟中继的正确转发归功于生产中心**。
- **代码与 CI**：代码冻结 [`aaf1ca89`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/aaf1ca890a37d679a52e3e79cf10d9f588ce25e5)；[PR CI #38282086761](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38282086761)、[D2 #38282086959](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38282086959)、[Review Baseline #38282086722](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38282086722) **SUCCESS**；新增 **6/6 PASS**，全仓 **3828 pass / 5 skip / 0 fail（3833 tests / 436 files）**，Typecheck、边界与 Electron 构建均通过。首次代码提交 [`60383db6`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/60383db63243a99ce2a3a74e766f5b665e8ba3a4) 的 PR/D2 因新增测试 `records[1]` 严格数组索引类型推断失败（TS2769），随后在 `aaf1ca89` 改为已知类型的 `records.slice(1, 2)`；失败 CI 保留 [#38281879589](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38281879589)，不作 PASS。
- **代码修补（`remote-service.ts`）**：`mayPublishAgentEventToRemote` 过去只扫描 `kind:profer_event` 的 `*SessionId/*SessionIds` 字段，且超过深度 12 时直接返回“没有私有引用”。现在继续不扫描 SDK 原文/任意文本，但覆盖结构化 `profer_event` 与 `session_projection`、嵌套的 `session.id` 和当前 `owner`、camelCase/snake_case 会话 ID；超过深度 32 或 12000 个对象采取 fail-closed，避免递归限额成为泄漏窗口。继续复用 Main owner/tombstone 和 replay/send 两次门禁，不扩张普通文件路径和远程请求的既有授权。
- **六项新增测试（`review-relay-multi-viewer-contract.p05.test.ts`）**：①桌面 Relay 适配器通过**真实本机 WS socket**与合成中继、两个合成 viewer 往返：两个客户端使用同一业务 `requestId`、不同 `_cmdId`，各自结果正确、hidden owner 返回拒绝；②第二 viewer 不继承另一 viewer 的无 ID 文件预览上下文，viewer 重连收到 `requiresSnapshot: true`；③ owner 删除后的 tombstone 仍拒绝，普通会话可用；④深层 owner/snake_case 数组引用被拒绝，普通文本包含 UUID 不误拒；⑤隐藏 `session_updated.session.id`、`session_projection.session.id` 被拒绝，普通 metadata、SDK 文本仍可用；⑥异常深度控制事件 fail-closed，旧 replay 中嵌套 owner 记录不会再次外发。**中心 fixture 是我们写的路由模型，不能证明生产服务端按其实现。**
- **服务端事实与协议缺口（P05-RELAY-ROUTE-01 / BLOCKED）**：当前本仓库仅发现 `remote-relay-client.ts` 的桌面 outbound WSS 与 `remote-service.ts` 适配层，无 `/remote/ws` 中心端 viewer 映射代码；桌面返回的 `command_result` 只有 `requestId/commandId`，**没有经过验证的 viewer 路由标识/绑定证明**。生产必须由中心服务端证明它将 viewer 的 socket/会话与 pending `_cmdId` 原子关联，只把响应发送到原 viewer，断线删除映射，禁止跨 viewer 广播及不同 viewer 同 `_cmdId` 碰撞导致混发。还必须验证 ticket 签发校验、重新登录、重连、重复/迟到回执、并发和 cursor；没有真实票据/服务端时保持 NOT-RUN，不伪造生产 PASS。
- **客户端事实与阻断风险（P05-POCKET-FIFO-01 / OPEN）**：在独立公开仓库 [Profer-pocket `ws-client.ts` L387–412](https://github.com/Yuan-lai-ru-ci/Profer-pocket/blob/main/src/renderer/pocket/ws-client.ts#L387-L412)，`resolveCommandResult` 遇到**非空但不匹配**的 `commandId/requestId` 时仍可能进入 FIFO fallback，错误完成另一个 pending 命令。该逻辑可由源码确认，但**生产中心是否会把不匹配回执送错 viewer 未证实**；不能把条件风险写成已发生泄漏。客户端维护者应使 FIFO 仅在完全无关联 ID、且兼容性条件满足时允许，非匹配有 ID 回执不得消费任一 pending 或写入错误 Remote Store；中心端还需独立证明响应定向。此仓库无对 Profer-pocket 的写入权限，**未擅自改动另一个仓库**。
- **验收下一步**：获取中心 Relay 服务端可执行协议测试/源码或安全的授权测试账户，且验证两个真实 viewer（含相同/冲突 `_cmdId`、不同业务 `requestId`、掉线旧回执、重连）及客户端错配回归，补来源、原始日志和精确 frozen SHA；否则 P05 保持 PARTIAL，不解除 Draft/不合并。真实 Electron/Pocket/Feishu、A0 与 LIVE-01～08 均 NOT-RUN，未开始 Main 业务 IPC、P06/P07/P08。保留 P04-TECHDEBT-01 之前的历史与容量追踪完整记录。

### P05 阶段级独立复核与跨仓修复交付（2026-10-13）

- **归档**：[32｜完整验收矩阵、两项阻断、补丁应用和实机清单](32-p05-stage-acceptance-and-local-gates.md)；代码冻结 [`ce992f90`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/ce992f90880ecde1954e925b63585692a085f621)，三套 CI [PR #38284532497](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532497)、[D2 #38284532492](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532492)、[Baseline #38284532487](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532487) 均 SUCCESS；P05 六个文件 **43/43 PASS**（8+7+7+8+8+5），全仓 **3830 pass / 5 skip / 0 fail**（3835 tests，436 files）。
- **六批逐个结论**：S01 **5/5**、S02 **7/7**、S03 **7/7**、S04 **8/8**、S05 **8/8**、S06 **8/8**，合计 **43/43**，均由最终代码 CI 原始日志的测试文件分组逐条核对。新增中心 fixture 2 个受控真实本机 socket 反例：两 viewer **相同** `_cmdId` 时生成 center 内部唯一关联 ID 并回填 viewer 本地 ID；viewer 断线后遗留回复不得交给使用相同 ID 的新 viewer。fixture 只表示中心**必须满足的合同**，不是生产服务端实际实现。
- **P05-POCKET-FIFO-01**：已提供 [Pocket 上游可应用补丁](patches/P05-POCKET-FIFO-01-Profer-pocket.patch) 与 3 项目标客户端测试，针对独立 [Profer-pocket@95e79f11](https://github.com/Yuan-lai-ru-ci/Profer-pocket/commit/95e79f11003006f4386b7f96540fa61f45bdd965) 固定版本。两处 diff hunk 对其实际源/测试文件逐行比对正确；**当前连接对上游 push=false，无法替用户写入独立 Pocket 仓库，未执行其 git apply、Bun test、真实 Pocket 构建或上游 CI，故 PATCH READY / TARGET NOT-RUN 而非 FIXED**。非匹配 ID 不进入 FIFO、Remote Store 回调，缺 ID 时仅一个 pending 才允许兼容，这些是补丁设计与静态检查结果，必须上游执行验收。
- **P05-RELAY-ROUTE-01**：生产中心 `profer.cn/remote/ws` 服务端实现/测试授权仍不可得；本仓库的真实 desktop outbound WS + 合成中心局部协议验证 PASS，但中心部署 **BLOCKED/NOT-RUN**。生产中心必须使用**全局唯一内部 correlation + 每 viewer 身份/连接 epoch + 原 ID 恢复 + 断线删除**，防不同 viewer 碰撞/迟到回执。由中心维护者提交服务端和实机证据后方可变更状态。
- **总体 verdict**：**CODE/CONTROLLED PASS / E2E BLOCKED / P05 PARTIAL / MERGE NO-GO**。不能声称 Pocket 与 Relay 两项问题在其生产代码里已解决，也不能声称 A0、LIVE-01～08 完成；保留项目现有 P06/P07/P08 和 Main IPC 阶段门禁。**P04-TECHDEBT-01 原始立项、容量表、TTL/GC 禁止策略和历史结论完整保留，下段不覆写**。

### P04-PATH-01 低层路径型桌面 IPC 审计、最小收口与补测（2026-10-12）

- **冻结代码/CI**：P04-PATH-01 冻结代码 `9eec2311b9ed8f5637f8bf6fa281605040899c39`：[PR CI #38260093230](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38260093230) **SUCCESS**（新增 **9/9 受控 PASS**；全仓 **3812 pass / 5 skip / 0 fail**，3817 tests / 434 files；typecheck、边界、Electron main/preload/renderer 构建通过）；[D2 #38260092950](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38260092950) 与 [Review Baseline #38260093231](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38260093231) 均 **SUCCESS**。 新测试 `apps/electron/src/main/lib/review/review-desktop-private-path.p04.test.ts` **9/9 PASS**；新增/修改 `review-private-file-access.ts`、`preview-path-policy.ts`、`local-file-protocol.ts`、`file-search-service.ts` 与 `ipc.ts`。P05-S06 未执行，本轮未改任何正式审核业务 Main IPC/P06/P07。
- **确认的路径级缺口**：① 根内/根外只读预览策略能访问同工作区隐藏 owner 的文件；② `LIST_DIRECTORY`、`READ_DIRECTORY_RECURSIVE`、`READ_ATTACHED_FILE` 等按路径操作未统一拒绝内部审核目录/符号链接；③ `SEARCH_WORKSPACE_FILES` 和 `file:search-candidate` 虽返回而未打开文件，但会泄露内部审核目录/文件名；④ `cdut-file://` 目录级 token 注册后可定位其下的私有相对资源，不能只在 token 注册时检查。**以上属于代码权限设计的确认缺口，不代表已在真实 Electron 或实际恶意客户端复现利用。**
- **修补范围与安全边界**：`isReviewPrivateDesktopPath` 用 Main 的 `isReviewOwnedOrDeletedAgentSessionId`（索引与 tombstone）识别 `agent-workspaces/<slug>/<id>`、私有消息 `agent-sessions/<id>*.jsonl` 和 `agent-checkpoints/<id>` 等已知布局，在**原始/规范化路径与 symlink 真实目标**双重检查；仅拒绝私有目标，不改变普通预览授权根的正向判定。共享工作区/父目录可以列/递归，但过滤私有子项；直接私有文件/文件夹拒绝；附加目录读取拒绝；`OPEN_FILE`、`SHOW_IN_FOLDER` 和危险的 workspace 容器级变更不绕过；普通附加目录/工作区其它文件继续允许。 `file:search-candidate` 在递归/直接 target 搜索两条路径均检查，`SEARCH_WORKSPACE_FILES` 路径型 @ 搜索在扫描根/子项/附加路径时过滤。 `local-file-protocol` 的注册入口与每个 `handleProferFileRequest` 目标均执行 deny，已有父目录 token 也不能用于访问私有子资源。
- **9 项合成磁盘正反例**：① 同工作区普通文件读预览允许、内部 owner 文件/目录拒绝；② 共享目录和外部指向私有文件的 symlink 别名拒绝；③ 私有消息与检查点位置在 live/deleted tombstone 后仍拒绝；④ 目录列表 owner 项/文件名不可见、普通项保留；⑤ 删除/重命名/移动类泛用操作不能触及审核内部 root 或整个 workspace 容器；⑥ 直接 `cdut-file` 私有文件/目录注册拒绝；⑦ 已注册普通父目录 token 下读取内部文件返回 403；⑧ 候选文件搜索在共享父目录中不会搜索到内部文件名，普通文件仍搜到；⑨ owner 删除后相同目录 token 不能通过残留私有文件。测试使用临时隔离 `PROFER_CONFIG_DIR`、虚构普通/内部会话和真实文件/symlink，没有使用真实案卷或 Electron 主窗口。
- **回归与修正记录**：首次 [PR CI #38259407202](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38259407202) 出现 **1 error（3807 pass / 5 skip / 1 fail）**，原有 `ppt-style-pack-service.test.ts` 导入阶段因引入完整 Session Manager 而提示 `electron.safeStorage` 缺失；确认是公共预览模块的依赖回归，并已改为私有布局匹配时按需查询主进程索引。最终冻结 SHA 所有三套 CI 为 **SUCCESS**，没有将中途失败抹除。
- **结论**：`P04-PATH-01` **已枚举的桌面通用路径入口受控 PASS，代码级风险从“未审/未证明”变为“已修并有正反例”**。仍不宣称真实 Electron/preload/多窗口主流程 E2E PASS；低层 FS 访问存在通常的文件变化/符号链接替换时间窗，运行时观察由 LIVE-06/08 检查。普通文件操作的 workspace 根目录整体删除被有意禁止，可能影响旧版手动管理方式，需实机复核；Native 用户主动通过系统选取目录的动作有独立用户选择信任边界，本批未替它造伪造 renderer 路径证明。P04 整体 **PARTIAL（仅实际桌面 LIVE 等未验）**。
- **本轮停点**：27/29/30/31 + PR #21 同步，本轮仅关闭 `P04-PATH-01`，不推进已排定 `P05-S06`、Main 业务 IPC 或 P06/P07/P08。P05 **PARTIAL**，首次 A0 **NOT-RUN**，LIVE-01～LIVE-08 **全部 NOT-RUN**，PR 保持 Draft/Open/未合并。


### P04-PATH-01 复核补丁：重命名／移动的最终目标路径门禁（2026-10-12）

- **发现过程**：旧 9/9 PATH 测试及其 CI 均真实通过，但独立审计确认 `RENAME_FILE`、`MOVE_FILE`、`RENAME_ATTACHED_FILE`、`MOVE_ATTACHED_FILE` 的实际 `renameSync(source, destination)` 只覆盖源路径或目标目录授权，未统一检查**最终 destination 路径**是否属于 review owner/tombstone。旧测试主要断言 `isUnsafeAgentWorkspaceMutationPath`，没有真正执行上述变更后的文件系统结果。属于确认的代码门禁缺口；未声称已从真实 Electron 恶意 Renderer 复现攻击。
- **修复与边界**：`review-private-file-access.ts` 新增 `renameOrdinaryAgentFileEntry(source, target)`，在**真实 renameSync 前**拒绝源／最终目标涉及 review owner、已删除 tombstone 或共享 workspace 容器；四个 IPC 统一调用。普通 Agent 的既有会话和目录授权仍由 IPC 保持，`RENAME_FILE`、`MOVE_FILE` 另对最终目标复用 `assertInsideAgentWorkspaces`。由于新目标常不存在，不强行对其施加要求目标文件已存在的只读授权。私有路径策略补上**最近已存在父目录的真实路径解析**，防止不存在目标文件的父级 symlink 指向审核私有目录。
- **代码与 CI**：冻结代码 [`7c5e003c`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/7c5e003c5c1a01dc295e1ff0e4c6ce15e4da42f0)；[PR CI #38269830272](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38269830272)、[D2 #38269830328](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38269830328)、[Review Baseline #38269830273](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38269830273) **全部 SUCCESS**；新增 **5/5**，全仓 **3817 pass / 5 skip / 0 fail（3822 tests / 434 files）**，typecheck/边界/Electron build PASS。
- **新增 5 项受控实际磁盘变更测试**：①普通文件不能覆盖已存在的内部审核 JSONL，而正常重命名可用；②不能在审核 workspace 新增文件；③父级 symlink 指向审核目录且最终文件不存在时仍拒绝，正常 workspace 移动可用；④删除 owner 后 tombstone 拒绝旧私有目标；⑤工作区整体容器不允许被移动。新增测试验证的是**四个 IPC 共同调用的真实生产文件变更函数及磁盘结果**，不是在 Electron BrowserWindow/preload 中直接驱动四个注册 IPC。
- **余留门禁**：路径验证与文件系统调用之间仍有一般的符号链接/目录替换 TOCTOU 窗口，跨 OS 行为与真实 Electron IPC/普通旧工作流未实机验收；继续纳入 **LIVE-06/08 NOT-RUN**。不能将 CI 和共享函数测试写成真实攻防 E2E 完成；P04 仍 PARTIAL。原 9/9 历史证据保留，不抹除首次独立审计发现的遗漏。
- **停点**：本轮只回补 P04-PATH-01 的 destination 缺口，不执行 P05-S06、Main 审核业务 IPC、P06/P07/P08，不解除 Draft，不合并 PR；A0 与 LIVE-01～08 全部 NOT-RUN。


### P04-TECHDEBT-01 执行批：索引热路径优化、规模基准与安全留存决策（2026-10-12）

- **最终状态：PERFORMANCE MITIGATED / RETENTION POLICY DECIDED / CAPACITY GROWTH TRACKED**。独立技术债已完成本批可安全实施的优化与定量评估；**没有实行也没有授权 tombstone TTL/GC**，容量随删除数线性增长仍是已接受且必须持续观察的架构成本，不等同容量固定或未来无需平台升级。原上节 `OPEN / DESIGN-REVIEW REQUIRED` 是此批次开始前历史快照，不再代表最新执行状态。
- **实现最小化**：只修改 `apps/electron/src/main/lib/agent-session-manager.ts`，在现有 `indexCache` 内添加从**同一已验证索引快照**派生的 `reviewOwnerIds: ReadonlySet<string>` 和 `deletedReviewOwnerIds: ReadonlySet<string>`；`isReviewOwnedOrDeletedAgentSessionId` 仍调用现有按 mtime+size 验证的 `readIndex()`，命中缓存后采用 `Set.has`，没有新的永久独立缓存。每次成功写索引或检测外部变更、恢复重读时重建；写失败丢弃缓存；无法缓存时退回原线性安全判断。持久 JSON 的 `reviewOwnerDeletionTombstones?: string[]` 和与 owner 删除同次原子写入的事务边界完全不变；普通旧索引不需迁移。
- **受控证据**：冻结代码 [`dccaf6ce`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/dccaf6ce96072eac9404c3957742555916bd62f1)；[PR CI #38273510150](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38273510150)、[D2 #38273510227](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38273510227)、[Review Baseline #38273510354](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38273510354) 均 **SUCCESS**；新增 **5/5 PASS**，全仓 **3822 pass / 5 skip / 0 fail（3827 tests / 435 files）**，typecheck、边界、Electron build PASS。
- **新增测试 5/5**：①owner 删除、普通更新后仍持续保护旧 ID；②外部原子替换索引及旧格式缺失字段能刷新派生缓存；③构造 `.tmp` 写失败后不得以未持久化数据为权威；④真正启动独立 Bun 进程（显式 preload 仓库 `test/preload-electron-mock.ts`）读取 tombstone 仍拒绝；⑤0/1k/10k/100k 合成 UUID 规模基准（非性能门禁）。两次中间 PR CI [#38272437748](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38272437748) 和 [#38272998456](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38272998456) 曾因裸 `bun -e` 没有 Electron mock 而在独立进程测试失败；定位 `safeStorage` export 问题后采用仓库标准 preload，最终冻结版三套 CI 全绿，未掩盖失败历史。
- **规模数据**：Linux x64 GitHub hosted runner；每档 512 次热查询，p50/p95；冷加载为单次测量，写入为合成索引中单条普通会话元数据变更。线性参考为同进程 `statSync + tombstones.includes`，不是旧 SHA 的完整端到端运行（因此属于对比参考，不等于精确实测旧版整条路径）。

| tombstone 条数 | 索引大小（bytes） | 冷加载（ms） | 更新写入（ms） | 新 guard p50/p95（ms） | 原线性参考 p50/p95（ms） |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 281 | 0.061 | 0.312 | 0.0043 / 0.0070 | 0.0021 / 0.0038 |
| 1,000 | 44,286 | 0.254 | 0.388 | 0.0041 / 0.0059 | 0.0109 / 0.0133 |
| 10,000 | 440,287 | 1.563 | 1.631 | 0.0041 / 0.0059 | 0.0902 / 0.1010 |
| 100,000 | 4,400,288 | 16.871 | 15.547 | 0.0040 / 0.0067 | 0.8777 / 0.8981 |

- **分析**：100k 时 JSON 约 4.4 MB、新 guard p50 0.0040ms，线性参考 0.8777ms；新 guard 保持相对稳定。但冷加载 16.871ms、单次索引更新 15.547ms 仍随规模增长；这是保留安全账本的真实成本，并非已消除。真实用户工作负载、Windows/macOS、应用主线程长时间运行未测，不外推绝对阈值。
- **安全留存决策**：永久保存 ID-only tombstone，不允许按 7/30/90 天或固定条数自动清理。若以后评估分段存档/压缩/GC，必须有 Session Manager / Agent 平台维护者联合审查，证明旧 replay、持久队列、SDK 恢复、历史快照以及远程连接再也不能引用拟清理 ID，并补跨重启/旧版本兼容/坏账恢复负例后才可更改。**容量超出 100k / 索引超过约 10MB 时建议重新做压力基准并向平台方提出独立架构提案**；这些是建议复评信号，不是代码中的自动 TTL 或硬上限。
- **门禁**：本批受控性能与一致性证据 PASS，实机稳定性、应用多窗口/真实流仍 LIVE-06/08 **NOT-RUN**，P04 整体仍 **PARTIAL**；P05-S06、Main 业务 IPC、P06～P08 均未执行。A0 和 LIVE-01～08 全部 NOT-RUN；PR #21 保持 Draft/Open/未合并。

### P03-MAIN-S01｜Main 后台审核只读业务状态接线（2026-10-13）

- **本批结果**：**CONTROLLED PASS / TRUE START-STOP NOT IMPLEMENTED / LIVE NOT-RUN**。这不是直接开通后台执行，只为后续 Main bridge 的启动/停止及 Renderer 回访提供可靠的只读状态入口。用户表示已在本地运行验收，但本批读取远程 PR #21 `df0c0d57` 的 32 号文档和 29 号 LIVE 表，尚无与用户这一轮操作对应的 SHA/设备/日志/逐项结果入库，因此**不能按口头报告将历史 NOT-RUN 改 PASS**。此项应由本地 agent 的独立证据提交补录；若本地尚有未推送提交，应先检查并协调与当前新 HEAD 的合并，勿覆盖。
- **代码与 CI**：冻结代码 [`5f786583`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/5f7865837c6321756c3bc779c5aad2fe793e8fd0)；[PR CI #38290676371](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676371)、[D2 #38290676419](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676419)、[Review Baseline #38290676426](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676426)、[Review batch focused #38290676413](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676413) **全部 SUCCESS**；新增 **7/7 PASS**，全仓 **3837 pass / 5 skip / 0 fail（3842 tests / 437 files）**，Typecheck / boundaries / Electron main, preload, renderer build PASS。原首提交 [`ed5574a5`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/ed5574a51fd825bcf99a7d151d98c28834a281c0) 的全仓 CI 因后续新提交被取消，不计为 SUCCESS；`5f786583` 才是冻结受控证据。
- **接口和安全语义**：在 `REVIEW_IPC_CHANNELS` / preload `reviewAPI` / Main `review-ipc.ts` 增加 `GET_BACKGROUND_PI_REVIEW_STATE_V2` / `getBackgroundPiReviewStateV2(caseId)`。Main 先检查 caseId 存储 ID、确认 V2 案卷存在，仅读取现有 `runs-v2` 持久账本中由 `run-pi-` 创建的最新直接 Pi 运行；返回 `{caseId, phase, runId?, runStatus?, completedAt?}`，**不返回**内部 sessionId、assignmentId、SDK 事件或 transcript。
- **最重要的 ACK 边界**：`preparePiReviewRunV2` 的持久 `running` 发生于执行权 ACK 之前，所以 `running` 不自动代表可切页。本批仅在原 `review-pi-admission` 的**真实 `onRunOwned`** 回调后建立进程内受理标记，运行完成/错误时按 run/assignment 同身份清除；读端再次检查当前 binding。状态为：无直接 Pi run `not-started`、queued/未 ACK running `preparing`、已获执行权 running `accepted`、awaiting-* `needs-attention`、completed `finished`、partially-completed/failed/cancelled/paused `incomplete`。**finished 只是模型分析完成，并非人工业务审批通过**。进程重启丢失 ACK 标记采取 fail-closed，V2 遗留运行由现有启动恢复逻辑继续处理。
- **新 7 项自动化**：无 Pi 或普通 V2 run 不伪装直接审核；未受理 running/queued 不给 ACK；确认 ACK 后 accepted；待处理与已结束区分；失败/取消/部分结果不误称完成；返回结构不暴露内部 ID；实际注册 Review IPC 对非法/不存在案卷拒绝。现有 P03 真实 `runAgent` 函数体受控测试增加 ACK 前/后/完成后的 `isPiReviewRunAdmitted` 时序断言，原正常回归通过。新增状态汇总测试含纯函数/真实 IPC mock，**不是 Electron GUI 中的完整 UI 点击或真实模型测试**。
- **停点与下一批**：只读 IPC 已注册但 **Renderer 还未切换调用、没有实际后台创建/启动/停止业务 IPC、没有真正 Main bridge start/stop**；不要为避免页面复位而直接把 prepared running 当 ACK。建议下一批 `P03-MAIN-S02`：核验严格 owner 原子创建+assignment/turnId/case/预设/模型的 Main-only start，复用 `admitPreparedPiReviewTurn` + `runAgent`，忙碌/重复/旧轮次负例先行；随后才加 stop 和最小 Renderer。若 P05 外部 Relay/Pocket 证明未完成，继续保留阻断而不宣称 P05/E2E 全绿。P06/P07/P08、A0 和 LIVE-01～08 **仍 NOT-RUN**；Draft PR 不解除、不合并。

### P03-MAIN-S02/S03 + Renderer + A0｜进入 P06 前置项交付（2026-10-13）

- **授权与结论**：用户要求补齐 P06 前置项、更新测试云端、先不合并。Main start/read/stop、最小前台、真实 Electron A0 和证据归档完成，**P06 LOCAL ENTRY READY / MERGE NO-GO**；P06/P07/P08 未执行。此前“不做 Main”保留为历史停点。
- **冻结应用及 QA 驱动**：[`14bc7d6c`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/14bc7d6c3625aaa6eec2675aa9ce4dc446475297)，Electron 0.15.156 / shared 0.1.66 / core 0.2.14。历史本地 P05 `df0c0d57` 九步和 43/43 补录 [33](33-p05-local-automation-recheck-20261013.md)；本批命令、环境、时间、日志哈希、case/run、截图、CI 见 [34](34-pre-p06-main-a0-acceptance-20261013.md)。文档提交产生新 HEAD，须另外核对其 CI。
- **接线范围**：Main 委托可信 owner factory、V2 prepare、admission/runAgent 和 stopAgentAndWait；业务 IPC 只接受主窗口。模块模型优先、持久全局回落、enabled/Pi/review preset 校验；默认沙箱不继承聊天工作区。Main 持有执行，真实 onRunOwned 后 ACK；Renderer 只回读业务态，不建普通 Agent Tab；旧 prepare/abort/指派入口拒绝新 owner。
- **自动化 PASS**：Main bridge 7、business state 7、reuse 13、controller 30，四文件 **57/57**；P05 **43/43**；全仓 **3849 pass / 5 skip / 0 fail（3854 tests / 438 files）**；typecheck、边界、皮肤和三段构建均 exit 0。
- **真实本地 A0 4/4 PASS**：DeepSeek/deepseek-flash 合成文本获得真实 ACK 后关闭审核子页，Pi 完成 1 check/1 SourceRef，重进回读；普通 list 不含 owner、meta=null、无普通 Tab。预检拒绝 0 run/0 新 owner；当前轮停止 cancelled；真实 Pi 请求本机 HTTP 500（6 次含重试）后 failed，后者不是生产 provider 故障。
- **缺陷复测**：修复重选案卷的假 ACK 覆盖、复用 owner 的 preset 检查、预检错误卡 IPC 前缀及切案后旧停止提示。受控回归与真实显示补测通过；迟到 stop/失败回调仍归 P06，不能借基本停止代签。隐藏 agent-preview 在 dev 出现 ERR_BLOCKED_BY_CLIENT；正文回退完成，LIVE-02 保留未验。完整工具清单、PNG/压缩/部分完成/跨端矩阵仍缺证据。
- **冻结 CI SUCCESS**：[PR #38305239415](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239415)、[D2 #38305239388](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239388)、[Baseline #38305239392](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239392)、[batch #38305239385](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239385)。
- **原阻断保留**：Relay BLOCKED / NOT-RUN；独立 Pocket PATCH READY / TARGET NOT-RUN，本轮未验证或应用 patch。P05 PARTIAL；P04 永久 ID-only tombstone、容量增长风险不变；PR #21 Draft/Open/未合并。LIVE 子集只追加 PARTIAL，下一批 P06 验证同案两轮、旧控制及释放后重启。

### P06-S01｜同案连续轮次的旧指派、迟到回调与停止屏障（2026-10-13）

- **验收结论**：**CONTROLLED PASS / P06 E2E PARTIAL / MERGE NO-GO**；详情 [35｜P06-S01 独立验收](35-p06-s01-consecutive-rounds-acceptance-20261013.md)。冻结代码 [`9851998a`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/9851998a1b157c9d5924b9c6387b062838aa4475)；[PR CI #38358640242](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640242)、[D2 #38358640258](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640258)、[Review Baseline #38358640275](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640275)、[Review batch focused #38358640240](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640240) **全部 SUCCESS**；新增 **3/3 PASS**，全仓 **3852 pass / 5 skip / 0 fail（3857 tests / 438 files）**，Typecheck、边界、Electron main/preload/renderer build PASS。
- **实现修复**：最新有效直接 Pi 指派选取使用既有持久追加顺序，禁止相同毫秒时间戳选回旧一轮；`review-pi-admission` 在 Promise 正常或异常收尾时撤销**原 assignmentId**，历史授权留下 `revokedAt` 记录且不删除，与 `isCurrent`/runId/assignmentId 并行守卫。保留现有 Main `busyCases` 阻挡 stop 尚未释放时启动新轮，不改通用 Agent runner/数据库。
- **新增 3/3**：真实持久 assignments 同毫秒冲突；同案同 owner 先失败再 `update`，旧 runId stop 拒绝、旧回调迟到不覆盖新 run；延迟 stop 期间 `restart` 拒绝，释放后新 owner/run 可启动，旧错误及旧 stop 不误伤。测试调用真实 V2/Main bridge，**Agent 执行器为可控 mock**，不是生产 provider/真实 GUI E2E。
- **LIVE 与外部状态**：34 号真实 A0 4/4 保留；29 号 LIVE-07 仍只有 A0 当前轮停止的 **PARTIAL**，真实两轮及迟到回调未执行；LIVE-01/04/05/06 仍 PARTIAL，LIVE-02/03/08 仍 NOT-RUN。生产中心 Relay 与独立 Pocket 阻断未改变；P04-TECHDEBT-01 容量/不做不安全 GC 的原证据未改变。
- **下一批**：`P06-S02` 使用隔离 Electron + 合成案卷实测双轮和迟到停止/回调、切案显示，同时做普通 Agent 正例；据真实 Main event/V2 ledger/时间线复核。不得因本批本机 Main mock PASS 自动将 P06、LIVE-07 或 PR 标 PASS。

### P06-S02｜前台慢返回隔离与真实 Electron 双轮驱动（2026-10-13）

- **代码/受控通过，实机阻断**：代码冻结 [`5d5e25e5`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/5d5e25e5db20bbe90a5f367481f3ca982b3162ad)；[PR CI #38361717837](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717837)、[D2 #38361717930](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717930)、[Review Baseline #38361717713](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717713)、[focused #38361717452](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717452) **全部 SUCCESS**；**3855 pass / 5 skip / 0 fail（3860 tests / 439 files）**，Typecheck、边界、Electron main/preload/renderer 构建通过。新增 **2/2 前台乱序回调测试 PASS + 1/1 真机脚本静态语法合同 PASS**，不是实际 Electron/Pi E2E。代码见 `review-actions-controller.ts`（同案每轮刷新 generation + 异步查询后守卫）、`RightPanel.tsx`（停止/反馈按 caseId+runId+操作代次隔离），2/2 前台时序测试 PASS，`node --check` QA 脚本合同 1/1 PASS。完整报告与真机命令见 [36｜P06-S02 实机验收指南](36-p06-s02-ui-race-and-electron-validation-20261013.md)。
- **实机真实状态**：本环境没有 Bun、隔离 Electron 应用工作树/授权模型，不能运行 A0 风格 CDP；**P06-S02 E01/E02/E03/E04/E05 真实 UI 和 E06 普通 Agent 实机 = NOT-RUN**。已提供 `scripts/qa/review-background-p06.mjs`，需在已配置授权模型的隔离 profile 中运行，并上传脱敏 `p06-summary.json`、run ledger/截图与哈希后才可签收。34 号 A0 原有 4/4 PASS 不能代替这轮双轮。
- **状态**：**P06-S02 CODE/CONTROLLED PASS / REAL E2E NOT-RUN；P06 整体 PARTIAL；LIVE-07 仍仅 A0 子集 PARTIAL**。P05 Relay/Pocket、P04-TECHDEBT-01 与其它 LIVE 原判定不变；Draft PR 不合并。

### P06-S02 本地实机及 P01～P06-S02 累计独立复核（2026-10-13）

- 用户授权本地验收 S02，并明确风险审查覆盖 P01～P06-S02；最终仅推送公开 `Fuck-GH-Admin/cdut-studio-review-agent`，不写原项目、不合并。实际接手云端 `de1318c5`；最终应用/驱动冻结 `ef9074e367d2e7fda5955d8b0d6d9a4812836a6d`，应用 0.15.157。环境/SHA/命令/日志/截图/时序见 [37](37-p06-s02-local-acceptance-20261013.md)，全部风险和保护负例见 [38](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。
- 九步本地门禁 exit 0：P06 三文件 48/48，累计相关 20 文件 194/194，全仓 **3860 pass / 5 skip / 0 fail（3865 tests / 439 files）**；类型、边界、皮肤、三段构建通过。这些正常回归不包括独立四个失败反例。
- 真 Electron/Pi/DeepSeek 的 E01/E02 **2/2 PASS、四轮 provider 回执**：update 实际复用本轮指派 owner、替换合成材料进入新快照；restart 实际新 owner；旧 run stop 拒绝且当前 running、两轮最终 GUI cancelled/授权撤销，旧 ledger 未改。原驱动 owner 假正例、界面未就绪、reload body 为 null、自然完成误归因都已修补并保留首败。
- E03 真实并发 stop/restart 尝试未命中重叠窗口，维持 NOT-RUN；E04 实际旧 executor 回调未注入，NOT-RUN。E05 实际关闭审核子页/重新进入后投递旧 Controller 回复，**UI 回到旧 run/preparing 而 Main 新 run 仍 accepted/running：FAIL**，已停止清理。普通 Pi create/list/meta/send/SDK/provider 局部正例 PASS，E06 完整产品矩阵 PARTIAL。
- 四项生产逻辑缺口 **CONFIRMED/OPEN**：`AUDIT-P03-P05-INDEX-01` 旧备份恢复丢 owner 后普通读/事件/路径放行；`AUDIT-P06-REMOUNT-01` Controller 实例局部 generation 无法守住卸载重进；`AUDIT-P06-WORKSPACE-WRITER-01` Workspace refresh 是另一条无屏障缓存写入；`AUDIT-P01-P06-SETTLE-01` 授权撤销 EACCES 导致未捕获 rejection/清理跳过。独立保护断言 **0 pass / 4 fail、exit 1**，独立 I/O 进程复核也是 exit 1。
- **判定：验收执行完成，S02 NOT ACCEPTED / P06 PARTIAL / MERGE NO-GO。** 本批仅加强驱动/断言与归档，四项生产问题未修；后续必须把正确保护断言纳入 CI 并复验 E05，不能依全绿关闭风险。P05 Relay BLOCKED、Pocket PATCH READY/TARGET NOT-RUN、P04 永久 tombstone/不 GC/容量风险均保留，P07/P08 未推进。归档 HEAD 的 CI 需单独核验并记 PR，不沿用冻结历史。

### P06-FIX-01｜审核 owner 旧索引恢复安全加固（2026-10-13）

[代码 `c8c84681`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/c8c84681f201f8911731b50b9f991bd51cddb9fa)：新增 **9/9 PASS**；全仓 **3869 pass / 5 skip / 0 fail**（3874 tests、440 files），Typecheck、边界和 Electron main/preload/renderer 构建通过。四套 CI **SUCCESS**：[PR #38421280083](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280083)、[D2 #38421280011](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280011)、[Baseline #38421280010](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280010)、[focused #38421279980](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421279980)。正式 9 项 `review-owner-index-recovery.p06-fix01.test.ts` 覆盖旧备份、旧 tombstone、owner 字段丢失、三副本损坏、跨进程、日志路径、自带身份回填、写入故障、截断失败；原普通 Agent 正例及 P04 100k 回归通过。详见 [39｜FIX-01 报告](39-p06-fix01-owner-index-recovery-20261013.md)。**原 38 号失败证据不改写、原 `replay-risk-probes.py` 精确复跑和真实 Electron 索引恢复 NOT-RUN；其余三个审计 OPEN、LIVE-07 PARTIAL、真实 E05 FAIL、P05 外部阻断与整个 PR NO-GO 均保留。**

### P06-FIX-02｜共享 Renderer/Jotai 写入资格收口（2026-10-14）

- **代码验收**：代码冻结 [`414f2066`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/414f20669b06513064ff9f84e9ccfb92f7a9001e)；[PR CI #38496467696](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467696)、[D2 #38496467716](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467716)、[Baseline #38496467778](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467778)、[focused #38496467754](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467754) **全部 SUCCESS**；新增 **5/5 PASS**（PR CI 日志逐项可见），全仓 **3874 pass / 5 skip / 0 fail（3879 tests / 441 files）**，typecheck、边界和 Electron main/preload/renderer 构建均通过。新增 `review-workspace-write-fence.ts`，按 Jotai store + caseId 共享单调写入代次；Controller、Workspace Hook `refresh/apply`、页面卸载清理统一守卫，变更只控制展示，不触碰 Main 的 Pi 生命周期。
- **实际保护断言**：跨 Controller 无显式卸载清理的异步交错、卸载取消、跨 case 隔离、真实 React/Jotai Hook 的 refresh/API 读取与 apply/IPC 写入迟到共 **5/5 PASS**；所有受控测试在默认 PR CI 运行并见证真实回调。详细记录 [40 号](40-p06-fix02-renderer-write-fence-20261014.md)。
- **未签收**：38 号原审计探针在本 HEAD 精确重放、37 号 E05 真实 Electron 关闭重进后释放旧回复 **NOT-RUN**；保留 E05 原 FAIL、LIVE-07 PARTIAL、P06-S02 NOT ACCEPTED。FIX-03 的 `AUDIT-P01-P06-SETTLE-01` OPEN。P04-TECHDEBT-01 原容量/不安全 GC 不变，P05 Relay/Pocket 原阻断不变，Draft PR #21 不合并。

### P06-FIX-03｜授权持久撤销异常与 Main 收尾观察（2026-10-14）

- **代码冻结 / CI**：[代码 `b5f9db17`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/b5f9db179b358d0405a1d0868133f11064edc93a)；[PR CI #38524782294](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782294)、[D2 #38524782315](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782315)、[Baseline #38524782350](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782350)、[focused #38524782373](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38524782373) **四套 SUCCESS**，全仓 **3881 pass / 5 skip / 0 fail（3886 tests / 441 files）**，类型、包边界、Electron main/preload/renderer build PASS。
- **正式受控 7/7**：覆盖旧终态拒绝、损坏 JSON 拒绝并禁止覆盖、ACK 后 EISDIR、ACK 前 reject+腐损、非 root EACCES、V2 终态未确认、正常成功撤销及普通指派正例；完整逐项和初次真实 FAIL 历史见 [41 号](41-p06-fix03-settlement-io-resilience-20261014.md)。
- **安全限制**：进程内待撤销 deny **不能冒充**磁盘上成功写入 `revokedAt`；V2/assignment 同时无法持久化及断电恢复仍需真机证明；当前修复未实际触发 ENOSPC 或重放 38 号整套离线探针。
- **门禁**：P06-FIX-03 **CODE/CONTROLLED PASS / 原审计精确重放与真实 Electron NOT-RUN**；37 号 E05 原 FAIL 保留，LIVE-07 仍 PARTIAL，P06-S02 NOT ACCEPTED；P07/P08、P05 生产 Relay/Pocket 阻断和 P04-TECHDEBT-01 留存决定未更改，PR Draft/NO-GO。

## 最终统一实机验收清单（必须保留到合并前；仅补入实际证据）

> 此表是**集中补测登记簿**，不要因为推进新的开发批次删除或自动勾选。全部使用隔离的 `PROFER_CONFIG_DIR` / `PROFER_USER_DATA_DIR`、非真实个人资料的合成案卷，固定测试提交 SHA；如涉及付费模型，使用获授权且受控的模型渠道。执行时在本表逐行填写 **PASS/FAIL/NOT-RUN、操作人、日期、测试数据版本、CI/日志/截图/录像链接、异常工单**。只有自动化测试通过而无对应真实操作证据时，本表仍为 NOT-RUN。

| 统一验收编号 | 原阶段 | 必须进行的实机操作 / 核验点 | 目前状态 |
| --- | --- | --- | --- |
| LIVE-01 | P01/P02 | 使用真实 Pi provider 启动合成案卷，工具名单仅包含 `review_read_documents`、`review_inspect_document_image`、`review_submit_result`、`review_inspect_original`、`CompactContext`；尝试或核验普通 Bash/Write/Read/MCP/AskUser 均不可用。审核提交真实正文与 PNG 证据，V2 结果、引用与回执一致 | **PARTIAL**：A0 真实 provider 正文和 SourceRef 已验证；完整工具清单/负例及 PNG NOT-RUN，见 34 |
| LIVE-02 | P02 | 用真实扫描型/解析失败 PDF 验证 Electron 隐藏 renderer 的 `review_inspect_original`：按材料版本 ID 翻页/`scope=all`，检查页数、视觉内容、失败/预算警告、覆盖账本和不可伪造引文；跨案版本、任意路径、符号链接越界需拒绝 | **NOT-RUN** |
| LIVE-03 | P02 | 真实 Pi 长轮次分批提交，触发 `CompactContext` 或空闲压缩，同 runId 续交/重新进入后恢复事实、缺项和证据引用，未读材料不能伪装已读取 | **NOT-RUN** |
| LIVE-04 | P03 | 真实 Electron 中验证 HTML/EML 修复与逐事项识别仍在准备阶段；准备结束但尚未获取 `onRunOwned` 时不得显示“后台已受理”；模型预检/忙碌拒绝时不留下孤儿 running，重复点击不影响原 run | **PARTIAL**：A0 预检拒绝无新 owner/run；HTML/EML、事项准备及实机 busy/重复 NOT-RUN，见 34 |
| LIVE-05 | P03 | 真正收到 Main ACK 后关闭/切换审核工作台、打开其他页面并返回，Pi 继续运行；刷新案卷从 V2 重取状态，完成/部分完成/失败一致，不靠 React Hook 长轮询保持执行 | **PARTIAL**：真实 ACK、关闭审核子页后完成/重进回读及受理后 failed 已验证；部分完成续审与完整矩阵 NOT-RUN，见 34 |
| LIVE-06 | P04/P05 | 内部 review owner 会话对桌面侧栏/搜索/归档/Tab 恢复/异步事件及 Pocket 按 ID 操作、消息检索、WS 实时与重放日志全不可见；旧普通 Agent 会话照常可用 | **PARTIAL**：46号真实 owner 路径拒止与故障恢复拒止子集PASS，FIX-01受控9/9及历史索引反例保留；完整跨端/多窗/事件可见性仍未验 |
| LIVE-07 | P06/P07 | 同案更新、从头重审、旧轮次迟到取消与异常回调、停止后立即重启、应用重启/强杀、删除案卷、切换工作区和模型停用；无旧 run 误伤新 run、永久 running、幽灵权限或孤儿会话 | **PARTIAL**：历史E01/E02与当前E05/E03/E04、真实ENOSPC/双持久化及重启拒止/恢复子集PASS，范围见46；其他原门禁未验，P06-S02仍NOT ACCEPTED，不进入P07 |
| LIVE-08 | P08 | 普通 Pi/Claude Agent 发送、权限、工具、预览、停止、fork、Pocket、原批量 A/B/C 审核保持原行为；冻结版 CI（类型、边界、所有单测与构建）及桌面操作日志均可复验 | **PARTIAL（局部实机证据）**：46号普通Pi工具/权限/停止、文本Office扫描PDF预览、普通会话重启和真实批次队列/B-C拒止子集PASS；完整A/B/C、Claude、fork/双窗/Pocket/平台矩阵未验，P08未推进 |

**统一验收记录模板（每项填写）**：`编号=LIVE-XX；结果=NOT-RUN/PASS/FAIL；执行日期=；操作者=；应用提交 SHA=；虚构案卷数据集版本=；步骤和预期=；实际结果=；日志/截图/录像/CI=；缺陷与复测=。`

**全局放行规则**：任何 LIVE-01～08 未 PASS，不能把 P02/P03/E2E 整体标为通过；尤其不能因当前 S02 的 Main 受理契约自动测试通过而省掉 LIVE-04/05。合并需要完整证明和用户明确验收。

## 正式开工门槛（ALL required）

- [ ] 在本文件 §“设计决策”中逐项确定 v1 选择，删除含混的备选说法。
- [ ] P01 的受控契约与 P02 安全接线已具 CI 证据；**P02 live Pi/扫描 PDF E2E 由用户授权移至最终完整后台链路测试**，必须在合并/发布前运行并通过；P03 允许逐小批次推进并独立取得受控证据。失败先调整接线，不能把 NOT-RUN 宣称 PASS。
- [ ] 完成 P04–P08 的入口枚举与针对性断言/负例；普通 Agent 现有行为先有回归基线。
- [ ] 明确 owner 与 run/assignment 权限是不同层次，普通 IPC/Pocket 不能持有未受限后门。
- [ ] 用冻结 SHA 记录测试、类型检查、边界检查、构建与桌面回放结果；未运行即 NOT-RUN。
- [ ] 用户复核并批准“开工门槛已达标”；PR #21 持续 Draft，未经用户验收不合并。

## 与 27 号方案的关系

27 号已改为轻量 v1 规范；本文件记录其实现之前未闭合的跨模块依赖和预验证。**不得把 §0 对“人工请求可处理”的长远目标自动当成 v1 必做**：如选择“单轮无通用中途交互”，就必须在 27 号和 PR 验收中同步标注具体边界，不许宣称已实现通用 AskUser 转接。旧 27 号在“隐藏状态”“迁移旧会话”“全量管理员诊断”等提法均按本文件的实施顺序分阶段验收。
