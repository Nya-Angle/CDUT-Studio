# 09 · 审核专区开发文档：AI Agent 接入实现（C1–C3 已交付）

> 面向后续维护者。只写真实存在的代码路径与行为，不写计划。
> 设计依据：`docs/design/review-agent/08-agent-integration-design.md`（含宝宝修订）。
> 交付版本：electron 0.15.143（提交 8f0dd4c5 → e04405bb）。

## 0. 一句话架构

通用 Agent 会话（Pi runtime）通过 **in-process custom tools**（`review-ops` 能力组，14 个工具）同进程直调审核服务层；一切写操作的唯一授权来源是 **UI 创建的可信指派**（`ReviewAgentAssignment`）；决定类动作再叠加 **AI 代批开关**（默认关）在案卷命令事务内二次校验；所有命令回执与运行记录持久化操作者身份，案卷时间线据此渲染「人工 / AI Agent」徽标。

```
用户（审核专区）                    用户（Agent 会话）
   │ 「交给 Agent」按钮                  │ 自然语言指派/指令
   ▼                                   ▼
ASSIGNMENT_CREATE_V2 IPC ──► review-agent-assignment.ts（落盘 assignments.json）
                                        │ assignmentId
                                        ▼
                        Agent 工具调用（pi-review-ops-tools.ts）
                        review_list_templates / review_create_case / ...
                                        │ 同进程直调（无 IPC、无 MCP 进程）
                                        ▼
                        审核服务层（application-service / stage-workflow /
                        run-async-service / report-export-v2-service）
                                        │ submitCommand（enqueueCase 串行事务）
                                        ▼
                        case-store-v2（state.v2.json + receiptLog 落盘）
```

## 1. 代码地图（全部相对 `apps/electron/src/main/lib/`）

| 文件 | 职责 | 关键导出 |
|---|---|---|
| `review/review-agent-assignment.ts` | 可信指派：创建/校验/撤销/绑定/actor 构造 | `createAssignment` `checkAssignment` `revokeAssignment` `bindCaseToAssignment` `actorOfAssignment` |
| `review/run-async-service.ts` | 运行装配+异步运行管理（从 RUN_REVIEW_V2 handler 抽出） | `assembleAndRunReview` `startReviewRunAsync` `cancelAsyncRun` `getRunById` `findActiveRunForCase` |
| `review/report-export-v2-service.ts` | 报告导出（从 EXPORT_REPORT_V2 handler 抽出） | `exportCaseReport` |
| `review/case-timeline.ts` | 时间线构建（receiptLog+运行 → 徽标条目） | `buildCaseTimeline(aggregate, runs?, filterOperator?)` |
| `adapters/pi-review-ops-tools.ts` | 14 个 Agent 工具定义（TypeBox schema） | `buildReviewOpsTools` `isPathUnderRoots` |
| `adapters/pi-builtin-tools.ts` | 工具注入点（`review-ops` 组注册，disabledToolGroups 可裁剪） | — |
| `review/stage-workflow.ts` | 决定门控 `assertAgentDecisionAllowed`（事务校验内） | `recordStageDecision` `resolveSupplementV2` `respondSupplementV2` |
| `review/case-store-v2.ts` | `submitCommand(cmd, handler, source?)` 回执带 actor/assignmentId/sessionId；`createAggregate(caseId, caseV2, initialReceipt?)` | — |
| `review/run-store-v2.ts` | `markStaleRunsInterrupted()`：启动时把遗留 queued/running 标 failed+interrupted | — |
| `../settings-service.ts` | `reviewAgentAutoApproval`（严格布尔归一）+ grantedAt/grantedBy 留痕 | `getSettings` `updateSettings` |

IPC 通道（`packages/shared/src/types/review.ts`）：`ASSIGNMENT_CREATE_V2` / `ASSIGNMENT_REVOKE_V2` / `ASSIGNMENT_LIST_V2` / `CASE_TIMELINE_V2`；settings 侧 `SET_REVIEW_AGENT_AUTO_APPROVAL`（`apps/electron/src/types/settings.ts`）。

渲染层组件（`apps/electron/src/renderer/components/content-review/`）：`ReviewAssignmentCard.tsx`（指派卡+高级折叠区代批开关+风险 AlertDialog）、`CaseTimelinePanel.tsx`（时间线+操作者筛选）、`ObservationConfirmPanel.tsx`、`RunResultPanel.tsx`。

## 2. 身份模型（谁在操作）

```ts
// packages/shared/src/types/review-v2.ts
type ActorSource = 'local' | 'mock' | 'school' | 'agent'   // C1 新增 'agent'
interface Actor { actorId: string; actorSource: ActorSource; role: RoleId }
```

