# V3 M4 F02｜模板作者端交付与共享合同请求 R01

> Owner：F02；共同祖先 `main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`；协调协议 `M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`。
> 本文件只属于 F02 feature PR，不代表 Main 已接线或 A02/A15 全链验收通过，也不更新 docs-only 总协调索引。

## 1. 本线实际改动

- 从自然语言明确表达的上下限生成未签认的 `field-number-limit`，区分表单输入范围与真正的审核规则；未知制度仍不自动定性。下限在作者端可保留草稿，但在 T04 真实算子可用前阻止发布。
- 结构化数值规则在编辑要求、字段含义、字段类型/单位、比较关系及阈值变化后自动撤销原负责人确认；从发布版本创建新草稿及复制参考配置均不继承旧签认。
- 模板库能显示版本历史；即使最新版本还是草稿，也能在“可载入”筛选中看见历史已发布版本。已发布版本不可覆盖；从历史版继续修改需创建新版本。
- 六类模拟业务案例保持原有真实可上传的 UTF-8 材料包，增加活动人数/预算、报销金额上限及奖学金成绩下限的结构化草稿规则；六类完整 Electron 用户旅程仍属后续集成/验收。

## 2. CONTRACT_REQUEST F02-CR-01（P0）：作者签认与 Main 桥接不一致

**现有作者侧事实**：`review-v3-t01-typed-criteria.ts` 的 `T01OwnerStatement` 保存 `kind/text/enteredBy/enteredAt`，`ReviewV3T01NumberRuleEditor.tsx` 让使用者明确输入声明人和原文。

**现有 Main 消费者**：`review-v3-main-template-plan-bridge.ts::adaptT01ConstraintsToT04()` 只读取 `ownerStatement.actorId/confirmedAt`，并将前者写为 `confirmedBy`。因此普通作者界面产生的已确认数值规则仍会被 Main 判定为未确认，返回 `unresolved`。A15 手工 fixture 使用的字段不同，不能证明本路径通过。

**请求 Main Owner 作出的最小合同裁决**：

1. 明确区分“本地模板负责人输入的声明文本与署名”与“Main 认证过的可信 Actor”。不能将自由文本 `enteredBy` 直接假冒可信 `actorId`，也不能让导入模板中的确认变成有效授权。
2. 在既有 `TemplateVersion` 与 T04 编译桥之间接通同一种经过 Main 校验的作者确认格式与来源；给出所需最小 IPC/领域入口及错误口径，保留旧版读取兼容（如须迁移）。不引入第二 TemplateStore/RuleStore。
3. 定向验证：正常编辑器签认 → 保存草稿 → 发布固定版本 → 真实案卷 → `compileTemplatePlanForCase` 生成完整 Check，而非仅用手工拼装 `actorId/confirmedAt` 的 fixture。

**F02 边界**：本线不会擅自在 Renderer 伪造 `actorId`/`confirmedAt`，不会修改 Main 桥接、可信身份、Run writer 或 `TemplateVersion` 共享 DTO。作者侧数据仍是未获得 Main 信任提升的本地声明。

## 3. CONTRACT_REQUEST F02-CR-02（P1）：`gte` 下限规则正式执行

- 作者侧允许 `operator: 'gte'`，自然语言现在也可明确抽取“人数不少于 5”“成绩不低于 80”等事实。
- `review-v3-main-template-plan-bridge.ts` 只无损映射 `lte → field-maximum`，`gte` 返回 `unresolved`；`review-v3-t04-published-plan.ts` 需由 F08 / F07 与 Main Owner 协调真正的字段下限算子与覆盖结果。
- **请求**：给 T04 增加确定性下限算子和正式 PlanBinding，处理数值单位、未知值及来源，不用取负值冒充上限。不改旧 RuleSpec / Run 权威身份。作者校验当前阻止尚不可执行的 `gte` 发布，Main 接线后可按真实能力解除。

## 4. 其他跨线观察（不越权修复）

- `review-v3-main-template-run.ts` 目前编译、评估、保存 Run，但没有在同一案卷事务安装 CanonicalPlan。是否影响 T05 的阶段资格，由 Main Owner / F07 / F09 / F11 依据 A15 S4 复核并处理。
- 模板复制/导入与候选治理的不可发布资格仍由 Main 控制；不得通过换 `sourceNote` 或改条件编号洗白 D0.5/D1 候选。
- A02/A15 的六业务实例应以真实发布 → Case → Run → 人工动作 → 报告及普通 GUI 证明；F02 领域单测不能升级为用户旅程 PASS。

## 5. 交付/验证边界

本线不合并 `main`，不改共享 Main/IPC/Preload/Case/Run writer。定向测试与类型检查结果以 Draft PR 的最新 source SHA 和实际命令为准；UI 尚未独立跑完整 Electron UAT。`README.md` 与 `AGENTS.md` 的同步修改依仓库规定待用户明确许可，当前未擅自修改。
