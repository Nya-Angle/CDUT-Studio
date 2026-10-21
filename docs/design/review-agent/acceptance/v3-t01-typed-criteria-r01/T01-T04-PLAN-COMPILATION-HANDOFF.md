# Review V3｜T01 → T04 确定性规则交接 R01

**状态**：T01 DOMAIN_CODED；本文件不表示 T04 编译、Main 持久化、A15-S2 已完成。  
**裁决**：PR #180《V3 核心架构收口裁决 R01》，D1。  
**范围**：T01 只负责负责人表达并确认规则。T04 负责编译 RuleSpec/PlanBinding/确定性算子；本地 L 负责可信发布校验、Plan/Run/Check 正式入库及 E2E。

## 1. 本轮真实交付

- `ReviewV3T01NumberRuleEditor.tsx`：在模板作者的单条 criterion 上选择“案卷级数值字段 / ≤或≥ / 阈值 / 本地负责人签名与要求原文”。更改字段/算子/阈值自动删除旧确认。草稿可保存，作者界面发布前要求有效确认。
- `review-v3-t01-typed-criteria.ts`：版本化的 `deterministicConstraint` 描述，`validateT01TypedCriteria`，`collectT01ConfirmedNumericChecks`，`collectT01RequiredMaterials`。它们是纯领域投影，不生成任何正式运行结论。
- `review-v3-t01-business-presets.ts`：实验室草稿从 `manual` 人数文本变成 **未确认的结构化 lte 20 规则**。原 `peopleCount.max=20` 被移除，否则 21 人会在表单层失败，永远到不了真实 non-compliant Check。
- `review-v3-t01-template-portability.ts`：外部导入/模型输出保留条件本身，但不得直接继承 JSON 自称“负责人已确认”的签名；须在本地重新确认。

模板字段、材料槽、双级阶段仍是现有 `TemplateVersion`，未引入另一份 TemplateStore。

## 2. T01 正式向 T04 交付的结构

目前 `TemplateCriterionSpec` 没有声明 `deterministicConstraint`，本线仅在 JSON 兼容拓展字段中暂存此结构。**本地 L 负责在共享 `TemplateCriterionSpec` 上增加可选正式类型，或通过现有 JSON 适配器严格解码；不能跳过发布端校验。**

```ts
type T01NumberLimit = {
  schemaVersion: 1
  kind: 'field-number-limit'
  fieldKey: string       // 必须与已发布 TemplateVersion.fields 唯一对应
  fieldScope: 'case'     // 当前 T01 限定案卷级数字字段
  operator: 'lte' | 'gte'
  threshold: number     // finite; 不使用字符串 eval
  unit?: string
  ownerStatement?: {
    kind: 'owner-statement'
    text: string        // 负责人真实输入的本地约束原文；不代表学校政策
    enteredBy: string   // 作者侧显示名，不是 Main 可信 Actor
    enteredAt: string
  }
}
type T01CriterionExtension = TemplateCriterionSpec & {
  deterministicConstraint?: T01NumberLimit
}
```

**Rule 投影**：
`collectT01ConfirmedNumericChecks(template)` 返回：
- `templateId/templateVersion/sectionId/criterionId/ruleId`，如 `section-eligibility-count`；
- `constraint.fieldKey='peopleCount'`，`operator='lte'`，`threshold=20`，`fieldScope='case'`，`unit='人'`；
- `policyVersionId='template-owner:<templateId>@<version>'`，`ownerStatement`，`priority`，`title/requirement/targetScope`。

无有效 ownerStatement 会抛 `T01_RULES_NOT_CONFIRMED`，不会悄悄当合规。导入模型起草只能生成待确认草稿。**T01 的负责人员声明还须由可信 Main 以真正发布者身份与发布收据绑定**，不能将 Renderer 任意 `enteredBy` 当正式权限。

**Materials 投影**：`collectT01RequiredMaterials` 返回 `slotId/minCount/requiredAt/requiredWhen/sectionId`；T04 编译 required-material 检查时引用的是**Main 登记的真实 DocumentVersion**，缺件时 `sourceVersionIds=[]` 不许伪造原件。

## 3. T04 必须接什么，而不是让 T01 私造 T04 算法

1. 从**Main 获取的已发布、固定版本的 TemplateVersion**计算上面的投影，不从 Renderer 自由传 `ruleId` 或篡改 policy 版本。
2. 用 `field-number-limit` 形成真实 `RuleSpec` 的**结构化约束**，在唯一 `CanonicalPlan` 中生成一条与它一对一对应的 `PlanBinding`。旧 `compileT04Operation` 的 `amount-limit` 写死 `amount`，**不得把 `peopleCount` 假装 amount**。
3. T04 已有 `{kind:'value-limit',field,maximum,unit}` 可处理 `lte`；`gte` 需要 T04 明确定义/支持最小值检查，若未支持，**返回 unresolved / BLOCKED_OWNER，不得错误编成 lte**。
4. `missing/undefined/unconfirmed` 的人数不等于 0：T04 产生 awaiting-confirmation，只有 human-confirmed Case field/fact 才可形成 compliant/non-compliant。21 → non-compliant，18 → compliant；旧 FieldSpec 的表单边界不参与正式审核结论。
5. 所有编译输出与 `templateId/version`、owner policy 版本、结构化运算及实际 subject/case 目标绑定 fingerprint；L 将它持久安装到正式 Case/Run。不存在 Plan 的时候不要用测试代码给 Run 注入预期答案。
6. `TemplateCriterionSpec` 中已有 sheet `dataCheck` 不受 T01 改动。若 criterion 是 deterministic 但既没有 `dataCheck` 也没有确认的数值 clause，视为编译未就绪；T01 的编辑器发布会阻止此状态（Main 最终也要校验）。

## 4. 本地 Main Owner 的唯一必要接口请求（CONTRACT_REQUEST）

**请求**：`CR-T01-D1-01`，为现有 `TemplateVersion` / criterion 保存 JSON-compatible `deterministicConstraint?`，并在 Main 的 save/publish 阶段校验字段引用、数值、作者确认及版本，避免直接 IPC 绕过 Renderer 发布检查。按 R01 决定：Main 还要将真实发布者身份、owner-statement 与不可变模板版本/Plan fingerprint 绑定。

**实现 Owner**：共享 DTO、`template-store.ts`、正式 IPC/Preload 与 `Case/Run` 的唯一作者均是本地 L；T01 不直接修改这些文件。T04 实现 Plan/Rule 编译。不要新建 PolicyStore/ReviewRun/Case writer。

**原始业务样例冲突**：此前 A15 的清单使用 `applicantCount`，T01 早期可编辑示例叫 `peopleCount`。这些是**同一含义但不同字段 ID**；T04 编译必须采用实际已发布模板的 `fieldKey`，不得全局硬编码任何一个键。若正式 A15 范例更名，须由 T01 Owner 在新模板版本上操作并创建新 Run，不能改写旧发布模板。

## 5. 最小验收（非整套产品 UAT）

- T01 单测：20 限制是 owner 待确认数据，确认后投影保留完整字段/来源/版本；变更阈值导致旧确认失效；外部 JSON 导入不得保留确认；材料槽记录保留；任何数字字段可复用。
- L 产品门槛仍是 A15-S2：用真实 DOCX 和真正的 published template 生成 Plan/Run/Check；18 合规，21 不合规，空人数 pending；后续 A15-S3/S4 仍由 L 执行，T01 不宣称通过。