- Agent 操作者的 actorId = `agent-{完整sessionId}`（**完整会话 ID 落盘**，短码只用于显示）；role 来自指派的 `workRole`（`reviewer` | `student`），**不由模型声明**；`teacher`/`judge` 等决定角色不开放。
- 落盘点：
  - `CommandReceipt.actor` + `assignmentId` + `sessionId`（`case-store-v2.ts` submitCommand 第 4 参 `CommandSourceMeta`，与业务变更同事务写入）
  - `ReviewRunV2.initiatedBy`（`run-async-service.ts` queued 运行即落盘）
  - `BusinessDecision.actor`、补件 `responses[].actor`（既有字段，直接承载）
- 历史兼容：旧记录无 actor → 时间线显示「未记录」，**不冒认人工**。

## 3. 授权链（写操作如何被允许）

任何审核写工具的执行前置（`pi-review-ops-tools.ts` `requireAssignment`）：

1. **轮次来源**：`ctx.triggeredBy !== 'user'` 直接拒绝（automation/goal/delegation 轮次无写权限）。
2. **指派五重校验**（`checkAssignment`）：指派存在 → 会话归属（完整 sessionId 相等）→ 未撤销 → 动作在 `actions` 范围 → 案卷匹配（绑定案卷不一致即拒）。
3. **建案绑定**：建案型指派（templateId 锁定）在建案成功后 `bindCaseToAssignment`，一次指派只能建一个案。
4. **路径授权**：`register_material` 的 `sourcePath` 经 `isPathUnderRoots`（**realpath 后**判断归属，防 startsWith 前缀碰撞与符号链接逃逸），根 = 会话 `allowedRoots`（orchestrator 注入，与 collectAttachedDirectories 同源）。

### 决定类的第二道门（C2）

`stage-workflow.ts` `assertAgentDecisionAllowed`：

```ts
if (command.actor.actorSource !== 'agent') return
if (getSettings().reviewAgentAutoApproval === true) return
throw new CommandValidationError('AGENT_DECISION_DISABLED', 'AI 代批未开启：…')
```

- 读取发生在**命令事务校验内**（enqueueCase 队列中、业务变更前）——排队期间关闭开关也生效。
- 幂等重试只返回原回执，不会重复执行决定。
- 覆盖 `RecordStageDecision` 与 `ResolveSupplement`；`RespondSupplement` 是提交者侧动作，不受代批开关限制（但受指派+附件归属校验）。
- **人工终点保留**：开关只开放代批能力；模板阶段 `executorRole`（teacher 终审、judge 评分）的业务校验不受影响，Agent 的 reviewer/student 角色依然过不了这些门。

### 开关的安全约束

- `reviewAgentAutoApproval` 默认 `false`，读取时严格布尔归一（`=== true`）。
- 通用 `settings:update` 通道在 `ipc.ts` 里**剥离**该字段及其留痕字段；唯一写入口是 `SET_REVIEW_AGENT_AUTO_APPROVAL` handler（UI 风险确认后调用），Agent 工具不可达。
- 开启记录 `reviewAgentAutoApprovalGrantedAt/GrantedBy` 随开关一起写入。

## 4. 运行（长任务）模型

- `startReviewRunAsync(caseId, initiatedBy, source?)`：预分配 runId → 立即落盘 `running`（含 initiatedBy）→ 后台执行 → 返回 `{ caseId, runId, status:'queued', nextPollAfterMs }`。同案去重：`findActiveRunForCase` 命中即抛错。
- 查询：`review_get_run_status(caseId, runId)` 读持久运行文件（`getRunV2`），返回状态/覆盖/检查摘要/结论；`completed` 是技术完成，不等于业务批准。
- 取消三处同时生效：`cancelRunV2`（进程内注册表，运行图不再启动新节点）+ `AbortController`（穿进 `assembleV2Executors` → `client.complete` → `chatCompletion` 的 fetch signal；429 退避等待也响应取消）→ 取消语义在网关里与超时区分（「模型请求已取消」）。
- 重启恢复：`registerReviewIpc()` 首行调 `markStaleRunsInterrupted()`，把遗留 `queued/running` 标 `failed` + 诊断 `interrupted: 进程重启`（幂等；completed 不动）。
- 429 限流重试（×3 指数退避 8s/16s/24s）在 `review-model-gateway.ts`，取消可中断退避。

## 5. 工具门面（14 个）

注册表：`packages/shared/src/types/agent-preset.ts` `AGENT_PRESET_CAPABILITY_GROUPS` 的 `review-ops` 组；预设可整体禁用该组或按单工具禁用。

