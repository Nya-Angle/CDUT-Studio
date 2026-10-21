# Review V3 M4｜F13 申诉、撤回与独立复审交付及 Main 接线请求

- Owner：F13；协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 功能验收目标：A10 / U05；本分支不合并 main、不代替本地 A15。
- 本交付状态：`CODED + PASS_SCOPED`；申诉正式提交/复审/撤回 Main 端口仍为 `CONTRACT_BLOCKED`，**不是 U05 PASS**。

## 一、原有能力和本轮实际增量

已复用 `review-v3-t05-appeal-actions.ts` 的最终决定检验、申诉材料版本校验、复核人独立性、更正追加决定与原申请人撤回逻辑；没有另造 Case/Run/决定的持久化体系。

本轮新增：

1. `review-v3-f13-appeal-flow.ts`：纯领域提案。提交申诉时强制绑定案卷真实提交人、原有效 final 决定和 Main 指派的不同复审人；一次性规划 Appeal + 独立 WorkflowTask，进入 `awaiting-review`。复核与撤回必须命中该开放任务，维持原判不伪造第二个业务决定，更正只追加引用真实 Run 的决定，撤回只取消复审任务且保留历史。新证据先经新 Run 核验，禁止凭未核验材料直接给出维持/更正结论。
2. `review-v3-f13-appeal-history.ts` + `ReviewV3F13AppealHistory.tsx`：只读历史投影已进入现有 T05 申诉区，展示原决定、被更正状态、证据文件版本、独立复审任务及关联更正决定。`upheld/overturned` 等旧英文状态若缺明确 `resolution` 或更正关联，显示“待人工核对”，不能猜测。
3. 定向测试覆盖合法申诉、原决定不变、身份不匹配、同人复核、伪造来源、待处理任务、新证据、维持、更正、撤回、重复处理及历史歧义。

已有界面的 `submitAppeal`、`reviewAppeal`、`withdrawAppeal` 回调仍因 Main 不提供而禁用并显示真实提示；这一限制属于可信写入边界，不可通过在 Renderer 构造 `Actor` 绕开。旧 `RESOLVE_APPEAL_V2` 被绑定为本地 reviewer，不能代表合法的独立 teacher 复审，且旧实现不创建专门的独立复审任务，不应直接拿来宣布 F13 闭环。

## 二、CONTRACT_REQUEST CR-F13-01：可信申诉全往返

**责任边界**：Local Main Owner 负责 IPC/Preload/共享 DTO/`submitCommand` 与正式身份。F13 纯领域提案函数不进行持久化。

建议提供下列三个 Main 命令（名称可按既有 API 命名规约微调，但语义不可弱化）：

```ts
submitTrustedAppeal({
  caseId, expectedRevision, requestId,
  againstDecisionId, statement, newEvidenceDocumentVersionIds,
})
reviewTrustedAppeal({
  caseId, expectedRevision, requestId,
  appealId, resolution: 'maintain-original' | 'amend-original',
  reason, amendedResult?,
})
withdrawTrustedAppeal({ caseId, expectedRevision, requestId, appealId })
```

