# 27｜直接案卷审核：复用现有 Pi 的后台会话最小实施规范

> **现行执行补充（2026-10-15）**：本文件仍是后台Pi/Main ACK/owner/V2的**架构和允许改动范围**；§6旧顺序属于历史阶段快照。46号已在选定16场景得到实机PASS但完整E06仍PARTIAL，后续排序与取证细则按 [47｜实测驱动调整](47-p06-evidence-driven-followup-plan-20261015.md)；[29](29-background-session-preflight-audit.md)继续是唯一LIVE验收台账。27号“本PR不新增批量产品能力”规则不变。


> **P06-FIX-02 最新受控进度（2026-10-14）**：代码冻结 [`414f2066`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/414f20669b06513064ff9f84e9ccfb92f7a9001e)；[PR CI #38496467696](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467696)、[D2 #38496467716](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467716)、[Baseline #38496467778](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467778)、[focused #38496467754](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38496467754) **全部 SUCCESS**；新增 **5/5 PASS**（PR CI 日志逐项可见），全仓 **3874 pass / 5 skip / 0 fail（3879 tests / 441 files）**，typecheck、边界和 Electron main/preload/renderer 构建均通过。修复 Controller 跨卸载与 Workspace Hook `refresh/apply` 旧异步回复共同写 Jotai 的缺口；详细见 [40 号](40-p06-fix02-renderer-write-fence-20261014.md)。**真实 E05 尚未复验、历史 FAIL 保留，P06-S02 NOT ACCEPTED，FIX-03 收尾 I/O 风险仍 OPEN，PR NO-GO**。

> **P06-FIX-01 最新受控闭环（2026-10-13）**：[代码 `c8c84681`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/c8c84681f201f8911731b50b9f991bd51cddb9fa)：新增 **9/9 PASS**；全仓 **3869 pass / 5 skip / 0 fail**（3874 tests、440 files），Typecheck、边界和 Electron main/preload/renderer 构建通过。四套 CI **SUCCESS**：[PR #38421280083](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280083)、[D2 #38421280011](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280011)、[Baseline #38421280010](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421280010)、[focused #38421279980](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38421279980)。旧索引回滚不再丢失已记录审核 owner 的拒绝身份，具体见 [39 号](39-p06-fix01-owner-index-recovery-20261013.md)。原 38 号四项 FAIL 是历史实测，原脚本精确复跑尚未执行；另外三项依旧 OPEN，真实 E05 FAIL、P06/S02 PARTIAL、PR NO-GO。

> **当前实测增量**：P06-S02 本地 E01/E02 已通过，但关页重进旧回复回退 UI 的 E05 FAIL；P01～P06-S02 累计风险复核确认四项 OPEN，详见 [37](37-p06-s02-local-acceptance-20261013.md)/[38](38-p01-p06-s02-cumulative-risk-audit-20261013.md)。S02 NOT ACCEPTED / P06 PARTIAL / MERGE NO-GO。优先修复身份恢复、两条旧 UI 写入路径与收尾 I/O 保护，不因本地双轮或 CI 通过自动推进 P07/P08；v1 复用边界不变。

> **2026-10-13 当前交付**：用户已授权补齐 P06 前置项。Main start/read/stop、最小 Renderer 接线和本地 A0 已交付，冻结应用及驱动代码 `14bc7d6c3625aaa6eec2675aa9ce4dc446475297`；证据见 [34｜Main/A0 本地验收](34-pre-p06-main-a0-acceptance-20261013.md)，原 P05 本地记录见 [33](33-p05-local-automation-recheck-20261013.md)。**本地工程已完成 P06 前置 A0 4/4，P06-S01 同案双轮与迟到授权已取得 3/3 受控 PASS；下一批 P06-S02 实测真实 Electron 双轮。P06 整体 PARTIAL、P07/P08 尚未执行，生产 Relay BLOCKED、独立 Pocket TARGET NOT-RUN、完整 PR MERGE NO-GO。** 下方旧批次停点为历史记录，不能用“尚未接线”重复实现已交付入口。

> **历史阶段快照（Main/A0 之前）**；跨会话接手先读：[30｜当前项目与 PR #21 交接指南](30-background-session-handoff.md) → [31｜复制即用的接手/小批次提示词](31-background-session-continuation-prompts.md) → 本文件实施规范 → [29｜验收证据及 LIVE-01～08](29-background-session-preflight-audit.md)。**P04-S01/S02/S03/S04 均有冻结代码受控 PASS，P04-PATH-01 原 9 项受控证据经复核发现最终目标路径遗漏，现已有新增 5 项真实文件变更受控修补（详见 29 号），P04-TECHDEBT-01 本批受控优化与规模评估完成（保留安全账本，不做 GC），P04 整体因真实 Electron LIVE-06/08 仍 PARTIAL；P05-S01 Pocket 间接 ID/事件重放的受控修复已 PASS；P05-S01/S02/S03/S04/S05 均有受控 PASS，P05 整体仍 PARTIAL；P05-S01～S06 已完成 43/43 受控测试、中心 correlation 冲突/迟到回执夹具与 Pocket 可应用补丁已交付，生产中心和独立 Pocket 上游尚无验收证据，P05 整体仍 PARTIAL、合并 NO-GO，LIVE-01～08 均 NOT-RUN。**

> 2026-10-12 缩减版（原提案的过度设计从当前实施基线移除；历史建议仍可通过 Git 历史查看）。
> 代码核对：`main@dd5a553c34a92b559559a7cb3c4e9c3f67fd9c8e`。本文件是 **v1 目标与允许改动范围**，不是实现完成声明。
> 开工门槛、遗漏风险与证据状态以 [29 号开工前审计](29-background-session-preflight-audit.md) 为准；现有业务成果以 [28 号交付状态](28-review-stage-delivery-status.md) 为准。

**P06-S01 受控小批（2026-10-13）**：冻结代码 [`9851998a`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/9851998a1b157c9d5924b9c6387b062838aa4475)；[PR CI #38358640242](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640242)、[D2 #38358640258](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640258)、[Review Baseline #38358640275](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640275)、[Review batch focused #38358640240](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38358640240) **全部 SUCCESS**；新增 **3/3 PASS**，全仓 **3852 pass / 5 skip / 0 fail（3857 tests / 438 files）**，Typecheck、边界、Electron main/preload/renderer build PASS。修复旧轮次授权存活与同毫秒指派选择，新增三项 Main bridge 竞态负例；**P06-S01 CONTROLLED PASS、P06 完整 E2E PARTIAL**。详见 [35｜P06-S01 验收](35-p06-s01-consecutive-rounds-acceptance-20261013.md)，真实 Electron 双轮与 LIVE-07 尚待运行，PR Draft/NO-GO。历史目标与 A0 证据仍保留。

**P06-S02 前台竞态与实机驱动（2026-10-13）**：代码冻结 [`5d5e25e5`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/5d5e25e5db20bbe90a5f367481f3ca982b3162ad)；[PR CI #38361717837](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717837)、[D2 #38361717930](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717930)、[Review Baseline #38361717713](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717713)、[focused #38361717452](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38361717452) **全部 SUCCESS**；**3855 pass / 5 skip / 0 fail（3860 tests / 439 files）**，Typecheck、边界、Electron main/preload/renderer 构建通过。新增 **2/2 前台乱序回调测试 PASS + 1/1 真机脚本静态语法合同 PASS**，不是实际 Electron/Pi E2E。已加固同案异步回读代次和旧停止回执隔离，提供 [36｜P06-S02 实机指南](36-p06-s02-ui-race-and-electron-validation-20261013.md)。本环境**没有执行真实 Electron/Pi 双轮**，所以 P06-S02 的代码/受控门禁 PASS，真实双轮 E01～E06 按实际范围 NOT-RUN；P06 整体仍 PARTIAL，PR NO-GO。旧 A0 4/4 与 P06-S01 3/3 不变。

## 1. 要解决的唯一问题

原 main 基线的直接案卷审核从 `use-review-actions.ts` 创建普通 Agent 会话，把它插入 `agentSessionsAtom`，随后调用 `openSession('agent', ...)` 并通过普通 `SEND_MESSAGE` 启动 Pi。该历史路径会使用户进入普通聊天界面。当前 Draft 分支已改由 Main 可信后台入口启动；旧普通审核聊天保留历史，不自动迁移。

**目标**：用户在案卷中点击开始审核，Pi 继续使用既有运行/证据/权限机制，**不创建普通聊天标签和会话入口**。正常审核只显示“审核中”；结束时展示既有结果、依据、需补件或人工决定。未完成时给出简要原因和重试入口。用户无需理解 Pi 技术状态。

**只改变直接案卷审核链路**，不改普通聊天、不改批量审核 A/B/C 的临时 Pi transcript、不实现自动业务审批。

## 2. 优先复用的现有代码（禁止另造同类子系统）

| 需求 | 现有代码 | 规则 |
| --- | --- | --- |
| 创建持久会话 / Pi 上下文 | `agent-session-manager.ts:createAgentSession`、原 Pi transcript | 复用同一索引、目录、上下文；只增加必要的可信归属字段 |
| 发起执行、模型适配、完成回调 | `agent-service.ts:runAgent`、`AgentOrchestrator`、`createAgentRunOutcomeReporter` | 首选原有 `runAgent()`；不新增 Agent 引擎、后台任务数据库或新 EventBus |
| 审核准备与证据写入 | `preparePiReviewRunV2`、`submitPiReviewResultV2`、`finishPiReviewRunV2` | 沿用 `caseId/sessionId/turnId/runId/assignmentId` 和 D2/来源引用/材料版本门禁 |
| 运行状态与历史 | `run-store-v2.ts`、现有工作台结果与待处理项 | V2 运行记录是唯一业务状态来源；前台只做简单状态投影 |
| 停止 | `stopAgentAndWait(sessionId)` | 审核入口必须先校验当前绑定的 run，再真正停止并等待释放 |
| 进程重启 | `markStaleRunsInterrupted`、原 Pi resume | 既有运行标记中断，检查点保留；恢复必须由用户发起，不假装后台持续运行 |
| 审核工具 | `pi-review-ops-tools.ts`、既有 `toolProfile:'review'` 与账本压缩 | P02 已在本 Draft 分支实现活动案卷绑定后的精确白名单及五工具权限闸门，复用原有 V2 图像/续审/账本压缩和原件预览服务；受控探针已过，**真实 Pi 与扫描 PDF Electron 视觉回放仍需验收** |

**核心决定**：只新增一个很薄的 Main 审核调用适配层，不重新实现 session manager、message store、permission service、run ledger 或 agent scheduler。

## 3. v1 边界：少做什么，也要写清

1. **仅 Pi 执行阶段后台化**。原 `review-actions-controller.ts:runFullReview()` 中的旧 HTML/EML 修复、逐事项识别等**启动前准备**暂时保留现有工作台行为；用户应等这些准备结束、Pi 真正受理后再离开页面。不能把这个版本称为“从点击开始起全链路后台化”。需要跨页面运行准备步骤时另立任务，不暗中扩大本 PR。
2. **不开发中途通用聊天**。原则上只加载受控审核工具；缺材料/需解释的事实写为待补件或待核实，在本轮结束后通过现有业务流程解决。通用 AskUser/高权限请求不能静默自动批准；出现非预期技术交互必须明确拒绝、失败并收口，而非永久悬挂。
3. **不批量迁移历史会话**。新后台入口产生有 owner 的内部会话；旧审核聊天会话继续按原行为展示。已存在的审核结果与运行历史仍可访问。
4. **不改变批量审核、普通 Agent、飞书/目标任务的语义**；会话强制隔离只针对新的内部 owner。
5. **不依赖新的配置面板**。第一版只维持审核专用模型选择与“跟随全局”的既有含义；主进程必须有可靠的真实模型解析来源，不能随意替换默认模型。
6. **不保证应用退出后继续运行**。关闭审核视图不停止已受理的 Pi 运行；整个应用退出后按既有进程退出和重启中断语义处理。

## 4. 最小接线设计

### 4.1 Main 可信创建和归属

`AgentSessionMeta` 增加可选字段：

```ts
owner?: { kind: 'review-case'; caseId: string }
```

普通旧会话缺省无 owner。由 Main 审核专用创建入口完成案卷验证并在初始持久化时原子设置 owner；通用 create/update IPC 不得让 Renderer 或 Pocket 自行伪造、覆盖 owner。owner **不是**业务操作权限凭据，原有效 assignment、用户触发轮次和证据版本检查全部保留。

同一案卷可按现有规则复用符合条件的 session；`restart` 使用新 session；跨案绝不能复用。新内部会话首版不允许普通发送、排队、分叉、协作委派、工作区移动、归档或普通删除等操作。

### 4.2 一个薄 Main bridge，三个业务动作

仅建议新建一个审核特化小模块（例如 `review-pi-run-bridge.ts`），它**委托**已有函数：

- `start(caseId, mode)`：校验本轮模型与已准备案卷；创建/获取 owner 会话；复用 `preparePiReviewRunV2` 与 `runAgent`，以真正绑定的 `onRunOutcome` 调 `finishPiReviewRunV2`。启动被 busy 拒绝或前置失败时要撤销本轮指派、正确收口；不能留下孤儿 running。
- `state(caseId)`：读原有 V2 run 与案卷状态，不新存另一套 run；返回简化的业务状态和所需结果索引。技术日志与 transcript 仍在既有存储里，但不走普通 UI。
- `stop(caseId, runId)`：在无异步空窗的情况下校验它仍对应当前 session/assignment/run，然后调用 `stopAgentAndWait`。旧 run 的迟到取消不得伤害新 run。

Main 发起执行时仍需要现有窗口的 `webContents` 用于运行事件转发，**不等于打开 Agent Tab**；若不满足条件，应 fail closed，不得通过虚构窗口/绕过 SDK 解决。

**P02 接线已存在于本 Draft 分支**：仅有效 `review-operator` / 用户发起 / 活动案卷指派使用严格 `toolProfile:'review'`。主进程 `selectDirectReviewStrictTools` 只向 Adapter 提供三案卷工具与 `review_inspect_original`，`CompactContext` 由 Adapter 自带；普通 MCP、Bash、Write、聊天问答均不进入受控工具清单。案卷原件工具只接收 `documentVersionId`，复用已有 `executeAgentPreviewTool`，并在渲染前后校验绑定。主进程权限只对这五项工具按有效指派放行，过期指派与陌生工具都拒绝。**这些属于 P02 的接线验证，不表示后台 UI 已实现；扫描 PDF 的真实 Electron renderer / provider Pi E2E 仍 NOT-RUN。**

### 4.3 Renderer 只改必要的调用点

保留 `createReviewActionsController`、`RightPanel`、`RunResultPanel` 与原有案卷数据模型。在既有 `startPiReview` 回调中改用审核专用 start/status/stop IPC，移除普通 `openSession('agent', ...)` 和人工维护正常聊天 `agentSessionsAtom` 的部分。状态只显示“审核中 / 需要处理 / 已结束 / 未完成”，**不展示材料读取阶段、token、工具调用或百分比**。

在真正切离页面后，重新进入案卷应从 Main/V2 store 查询状态，而不是依赖原 Hook 的轮询循环和未保存的 Jotai 内存。

### 4.4 共享代码只允许必要的局部守卫

定义**统一的“普通会话是否允许访问”规则**，但各入口必须真正使用它：

- 主进程普通 `LIST_SESSIONS`、`SEARCH_MESSAGES`、按 ID 的普通读取与变更接口；内部维护/审计所需全量查询保留，不能全局修改底层 `listAgentSessions`。
- Desktop 会话侧栏、归档计数、消息搜索、普通 Tab 创建及持久恢复、`session_projection`、`external_run_started`、`session_updated` 和过期列表快照合并。不能因为一个异步事件重新显示内部会话。
- Pocket 远程会话列表、单会话读取、发送、取消、删除、fork、修改设置、互动答复；**进入远程事件重放日志之前**过滤内部会话。飞书镜像不能自动给内部会话建立普通聊天镜像。
- 原始 transcript 只允许受授权的审核诊断途径读取；首版可以只保留既有本地文件和审计能力，不必新做管理面板。

旧普通 Agent 的事件、权限、缓存合并、恢复和多端交互不得因新增 owner 而改变。

## 5. 实际验证与未验证（不要混淆）

**已通过的局部验证**：P01 复用测试 [`review-background-reuse.probe.test.ts`](../../../apps/electron/src/main/lib/review/review-background-reuse.probe.test.ts) 把真实 `runAgent` 函数体与真实 V2 运行存储/指派连接，使用受控模拟编排器，五种情况均通过：完整提交、部分完成、错误、取消、busy 不误收尾。PR CI 的 [运行 #38164270451](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38164270451) 验证了 3714 pass / 5 skip / 0 fail，并通过类型、边界与 Electron 构建。此结果**不等于真实 Pi/桌面 E2E**。

**P02 最新证据**：在 `42fd57fd` 的 [PR CI](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38173768799) 中受控工具/账本/权限/原件预览探针 **14/14 PASS**，全仓 3728 pass / 5 skip / 0 fail，Electron 构建、typecheck、边界检查通过。真实 Pi/model 与真实扫描型 PDF 的 Electron 渲染仍 NOT-RUN。

**P03-S01 新增验证**：在提交 `3a345227` 的 [PR CI](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38175575480) 中，现有 Main runner 无页面目标仍可收尾、V2 `running` 早于真实执行权的两项探针 **2/2 PASS**；全仓 3730 pass / 5 skip / 0 fail，D2 与审核基线均通过。此项不证明真实 Electron 跨页运行。

**P03-S02 本轮实现（仅 Main 内部）**：既有 `runAgent()` 增加可选 `onRunOwned` 观察者（普通调用方不传、不改变原行为）；`review-pi-admission.ts` 复用已有 V2 状态/指派和收尾函数，拆分短期“确实取得执行权”的受理 ACK 与持续运行 Promise。启动未受理、忙碌拒绝要收口**对应** run/assignment；同一 assignment 重复启动不能误伤原 owner。只存在内部可注入执行入口，尚未注册新的 IPC，也没有创建隐藏 owner session。

**统一验收待办入口**：[29 号 LIVE-01～LIVE-08 集中验收表](29-background-session-preflight-audit.md#最终统一实机验收清单必须保留到合并前当前均-not-run)。P02 的真实模型/扫描 PDF、P03 的 ACK/切页，以及 Pocket 隔离、重启停止和普通 Agent 全部集中登记为 **NOT-RUN**，后续不得自行勾选。

**P03-S02 自动化验证**：在冻结提交 `0180a087` 的 [PR CI #38176324329](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38176324329) 中新增受理/忙碌/早退/重复启动/预检失败/非法轮次 **6/6 PASS**，全仓 3736 pass、5 skip、0 fail，类型、边界与 Electron 构建成功；D2 与审核基线成功。**仍未注册实际业务 IPC、未创建隐藏 owner，会话隔离和真实 Electron ACK/切页未运行。**

**P03-S03 受控验证**：`759606af` 的 [PR CI #38182548136](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38182548136) 中可信 owner 落盘/拒绝伪造、普通会话兼容、Pocket 基础按 ID 阻断与重放前事件过滤 **4/4 PASS**，全仓 3740 pass、5 skip、0 fail；D2、审核基线、构建与类型检查通过。新增 `createReviewOwnedAgentSession` 仅是 Main 内部工厂，尚未通过新 IPC 真正建立后台审核。

**P04-S01 桌面入口第一批次已验证**：[`3096ba6f` PR CI #38184686298](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38184686298) **8/8 受控负例 PASS**，全仓 **3748 pass / 5 skip / 0 fail**；D2 与审核基线通过。采用原 owner 与 `assertOrdinaryAgentSession`：Main 的搜索、归档计数与多数普通按 ID 操作关闭内部会话入口；会话投影/桌面流恢复/事件 fallback 不向普通桌面转发；Renderer 的列表并发合并和迟到投影无法重新插入已知 owner。未修改公共执行内核。第一轮全仓 #38184389961 暴露旧 Goal/Stop 片段测试夹具缺少新依赖，已在冻结提交前修复并补 Stop 负例。

**P04-S02 历史 Tab/重新打开局部受控验证**：冻结代码 `68ef5128025c61b6c737be9baa82f69aefb042fc`；[PR CI #38186002063](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38186002063) **SUCCESS**，新增 `agent-tab-access.test.ts` **7/7 PASS**，全仓 **3755 pass / 5 skip / 0 fail**；[D2 #38186002055](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38186002055)、[Review Baseline #38186002095](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38186002095) 均 SUCCESS。启动时 `settings.tabState` 的历史 Agent tab 必须经由 Main 已过滤的 `listAgentSessions(true)`、owner 与工作区二次核对；不持久化 Preview/Browser，拒绝伪造 ID、已删除 ID 与隐藏 owner。未知 ID 经 Main `GET_SESSION_META` 确认后才允许普通重新打开；Preview/Browser 运行期状态协调必须有本地已知的普通会话。Main 受管浏览器已有仅主窗口/普通会话的前台和布局鉴权，本批复用，未重写 Session Manager/内核。普通已归档会话和项目 draft 的恢复与普通工作 Tab 走自动化正例。

**P04-S03 已完成的最小 tombstone 门禁**：冻结生产/测试 SHA `3ca7a6726bfefc3e5a8496ff873203ea6d0018c0`，[PR CI #38192286740](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38192286740) SUCCESS（P04-S03 新增 **5/5**，全仓 **3760 pass / 5 skip / 0 fail**），[D2 #38192286741](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38192286741)、[Review Baseline #38192286739](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38192286739) SUCCESS。内部审核会话删除时在现有 Agent 索引同次原子保存仅含 ID 的 `reviewOwnerDeletionTombstones`，`isReviewOwnedOrDeletedAgentSessionId` 同时识别现存 owner 与已删 owner；普通按 ID 访问、投影发布/删除、Main 事件流恢复与兜底直发/独立终态通知以及远程实时和重放写入前均使用该门禁。旧投影即使丢失 owner 字段也不得恢复；普通会话行为保持。**并非真实 Electron、Pocket、跨窗或 Pi E2E 通过。**



**P04-S04 受控结果与未完成的真实门禁**：P04-S04 冻结代码 `4c458d24bd73dc3221bc1d13333b50f7752d3054`：[PR CI #38194874977](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38194874977) **SUCCESS**（S04 新增 **8/8 PASS**、全仓 **3768 pass / 5 skip / 0 fail**，3773 tests / 428 files；Typecheck / boundaries / Electron main/preload/renderer build PASS），[D2 #38194874914](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38194874914)、[Review Baseline #38194874938](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38194874938) 均 **SUCCESS**。 对 `P04-S04-COMPAT-01` 已加 Main 授权后限次水合补偿、普通 Preview/Browser 正例、删除中撤销异步回放、正式 PPTX 失败回执；对未知 SDK 流建立 4096 条上限的临时队列，身份确认后顺序回放。仍需真实双窗口/后端慢查复现，并审计 `LIST_DIRECTORY` 等无 sessionId 的通用路径 IPC，不能因 S04 单测通过提前声明所有桌面入口隔离无缺口。
**P04-S02 普通工作 Tab 兼容性复查结果**：已确认**静态代码上的明确竞态条件**：`agentSessionsAtom` 的异步水合未与正式 Preview/Browser 状态到达建立屏障；`canOpenOrdinaryWorkTab` 对尚未水合的真实普通会话返回 false，`openFilePreviewTab` 返回空 ID，`reconcileBrowserTabs` 返回 null，正式 PPTX 预览调用方未验证空 ID。**真实发生率、正式回执实际后果尚未实机证明**；在 29 号登记 `P04-S04-COMPAT-01`，LIVE-06/08 NOT-RUN，未来应使用 Main 可信校验 + 有界补偿/重试，不得把未知 ID 直接放行。

**P04-S04 已推进**：补齐剩余有明确 sessionId 的 Graph/Retrospective/迁移/会话附件与预览回执/权限待审请求、健康列表、恢复 sender、browser 事件以及 Renderer 早到 Tab/迟到队列门禁；正式预览失败现有明确回执。参见 29 号 S04 专节与 PATH-01 文件路径级未验证风险。**后续小批**：**P05-S02** 飞书绑定/镜像/EventBus 已受控 PASS；**P05-S03** Pocket 路径/附件门禁已受控 PASS；**P05-S04** 搜索快照与嵌套提及 ID 隔离已有受控 PASS；**P05-S05** 已对真实本机 socket/模拟 RelayClient 重连及结构化事件引用做受控 PASS；下一小批 **P05-S06** 定点审查中心 Relay 多 viewer request-response 路由、剩余深层 payload 与真实联调限制，之后才能判定 P05 阶段是否具备关闭条件；**P06/P07/P08** 正式停止竞态、真实重启删案与普通 Agent 实机回归。P04 整体 PARTIAL，LIVE-01～08 均 NOT-RUN。


**P05-S01 首个 Pocket 远程隔离小批次**：P05-S01 冻结代码 `2a08e439d19a0d2eea572003b6ad2d71d33ca3c0`：[PR CI #38198346287](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38198346287) **SUCCESS**（本批 **5/5 新增受控 PASS**、全仓 **3773 pass / 5 skip / 0 fail**，3778 tests / 429 files；Typecheck、包边界、Electron build PASS），[D2 #38198346297](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38198346297)、[Review Baseline #38198346361](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38198346361) **SUCCESS**。 复用 P04 的 Main owner/tombstone 和 pending request 检查：`get_pending_interactions` 的权限、AskUser、ExitPlan 全量/按会话快照隐藏 review owner；三条 `respond_*` 先以 Main pending 请求的真实 sessionId 授权，不能只凭 requestId 改变内部审核状态；旧 Pocket 两个文件预览命令的 `access.sessionId` / 连接上下文回退也必须判定 owner；远程事件日志的重放/已排队待发记录在**实际发送时**重新判定 owner/tombstone，删除后不下发早已入队的 owner payload。对普通会话请求/文件操作保留原有路径。**P05 整体仍 PARTIAL**；历史 cursor/元数据、完整 WS 联调、飞书群镜像/旧绑定/事件、路径型远程 Chat 附件仍要单独审查。下一小批 `P05-S02`，不进入 Main 业务接线或 A0 实机。

**P05-S02 飞书受控隔离结果**：P05-S02 冻结代码 `ae8d6398b3f818abd2d648ea14876c6c5800e164`：[PR CI #38200646046](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38200646046) **SUCCESS**（本批 **7/7 新增受控 PASS**、全仓 **3780 pass / 5 skip / 0 fail**，3785 tests / 430 files；Typecheck、边界、Electron main/preload/renderer build 均通过），[D2 #38200646047](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38200646047)、[Review Baseline #38200646059](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38200646059) 均 **SUCCESS**。 `feishu-bridge.ts` 的旧 chat binding 落盘恢复、`listBindings/getStatus`、`updateBinding`、`ensureSessionMirror/startSessionMirrorRun/stopSessionMirrorRun`、带旧绑定的群消息、`/stop`、`/now`、`/model`、Agent EventBus 处理、迟到完整答复及定时通知入口现在在发送或修改前检查 Main 已知 owner/tombstone；`feishu-bridge-manager.ts` 的镜像动作也在调用 Bridge 前拒绝隐藏 owner。7 项合成绑定、旧绑定恢复、删除后回放、普通镜像/绑定正例已通过。**不代表真实飞书账号/群、网络重连、多 Bot E2E；P05 整体仍 PARTIAL**。下批 `P05-S03` 专项审远程 path-only/附件读取 `P05-REMOTE-PATH-01`，并保留 `P04-PATH-01`、全量 WS/relay、LIVE-06/08。A0 首次实机计划仍在 P05/真实 Main IPC/路径门禁齐备后。

**P05-S03 远程路径与旧 Chat 附件隔离（受控）**：P05-S03 冻结代码 `fe89861a52a99836d5d458a528f1d8d9e885ff70`：[PR CI #38201737608](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38201737608) **SUCCESS**（本批 **7/7 新增受控 PASS**、全仓 **3787 pass / 5 skip / 0 fail**，3792 tests / 431 files；Typecheck、包边界及 Electron main/preload/renderer build PASS）；[D2 #38201737615](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38201737615)、[Review Baseline #38201737635](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38201737635) **SUCCESS**。 证实 `chat_read_attachment` 原允许绝对路径读取整个 app 配置根、`chat_delete_attachment` 缺少相同远程权限验证；普通 Pocket 的 `resolve_and_read_file/read_file_as_data_url` 虽使用 realpath 工作区根门禁，但共享工作区根本身包含隐藏 review owner 的 session 子目录。仅修改 `remote-file-access.ts` 与 `remote-service.ts`：Chat 附件读删限制到真实 `attachments/` 根并验证符号链接解析；Pocket 文件预览在传入路径及 realpath 两处按主进程 owner/tombstone 拒绝 review 私有会话工作目录、SDK 消息及 checkpoint 等已知路径布局，即使经共享 workspace 根或显式 attachedFiles/attachedDirectories 也拒绝；普通 session cwd、共享文件、正常 Chat 相对/绝对附件操作仍可用。合成文件 7 项正负例及全仓 CI 通过。**`P05-REMOTE-PATH-01` 在本批明确列举的三类读取/附件删除入口已受控收口；不等于全部远程入口或桌面 `P04-PATH-01` 通过**。剩余 WS/relay 历史、快照与重连和真实双端 E2E 归 `P05-S04` / LIVE-06/08。真实 Main 后台审核 IPC 仍未注册，A0 未执行。

**P05-S04 Pocket 远程搜索/快照/重放受控批次**：P05-S04 代码冻结 `fa6a2a250e6fee0d956ab2ad045812bacd5f3c2c`：[PR CI #38232065193](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38232065193) **SUCCESS**（新增 **8/8 受控 PASS**；全仓 **3795 pass / 5 skip / 0 fail**，3800 tests / 432 files；类型检查、边界和 Electron main/preload/renderer build 均通过）；[D2 #38232065271](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38232065271)、[Review Baseline #38232065165](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38232065165) 均 **SUCCESS**。 确认 `search_workspace_files` 原通过 server-derived attachedDirectories/attachedFiles 扫描目录，但只在后续文件读取应用 S03 的私有路径排除，能提前泄漏 owner 目录/文件名与绝对路径。改 `remote-workspace-file-search.ts` 的扫描与附加路径入口：加入可选 `denyPath`，候选路径、canonical realpath 以及目录本身都先按 `isReviewPrivateConfigPath` 与 Main tombstone 判断再展示。对共享工作区/普通文件仍兼容。普通 `queue_message` 的嵌套 `mentionedSessionIds` 可表达内部 owner ID，已在入队前拒绝 hidden/deleted owner，普通引用保持。新 8 项合成正负例包括 list_sessions / active context 快照、搜索与软链接、删除后残留、普通队列、进程内 replay 的 cursor/order/expired snapshot fallback。**尚无真实 Pocket/Relay 多客户端连接、重连、快照刷新或网络终态证明，故 P05 总体仍 PARTIAL**。P05-S05 继续协议层封闭测试；P04-PATH-01、Main 接线、A0 和 LIVE-01～08 仍开放。

**P05-S05 本地 WS/Relay 真实 socket 受控验证**：P05-S05 冻结代码 `88b941337749028ae3c51ff0db117c44ceb4d7aa`：[PR CI #38254196437](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38254196437) **SUCCESS**（新增 **8/8 real-loopback/受控 PASS**，全仓 **3803 pass / 5 skip / 0 fail**，3808 tests / 433 files；Typecheck、package boundaries、Electron main/preload/renderer build PASS）；[D2 #38254196484](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38254196484) 与 [Review Baseline #38254196442](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38254196442) 均 **SUCCESS**。 源码确认旧 Relay 通过一个 `remoteRelayCommandContext` 在多个 viewer 之间共享 `activeSessionId` 回退，旧无 sessionId 文件预览可能借到其他 viewer 会话；修成 `handleRemoteRelayCommand` **无共享连接上下文**（Relay 必须显式携带 sessionId，普通本地 LAN 旧版回退仍保留）。对普通 Agent `profer_event` 的结构化 `sessionId/*SessionId/*SessionIds` 等字段增加隐藏 owner/tombstone 拒绝，append、发送与历史重放均重新检查，**不扫描用户正文的任意字符串**，避免扩大业务语义。新增 8 项 CI 可跑的真实 loopback WS 与 `RemoteRelayClient` 连接测试：token 握手/拒绝、两个 viewer 独立 replay gate、断连续传、删除及嵌套 owner、无效 cursor→snapshot、普通 LAN legacy 回退、Relay stateless command、模拟 ticket 的真实 RelayClient socket 认证和重连。首次 D2 TypeScript 测试桩失败（[#38253917752](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38253917752)），已修使用 HTTP-backed WS listener/消息类型，冻结版全 CI 成功。**真实中心 Relay、多 viewer 跨网络响应路由、移动设备/飞书未测，P05 仍 PARTIAL**，P04-PATH-01/LIVE-06/08/A0 不得因本次 PASS 放行。

**P04-PATH-01 遗留路径型桌面 IPC 专项修补（2026-10-12）**：P04-PATH-01 冻结代码 `9eec2311b9ed8f5637f8bf6fa281605040899c39`：[PR CI #38260093230](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38260093230) **SUCCESS**（新增 **9/9 受控 PASS**；全仓 **3812 pass / 5 skip / 0 fail**，3817 tests / 434 files；typecheck、边界、Electron main/preload/renderer 构建通过）；[D2 #38260092950](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38260092950) 与 [Review Baseline #38260093231](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38260093231) 均 **SUCCESS**。 源码审计确认常规 `LIST_DIRECTORY` / `READ_DIRECTORY_RECURSIVE` / `OPEN_FILE` / `READ_ATTACHED_FILE` / `FILE_PREVIEW_REVISION` 仅靠通用根/预览规则，部分路径没有 `sessionId`，可触及工作区私有子目录；`SEARCH_WORKSPACE_FILES` 和文件候选检索可能泄露隐藏审核文件名；`cdut-file://` 目录 token 可在注册后访问目录下其它相对资源，先前未按每条资源执行 owner 隔离。已新增 `review-private-file-access.ts`，以 Main 既有 owner/tombstone 和审核目录布局构建**原始路径+realpath 双层只拒绝**（不扩大通用路径授权）；对目录枚举过滤私有子项、递归读取跳过私有子树、直接私有路径读写/打开/预览拒绝、目录级危险删除/移动拒绝、附加目录读取和候选搜索隔离，并在 `local-file-protocol.ts` 的目录 token 实际请求时最终复核。已删除审核会话残留与 symlink 别名受控验证。**普通工作区文件及用户明确外部预览继续正常**；删除整个 workspace 容器的低层泛用文件操作被有意收紧。第一次全仓 CI [#38259407202](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38259407202) 因公共预览 import 重依赖触发已有 PPT 单测 `electron.safeStorage` 导入失败；改为路径确实涉及私有布局时再调用 Main 索引判定，冻结代码三套 CI 全通过。**P04-PATH-01 对已枚举泛用路径链路 = 受控 PASS；P04 整体仍 PARTIAL**（实际 Electron 双窗口、正式预览、LIVE-06/08 未运行），不提前合并或解 Draft。

**P04-PATH-01 独立复核后的目标路径补丁**：旧 9/9 PASS 不能代表 IPC 最终 destination 已检查。已将四个文件移动/重命名 IPC 统一接入受保护实际 rename 函数，覆盖新目标及父级 symlink；冻结代码 [`7c5e003c`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/7c5e003c5c1a01dc295e1ff0e4c6ce15e4da42f0)；[PR CI #38269830272](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38269830272)、[D2 #38269830328](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38269830328)、[Review Baseline #38269830273](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38269830273) **全部 SUCCESS**；新增 **5/5**，全仓 **3817 pass / 5 skip / 0 fail（3822 tests / 434 files）**，typecheck/边界/Electron build PASS。真实 Electron IPC、多 OS 及 TOCTOU 后续仍按 LIVE-06/08 记录 NOT-RUN；P04 PARTIAL，下一小批 P05-S06 不变。

**P05 独立阶段验收/本地验证交接（2026-10-13）**：代码冻结 [`ce992f90`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/ce992f90880ecde1954e925b63585692a085f621)，三套 CI [PR #38284532497](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532497)、[D2 #38284532492](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532492)、[Baseline #38284532487](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532487) 均 SUCCESS；P05 六个文件 **43/43 PASS**（8+7+7+8+8+5），全仓 **3830 pass / 5 skip / 0 fail**（3835 tests，436 files）。真实中心 Relay 服务器并未在本仓库实现；最新合成中心 fixture 补相同 `_cmdId` 碰撞与断线旧回执正反例，正式中心仍 NOT-RUN。独立 Pocket 只读上游提供 [客户端修复补丁](patches/P05-POCKET-FIFO-01-Profer-pocket.patch)，目标测试未执行。详见 [32 号完整 P05 验收与实测指南](32-p05-stage-acceptance-and-local-gates.md)。**P05 整体 PARTIAL，Draft PR NO-GO；P04-TECHDEBT-01 原记录全部保留，不推进 Main/P06。**

**P05-S06 多 viewer 路由受控补批（2026-10-13）**：代码冻结 [`aaf1ca89`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/aaf1ca890a37d679a52e3e79cf10d9f588ce25e5)；[PR CI #38282086761](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38282086761)、[D2 #38282086959](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38282086959)、[Review Baseline #38282086722](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38282086722) **SUCCESS**；新增 **6/6 PASS**，全仓 **3828 pass / 5 skip / 0 fail（3833 tests / 436 files）**，Typecheck、边界与 Electron 构建均通过。真实桌面 outbound WSS→合成 Relay→两个 viewer 的响应定向、重连快照及深层结构化 ID 均取得受控证据；但中心服务端源码/授权多端票据尚未可用，`profer.cn/remote/ws` 生产转发 **NOT-RUN**。另见独立 Profer-pocket 客户端在 ID 不匹配时依旧 FIFO 消费的 [源码风险](https://github.com/Yuan-lai-ru-ci/Profer-pocket/blob/main/src/renderer/pocket/ws-client.ts#L387-L412)（不是已发生生产泄漏）。详见 29 号 P05-S06 专节。P05 PARTIAL、LIVE-01～08 NOT-RUN，不推进 Main IPC/P06。

**P04-TECHDEBT-01 安全性能补批**：会话索引同版本派生的 owner/deleted ID Set 解决高频线性扫描；冻结代码 [`dccaf6ce`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/dccaf6ce96072eac9404c3957742555916bd62f1)；[PR CI #38273510150](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38273510150)、[D2 #38273510227](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38273510227)、[Review Baseline #38273510354](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38273510354) 均 **SUCCESS**；新增 **5/5 PASS**，全仓 **3822 pass / 5 skip / 0 fail（3827 tests / 435 files）**，typecheck、边界、Electron build PASS。0/1k/10k/100k 实测与保留 tombstone 的安全策略详见 29 号。容量永久增长不能靠不安全 TTL/GC 消除；按风险保留平台架构复评。LIVE-06/08 未做，P04 总阶段 PARTIAL；下批仍 P05-S06。

**仍未完成的门禁**：P03 实际业务 Main IPC/会话启动/切页；P02 真实模型与原件视觉 E2E；P04 已知路径型桌面文件 IPC 的完整隔离证明与真实 Electron 回放、P05 Pocket/Feishu 的全面隔离、P06 迟到 stop、P07 重启与删除、P08 普通 Agent 真实回归。统一验收 LIVE-01～08 全部保持 NOT-RUN。

**P03-MAIN-S01 只读业务状态小批（2026-10-13）**：冻结代码 [`5f786583`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/5f7865837c6321756c3bc779c5aad2fe793e8fd0)；[PR CI #38290676371](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676371)、[D2 #38290676419](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676419)、[Review Baseline #38290676426](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676426)、[Review batch focused #38290676413](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38290676413) **全部 SUCCESS**；新增 **7/7 PASS**，全仓 **3837 pass / 5 skip / 0 fail（3842 tests / 437 files）**，Typecheck / boundaries / Electron main, preload, renderer build PASS。新增 Main 业务态读取与真实 `onRunOwned` 受理标记，不再将 V2 的 `running` 当可切页 ACK；不对外返回内部 Agent sessionId/assignmentId。**这不代表 start/stop 或真实后台审核可用**；下一批 P03-MAIN-S02 做可信业务启动。用户表示本地已验收，但对应证据尚未同步到本 PR 分支的 29/32，保持 P05 外部端、A0/LIVE 的已有 NOT-RUN；详见 29 号新小节。P04-TECHDEBT-01 原记录不动。

## 6. 后续严格按这个顺序执行

1. **P02 live E2E 合并到最终端到端验收**：白名单、权限闸门、案卷限定预览、V2 续审已经有受控证据；真实 provider Pi / 扫描 PDF Electron 视觉回放在完整 Main 后台链路接通后统一测试，之前仍标 P02-LIVE-E2E NOT-RUN。**允许按小批次开展 P03 接线/受控测试，但严禁在此之前合并、推出功能或宣称 P02 整体通过**。
2. **P03-S01～S03 和 P04-S01/S02/S03/S04 已按小批次推进**：审核材料修复、申报事项识别仍由 Renderer 先完成；`preparePiReviewRunV2` 写入 `running` 不是 Pi 已受理。必须由 Main 观察到真实 `onRunOwned` 后才给出可安全离开页面的受理 ACK；忙碌拒绝或启动失败按原案卷 run/assignment 收口，不能留下虚假 running。切页仅允许发生在已经受理后的 Pi 阶段。S02 已增加现有 `runAgent` 的 Main ACK 可选钩子及 `review-pi-admission.ts` 薄协调层，受控 CI 已通过、真实 Electron 真机待验；S03 已具备可信 owner 原子创建与基础屏障；P04-S01 补齐桌面搜索/归档/普通会话操作与投影基本拦截，需继续解决 P04 路径型 IPC 残余证据、执行 P05 的剩余远程入口枚举与针对性负例，才能暴露新后台审核 IPC。
3. **薄 Bridge**：仅接入现有 `runAgent`、`preparePiReviewRunV2`、`finishPiReviewRunV2`、`stopAgentAndWait`。入口快速 ACK 与持续运行完成是两个不同 Promise/生命周期；Main 自己持有长期执行，不依赖 React Hook 轮询。逐个测试成功、失败、取消、竞态、重启、删案。
4. **最少 UI 改动**：仅修改审核触发与业务状态；Pocket、历史 Tab、事件回填与普通聊天逐项回归。
5. **实测验收**：冻结提交 SHA，运行全部测试、类型/边界/构建、合成案卷 Electron 回放与真实 Pi 受控测试；无法执行的标 NOT-RUN。由用户审核结果后决定是否结束 Draft/合并。

**越界停止规则**：任何一步如果要求重写 Pi Adapter、AgentOrchestrator、通用 Session Manager、权限系统或事件总线，必须先给出无法通过局部适配完成的可复验证据，并修订本文件后才继续，不允许边做边扩张。

## 7. PR 边界

仅在 `feat/review-owned-background-sessions` 的 Draft PR #21 开发。预先划清必要的生产改动文件与测试文件；不得夹带 D3 模板编辑器、批量审核或其他通用 Agent 功能的重构。**没有真实 CI 与桌面证据不合并；未经用户验收绝不合并。**
