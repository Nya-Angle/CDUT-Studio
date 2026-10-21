# Review V3｜T05 续作历史、实际功能与 Local-L 合同交接 R01

## 基线与已有进度

本轮：T05 独立领域 Owner；起点 main@9840a64f25a3c09a13b76dcd90045a96dd7d529b；工作分支 feat/v3-t05-stage-supplement-closure-r01。

原 PR #173 九次提交最终 41c3f2fa9eec000d797bde61baff7946d40756b4，已合入 main，含 ReviewV3T05HumanWorkflow、ReviewV3T05RunDecision、T05 appeal pure domain+tests。Local-L L3 标 T05 WIRED，但 A15 完整 NOT_RUN。原 PR 的 CR-T05-01 申诉可信命令、CR-T05-02 合法本地业务阶段、CR-T05-03 提交人身份绑定尚未因源码合并自动解决。

当前可核对的真实断点：
- 旧 T05 界面只显示 reviewer 阶段；模板 final=teacher 的终审没有用户操作入口。
- 旧 stage-workflow.ts 的 recordStageDecision 在决定中使用构造的 run@rev... 字符串，并非已核验的 ReviewRun ID；不能据此宣称产品 A15 通过。
- 原 UI 列出阶段决定供申诉，而领域服务只接受有效 final 决定。
- CanonicalPlan 与合法的 local-business 运行不是必然互斥；必须由 Main 判定业务模式，不能看到 Plan 就禁止一切本地业务决定，更不能删掉 D2 的禁止校方冒充限制。

## 本轮已交付的 T05 增量

1. apps/electron/src/main/lib/review/review-v3-t05-local-stage-plan.ts：纯领域决策 Proposal + applyT05LocalStageProposal（纯粹追加式状态变换）。由可信 Main 给定 Actor、已发布 TemplateVersion、开放 WorkflowTask、local-business 模式、核验过的真实 Run 及生成的 ID/时间；初审追加阶段决定并打开终审任务，终审追加 final 决定；缺计划书允许先只生成补件（不伪造 Run 或业务决定）；所有返回的 tasks/decisions/supplements 都由 Main 在唯一 CaseAggregate 事务一次性持久化。补件首次不足、第二次满足须等全部请求处理。
2. 同路径 review-v3-t05-local-stage-plan.test.ts：定向单元用例。
3. apps/electron/src/renderer/components/content-review/ReviewV3T05HumanWorkflow.tsx：接受可信 Main stageCapability 与 recordTrustedStageDecision 回调，支持经 Main 确认的 reviewer/teacher 任务；未具可信 Run 时不能凭旧 Run 作出阶段结论；申诉下拉框只显示有效 final 决定。保留既有 reviewer UI 通路作为兼容，不能当作 A15 已验收。

## CONTRACT_REQUEST CR-T05-04：A15 合法本地业务阶段与真实 Run 关联

**Main 只读阶段能力投影**：
- T05TrustedStageCapability（定义在 T05 组件文件），字段 mode='local-business'、actorLabel、actorRole ('reviewer' | 'teacher')、eligibleTaskIds、hasCurrentRun。
- 必须由 Main 从当前登录/本地模拟业务身份、实际任务指派和有效审核运行生成。能力投影只是展示，不能代替写入授权。

**Main 写入**：实现 recordTrustedStageDecision(T05TrustedStageCommand) 传给 T05 组件（仍复用现有 V2CasePanel 挂载点）。
输入：caseId、templateId、version、expectedRevision、taskId、action、reason、supplementRequiredElements?、supplementReason?。
Main 不接受 Renderer 伪造的 Actor、role、isRunCurrent 或 Run ID，必须在共享 CaseAggregateV2/ReviewRun/TemplateVersion 真实事务中重核身份、权限、源版本、expectedRevision，并使用 planT05LocalStageAction 生成 Proposal，随后由 Main 提供唯一 ID/时间交给 applyT05LocalStageProposal 生成新的 tasks/decisions/supplements/caseStage，最后复用 submitCommand 在唯一 CaseAggregate 事务中原子写入；禁止再自己重写一套阶段状态机。提供给纯领域函数的 verifiedRun.decisionReadiness 必须由 Main 对当前必需检查、人工处置和可适用例外计算：只有 ready 才允许 stage-pass；blocked 可以发出有依据的 final-reject 或要求补件，不能把 Run 完成误当成业务检查全部通过（A15 21 人上限反例）。

- stage-pass：非最终初审只生成下一阶段 teacher 任务；终审才 final；真实 basedOnRunId，不写 run@rev。
- return-for-supplement：尚未得到完整原件时可以直接创建补件请求，不伪造 Run/Decision。第一次不足、第二次有真实新 DocumentVersion，再核验完成且关联新 Run；多请求全部结束才能恢复原阶段。
- return-to-previous-stage：按模板设定回退新任务轮次，旧记录保留。
- final-reject：依据实际有效 Run，具名本地角色决定，不会自动变待补件。
- 技术预审/学校权限保持原限制：d2RuntimePlan 不可走业务决定；具有 CanonicalPlan 的案卷必须由 Main 确认 local-business 才能办理本地阶段；从不冒充学校批准。
- 本地模拟 reviewer/teacher 的切换若需要，建立可信 Main 身份会话与可审计角色来源；禁止 Renderer 修改 actor.role 充当教师。
- 旧 stage-workflow.ts 的人造 run@rev 决定不能作为 A15 验收证据。

**另两个旧请求仍需 L 承担**：
CR-T05-01：申诉 submit/review/withdraw 的可信 Main 命令、独立复核及原子追加。CR-T05-03：补件提交方可信身份及原件版本的实际关联。

## 实验室申请 A15 验收配合

已有 PR #178 五份真实 DOCX + LAB-SIM@1 虚构政策可由 L 使用；T01/T04 Owner 决定 RuleSpec/Plan 的确切语义，L 不应从任意政策 requirement 文本自行猜规则。18 人且资料完整：初审→终审→本地决定；21 人：人数上限确定不符；缺计划：先补件，首次材料不清楚仍不足，第二次核验后新 Run；完整过程由 work/e2e/v3-e2e.mjs 的真实 Electron 验收签收，而非仅单测。

本轮 T05 不修改共享 Main/IPC/Preload/Case writer、共享 DTO 或 T01/T02/T04/T06/T08 其他 Owner 文件。L 只需补上明确端口与唯一主线事务，不重造本线领域逻辑；尚未接线的功能必须标 WAITING_FOR_LOCAL_L。
