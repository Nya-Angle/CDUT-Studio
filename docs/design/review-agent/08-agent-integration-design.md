# 08 · 审核功能接入 Agent：可行性验证与设计（阶段 C）

> 状态：设计稿，三个产品决策已记录；**阶段 C 未实施**。2026-10-06 对照代码 `4e538977` 复核并修订设计，本次没有进行新功能运行验收。
> 决策记录：① AI 代批默认禁止，开关放在高级区，开启前确认（用户可选开启）；② 用户显式指派，不做后台扫描或无人值守发起审核；③ 案卷时间线展示操作者（AI 操作可辨）。运行中查询已指派任务的进度不属于后台主动接单。

## 1. 结论先行

**三项均可在现有 CDUT-Studio 基座内实现，不依赖学校 API，也不需要新 Agent 内核或数据库。** 现有 Pi 工具注入、审核服务、命令事务、设置和 UI 组件可复用；授权范围、代批门控、异步运行管理与完整操作者记录仍需新增。没有可复核的工作量分母，移除“已覆盖约 80%”的完成度估计。

| 新增功能 | 可行性 | 可复用基础 | 实施前必须补齐 |
| --- | --- | --- | --- |
| AI 可选择代批，默认禁止 | 可行；涉及业务正确性的改动较多 | 阶段/补件命令、settings.json、AlertDialog | 默认拒绝、任务角色/范围/版本校验、开关即时生效、代操作与授权人可区分 |
| 用户显式指派 Agent 操作审核 | 可行；是 C1 的主链路 | Pi customTools、能力组裁剪、用户轮次上下文、已授权目录 | 可信的指派上下文、模板查询、异步启动/查询/取消；不能依靠每步弹窗识别用户意图 |
| 时间线显示人工/AI 操作者 | 可行；宜与 C1 同时交付 | 决定已有 actor，命令回执和本地 JSON 仓库存在 | 补件/运行/回执身份与会话来源落盘、历史兼容、统一时间线和 UI 更新 |

核心方案：

- **Pi in-process custom tools → 审核应用服务**。新增 `review-ops` 能力组，复用 `adapters/pi-builtin-tools.ts` 的注册方式。UI IPC handler 与工具调用相同服务函数；不在工具里模拟点击或调用 renderer 的 IPC handler。
- **先抽出仍位于 handler 内的运行装配和报告导出**。`RUN_REVIEW_V2` 当前已经真实装配执行器，但运行渠道/OCR 装配与 `EXPORT_REPORT_V2` 的 MD 落盘还在 handler 内，不能照抄两份。提取为主进程服务，两类入口薄委托。
- **授权与决定分开验证**。工具检查本轮指派范围；应用服务检查操作者、任务角色、状态、引用、expectedRevision，以及决定类操作的代批开关。能力组 risk 是描述元数据，不自动产生这些业务规则。
- **主进程构造 actor**。所有入口保持操作者来源，避免 `submitCaseV2` 等服务把 Agent 重写成 `local-user`。采用同进程调用可以复用案卷串行锁；外部 MCP 若经主进程 API 代理也能实现，但本阶段没有必要增加这一层，更不能让外部进程直接读写聚合文件。

## 2. 三条决策的落地设计

### 2.1 AI 代批（默认禁止 + 高级区开关 + 开启确认）

```
AppSettings.reviewAgentAutoApproval: boolean（默认 false，settings.json）
```

- **开关位置**：审核专区「高级」折叠区（或设置 → 审核专区），不放主操作区；当前任务显示“AI 代批：关/开”，可以定位设置并关闭。高级区不等于用户看不见当前权限状态。
- **开启流程**：AlertDialog 列出具体可代执行的决定及适用范围 → 用户确认才写入。保留开启时间/操作者记录。Agent 不能自行开启该开关。
- **开关的含义**：它只开放代批能力，仍需本轮显式指派和合法工作角色；不能解释为从此允许所有案卷/阶段自动通过。未来校方适配器可以进一步限制该能力，本地设置不能提升校方权限。
- **决定类门控**：覆盖 `RecordStageDecision` 全部会改变决定的动作（含事项通过、终审驳回、退回前阶段等）及 `ResolveSupplement`。后续增加申诉裁决、评分定稿等决定路径时使用同一策略，不能靠两个工具名覆盖全部业务。
- **补件回复不是审核决定**：`RespondSupplement` 不受代批开关限制，但必须是提交者明确指派的回复；校验请求归属、合法状态和本案附件版本。不能无条件开放，也不能替代审核方宣称材料已经满足。
- **门控放在聚合命令执行校验中**：在案卷串行队列读取最新聚合与当前设置后、写入决定之前检查，避免排队期间关闭开关仍写入；幂等重试只返回原回执，不再次执行决定。

