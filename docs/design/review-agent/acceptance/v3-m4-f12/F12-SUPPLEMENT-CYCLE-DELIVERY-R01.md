# M4 F12｜合并补件、回件与再审核交付 R01

- Owner：F12；统一协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 分支：`feat/v3-m4-f12-supplement-cycle`；Draft PR 指向 `main`，NO MERGE
- 边界：只做 A09/U03 的补件读模型与操作 UI，既有 `CaseAggregateV2`、`SupplementRequest`、CAS、阶段决定和 Main IPC 不改动。F11/F13/F18 不在本 PR 认领。

## 原有能力与本轮增量

已有 `respondSupplementV2`、`resolveSupplementV2`、T05 补件重入和批次恢复；A15 S3 已有两轮补件的真实 Main 执行记录。这些不再重写或标为缺失。

本轮新增：

1. `review-v3-f12-supplement-cycle.ts`：从唯一聚合计算多请求合并清单、逐条状态和补件后的可继续提示。相同补正要素只展示一次，但各请求的状态及历史始终独立；任何 `responded` / `insufficient` 都阻断恢复。
2. `ReviewV3F12SupplementCycle.tsx`：真实挂入 V2 案卷内的 T05 工作台；跨请求清单、要素/原因/期限、回复历史、当前可选文件、再次回复、人工核验/取消及明确的回流状态。动作沿用原 V2 命令，不直接写案卷；回执失败原样呈现。
3. 新文件选择只在请求存在 `documentVersionIdsAtRequest` 基线时称为“新增版本”。历史无快照请求依然允许人工关联现有材料，但必须明确不确定性。
4. 全部请求关闭后，只在唯一案卷阶段已真正恢复至 `reviewing`/`awaiting-review` 时展示再审核提示；不会仅凭前端补件状态解锁审批，也不会把核验满足当作新 Run 或最终批准。

## 定向验证与验收边界

- `node apps/electron/src/renderer/components/content-review/review-v3-f12-supplement-cycle.test.mjs`：4 条用例，验证跨请求去重、`responded` 阻断、材料版本基线、不确定旧请求与阶段回流门槛。
- `git diff --check`：通过。
- 本运行容器未预装 Bun 或仓库依赖，`bun run --filter='@profer/electron' typecheck` 无法执行；不能标记 TypeScript 或 GUI 验收通过。提交前后需由具备 Bun 依赖环境的本地 Owner 运行类型检查和 A09/U03 Electron 全链。

## 精确 CONTRACT_REQUEST（由共享 Main Owner / 对应 F Owner 接收）

### CR-F12-01｜新回复文件身份与可信提交方（Main / F04 / F18）

- 当前调用：`stage-workflow.ts` 的 `respondSupplementV2` 接收 Renderer 给的 `documentVersionIds` 和 `actor`。已有 CAS 回执，但未在该入口检查这些版本是否确属当前案卷的有效 `DocumentVersion`；本地 UI 的 `local-student` 仍是显示层固定身份。
- 要求：Main 在同一案卷命令事务中解析可信本地/离线回件操作者，检验每个关联文件的 `caseId` 所有权、有效版本与可用状态；拒绝其他案卷/不存在/不活跃的版本，以及未经授权的责任人。保持原 `SupplementRequest.responses`、requestId/CAS/Receipt 语义，必要时对现有 local UI 提供无 actor 的可信接口。
- 当前 F12 仅做候选展示，**不能替代 Main 的拒止**。对应历史 CR-T05-03。

### CR-F12-02｜请求创建时的版本快照（F11 / Main）

- 当前落点：`review-v3-t05-local-stage-plan.ts` 的 `applyT05LocalStageProposal` 创建阶段补件时未填写 `documentVersionIdsAtRequest`；另一条 `openWorkspaceSupplementV2` 已保存此快照。
- 要求：通过正式案卷事务按创建时的全部文档版本生成该字段，不另造版本库。仅对未来请求生效；旧历史保持“无法确认新增材料”的展示降级。

### CR-F12-03｜取消最后一个请求后的回流（F11 / Main）

- 当前落点：`stage-workflow.ts` 的 `resolveSupplementV2` 仅在 `outcome === 'satisfied'` 且已无其他未结请求时恢复 `reviewing` 并回流任务；若最后一条以有理由的 `cancelled` 结束，可能仍停留在 `awaiting-supplement`。
- 要求：将全案未结状态及来源阶段作为决定恢复的依据；取消不等于满足，不自动形成合规结果或虚假 Run；回流任务应有原阶段、轮次与可信 actor。当前 F12 UI 明确显示状态未恢复。

### CR-F12-04｜受影响检查的真实增量重审（F05/F09 / Main）

- 当前 F12 可指引用户到已有“开始审核”/“按模板规则检查”，但不拥有 `ReviewRunV2` writer 或依赖级失效计算。
- 要求：新回复/新材料进入当前输入清单后，明确标记旧 Run 与哪些检查过期，按依赖重审并生成新 Run；人工阶段须核对新的真实 Run，不能因为请求状态 `satisfied` 就沿用旧结论。

以上均为真实跨线接口缺口，不在本 PR 改写 Main/IPC/共享 DTO。A09/U03 的完整用户旅程、模糊图片→清晰图片、两阶段、公开反馈和冷重启等仍归集中实机验收，不能把本轮四条领域单测当作验收通过。