- **Actor 来源**：Main 绑定真实会话身份，提交/撤回与 `caseV2.submitter` 的 `actorId+actorSource` 同一；旧案卷缺提交人归属时先进入身份补录/核对，不推断同一个 `local-student`。校方 teacher 未授权时不得把本地角色包装为学校身份。
- **任务指派**：Main 选择一个与原决定人不同的具名审核员/复核人。调用 `planF13AppealSubmission` 生成的 Appeal、WorkflowTask 和阶段变更必须在唯一 CaseAggregate 的一次 CAS 事务中写入；任务 `stageId='appeal-review'`，不得与常规 T05 终审任务混淆。当前共享 WorkflowTask 仅保存 `assigneeActorId/assigneeRole`，未保存 `actorSource`，Main 必须从可信会话/指派记录核对来源，不能只相信 Renderer 同名字符串。
- **复审写入**：Main 核验当前未关闭 Appeal、唯一开放复审任务、独立复核人、模板/政策有效性和实际当前 Run（尤其申诉含新证据及更正决定）。调用 `planF13AppealReview`，在同一事务替换 Appeal、关闭复审任务、追加 `amendment`（如有）及更新 case.stage。`maintain-original` 不追加伪造的 BusinessDecision；`amend-original` 必须由 Main 提供 `verifiedRunId`，不能信任 Renderer 自报。
- **撤回写入**：调用 `planF13AppealWithdrawal`；只允许原申诉人撤回尚未结案的申诉，复审任务取消而不删除。不能借用旧 `RESOLVE_APPEAL_V2` 的 reviewer 路径代替。
- **幂等和恢复**：沿用 `requestId`、`expectedRevision`、Receipt/CAS；重复提交不得生成第二个申诉或任务，冷重启需可读取同一历史。错误须返回既有 `ReviewCommandResult`，不返回成功的空壳。
- **界面接线**：接入现有 `ReviewV3T05HumanWorkflow` 的三个可选回调，复审角色/指派资格以 Main 投影显示；不能用 Renderer 自选 `teacher` 充当真实授权。

**最小输入输出合同**：提交成功返回 `{ok:true, aggregate, entity: Appeal}`，复审/撤回亦返回同型既有 `ReviewCommandResult`；失败沿用既有错误码（身份/转移/冲突/依赖不可用）。Main 可以额外返回可信申诉能力投影，但不得把能力投影当写入授权。

**待协调的审计字段**：现有 `Appeal` 没有 `reviewedBy/reviewedAt/reviewReason/withdrawnAt`；维持原判时甚至没有关联的新 BusinessDecision。短期必须把操作者、结论理由、时间写入持久命令 Receipt（本轮提案提供 `summary`），正式 U05 对学生公开复审理由则需要由 Main/共享合同 Owner 决定最小追加式字段或可信只读回执投影。F13 不私自改共享 DTO。

## 三、CONTRACT_REQUEST CR-F13-02：申请撤回与退回前级的区分

- **申请撤回**是提交者终止本次申请；**撤回申诉**只关闭异议，原业务决定仍有效；**退回前级**属于 F11 的阶段任务和新轮次；**退回补件**属于 F11/F12，不应共享一个无类型的 `withdraw/return` 事件。
- `recordStageDecision` 旧的 `withdraw` 基于 reviewer 操作，与设计 §5.2 的提交者撤回不等价。Main Owner 需要确定可信提交者撤回的事务入口及案卷归档/重新发起规则；F13 不抢写 `CaseAggregateV2` writer，也不通过 reviewer 权限冒充申请者。
- F11 已拥有退回前级的阶段提案，F13 不重复实现。未来在 U04/U05 的联测中核对旧决定/任务记录仍可追溯。

## 四、需由集成阶段签收的 A10/U05

1. 使用真实工作台生成 final 决定，提交人用具名身份提出申诉并选择实际新证据，主进程在一次事务写 Appeal + 独立任务。
2. 确认原决定人不能受理自己的申诉；不具备学校授权时只能显示本地模拟身份，不能盖学校终审章。
3. 复审人读取原依据、原 Run、旧意见、新证据与当前 Run；维持、改判分别写入正确历史。
4. 原申请人撤回申诉；确认被更正决定的状态、回复文案、任务关闭与冷重启后回读一致。
5. 新证据替换版本、旧英文历史状态、相同 requestId 重放、revision 冲突、无权限与异常恢复分别验收。

**当前真实验证**：F13 新增两份 Bun 定向测试共 9/9 PASS；`tsconfig.f13-scoped.json` 的指定文件类型检查 PASS。全 Electron `typecheck` 在当前容器默认 V8 ~2GB 堆上 OOM，故不声称全仓类型验收或真实 GUI 验收。
