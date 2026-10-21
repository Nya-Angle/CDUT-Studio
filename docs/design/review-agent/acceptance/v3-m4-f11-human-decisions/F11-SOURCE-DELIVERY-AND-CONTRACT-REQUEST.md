# V3 M4 F11｜人工决定源码交付与 Main 合同请求

> 本文件是 F11 Owner 的独立交付说明，不修改 M4 统一协调登记。**CODED / PASS_SCOPED 不代表 A09 或 U04 已签收。**

## 固定约束

- ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`（PR #187）
- 固定祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- Owner：F11；分支：`feat/v3-m4-f11-human-decisions`；PR 状态：Draft / NO MERGE
- 不接管 F12 补件持久化、F13 申诉复审、F07/F09 Plan/Run 有效性、Main IPC/CAS writer 与本地 A15 S4。

## 已有能力核验（本轮不重复开发）

1. `review-v3-t05-local-stage-plan.ts` 已为初审、终审、退回前级、最终驳回、无 Run 补件建立纯领域 proposal，复用任务、决定和补件记录。
2. `review-v3-t05-main-service.ts` 已提供可信阶段资格、当前 Run 判定和 CAS 事务写入；本地 reviewer/teacher 均明确不是学校授权身份。
3. A15 S3 的 L3 台账记载两阶段 Run 绑定、角色拒止与冷重启后的决定保持。这是既有 SHA 的局部实证，不是本交付新增的 UAT。
4. `ReviewV3T05RunDecision.tsx`、三栏 `CenterPanel` 已能执行检查处置和事项认定，不能把相同动作另建一套写入器。

## F11 本轮源码增量

| 改动 | 用户可观察行为 | 可信边界 |
|---|---|---|
| `ReviewV3T05HumanWorkflow.tsx` | 阶段动作显示 Main 已计算的可执行资格、实际阻断原因；无 Run 可选合法补件，非合规 Run 不误提示可通过 | 不再在能力缺失时走旧 `RecordStageDecisionV2` 回退，实际提交始终走 `recordT05StageDecision`，Main 重新验证 |
| 同上 | 完成运行后可单击“重新核对阶段资格”，无需靠案卷 revision 变化刷新按钮；角色/案卷切换的迟到读取不覆盖新状态 | 按 caseId、revision、role 和请求序号隔离只读结果，不产生角色或业务决定 |
| 同上 | 同一面板明确分开“事项认定”和“案卷阶段决定”，显示现存事项认定的结果、理由、actor 来源和绑定 Run | 读取已有 `aggregate.adjudications`，按 supersedes 链投影，不改写历史 |
| `review-v3-t05-stage-actions.ts` 与 `.test.ts` | 提交按钮仅在当前任务指派、模式、补件状态及 Main 按动作资格全部成立时启用 | 纯展示门禁；不存在第二套业务状态机或新的 Case/Run 真值 |
| Electron package metadata | 按根 `AGENTS.md` 递增 patch 版本 | 只是版本元数据，后续多分支集成需统一处理 |

## 合同请求（不在 F11 私改共享 Main/IPC）

### CR-F11-01｜Main/Preload 动作资格合同一致化（F11 ↔ 本地 Main Owner）

- **实际现状：** Main 的 `readT05StageCapability` 返回 `mode / actorRole / eligibleTaskIds / hasCurrentRun / allowedActions / blockers`；`preload/index.ts` 对同一 RPC 的 TypeScript 声明只含前四项，且将 `mode` 窄化为 `local-business`。`V2CasePanel.tsx` 的本地 state 重复了窄化合同。
- **请求：** 在 Main Owner 单一共享入口统一声明上述完整只读返回类型，至少包含 `mode: 'local-business' | 'technical-pre-review'`、四种 `allowedActions`、可读 `blockers`，V2CasePanel 按该类型透传。不要在 Renderer 计算业务动作资格，也不要让返回值充当写入授权。
- **兼容：** F11 自有组件暂用可选字段接收当前实际 RPC 值；若旧 Main 缺少 `allowedActions` 则展示阻断、不回退旧写入命令。
- **优先级：** P1，Main/Preload 源码无 F11 分支修改。

### CR-F11-02｜零 Check / 零计划的 stage-pass 判定（F07/F09 ↔ 本地 Main Owner）

- **旧调用：** `t05ActionEligibility(aggregate, run)` 在 `run.inputManifest.effectiveRuleIds` 非空时逐项覆盖核对；当该数组为空且 `run.checks` 为空时，没有显式的“零有效检查”阻断。`recordT05StageDecision` 以该投影的 `readiness` 决定是否准许 `stage-pass`。
- **请求：** 由统一 Plan/Run Owner 将 `CanonicalPlan` 或发布模板中**实际必核目标集合**、Run 完成范围与人工检查的真实完成状态映射到可信资格。零检查不能以“没有发现问题”为由通过；若是明确发布的纯人工模板，必须有具名人工检查/授权确认记录，并能区分“不适用”和“未执行”。
- **拒止语义：** 对零覆盖、缺检查、执行失败、输入过期均拒绝 `stage-pass`，但可依真实动作规则继续发起补件或有依据的拒绝/退回。不能凭一个可选数组的空值推断“全部合规”。
- **建议定向场景：** `effectiveRuleIds=[] / checks=[]`、计划有 2 项而 Run 只 1 项、无规则但有已完成的正式人工核定、21 人超限有/无具名例外、补件回复后旧 Run、重启恢复。
- **优先级：** P0，对接 F07/F09；F11 不抢改 Main 的资格算法。

### CR-F11-03｜Plan 安装与本地业务确认持久化（F02/F07/F09 ↔ 本地 Main Owner）

- **实际现状：** `review-v3-main-template-run.ts` 编译并执行 T04 计划，但编译计划是否进入 CaseAggregate 的唯一权威事务需要集成确认。`review-v3-t05-main-service.ts` 的 `localBusinessConfirmations` 是进程内 `Map`，在有 `canonicalPlan` 时它又是 `local-business` 的必需依据。
- **请求：** 同一 Main CAS/Receipt 边界中保留可冷重启复核的发布确认（确认主体/理由/时间/模板版本/planFingerprint）；锁定的 Plan 身份、Run 身份、业务资格一致。移除对进程内 Map 作为唯一持久依据的依赖；不得把拥有 CanonicalPlan 等同于校方/本地审批授权。
- **最小验收：** 用户发布模板、装计划、真实 Run、初审、冷重启、终审；重启后确认仍有效，模板/计划指纹变化后确认失效，D2 技术案卷始终拒绝业务决定。
- **优先级：** P0，属于共享 Main 写入而非 F11 UI 所有权。

### CR-F11-04｜按任务的阶段动作原因（F11 ↔ 本地 Main Owner）

- 当前资格对动作作案卷级判断，不检查选中任务是否配置 `returnToStageId` 等；Main 正式写入时会检查并拒绝。
- 如后续希望在 UI 提前禁用此类动作，建议为每个 `eligibleTaskId` 返回 Main 派生的动作集合及原因，不能在 F11 组件里复制模板状态机。
- **优先级：** P2，不阻碍本批交付。

## 验证与剩余边界

- 定向纯函数测试：`review-v3-t05-stage-actions.test.ts` 覆盖已指派、缺投影、技术预审、角色不符、补件阻断、无 Run、非合规与动作禁用；按仓库 Bun 版本执行。
- 环境无 Bun 和依赖安装：F11 Owner 本地仅通过 Node 24 的 TS stripping 对同一生产 helper 运行五条定向断言，**未运行 `bun run typecheck` 或 Bun 测试**。必须由 PR CI / 集成环境复核，不能将此说明写成类型检查通过。
- A09/U04 真实 UI → Main → CAS → 冷重启的全程签收仍归后续集成，不应以 F11 UI 的按钮变化代替。
- 根 `AGENTS.md` 要求更新 README 和自身，且要求**改前取得用户同意**；本批未擅改该两文件，待统一集成与用户批准后同步。