```ts
// 示意：submitCommand 的 handler 中、产生任何新业务变更之前。
assertTaskActorAndAssignment(aggregate, command.actor, context)
if (isDecisionCommand(command) && command.actor.actorSource === 'agent'
    && getSettings().reviewAgentAutoApproval !== true) {
  throw new CommandValidationError('AGENT_DECISION_DISABLED', 'AI 代批未开启，请由人工处理此决定')
}
```

- 上述辅助函数与错误码均为待实现设计；将 `AGENT_DECISION_DISABLED` 加入共享 `CommandErrorCode`，统一返回结构化拒绝。默认值、旧 settings 读取和设置更新都要归一为严格布尔值。
- **能力组配合**：决定类工具标 `risk: 'destructive'`，预设可整体裁剪；`canUseTool` 继续处理当前权限模式。即使通用 Agent 为完全自动模式，服务层代批开关仍必须生效。
- **开关开启也保留人工终点**：当流程指定 teacher 终审、独立 judge 评分、未确认事实或最低人数不足时，仅凭 reviewer 身份和代批开关不能越过这些门控。Agent 可以建议修改/决定，人工确认动作与 AI 自动建议保持不同记录。

### 2.2 显式指派

- 用户通过“交给 Agent”选择当前案卷/材料，或在当轮消息中明确请求，主进程据此创建 `ReviewAgentAssignment`。内容至少包含 sessionId、turn/messageId、允许的案卷或建案模板、动作范围、工作角色和有效状态。建案成功后把新 caseId 绑定到该指派。工具参数不能自行扩大指派范围。
- C1 优先使用按钮产生结构化指派；自然语言没有明确案卷/业务或动作时先让用户选择，不把所有 user 来源消息都当授权。一份指派可以覆盖其范围内的整条整理/提交/预审/导出流程，不要求用户每一步重新指派。
- 每个工具检查可信指派上下文；只选择“审核操作员”预设不自动获得对全部案卷的操作许可。用户撤销指派后，后续新写入被拒，已经完成的动作保留时间线。
- `PiBuiltinToolsContext.triggeredBy` 已能区分 user/automation/delegation/goal。C1 只接受用户发起的轮次；自动任务和 Goal 自动续轮不获得审核写权限。将来允许委派时，应继承原用户指派范围，不能自行扩大。
- **权限弹窗不等于显式指派**：当前默认 permissionMode 是 `bypassPermissions`，auto 模式还支持“总是允许”的会话白名单，因此“不在 SAFE_TOOLS 就每次弹窗”不成立。复用已有权限模式处理工具确认，避免查询状态也反复打断用户；代批开关和指派范围始终由业务服务验证。
- 模板/案卷/运行查询等只读工具可单独加入只读分类，仍检查可见范围；不能将整个 review-ops 组加到 SAFE_TOOLS。plan 模式同步允许这些查询、拒绝登记/提交/运行等写动作，避免工具新建后连查询也不可用。
- 不扫描 submitted 案卷自动接单，不接 automation；已指派任务的有限进度查询允许进行。达到等待补件/等待人工状态时结束自动推进并给出继续入口，不能轮询到永久等待。
- 可选「审核操作员」预设和配套操作 Skill，用于说明何时读模板、提交、运行及等待。它们复用现有会话与工具体系，不能另建一套审核 Agent 状态机。

### 2.3 操作者展示（时间线）

当前只具备部分基础：`BusinessDecision.actor` 是身份对象；补件 responses.actor 只有字符串 ID；`Observation.extractedBy` 只是 ai/user/fixture 分类；`CommandReceipt` 和 `ReviewRunV2` 没有发起者。没有可直接渲染的完整案卷时间线。**必须补数据契约与写入路径。**

