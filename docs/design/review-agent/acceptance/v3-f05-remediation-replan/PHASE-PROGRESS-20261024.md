# Review V3｜F05 人工纠错—计划重建—必要复审｜阶段交付（2026-10-24）

## 0. 基线和责任边界

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
- 独立分支：`fix/v3-f05-remediation-replan-rerun`
- 固定派生基线：`integration/v3-r02-pr246-249-250-20261024@7773de6afc9c4a16934076b8b5bdb61a2e8bc9a2`（Draft PR #265）。
- 不向 #246/#249/#250、F02/F03/F04/F06/F07 直接提交，不合并到 R02/main，不修改 144 项业务模板。
- 不新增第二套 Case/Plan/Run/Decision 真值；本批的提案记录和旧 D2 只读历史都在唯一 `CaseAggregateV2` 的 CAS/Receipt 内。
- `AGENTS.md` 要求修改 README/AGENTS 前取得额外许可，本次未修改两者；以本专项报告记录增量。

## 1. 原来错在哪里

1. #265 单案分类组件虽可在 Plan 冻结前按版本原子改类，冻结后只显示“去计划升版”的提示；用户看不到可信的纠错申请、修订留痕与后续状态。
2. 本机 D2 技术计划一旦固定，既无明确撤回旧任务包的审批动作，也无面向用户的“改类后重新安装 D2”入口。直接解除写保护会让旧 RuleSpec、Subject 与旧 Run 被误用。
3. 已有 CanonicalPlan 正式升版另有独立发布者证明、Main Grant、移除 Check ACK。普通本地 reviewer 不能因为提出材料纠错就被授予校方发布权。
4. 初审产生的补件请求和阶段任务属于旧输入；如果只改类不清理当前工作流状态，新的 Run 可能被旧 `open` 请求继续阻断，或旧请求被误当作已满足。
5. AI 分类建议与用户纠错申请未衔接；计划冻结后也没有一个“只记录建议、不立即改写材料”的入口。

## 2. 本次最小修复：如何做、为什么这样做

| 环节 | 实施 | 权威/安全边界 |
|---|---|---|
| 提案持久化 | 新增 `ProposeNativeRemediationV3` 命令和 `remediationRecords`；记录旧/新角色、材料槽、精确 `documentVersionId`、理由、计划身份、时间和修订 | 只写建议，不改材料、不使旧 Run 失效；重复 requestId 通过原有事务回执幂等 |
| 原子执行 | 新增 `ApplyNativeRemediationV3` 命令；Main 再检查原件有效性、角色与槽位、模板约束、提案计划身份、案卷修订及正在运行的 Pi | 真正写入仍只走 `submitCommand` CAS；旧材料版本、跨修订与没有原始提案均拒绝 |
| 未冻结案卷 | 角色/槽位纠正与来源撤销同一事务，生成 `remediationGeneration` | 当前 Run hash 必然变化，旧观察确认/证据关联失效；原件 SHA/版本不改 |
| D2 已冻结 | 审核员必须明确确认原始 D2 fingerprint 和旧结果失效；Main 先验证当前 D2 任务包一致，随后将旧任务包存入 `d2RuntimePlanHistory`，移除当前 D2、RuleSpec 和 D2 Subjects，返回未绑定草稿 | **这是明确撤回—重新编译/安装**，不是偷偷“就地改计划”。重建前无 D2 计划，不允许沿用旧 Check/Run；不产生学校正式批准 |
| CanonicalPlan 已冻结 | 提案可记录，但本地执行坚决拒绝 | 必须使用已有 `upgradeCanonicalPlanV3` 的正式 Main 发布/权限/删除责任 ACK；本批没有合成发布来源，也未打通正式 Plan 与材料同时变化的可信事务 |
| 旧补件/待办 | 原始补件请求与回复保留；活跃请求改为 `cancelled`，未办旧任务改为 `cancelled`；旧待补阶段回草稿 | `cancelled` 明确不等于 `satisfied`。必要补件必须由新 Run 按新模板重新生成 |
| 统一工作台 | 新增 `ReviewV3RemediationPanel`，支持用户输入原因→提案→复核→执行；AI 分类建议可手动转交成提案 | 模型建议仍需人为确认且不自动改类；AI 发送摘要仍由用户主动触发，#261 出站门禁尚需集成验收 |

新增/修改的关键代码：

