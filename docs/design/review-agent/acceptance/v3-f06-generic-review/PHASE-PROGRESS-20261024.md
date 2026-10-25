# F06｜库外事项的安全通用审核｜阶段记录（2026-10-24）

## 0. 基线与边界

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
- 独立工作分支：`fix/v3-f06-generic-review`
- 源码起点：PR #246 `fix/v3-unified-intake-routing`，固定基线 `d30e819a07f08dd036608f248e47ed570a9a30a5`。
- 当前 PR #246 / #249 / #250 仍由独立集成会话处理；F06 不自行合并它们，也不写第二套 Case、Plan、Run、Decision 真值。
- 依赖现有 B29 → B1 草稿/冻结 → Main `attachB1TechnicalPlanV3` → 原生案卷 Pi Run；F06 本身没有正式审批能力。

## 1. 原来错在哪里

已存在一条公共兜底技术路径，但它不能等同于有质量保证的通用初审：

1. 进入 B29 的 `objectKey` 被 Renderer 固定写为“当前申请事项”，真实申请对象没有被显式确认。
2. 只把用户/模型编辑的自由文本列为语义审核要求，没有不可删改的申请事项核对、材料事实一致性、缺件与政策来源可信性检查。
3. 所有原件被登记成 B1 `user-declared` 来源；任意额外要求可能经用户打钩后被当作 `request-scope` 的已确认规则。这是技术预审，不等于校方制度已核实。
4. 没有额外要求时会拼接一条探索性自由文本检查，难以稳定验收和分类追溯。

这些是本次在 #246 固定基线源码中的发现；不是声称集成后的最终 HEAD 仍然如此。

## 2. 为什么这样改

- 通用初审应只在**材料事实**上有限下结论；对于学校制度真实性、适用范围、版本、资格阈值、审批权限，宁可 `awaiting-confirmation` 也不得伪造。
- 审核事项与当前 DocumentVersion/SHA 必须一一对应，缺失、过期、重复来源一律拒绝固定新计划。
- 用户可以不填额外规则，仍运行一组可信边界内的通用事实检查；额外要求仍可保留，但只能作为未认证问题。
- 所有运行和结果沿用既有 B1/D2/Pi/T05 技术预审门禁，而非增加临时“通用审核状态库”。

## 3. 本轮改动

| 文件 | 修改与约束 |
| --- | --- |
| `review-v3-f06-generic-contract.ts`（新增） | 固定三项材料事实检查、一项政策来源待核实检查；产生有稳定 `checkKey` 的 B1 Obligation；Main 安装前拒绝缺项、篡改、错误材料绑定和旧式兜底绕行。 |
| `review-v3-fallback-executable-plan.ts` | 提取/确认真实申请事项；F06 固定检查与最多 30 条附加要求进入现有 B1；基于当前 Main 候选 SHA 重新关联真实 DocumentVersion。 |
| `ReviewV3TemplateRoutingAssistant.tsx` | 将真实事项明确呈现给用户修改确认；固定四项检查说明与可选附加检查分开；允许没有自拟政策时安全开展有限初审。 |
| `review-v3-main-b1-local-plan.ts` | Main 对新 `fallback-*` 安装强制 F06 合同；固定事实检查为 `request-scope`，政策/自拟条款为 `unverified-policy`、`confirmation:unconfirmed`。Pi 只能对后者提交 `awaiting-confirmation`。 |
| `review-v3-f06-generic-contract.test.ts`、`review-v3-fallback-executable-plan.test.ts`（新增） | B1 冻结可编译、原件溯源、事项篡改、政策越权、旧式绕行、无额外规则等反例。 |
| `apps/electron/package.json`、`bun.lock` | 按仓库约定将 Electron patch 版本 `0.15.163` → `0.15.164`。 |

特别说明：B1 `workspace:b1-*` 是本地技术来源标识，不是校方 PolicyVersion。T05 对 D2 Plan 一律解析为 `technical-pre-review`，不会由此获得正式决定权。

## 4. 目前如何证明

测试环境：Bun 1.4.2，锁文件依赖；本地独立分支。

- F06 + 既有 B1 兜底端到端*代码级*测试：**9 pass / 0 fail**。
- 既有 T01 草稿、模型解析、兜底模板草稿回归：**18 pass / 0 fail**（本轮第一次回归中另含 B1 整链，共 19 pass）。
- Electron TypeScript：`bun run --filter='@profer/electron' typecheck` **通过**。
- `bun install --frozen-lockfile`：**通过**，依赖检查无新增修改。
- 架构边界：`bun scripts/check-boundaries.ts` **通过**，未发现边界违规。
- `git diff --check`：无空白格式错误。

该证据证明固定合同、真实来源映射和技术计划可编译；并**不等于**真实 Pi 模型已读取实样、完成补件流程或 Electron GUI 已实机验收。

## 5. 尚余风险和依赖集成的事项

1. **F04 依赖**：#246/B29/Main 对公共兜底仍要求恰好一份 `role=application`，F06 未改写材料入口或多主件规则。需 F04 在统一主流程定义模板驱动材料数量后共同回归。
2. **模型及真实材料**：未执行已配置通用模型的 Electron 实样检查（含扫描件、缺件、矛盾原件、断网、库外识别误判），不能宣称自然语言审核质量已达标。
3. **补件请求持久事务**：F06 可在 Pi 检查理由中列明补件建议和 `awaiting-supplement`，但正式 `SupplementRequest` 的创建、回复、旧 Run 失效与报告更新仍依赖 F05/#249 的集成闭环。F06 不写第二套补件存储。
4. **报告/权限**：未扩展 T08/F16；所有输出必须标记本机技术初审、待确认，不得显示学校签发或自动批准。
5. **旧候选升级**：本次 Main 新安装会拒绝没有 F06 固定合同的历史 `fallback-*` 作者草稿。既存冻结 Run/历史报告不修改；如需重装旧草稿，应重新走本机确认与 F06 编译。
6. **团队合并**：本分支仅应在 #246/#249/#250 统一集成 HEAD 冻结后由负责人进行增量摘取并在该 HEAD 重跑测试；不直接合并到 `main`。
7. **仓库根文档**：`AGENTS.md` 要求架构变化时同步 `AGENTS.md` 和 `README.md`，但同时规定修改前需用户同意。本分支未擅自改动，集成前应取得许可后同步。

## 6. 统一 HEAD 的最小业务验收脚本

1. 输入实际不在目录的申请事项及两份真实材料，确认两层匹配和 AI 深度匹配无法覆盖；“不确定/模型失败”不能被当作“确认库外”。
2. 人工确认事项、用途及额外问题（可留空）。固定 F06 Plan，检查四项固定 Check、原件版本及 SHA 的冻结来源，确保没有虚构 PolicyVersion。
3. 启动**现有一份** Pi Run，逐份读取真实材料并提交：事项匹配、事实矛盾、缺件建议、政策依据真实性；结果需有 `documentVersionId + blockId/图像读取凭据` 或明确待确认。
4. 尝试对 `f06-policy-basis` 和 `f06-request-*` 伪提交 `compliant`，必须拒绝；正确的 `awaiting-confirmation` 可保存，但不导致 `autoPass` 或正式审批。
5. 补入缺失原件并重审，确认旧 Run 不再代表当前输入；报告区分初审与决定，并在重启后核验原件/Run/报告历史一致性。

验收判定：前三步构成 F06 的有限初审技术闭环；第 4、5 步与 F03/F05/F07/T08 集成共同保证整条业务链可信。未取得实机证据前不得标记生产完成。
