# Review V3 M4 · F03 多政策规则与冲突确认｜领域交付及接线请求 R01

- Owner：F03；协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定开发祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- feature：`feat/v3-m4-f03-policy-conflicts`；Draft PR 为源码交付，**NO MERGE**。
- 范围：F03 / A06；不修改 `CaseAggregateV2`、Main IPC/Preload、TemplateVersion、CanonicalPlan、ReviewRunV2、实际业务 writer。

## 已实现的生产入口

1. `f03-policy-resolution.ts`：多政策条款的来源归并、适用日期、安全分流、同一 claim 冲突、显式优先关系裁定及候选集合指纹。仅语义完全相同的跨来源同名规则合并一次检查，并保留来源清单；相反规则保留两个有区别的运行态规则 ID，均标记待确认。
2. `effective-rules.ts`：正式模板精确读取 `policyRefs`，拒绝未发布/不匹配/内容被改写/来源或确认记录缺失的引用；跨政策同名规则不再被 `Map(rule.id)` 静默覆盖。原 `resolveEffectiveRules` 消费者自动获得 F03 安全投影；需要冲突明细的消费者使用 `resolveEffectiveRuleReport`。
3. 对未确认或有效日期不明的规则，运行态安全投影不保留确定性可执行载荷：旧 V2 的 `dataCheck` 优先分支也不会在人工待核前执行。发布原文、正式模板、历史 Run 均不被修改。
4. 独立定向 BDD 测试覆盖两份相反限额、第三份不受影响条款、相同条款去重、多来源出处、具名选择、改版失效、跨 ID 显式 claimKey、无/无效业务日期、未确认规则及真实旧 V2 计算消费者。

**状态边界：** 当前为 `CODED + WIRED`（只读规则投影已接入旧消费者）、`PASS_SCOPED`；**不是 A06 端到端 PASS**。没有可信 Main 存储/读取优先裁定时，相反限额将正确地持续待确认；本分支不能声称用户在 UI 已经完成确认往返。

## CONTRACT_REQUEST F03-CR-01：政策冲突预览、确认及正式 Plan 绑定

**目标 Owner：** 本地 Main/IPC/Case/Plan 唯一 Owner；F02 模板作者界面负责正常编辑入口，F07/F08 消费最终固定 Plan。F03 提供领域函数与格式，无权自行开放写入通道。

### 既有行为与缺口

- 模板发布已有 `PolicyRecord` 和 `TemplateVersion.policyRefs`，T04 有 `resolveT04PolicyClaims`；旧 `resolveEffectiveRules` 使用裸 id 覆盖政策规则。
- F03 修正规则投影后，`resolveEffectiveRuleReport(aggregate, template)` 可展示准确的 `conflicts[].claimKey/candidates/candidatesHash`，但正常 Main 运行尚未向它传入受权、可持久重放的 `decisions` 和可信 `asOfDate`。
- `RuleSpec` 本身没有跨不同 rule ID 的语义 claimKey 字段；F03 提供显式 `F03ClaimLink[]` 参数，不凭相同标题或数值自动认定冲突。

### 希望的最小读取合同

由 Main 读取已确认且固定的模板/政策版本与案卷事实，返回每个候选的 `policyId + version + ruleId + title + sourceRefIds`、本轮实际适用条件与 `claimKey`、冲突候选指纹、是否已有有效裁定及其历史。Renderer 仅展示，不可自行指定正式身份、政策正文出处或“发布状态”。

### 希望的最小写入合同

现有 Main 业务命令/CAS/Receipt 体系增加一次受控的“政策优先关系确认”，不另建 RuleStore、PlanStore 或隐藏 JSON 真值。请求的逻辑字段：

| 字段 | 来源和约束 |
|---|---|
| `caseId`、`expectedRevision`、`requestId` | 案卷事务与幂等，Main 校验当前版本 |
| `templateId`、`templateVersion` | 实际已发布且本案绑定的模板，不信 Renderer 自报 |
| `claimKey`、`candidatesHash` | 本轮全部有效候选与来源版本的规范化摘要，提交时重新计算 |
| `selected.policyId/version/ruleId` | 必须恰好命中当前冲突候选，不能选草稿/撤销版规则 |
| `reason` | 人工解释优先关系或明确例外，不允许空理由 |
| `confirmedBy`、`confirmedAt`、身份来源 | **Main 依据受信 actor 生成**，不是 Renderer 传入后照单写入 |

要求：没有权限、旧 revision/旧 hash、政策版本漂移、范围不符、同 requestId 不同内容必须拒绝；同一次有效请求重放应返回同一回执。历史裁定与关联原文保留。受理成功后重新编译当前 Plan/Run，旧 Run 不被原地改写。正式发布前的模板层优先关系确认如需复用同一数据，仍须由 F02/本地 Owner 决定其合法版本承载位置。

Main 在消费 `resolveEffectiveRuleReport(..., { claims, decisions, asOfDate })` 前需验证：

1. `claims` 是作者明确配置并已发布的条款关联；同一原始 ID 不可拆组规避冲突。
2. `decisions` 的受信身份、理由、候选指纹、模板/计划与案卷版本均已绑定；F03 的纯函数只检查格式与候选匹配，不授予角色权限。
3. `asOfDate` 来自业务上确定的有效日期（具体字段由模板定义），未确认时不以机器今日日期代替。
4. `effectiveRules[].originalRuleId` 与 `origin/policySources` 的映射纳入 Plan/报告可审阅溯源；不要把 `f03-...` 稳定运行别名伪造为政策条款号。
5. 冲突未消除时仅受影响检查为 `awaiting-confirmation`，无关检查仍正常执行；任何技术 Run 完成不等于业务审批通过。

### 依赖与验收移交

- **F02**：作者可配置跨不同 rule ID 的 claimKey、适用范围/日期/明确例外及优先来源；政策负责人录入文本须保留真实 `enteredBy/enteredAt`。不与 F02 争写 `TemplateWizardPanel.tsx`。
- **F07/F08**：唯一 CanonicalPlan/Rule ledger/Run 消费已裁定的规则集与来源、版本指纹；未确认项不得确定计分。对于 F02 的 `gte` 操作另有既定跨线 CR，不归 F03 偷改 T04 算子。
- **本地 Main Owner**：受信身份、幂等、CAS、持久裁定、重启恢复、正式 Run 联动及 A15 S4，不在本 PR 内实现。
- **A06 最终用户旅程**：学校政策+学院补充+活动通知各自产生检查；相反限额待确认但第三项正常；负责人明确例外并作具名裁定，重启后仍生效；变更政策版本后旧裁定自动失效、历史可查。须同一生产 SHA 的实际 Electron UI 记录才能签收。

## 验证边界

- 定向测试：`f03-policy-resolution.test.ts`、`effective-rules.test.ts`，以及旧 T04/Run/Pi/模板/批次相关回归。
- `bun run --filter='@profer/electron' typecheck` 曾因执行进程 SIGKILL 未完成；限制源文件和实际传递依赖的定向 TypeScript 校验通过。不把后者写成全仓类型检查 PASS。
- 未运行 GUI/A15；未核实真实学校政策授权，不将演示负责人声明宣称为正式校规。
- 根据仓库 `AGENTS.md`，功能变化时 `AGENTS.md` 与 `README.md` 的改动需要用户许可，本次遵守暂不修改；请由集成/文档 Owner 获授权后统一同步。Electron patch 版本已递增并同步 `bun.lock`。
