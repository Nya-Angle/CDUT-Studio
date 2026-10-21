# Review V3｜T04 R01 领域实现与联合接线交付

**Owner**: T04，分支 `feat/v3-core-t04-published-plan-r01`，Draft PR #182；依据架构裁决 PR #180。
**状态**：领域源码已提交；Main/IPC/真实 Run 尚未接通，A15 S2 仍需实机。
**基线**：启动时 main `5643959a4219fe2bcc6ca8c315a05fb3c4fde86d`。本分支不可直接覆盖后续 L 的 main。

## 一、已交付的生产代码

- `review-v3-t04-published-plan.ts` 提供 `compilePublishedTemplateReviewPlan(input)`，只读编译：
  - 必须输入 **published** 的原始 `TemplateVersion`、完整的 `effectiveRules: RuleSpec[]`、T01/负责人正式确认且随发布版本不可变的 `constraints`，以及 Main 验证过的 `targets`；
  - 输出现有 C0 `CanonicalPlan`（`schemaVersion=review-c0/1`）、逐一对应的 `PlanBinding + RuleSpec + T04Operation`、`checks:T04PlanCheck[]`、`bindingLedgerHash`；
  - 计划指纹涵盖模板全文快照、规则/约束/算子、目标确认值、材料版本/条件及评审阶段。需在每个变化后重新生成新 Plan/Run，不改历史；
  - 每个原有 RuleSpec 均生成绑定：未编译/语义/人工检查保留 `awaiting-confirmation`，不会因为没有算子就从清单消失；
  - 每个明确 required 的材料槽自动生成材料数量检查；明确定义的零份 `awaiting-supplement`，资料状态未确认 `awaiting-confirmation`，有真实已登记版本且达到门槛才 `compliant`。
- `review-v3-t04-rules-scoring.ts` 复用已存在的 `value-limit`，增加 `material-min-count`（不新增规则引擎），扩展 `T04Status` 为含 `awaiting-supplement`，与现有 `CheckStatus` 对齐。
- `review-v3-t04-published-plan.test.ts` 实际构造了泛用组织模板，检测 A15 18/21/未知/缺件、已发布状态、未知条件不等于通过、来源版本/规则修改改变指纹及材料决策阶段。

**不是**：新的规则库、第二套 PlanStore、真实 Run writer、可信 Actor 认证，也不是自动从自然语言推断政策。

## 二、T01 Owner 的唯一接口请求（CR-T04-01）

**当前事实**：T01 `createT01Scenario('laboratory')` 的 `peopleCount` 上限在 `FieldSpec.max=20`，对应 `section-eligibility-count` 的 `TemplateCriterionSpec.execution='manual'`，缺真正的确定性约束。不能使用 T04 静默改它的执行类型或硬编码实验室名称。

T01 请在自己的分支完成：

1. 当模板负责人**明确确认“某数字字段不超过 N”**，发布前将该 criterion 的 execution 合法设为 `deterministic`，并保存一个**不可变的 typed clause ledger**，至少含：
   `{templateId, templateVersion:number, ruleId, policyVersionId, confirmedBy, confirmedAt, constraint:{kind:'field-maximum', fieldKey, maximum:string, unit?:string}}`。
2. 该 ledger 与 `TemplateVersion` 的**同一发布快照**关联；后续不得任意后加字段，将确认变更作为新的发布版本。解析自然语言只产生编辑建议，用户确认和发布才赋予约束的领域含义。
3. `FieldSpec.max` **仍只是表单约束**。当其值与确定性条款上限不同或模型尚未确认条款时，必须让负责人修订，而非取某一个偷偷通过。
4. T01 可在独立模块实现领域作者/不可变 sidecar；共享模板 DTO 的变更必须由本地 L 统一签入 main。

**使用代码合同**：T01 提供 `T04PublishedConstraint[]` 和真实 `RuleSpec[]`；其中 `RuleSpec` 可以复用 `resolveEffectiveRules(aggregate, template)` 产生的模板分项规则，但每条规则必须保持 policyVersionId 和 execution/confirmation 的一致性。不允许用 `owner-statement` 冒充学校正式政策。

**重要**：当前 T04 编译器拒绝为 `manual/unconfirmed` rule 附上已确认 typed constraint，正是用来暴露这个缺口，而不是需要 T04 放宽限制的 Bug。

## 三、Local-L/Main Owner 的唯一接线请求（CR-T04-02）

Main 只做必要正式连接：

1. 从 **实际 published TemplateVersion+PolicyStore+T01 发布快照** 取得不可篡改的 typed ledger；验证出版者与版本和 `RuleSpec` 一致；从 `CaseAggregate` 当前已确认字段/观察及 DocumentVersion/SourceRef 建 `T04PublishedTarget`。
2. `T04PublishedTarget.fields` 的每个 `T04Value.confirmed` 必须反映真实用户核对/事实确认，**字段未确认时传 false**；`sourceVersionIds` 为 Main 验证的**有效原件版本 ID**，`materialSlots` 为依据相应槽位登记与条件得出的真实状态。**已确认没有计划书**才可传 `{documentVersionIds:[],confirmed:true}`；尚未核对材料状态则 `confirmed:false`。
3. `compilePublishedTemplateReviewPlan(...)` 得到 Plan/绑定。Main 使用 C0 Plan install/Run writer 按 CAS 与版本快照安装、调用 `evaluateT04Plan(plan, checks)`；逐条使用 `toT04CheckResult` 及由 Main 核验的真实 SourceRefs，持久为一个 `ReviewRunV2`；不得让 Renderer 直接写入 Plan/Run。
4. 复用 T05 可信业务门禁，按 PR #180 D2/D3 判断本地业务模式与允许动作。**有 CanonicalPlan 不等于技术候选**，真实 Run 完成不等于自动通过。
5. 不必为了 A15 等全格式 OCR/批量 ZIP/PDF；取 PR #178 的真实 DOCX 及 A15 S2 18/21/缺件/未知数据逐项跑。

### 调用示例（仅示接口，不是真实持久化）

```ts
const compiled = compilePublishedTemplateReviewPlan({
  template: mainVerifiedPublishedTemplate,
  effectiveRules: mainVerifiedEffectiveRules,
  constraints: mainVerifiedOwnerClauses,
  targets: mainVerifiedTargets,
  phase: 'submission',
})
const proposals = evaluateT04Plan(compiled.plan, compiled.checks)
// MAIN verifies CaseAggregate/Run snapshot, policy provenance, sources,
// then persists its own CheckResult/ReviewRun through existing writer.
```

## 四、最小验收与未覆盖范围

A15 正例 18 → `compliant`，21 → `non-compliant`，未确认人数 → `awaiting-confirmation`，明确缺交材料 → `awaiting-supplement`；全部在真实 Run 与相同已发布模板上检验，材料来源 ID 和版本可核查。**本 PR 的领域测试通过≠ A15 S2 真机 PASS**。

后续实现事项仍属于 L/T01：模板发布阶段持久化 typed ledger、Main 可信读取、真正的 SourceRef/Check writer、T05 阶段决策、S2/S3/S4 用户操作实测。T04 不修改 Preload/IPC/正式 Case writer，也不承担 UI 验收。遇到已有第三方语义规则不支持确定运算时保持 pending，而不是伪造 compliant。

**备注**：目前 material-count 最小化支持 case-scope required slot 和 submission/decision 生命周期；按 subject 分槽、复杂条件和多阶段自定义材料策略需要对应模板合同后单独扩展，不以此宣称 F01–F18 全部完成。
