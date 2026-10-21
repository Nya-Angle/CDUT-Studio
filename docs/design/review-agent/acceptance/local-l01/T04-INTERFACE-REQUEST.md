# T04 接口需求说明（BLOCKED_OWNER）

**提交方**：Local-L04 集成线
**对象**：T04 规则编译与确定性评分 Owner
**结论**：T04 代码已 MERGED 进 main，但**无法接线**，因为它需要的输入契约不存在。

## 1. 现状

`apps/electron/src/main/lib/review/review-v3-t04-rules-scoring.ts` 提供：

```ts
evaluateT04Plan(plan: CanonicalPlan, checks: T04PlanCheck[], decisions?: T04PolicyDecision[]): T04PlanProposal[]
```

`T04PlanCheck` 要求每个 `PlanBinding` 配一个 `RuleSpec`：

```ts
type T04PlanCheck = {
  binding: PlanBinding      // 来自 CanonicalPlan.bindings
  rule: RuleSpec            // ← 缺失的这一侧
  operation: T04Operation   // compileT04Operation(rule)
  items: T04Item[]
  policyClaimKey?: string
  asOfDate?: string         // 必须是调用方给定日期，绝不能用机器时钟
}
```

且 `evaluateT04Plan` 要求 `checks` 与 `plan.bindings` **逐个精确匹配**，否则抛 `T04_BINDING_SET_MISMATCH`。

## 2. 为什么接不上

| 路径 | 有 CanonicalPlan？ | 有 RuleSpec？ | 能否接 T04 |
|---|---|---|---|
| A15 模板绑定（T01/T10，`createCase` + `reviewTemplate`） | **无**（只有 `caseV2.templateId/templateVersion` 与 `d2RuntimePlan`） | 有：`resolveEffectiveRules` 能从模板 `sections[].criteria` 产生 | **否**：缺 CanonicalPlan |
| B1 候选模板（`freezeLocalCandidateAuthorV3` + `attachB1TechnicalPlanV3`） | **有** | **无**：`B1AuthorDocument.modules[].checks[]` 只有 `checkKey` / `requirement` / `responsibility` / `sourceIds` / `targetKeys` / `condition` | **否**：缺 RuleSpec |
| D2 本地 D4 技术预审 | 无（`d2RuntimePlan.mapping` 是另一套模型） | 有：`ruleId` + Check 定义 | **否**：且 D2 按设计不得形成正式决定 |

也就是说：**同时具备 `CanonicalPlan` 与 `RuleSpec` 的数据形态，在当前代码库里不存在。**

## 3. 需要 Owner 给出的最小契约（三选一）

**方案 A（推荐）：给 B1 检查补 RuleSpec 字段**
在 `B1AuthorDocument.modules[].checks[]` 上可选增加 `rule`（或 `execution` / `policyVersionId` / `targetScope` / `confirmation` 四要素），由作者态显式声明。L 线随后可写：
```ts
buildT04Checks(aggregate.canonicalPlan, authorDocument) → T04PlanCheck[]
```

**方案 B：模板编译时同时产出 CanonicalPlan 与 RuleSpec**
在 `compileReviewB1Plan` 或模板发布路径里，把 `sections[].criteria` 编译成 `RuleSpec` 并让 `PlanBinding` 携带 `ruleId`，使二者可对上。

**方案 C：明确 T04 只服务 D2，不服务业务模板**
若如此，请明确写出「T04 不参与 A15 业务决定路径」，L 线将把 T04 标为 `NOT_APPLICABLE_IN_A15` 而不是 `BLOCKED_OWNER`。

## 4. L 线承诺

- 不自行发明 `B1 check → RuleSpec` 的映射（会凭空创造业务语义，违反集成线职责）。
- 契约落地后，L 线负责：接线、`asOfDate` 由调用方显式传入（绝不用系统时钟）、结果经既有 Run writer 落盘、待定规则与冲突保持对应状态而不被模型文本偷换为 compliant。
- 不新增第二套 rules storage。

## 5. 当前对产品的影响

**A15 的确定性检查计算无法运行。** 具体表现：
- 模板里 `execution: 'deterministic'` 的判据不会产出确定性结论；
- 只有 Pi 语义审核路径可用，且 D2 技术预审案卷明确禁止形成正式决定（`AGENT_DECISION_DISABLED`）。

这**不是**集成线可以绕过的问题：绕过它等于让模型文本冒充确定性规则结论。