1. `Actor.actorSource` 加 `'agent'`，同时统一 BusinessDecision、人工处理记录等重复声明的内联 actor 类型；不能只改 Actor 一处。
2. `CommandReceipt` 添加 `actor?: Actor` 及会话/轮次/指派来源。`submitCommand` 与实际业务变更同事务保存；`createCaseFromTemplate` 当前创建回执只返回、未追加 receiptLog，创建动作也要持久记录。`submitCaseV2` 接受可信 actor，不再固定写 local-user。
3. 补件回复保留旧 actor 字符串以兼容历史，添加可选完整操作者；观察的 extractedBy 继续表示提取方式，纠错/确认的操作者由命令回执记录，不将分类值当身份。运行增加 initiatedBy 和来源关联，并记录 queued/结束/取消等运行事件。
4. AI 操作者与人工授权/确认者分开记录：例如“AI Agent 代操作，某本地用户指派”。保留完整 sessionId，不以会话前 8 个字符作为唯一身份；短码只用于显示。
5. 时间线由已持久命令回执和运行事件构建，显示时间、动作、案卷/事项、人工/AI/模拟/校方来源、工作角色、关联运行与理由。Agent 修改后更新已打开案卷和列表，点击可回到对应结果；避免后台变更而页面仍显示旧 revision。
6. 历史无 actor 的条目显示“旧版记录，操作者未记录”，不猜成“人工”；保证重启后 AI 标识仍存在。C1 就完成写入与基本展示，C3 再打磨侧栏和筛选。

## 3. 代码核对：已有基础与需要新增的部分

| # | 假设 | 验证结果 | 依据 |
|---|------|---------|------|
| 1 | Actor 可以扩展 Agent 来源 | 可扩展，但决定等有内联 actor 类型，需一起收敛；role 与 actorSource 是两回事 | `packages/shared/src/types/review-v2.ts:359/421/526` |
| 2 | 操作者数据已齐全 | 不成立：回复是字符串，extractedBy 是分类，receipt/run 未记身份；创建回执未入日志 | `review-v2.ts:290/384/449`、`review-v2-contracts.ts:282`、`application-service.ts:92` |
| 3 | Pi 可以同进程注入服务工具 | 成立：buildPiBuiltinTools + customTools 权限包装，可复用生图/规划工具方式 | `adapters/pi-builtin-tools.ts:1623`、`adapters/pi-agent-adapter.ts:2051/2200` |
| 4 | 现有案卷命令串行机制可复用 | 成立：同进程 submitCommand 进入 enqueueCase；外部进程不能直写共享 JSON | `review/case-store-v2.ts:105` |
| 5 | 白名单外工具总会请求确认 | 不成立：默认 bypassPermissions 直接放行，auto 有会话白名单；risk 元数据不代替权限策略 | `types/agent.ts:1890`、`agent-orchestrator.ts:1574`、`agent-permission-service.ts:156/241` |
| 6 | 服务层有门控插入点 | 成立，但必须在事务校验内检查设置/任务/指派；共享错误码还需增加 | `review/stage-workflow.ts:58/174`、`review-v2-contracts.ts:316` |
| 7 | 设置存储与确认组件可复用 | 成立，新增字段默认值/读取归一/开启记录和设置 UI 待实现 | `settings-service.ts:24/44/88`、设置区 Dialog 组件 |
| 8 | 登记不依赖原生文件选择框 | 成立：registerMaterial 收 sourcePath；路径授权与槽位/附件归属需工具服务验证 | `review/material-service.ts:54`、`agent-directory-utils.ts:17` |
| 9 | V2 可以运行并查询 | 成立：RUN_REVIEW_V2 已接线，getRunV2 需 caseId+runId；异步后台管理尚需新增 | `review/review-ipc.ts:202/351`、`review/run-service-v2.ts:44/57` |
| 10 | 报告可以复用 | 有 MD 导出，但逻辑在 IPC handler 内，先抽服务；导出写文件，risk 应为 write | `review/review-ipc.ts:249` |
| 11 | 内部提取工具与业务操作应分工 | 可保留：通用 Agent 负责指派的业务操作，内部执行器负责材料核验；不裸开放内部 submit_check 等接口 | `review/pi-review-executor.ts`、`review/v2-executor-factory.ts` |
| 12 | 结构化摘要能完全防止指令注入 | 不成立：标题/理由/文件名仍可能来自材料；摘要减少传输，内容仍按数据处理，动作受可信指派和服务校验约束 | `review_get_case/get_run_status` 的待实现输出合同 |

