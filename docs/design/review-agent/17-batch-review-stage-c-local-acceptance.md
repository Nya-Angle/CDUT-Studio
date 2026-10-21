# 批量审核 C 阶段：自动化策略、完整闭环与验收（v1）

> 本文随功能分支 `feat/batch-review-triage-v1` 提交供本地验收；正式设计约束见主分支 `16-batch-review-automation-and-issue-clustering-spec.md`。  
> 用户验收前不合并；跨案审核仍属于未来扩展，不在本轮。

## 1. 本轮真实实现

- **默认辅助**：批次未明确启用自动化时，运行检查只产生建议，不会自动产生业务决定。
- **批次授权**：支持 `assist`、`auto-return`、`auto-approve`，本地审核员需逐批勾选确认。策略写入批次状态，带模板版本、授权时间与修订号；变更/撤销后旧授权立即失效。
- **自动退回补件**：只对已完成有效检查、规则来源为已发布且人工确认的政策、全部问题都属于可补正且有有效证据的案卷，创建正式 `return` 决定及补件请求；补件材料要求以**政策规则 requirement** 为准，不把模型随意生成的建议当强制要求。
- **自动通过**：除上述条件外，还需全局 `reviewAgentAutoApproval` 开关为真、模板 `autoPassPolicy.enabled` 显式开启、单一非校方归属自动审核/定稿阶段、无需评分/名额/逐事项人工认定、所有有效检查符合、所有证明/事实/业务就绪检查通过。未知、冲突、未阅读、未确认或来源造假的情况均不通过。
- **同一个 V2 事务**：自动审批使用原 `decideWorkspaceCaseV2`，在单案串行事务内部重新检查策略、输入哈希、当前状态与准入条件；留存 `actorSource='system'`、批次修订号、案卷决定和幂等回执。不是校方凭证，也不向校方系统推送。
- **批次执行**：运行完 `queued` 队列后，如果策略启用，则自动尝试对每案分流与写事务。也可以在批次页对已完成运行的案卷单独点击“执行自动处理”。阻断/失败保留给人工，单案失败不拖累整批。
- **补件回流**：回复补件不等于材料已核验；审核员将全部有效补件请求判为满足后，案卷重回审核状态，批次自动入队，下一次批次执行重新跑审核。旧输入哈希与旧运行不可被用于新批准。
- **完结及冻结**：按钮“核验并定稿”仅在所有案卷都完成检查且有真实最终业务决定、没有开放补件时才可定稿；快照保留规则、策略和决定依据。
- **人工处理**：继续保留 B 阶段按问题组集中处理、排除案卷、预览确认、逐案事务与完整回执；自动处理不能取代人工必审业务。

## 2. 开发侧验收

在当前共享验收工作区，公开副本远端名为 `mine`；若是从公开副本新克隆，默认远端一般是 `origin`，以下命令中的远端名要换成实际指向公开副本的 remote。

```bash
git fetch mine
git switch --track mine/feat/batch-review-triage-v1 # 若本地尚无该分支
# 若本地分支已存在，则使用：git switch feat/batch-review-triage-v1
git pull --ff-only mine feat/batch-review-triage-v1
bun install --frozen-lockfile
bun test --isolate --timeout 30000 \
  packages/shared/src/review/batch-review-triage.test.ts \
  apps/electron/src/main/lib/review/batch-store.test.ts \
  apps/electron/src/main/lib/review/batch-group-action-service.test.ts \
  apps/electron/src/main/lib/review/batch-automation-service.test.ts \
  apps/electron/src/main/lib/review/stage-workflow.test.ts \
  apps/electron/src/main/lib/review/workspace-business-service-v2.test.ts \
  apps/electron/src/main/lib/review/case-store-v2.test.ts \
  apps/electron/src/main/lib/review/template-store.test.ts
bun run typecheck
bun run check:boundaries
bun run electron:build
```

请另查看分支对应的 GitHub Actions **PR CI**（若已建立 PR）：包括全 workspace typecheck、包边界、UI 皮肤契约、主进程/预加载/renderer 构建和全库 Bun 测试。专项测试成功不能替代应用构建和 UI 验收。

## 3. 本地 UI 场景（建议使用合成材料，不碰真实敏感申请）

先按 [B 阶段的离线桌面验收入口](16-batch-review-stage-b-local-acceptance.md#离线桌面验收入口) 使用内置演示账户登录，进入 **CDUT 专区 → 材料审核 → 批次管理**。本地 B+C 验收无需真实校方 CAS 认证或生产 SchoolPort。2026-10-11 的实际桌面补验记录见 [离线 UI 补验报告](21-batch-review-offline-ui-acceptance.md)。

| 场景 | 期望 |
| --- | --- |
| 新建批次未授权 | 仅检查与分流建议；无正式自动审批记录 |
| 开启 auto-return 并勾选确认 | 只有可明确补正且证据/规则有效的案卷正式退回；符合的案卷不自动通过 |
| 开启 auto-approve，模板未启用 autoPassPolicy | 配置拒绝，不能绕过模板授权 |
| 模板支持 + 全局 AI 代批已开启 + 所有检查符合 | 逐案正式通过；案卷决定和系统来源审计可见 |
| 原检查引用的材料版本不存在 | 阻断自动决定，并将原因留在批次回执 |
| 材料发生变化或补件已回复未核验 | 不沿用旧运行；不自动通过 |
| 关闭全局开关或把批次改回 assist | 尚未执行的自动审批立即停止 |
| 补件要求已满足且人工确认 | 自动重新入队；新审核运行完成之前不产生新批准 |
| 有评分、配额、多阶段、教师/评委或校方审批要求 | 不做自动最终决定，交由正常工作流 |
| 全部有正式决定、无开放补件 | 可以定稿；否则明确拒绝 |
| 重复执行同一批次自动处理 | 不重复写业务决定或补件 |
| 人工按组批量处理 | B 阶段的逐案排除、冲突、审计和幂等继续有效 |

## 4. 界限与交付说明

- UI 中“可通过候选”是**建议**；“已自动通过（业务已写入）”只有当有正式事务回执时才显示。
- 本机 `system` 来源不代表学校的远端身份认证。真实部署前仍需学校角色、业务负责人授权与外部 `SchoolPort` 接入。
- 模板带不可评估的 `autoPassPolicy.conditions` 时自动通过将保守阻断，不猜测条件真值。当前不支持将模型置信度作为批准依据。
- B+C 的测试均使用合成数据；审批上线前仍须按各模板和校本业务规定做独立验收，尤其涉及法定或校方必须人工签署的事项。