| 工具 | risk | 分期 | 备注 |
|---|---|---|---|
| review_list_templates / review_get_template | read | C1 | 模板/字段 schema/材料槽/阶段 |
| review_list_cases / review_get_case | read | C1 | 摘要不含材料全文与 assetPath |
| review_create_case | write | C1 | 需指派；模板锁定；成功即绑定 caseId |
| review_register_material | write | C1 | realpath 授权目录 + 槽位 |
| review_submit_case | write | C1 | 材料槽不足被业务校验拒 |
| review_start_run / review_get_run_status / review_cancel_run | write/read | C1 | 异步+轮询；completed ≠ 批准 |
| review_export_report | write | C1 | 落盘 `review-cases/{caseId}/reports/` |
| review_decide_stage / review_resolve_supplement | destructive | C2 | 指派含决定动作 + 代批开关 |
| review_respond_supplement | write | C2 | 提交者侧；附件必须属于本案 |

工具返回一律结构化 JSON 摘要（错误也在 JSON 里，`isError: true`），**不返回材料原文**——材料内容对 Agent 是数据不是指令（与审核执行器 R10 同源精神）。

## 6. 前端接线

- `V2CasePanel.tsx` 挂载顺序：RunResultPanel → ObservationConfirmPanel → ReviewAssignmentCard → CaseTimelinePanel（`runNonce` 驱动刷新；Agent 写后 applyResult→+1）。
- 指派卡：`交给 Agent` 按钮（有效指派存在时禁用）→ 创建 8 项基础动作的 reviewer 指派；列表行带撤销；「高级」折叠区内是代批开关（AlertDialog 风险确认）。
- 时间线：`CASE_TIMELINE_V2({ caseId, filterOperator? })`；徽标样式映射在 `CaseTimelinePanel.tsx`。
- **改 preload 必须跑 `bun run build:preload`**（历史上漏过一次导致新通道 undefined）。

## 7. 测试与验收记录（真实执行过）

- BDD 快验（bun run 临时脚本，PROFER_CONFIG_DIR 隔离）：指派 9 场景、门控+receipt.actor 4 场景、C2 开关矩阵 6 场景、恢复 5 场景、预设 4 场景、时间线 6 场景、路径 4 场景——全 PASS。
- 真实案卷 E2E（case-muuqn94s）：A 开关关→agent 决定 `AGENT_DECISION_DISABLED`；B 开关开→决定通过且 `decision.actor.actorSource==='agent'`；C 撤销指派→新决定被拒 `ASSIGNMENT_REVOKED`；D 还原（开关默认关、案卷 decided、验收产物零残留）。
- UI 真实点击（Xvfb :99 + xdotool）：指派创建（`asg-a7b118f2` 落盘+UI 双确认）、时间线渲染 21 条历史（旧记录如实「未记录」）。
- 全量门禁：3069 pass / 0 fail（预设内置数量 3→4 的断言已同步更新），typecheck 0。

## 8. 排版规范（对齐系统其他页面）

审核专区新面板曾密集使用 `text-xs`/`text-[10px]`，与系统其他页面（Agent 消息、设置页主体 `text-sm`/`text-[13px]`）不协调，已统一：

- 面板小标题：`text-[13px] font-semibold`
- 正文/列表行：`text-[13px]`（替代 text-xs）
- 徽标/辅助行：`text-xs`（替代 text-[10px]）
- 行距：列表 `space-y-1.5`+，行内 `py-2`+，区块间 `pt-3`

新增 UI 组件请沿用这组 token，不要再往下压字号。

## 9. 已知边界（别踩）

- 外部进程**不能**直写 `state.v2.json`（会绕过 enqueueCase 串行锁）；一切写走服务层。
- `RUN_REVIEW_V2` IPC 仍是同步 await 全图（UI 按钮路径）；Agent 工具走异步 `startReviewRunAsync`。两条路径共用同一装配服务。
- settings 读取有内存缓存；`updateSettings` 是唯一安全写入口（代批字段已在通用通道剥离）。
- 指派存储是单文件 JSON（`review-agent-assignments.json`），按「显式指派、低频写」设计；不做跨机同步。
- **GNOME Wayland 下原生对话框会静默失败**（`zxdg_exporter_v2: exported surface had an invalid role`，无异常抛出、UI 无反应）。dev 启动 Electron 必须设 `ELECTRON_OZONE_PLATFORM_HINT=x11`（Xwayland 下 dialog 正常）。该结论同样适用于任何调用 `dialog.showOpenDialog` 的入口。
- V2 案卷的「登记材料」按钮在模板有材料槽时强制先选槽位（前端守卫 toast 提示），防止材料落入未分配槽导致覆盖账本 unread。