- `apps/electron/src/main/lib/review/review-v3-remediation.ts`：Main 原子提案与执行。
- `apps/electron/src/main/lib/review/review-ipc.ts`、`apps/electron/src/preload/index.ts`、`packages/shared/src/types/review.ts`：可信 IPC/Preload 合同。
- `packages/shared/src/types/review-v2-contracts.ts`：同案纠错记录和 D2 历史任务包。
- `apps/electron/src/renderer/components/content-review/ReviewV3RemediationPanel.tsx`、`ReviewV3LocalCandidateWorkbench.tsx`、`ReviewV3MaterialClassification.tsx`：同一工作台接线及建议转提案。

## 3. 反例与核验口径

执行：

```bash
bun test \
  apps/electron/src/main/lib/review/review-v3-remediation.test.ts \
  apps/electron/src/main/lib/review/native-case-material-slot.test.ts \
  apps/electron/src/main/lib/review/workspace-business-service-v2.test.ts \
  apps/electron/src/main/lib/review/plan-binding-v3.test.ts \
  apps/electron/src/main/lib/review/stage-workflow.test.ts \
  apps/electron/src/main/lib/review/review-v3-main-author-plan-ipc.test.ts \
  apps/electron/src/main/lib/review/review-v3-report-service.test.ts

NODE_OPTIONS=--max-old-space-size=6144 bun run --filter='@profer/electron' typecheck
git diff --check
```

F05 新 BDD 包括：

1. 提案先落盘，旧 material/Run hash 不变化；执行后旧 Run stale；原件原版本与回执留存。
2. D2 无 ACK、错误指纹拒绝；有精确 ACK 且 D2 自检通过后撤回旧任务包、保留历史、设置重建状态。
3. CanonicalPlan 仍冻结且无额外正式授权时绝不改类；提案不授予发布权。
4. 旧版本、过期 revision 和重复申请受 CAS/幂等约束，失败不产生半笔数据。
5. Pi 处于 queued/running 时禁止执行纠错；防止活跃模型边读边改。
6. 补件中改类取消旧运行关联的活跃补件及旧任务，但不会伪称 `satisfied`；完成后仍需重新初审。

本次记录只将 `bun test` 的直接执行结果、TypeScript 检查与源码检查算作验证；**没有进行真实 Electron GUI、真实模型、正式 CanonicalPlan 发布者签收和学校身份验收**。具体数字及提交 SHA 以最终本分支测试与 GitHub PR 记录为准。

## 4. 最小用户闭环

1. 从原件分类面板手动选一份材料，或先用用户主动触发的 AI 分类按钮得到建议。
2. 输入人工纠错理由并保存提案；刷新案卷后提案仍在。
3. 审核员确认执行：未冻结则原子改类；D2 冻结则必须确认撤回旧技术任务包；CanonicalPlan 冻结则保持等待正式可信升版。
4. D2 回到未绑定状态后，重新从可信 D4/B1 来源选择/安装计划；再启动新的 Pi Run。
5. 由已有人工处置和 T08/F16 产生新的当前报告；历史 Run/报告保持只读，不被本流程覆盖。

## 5. 尚未关闭和集成风险

1. **正式 CanonicalPlan 的材料变更+Plan 升版**仍需 C/Main 独立发布者提供完整的新 Plan，并在一个授权边界处理材料版本、Check 删除义务与重审；本次是 fail-closed 提案，不冒充正式闭环完成。
2. **D2 重新安装与完整 Pi 重跑**复用了既有入口，但当前缺少跨 UI 自动驾驶和 Electron LIVE 证据。本批没有虚构 B1/D4 发行方或强制后台自动审核。
3. **证据绑定/事项字段更正**继续复用现有 `correctObservationV2`、`setEvidenceLinkV2` 和 Case 页面动作；尚未实现全部在这个新面板内的细颗粒合并操作和安全自动复跑。后续应针对真正错绑的 Subject×SourceRef 增加专项实测。
4. 需要在统一 HEAD 联合复核 F03 的 `frozenPlan/plannedCheckBindings`、F04 的本地自动预分拣、F07 的冷启动确认、F02 的报告权限，以及 #261 模型外发门禁。此独立 PR 不直接承接它们的变动。
5. 最终验收仍需在同一 Electron HEAD 完成：初审→AI/人工指出错绑→纠错→重建→补件→新 Run→人工决定→T08 新快照→重启查看历史。**只过单测不能标记生产可用。**

交付状态建议：`CODED / PASS_SCOPED / PENDING_C0_PUBLISHED_PLAN_UPGRADE_AND_ELECTRON_LIVE`。保持独立 Draft，交由集成负责人裁定何时接线；不得直接并入 R02/main。
