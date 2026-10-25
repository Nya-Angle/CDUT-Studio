# R02 研究模板 → V3 原生实现与仓库交付契约

更新日期：2026-10-23

## 0. 本轮任务定义

本轮不是“只审查文档并提交报告”。固定闭环为：

**审读 128 份现有研究模板 → 修正可确定的内容缺陷 → 转换为 V3 可执行模板定义 → 接入 V3 计划/运行链路 → 添加针对性测试 → 提交代码分支与 PR → 集成回归。**

只有报告、只生成 JSON/MD、只添加未接入的死代码、或只提交模板文件而无法在 V3 创建案卷和运行审核，都不算完成。

## 1. 仓库和基线

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
- 基线：`main@7b6cdc843d26e926c0c63b8c51a451ff3925cfad`（派发时如 main 已前进，集成 Owner 必须记录新基线并先核对差异）
- 集成分支：`feat/v3-r02-template-library`，已从上述 main 创建。
- 子批次分支：`feat/v3-r02/templates-{BATCH_ID}`
- 子批次 PR 的 base 必须是 `feat/v3-r02-template-library`，不得直接以 main 为 base。
- 最终由唯一集成 Owner 完成集成回归，并创建一个指向 main 的最终 PR；子批次不得直接合并 main。

## 2. 范围

- 128 份正式 MD 是本轮实施对象，固定 ID 和正式名称不得擅自更改。
- 另外 16 个缺失源文件只登记在缺口清单，不得用相邻模板代替，也不得创建空白假模板；这 16 项不阻塞 128 项交付。
- 每份模板源文档必须在仓库中有可追溯的审阅后版本：`docs/design/review-agent/business-templates/R02/{TEMPLATE_ID}.md`。
- 每份模板必须有 V3 运行时定义：`apps/electron/src/main/lib/review/r02-template-catalog/definitions/{TEMPLATE_ID}.ts`。
- 每个批次的专项审查报告与问题台账放在 `docs/design/review-agent/business-templates/R02/audits/{BATCH_ID}.md` 和同目录 TSV。
- 每批次新增一个独立测试文件：`apps/electron/src/main/lib/review/r02-template-catalog/definitions/{BATCH_ID}.test.ts`。
- 子批次不得修改共享注册器、`builtin-templates.ts`、`template-store.ts`、共享类型、V3 Main 写入服务、IPC、preload、renderer 或 README/AGENTS；这些统一由集成 Owner 处理，避免 31 路冲突。

## 3. V3 运行时实现要求

1. 使用仓库已有的 `TemplateVersion`、`TemplateField/MaterialSlot/Section/Criterion/WorkflowStage` 契约和 V3 C0 Plan / Run 路径。不得另造平行的 Case、Run、Decision 或 Batch 状态机。
2. 保留每份模板的唯一 ID、正式名称、业务范围、字段、材料槽、审核分项、办理情形、异常路径和结果输出。字段类型只有在原文有充分依据时才细化；无法确定时用 text/人工确认，不猜类型或阈值。
3. V3 必须把每个模板 criterion 编入可追踪的检查计划，生成稳定 checkKey，并将模板版本、规则/标准摘要、材料版本及 plan fingerprint 绑定。不能只把模板显示在目录中，却没有对应的运行检查。
4. 当前 `TemplateCriterionSpec` 是模板内审查标准，不天然等于学校正式政策。V3 编译器必须明确区分“模板内审查项”和“真实 PolicyVersion/校本政策规则”。**禁止为了满足接口而伪造 PolicyVersion、policyVersionId、确认人、确认时间、政策 URL 或学校授权。** 若现有 C0 绑定不能清楚表达来源类型，集成 Owner 应增加显式来源类型/来源状态，并兼容旧模板；不得把模板内审查项伪装成学校政策。
5. 模板的政策来源、当前性和适用范围状态应可追踪；政策未确认时仍可读取材料、提取事实、发现差异并生成审阅建议，但与政策合规有关的最终判断必须进入 `awaiting-confirmation/needs-human-review` 类状态，不能以语义模型的 pass/fail 直接变成正式合规结论。
6. 所有 128 项初始默认 `autoPassPolicy.enabled=false`。模板运行可以生成事实、证据关联、问题、补件建议和审阅报告；最终业务决定必须走现有 V3 Main 受控流程和真实可信身份，不得从 Renderer 接收可信 Actor，不得绕过 expectedRevision/CAS/Run 新鲜度/Plan 指纹/材料版本检查。
7. 最终办理阶段只配置通用本地审核角色（如 reviewer/teacher），不根据组织名称推断校方最终签批权；不得接入或伪造学校远端写回。界面/模板说明须清楚显示“本地研究模板 / 非校方正式模板”，若存在政策证据缺口还须显示“部分规则待确认”。
8. 每个模块保存源文档路径和 SHA-256，保持研究原件、审阅修订版、运行时定义之间的可追溯关系。源文档中的 SRC 是研究来源索引，不等同于案卷材料 SourceRef；不得将其伪造成案卷证据引用。
9. 保持本地文件存储优先，不引入数据库或额外依赖，不复制一套 V3 Case/Run/Decision。不要为了模板数量复制整套业务逻辑；采用数据定义 + 一个共享编译/注册路径。
10. 模板必须可在 V3 模板库被发现、可创建案卷、可进入真实 V3 Run 计划，并且每个 criterion 都有对应计划绑定和结果槽位。局部发布表示应用内模板版本可用，不代表成都理工大学正式发布或批准。

