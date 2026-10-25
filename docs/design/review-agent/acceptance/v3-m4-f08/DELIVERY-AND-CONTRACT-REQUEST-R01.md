# Review V3 M4 · F08 确定性计算与评分口径交付 R01

- Owner：F08；协作协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 目标：补足 A07/A14 的**计算领域能力**。本 PR 不是主进程集成，也不是 A15/UAT 的通过声明；不得由本 PR 合并生产 main。

## 已有实现与本轮增量

共同祖先已有 T04 十进制定点计算、D04–D07 逻辑与测试、T07 评委流程/排名、T07 Main 写入及实机局部验收。保留这些模块和原有数据身份，不重造评分存储。

本轮改动：

1. `review-v3-t04-rules-scoring.ts`：当 `RuleSpec.groupBy` 用于 `group-score` 时，按已确认分组键分别去重/择高/封顶，再汇总；未知键禁止跨组混算。输出 `groupResults` 供后续检查卡展示各组账本。
2. 修正小分值精度尾差：明细采用最大余数分配显示单位，分配明细之和等于展示总值，并可重复回放；未知币种/缺项仍不视为 0。
3. 增加纯算子 `value-minimum`，可对已确认下限执行精确 `>=` 比较；仅 F08 域可用，T01→Plan 的 Main 适配仍需统一接线。
4. `review-v3-f08-rubric-calculator.ts`：无写入的评委量表数值内核。按已核验的人工作答计算维度均值、评委加权值、有效人数、N/A 权重重归一、换算量尺和分歧阈值；阻止重复票、未知票、未确认 N/A、无效配置、缺少必需评委和模型建议伪装成人工分。

## 定向验证与真实口径

- `bun test apps/electron/src/main/lib/review/review-v3-t04-rules-scoring.test.ts apps/electron/src/main/lib/review/review-v3-f08-rubric-calculator.test.ts`：**17/17 PASS**（包含 D04–D07、D11，A07 分组与账本尾差、下限、N/A、零值与分歧）。
- Electron 全量 `typecheck`：已尝试两次；默认 Node 2 GiB heap OOM，4 GiB heap 在容器内 SIGKILL。**不是编译通过**。
- 临时限定上述两个生产源码文件的 TypeScript 编译（继承 Electron tsconfig）：**PASS**。限定编译未覆盖测试文件的 `bun:test` 类型，因为当前只安装了 Electron 工作区所需依赖。
- 尚未执行真实 Electron GUI、正式模板→Plan→Run、多人独立评分/评分包导入、冷重启；这些不属于本 PR 的验收结果。

## 精确接口请求（CONTRACT_REQUEST）

### CR-F08-01 · gte 规则进入正式发布计划

- 现状：`review-v3-t01-typed-criteria.ts` 允许 `operator:'gte'`，但 `review-v3-main-template-plan-bridge.ts` 只映射 `lte`，`review-v3-t04-published-plan.ts` 的 `T04PublishedConstraint` 只有 `field-maximum`。
- F08 已提供 `T04Operation {kind:'value-minimum',field:string,minimum:string,unit?:string}` → `T04Outcome`（`compliant`/`non-compliant`/`awaiting-confirmation`，附计算明细）。
- 请求 F02 与唯一 Main Owner：先统一并核对原有 `ownerStatement.enteredBy/enteredAt` 与 Main `actorId/confirmedAt` 的签认来源，再由已发布 `TemplateVersion` 的确切 `fieldKey`、阈值、单位和签认映射成新 `field-minimum` 类型约束；T04 发布计划编译器把它编译到 F08 `value-minimum`。无确认不得执行，字段单位不明须 pending。
- 不请求新 `RuleStore`、`PlanStore` 或 Run writer，原有 `CanonicalPlan` 指纹与绑定身份需随正式编译内容变化。

### CR-F08-02 · 多事项的真实分组输入

- 现状：`compilePublishedTemplateReviewPlan` 目前对每个目标建立 `items:[item]`，`buildT04TargetFromCase` 实际只构造一个 `scope:'case'` 的目标。即使 F08 会按 `groupBy` 独立封顶，当前 Main 路径仍不能证明真正把多个事项送到同一个分组检查。
- 请求 F07 / 唯一 Main Owner：从已确认的案卷字段、Observation 和明确身份的业务事项形成 `T04Item[]`；每项带稳定 `id`、逐项已确认值及真实来源，不用 AI 推断去重键。把这些项按冻结 Plan 的真实目标传给 F08 `evaluateT04Rule`，保留 `groupResults` 的每组归属与明细；Run 仅由 Main 保存，检查与来源须按真实用到的事实绑定。
- 对没有确认的 `groupBy` 键：允许 `awaiting-confirmation`，不允许静默变成同一组或落到“其他”组。

### CR-F08-03 · 正式评委汇总复用数值内核

- 现状：`review-v3-t07-rating-workflow.ts` 已有分配、提交、排名、冻结与独立 Main 写入；F08 新量表函数尚未替换既有 `computeT07Ranking` 的 JS 浮点运算。
- 请求 F15 / 唯一 Main Owner：以可信当前 `T07Round` 的有效评委任务、人工提交票、经 T04 确认的 N/A 资格及已发布 `RubricSpec` 调用 `calculateF08Rubric`；按结果的阻断项处理定稿门禁，名额/同分/回避/重开仍留给 T07/F15。不从 package 声称的 actor、AI 建议分数或被回避的评分产生有效票。
- 新函数返回数值字符串，以保护定点计算精度；现有 T07 UI/Run 类型如需 number 映射，应在单一集成边界转换并保留精确报告值。

## 保留的差距

- D04–D07 的实际多原件、多事项事实对齐与来源定位取决于 F04/F05/F06/F07 的生产接线。
- A14 同分名额、真实回避与评分包往返由 F15/F18 负责；本轮不重复实现评分工作流。
- A07/A14 完整用户链必须由本地 Main Owner 通过同一生产 SHA 的 Electron / A15/UAT 单独签收。
- 仓库 `AGENTS.md` 要求修改 README/AGENTS 时先经用户允许；本独立 PR 不改这两份文件，待统一集成后由授权维护者更新产品状态说明。

交付状态：`CODED` / `PASS_SCOPED`；正式接线 `CONTRACT_BLOCKED`（CR-F08-01/02/03），**不声明产品已闭环**。