## 4. 工具门面（review-ops 能力组，C1 11 项 + C2 3 项）

注册进 `AGENT_PRESET_CAPABILITY_GROUPS`（group id `'review-ops'`），实现于 `agent-review-ops-tools.ts`：

| 工具名 | 动作 | risk | 服务层门控 | 分期 |
| --- | --- | --- | --- | --- |
| `review_list_templates` | 查询可用已发布模板及版本 | read | 指派允许的业务范围 | C1 |
| `review_get_template` | 读字段 schema、材料槽、阶段和必要规则摘要 | read | 锁定模板版本；帮助 Agent 填合法参数 | C1 |
| `review_list_cases` | 列案卷（id/标题/阶段/revision） | read | 限当前指派/可见范围，分页 | C1 |
| `review_get_case` | 聚合摘要、字段、材料槽、任务及下一步；不含材料全文 | read | 案卷范围及工作角色投影 | C1 |
| `review_create_case` | 从已发布模板建案 | write | 模板/字段校验；新案绑定指派；创建可幂等重试 | C1 |
| `review_register_material` | 登记授权文件并分配 materialSlotId | write | 路径、槽位、文件类型及案卷版本 | C1 |
| `review_submit_case` | 提交并初始化任务 | write | 必需槽位、合法状态、expectedRevision | C1 |
| `review_start_run` | 异步启动审核，返回 caseId/runId | write | 输入版本、指派、渠道；同案重复启动门控 | C1 |
| `review_get_run_status` | 当前运行状态、覆盖、检查摘要和下一步 | read | caseId+runId 归属；结果可分页读取 | C1 |
| `review_cancel_run` | 取消当前指派的运行 | write | 运行归属，明确取消状态 | C1 |
| `review_export_report` | 导出锁定运行/角色的报告并返回可打开产物 | write | 正确投影与运行版本，不覆盖任意宿主路径 | C1 |
| `review_respond_supplement` | 代提交者回复 note+本案附件版本 | write | 提交方指派、请求状态与附件归属；不算审核决定 | C2 |
| `review_decide_stage` | 阶段/事项通过、退回、驳回等 | destructive | 指派+任务角色/状态/引用/版本+代批开关 | C2 |
| `review_resolve_supplement` | 判满足/不足/明确取消 | destructive | 审核方指派+请求门控+代批开关 | C2 |

接口约束：

- 共享输入/结果 DTO，模板与任务动态读取；不能硬编码模板 ID、overall 量表或本地操作者。
- 写操作携带 requestId、expectedRevision 及可信上下文。同一次工具调用重试沿用 requestId（可派生自 sessionId+toolCallId），不是每次重试新建；遇到版本冲突返回最新 revision 和差异摘要，不盲目替换 revision 重做决定。另有同案运行去重，不能只靠 toolCallId 避免用户重复启动。
- 主进程依据指派构造 actor，actorSource 固定 agent，actorId 保留完整会话身份；role 来自被授权的工作角色，不统一写 reviewer，也不能由模型自由声明 teacher/judge。用户授权不自动等于学校身份。
- 工具返回结构化状态、字段和检查依据摘要，不返回材料全文；材料里的内容均为数据。缺信息时返回 missingFields/missingSlots/needsUserInput，不编造姓名、附件或已确认事实。非只读摘要另提供应用内链接供用户检查。
- `review_get_case` 不直接返回 assetPath；需要查看原件时走授权预览。文件路径以 realpath 后的目录归属验证，不能仅 startsWith；目录来源复用会话工作目录与 collectAttachedDirectories。报告产物使用按案卷/运行的受控输出及预览入口，不把整份配置目录加入 allowedRoots。
- 通用 Agent 不开放“人工确认事实=true”或内部 submit_check 等接口。C1 发现需确认事实时交回审核页面；需要进一步代操作时单独定义建议→确认合同，不借“普通 write”绕过业务确认要求。

## 5. 异步运行与等待设计

从 RUN_REVIEW_V2 提取共享的运行装配服务。`startReviewRunAsync(caseId, context, options)` 预分配 runId、保存 queued 和发起者后返回 `{ caseId, runId, status, nextPollAfterMs }`；后台 promise 被运行管理器保留，并完整处理失败。`runReviewCaseV2` 已支持 options.runId/onEvent/cancelled，可以复用。