## 4. 共享架构职责

- 子批次（模板领域实现）：负责自己分配的 Markdown 内容审阅、低歧义修订、独立 TemplateVersion 模块和专项测试；只添加自己唯一的文件。
- 集成 Owner（唯一集成者）：负责总注册器、内置模板播种与目录排序、V3 TemplateCriterion → CanonicalPlan 编译桥、来源状态传递、运行结果映射、界面非官方/待确认提示、跨模板一致性、共用类型和共享 Main/IPC 修改。
- C 业务 Owner 的边界必须保留：CurrentCase/ReviewRun/BatchAttempt/Decision/Outbox 的业务写权集中在现有 Main/C 服务；子批次不新增第二写入点。
- 不改 `README.md` 或 `AGENTS.md`，除非用户另行明确授权。必要开发说明放在 `docs/design/review-agent/`。
- 不回退到 V1/V2 作为主业务流程；可复用现有 TemplateVersion 作为 V3 的模板描述层，但执行必须接现有 V3 C0 Plan/Run 和 Main 门禁。

## 5. 单批次工作与交付

每个批次必须：

1. 从 `feat/v3-r02-template-library` 当前 HEAD 按固定 ID 读取分配的全部原始 Markdown：`docs/design/review-agent/business-templates/R02/research-original/{TEMPLATE_ID}.md`，并完整阅读，不得只看摘要。原始 ZIP 不是输入前提；若已有 ZIP，可作为辅助交叉校验。
2. 审核来源、业务范围、字段/材料/规则/角色、异常和跨模板边界；可查证的官方来源记录 URL/文号/条款，未确认项标状态并继续。
3. 对可确定的低歧义内容错误直接修正审阅后 MD；不得虚构政策。将 GitHub 上 `research-original/` 原件保持只读，修订稿写入 `docs/design/review-agent/business-templates/R02/{TEMPLATE_ID}.md`。若已有批次 ZIP，可作为可选辅助材料；不得要求用户提供或等待 ZIP。
4. 将每份模板转换为 `TemplateVersion` 数据模块；每个 R ID 都必须有至少一个运行检查 criterion，材料/字段/阶段契约须通过结构校验。
5. 生成每批次测试，至少验证：ID/名称、字段与材料槽引用、分项/criterion ID 唯一、阶段图合法、source metadata 存在、autoPass 关闭、未知政策状态不会生成自动正式通过。
6. 运行批次专项测试；按仓库规则运行 `bun run typecheck` 与 `bun run check:boundaries`（如当前环境不能运行，记录真实错误和已执行命令，不得声称通过）。
7. 提交分支并创建 PR 到集成分支。PR 必须包含代码、审查报告、问题 TSV、测试结果和未解决项。最终回复给出 branch、commit SHA、PR URL、测试命令/结果。
8. 交付 ZIP 可作为辅助材料，但不能替代仓库提交和 PR。

## 6. 统一测试策略（避免过度 CI）

- 子批次：只跑本批次测试 + typecheck + boundaries；不要求每个批次重复全仓 5,000 项测试或 Electron 全量打包。
- 集成阶段：运行 128 项注册/结构测试、V3 Plan/Run 专项回归、`bun run typecheck`、`bun run check:boundaries`；完成后再统一运行一次全量回归。先功能闭环，再集中回归。
- 必须使用合成案卷和隔离配置；不使用真实学生/教师材料，不把真实账号或隐私信息提交仓库。

## 7. 集成验收（最终 PR 前必须全部满足）

- [ ] 128/128 个模板 ID 唯一，128/128 都有源 MD、运行时模块、专项测试登记。
- [ ] 模板库实际列出全部 128 项；创建案卷时绑定准确 templateId/version。
- [ ] 128 项均能编译 V3 Plan；每个已配置 criterion 都有稳定且唯一的 checkKey / target binding，未执行检查不会被算作已覆盖。
- [ ] 计划 fingerprint 绑定模板版本、criteria/source metadata、材料版本；修改后旧 Run 不可作为当前决定依据。
- [ ] 不存在伪造 PolicyVersion/学校批准人/政策确认；未确认政策仅生成建议/待确认，不自动正式通过或拒绝。
- [ ] 128 项全部关闭 auto-pass；正式决定走现有 Main 门禁，未引入 Renderer 写权或第二 Case/Run/Decision 存储。
- [ ] 模板库明确显示非官方性质和政策待确认状态。
- [ ] 缺失 16 项仍在独立缺口表中，没有占位假模板。
- [ ] 全量模板结构测试、V3 专项回归、typecheck、boundaries 通过；失败必须修复或在 PR 中明确标记，不能沿用旧 CI 结果。
- [ ] 最终交付为一个指向 main 的集成 PR，包含最终报告、问题台账、变更映射、测试证据和 16 项缺口。

## 8. 固定结论

“学校授权/内部制度未确认”只能影响具体规则的证据状态和自动判断能力，**不能阻止研究、模板代码实现、测试、分支提交或 PR**。开发目标是交付可用的本地 V3 研究模板库，不是声称学校已经正式采用这些模板。