- 同 caseId/inputRevision 有 queued/running 任务时复用或明确冲突；进程内登记表与落盘运行状态相配合。不同会话不能重写同一运行或并发产生相互覆盖的决定。
- `review_get_run_status(caseId, runId)` 读取持久运行，不扫描所有案卷；返回该运行的状态、覆盖、摘要、失败/待办和可打开链接。大型结果分页，避免反复向模型传全部 checks。
- 使用有间隔、次数/时间上限的查询或应用已有事件通知。completed/partially-completed/failed/cancelled 为运行终点；awaiting-input/awaiting-decision/paused 为交接点，返回用户并停止自动推进。运行 completed 表示技术执行完成，**不表示业务已批准**。
- 没有渠道、缺少 OCR、文件不可读、模型失败均返回具体状态，不能降级成模拟通过。关闭会话/停止 Agent 的处理必须明确：撤销后续自动动作，必要时取消对应运行，并向用户保留已完成结果与继续入口。
- 取消信号需穿透执行器及网关，当前 handler 的 client.complete 接收 signal 却未传给 chatCompletion，这一步仍需适配。仅登记 cancelRunId 不等于中止已经在等待的网络请求。
- 重启后正在运行的任务标为可恢复/中断，按输入 manifest 和检查点继续；不能只恢复一个永久 running 文件。Agent 会话侧提供“打开审核结果/继续任务”，不另造无限 Goal 或定时轮询。

## 6. 实施分期（供立项拆分）

- **C1 指派操作闭环**：共享运行/导出服务、可信指派、完整 actor/receipt/run 写入与基本时间线、决定类默认拒绝、11 项工具及共享 DTO、异步运行查询/取消。真实旅程：“用户指派→查模板→建案→登记槽位材料→提交→真实审核→读结果→导出/交回人工”。等待人工时必须能返回用户；这阶段不宣称 Agent 自动终审。
- **C2 代批与补件**：settings 开关及高级入口、开启确认、3 项工具、任务角色/范围/版本门控、实际补件回复和再审。关闭/开启/撤销指派、错误角色、陈旧结果、多请求补件分别验证；最终审批只在模板和角色都允许时执行。
- **C3 易用性与恢复**：审核操作员预设/操作 Skill、审核专区内嵌既有 Agent 会话、状态卡/结果跳转/时间线筛选、重启恢复和用户旅程打磨。会话沿用公共模型、权限、消息和附件机制；操作者持久化不能推迟到 C3。

三个分期不是三套互相替代的 Agent。全部功能共享审核状态、单案执行与现有会话；前两期分别建立“可操作”和“可决定”的能力边界，C3 改善入口与恢复。

## 7. 测试计划（BDD）

- **指派**：无指派、无关用户消息、automation/Goal 自动续轮不得写审核业务；明确指派可以完成合法链路。bypassPermissions、auto“总是允许”、plan 三模式分别验证，不靠弹窗次数断言授权；撤销后新动作被拒。
- **代批**：开关关时默认拒绝所有决定路径，code=AGENT_DECISION_DISABLED；开关开、指派/角色/任务合法才通过，时间线记录 AI。排队期间关闭、错误角色、旧 revision/旧 run、未满足补件/缺评不得放行；人工角色仍遵循原业务门控。
- **事务与身份**：同工具调用重试不重复建案/登记/提交/决定；创建回执实际落盘。决定、补件、纠错、运行、导出均可追溯 session/指派；重启标识不丢，旧记录不冒认人工。
- **运行**：真实材料至少一份符合、一份冲突、一份失败；重复启动、取消等待中的调用、等待人工退出、重启恢复各验。运行 completed 不显示为审批通过。
- **门面**：模板/schema 可发现，必需字段与槽位缺失返回明确请求；越目录/符号链接出目录拒绝，外案附件拒绝；摘要和导出按角色投影，产物可通过受控入口打开。
- **公共基座**：review-ops 注册与单工具/整组裁剪生效，其他预设行为不变；审核内嵌会话不另建模型配置、存储或 Agent 内核。
- **门禁及真实验收**：原稿记录开发基线 3069；实施前重新执行全量以确认最新数量，每批 typecheck/边界/相关行为回归通过。最后在真实 Agent 会话中从显式指派走到报告或可继续人工待办，附点击、落盘及失败证据。本文仅完成设计核对，不声明这些新增验收已通过。
