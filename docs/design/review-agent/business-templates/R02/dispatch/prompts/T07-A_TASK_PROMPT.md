# 子会话任务｜T07-A｜部门行政与正式信息发布

> **权威 GitHub 原件定位与读取顺序（ZIP 不是输入前提）**
> 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`；权威资料/集成分支：`feat/v3-r02-template-library`。开始时读取并记录该分支最新 HEAD SHA；本文中的历史 SHA 或本地旧文件均不得替代当前 HEAD。
> - 本批提示词：`docs/design/review-agent/business-templates/R02/dispatch/prompts/T07-A_TASK_PROMPT.md`。
> - 本批原始模板（以下路径已按本批实际 ID 展开，必须逐份完整读取；不得只看摘要或前几节）：
>   - `docs/design/review-agent/business-templates/R02/research-original/T07-T01.md`
>   - `docs/design/review-agent/business-templates/R02/research-original/T07-T02.md`
>   - `docs/design/review-agent/business-templates/R02/research-original/T07-T03.md`
>   - `docs/design/review-agent/business-templates/R02/research-original/T07-T04.md`
> - 执行前必须完整读取以下公共要求（均从上述分支当前 HEAD 读取）：
>   1. `docs/design/review-agent/business-templates/R02/dispatch/README.md`（资料总索引）
>   2. `docs/design/review-agent/business-templates/R02/dispatch/README_派发说明.md`（派发规则）
>   3. `docs/design/review-agent/business-templates/R02/dispatch/00_V3实现与提交契约.md`（本轮实施闭环）
>   4. `docs/design/review-agent/business-templates/R02/dispatch/00_统一审查标准.md`（质量验收标准）
>   5. `docs/design/review-agent/business-templates/R02/dispatch/00_集成分工与文件所有权.md`（写入范围/所有权）
>   6. `docs/design/review-agent/business-templates/R02/dispatch/00_模板清单_128.tsv`（128 项正式 ID、名称、来源元数据、字节数与 SHA-256）
>   7. `docs/design/review-agent/business-templates/R02/dispatch/01_未纳入的16项.md`（明确缺失项，禁止用邻项代替）
>   8. `docs/design/review-agent/business-templates/R02/dispatch/00_总集成会话提示词.md`（总集成边界与验收）
>   9. `docs/design/review-agent/R02-V3-IMPLEMENTATION-CONTRACT-20261023.md`（V3 原生实现契约）
> - 辅助参考（不取代以上权威文件）：`docs/design/review-agent/business-templates/R02/dispatch/README_使用说明.md`、`docs/design/review-agent/business-templates/R02/dispatch/01_预期目录缺口_修正版.md`。
> **本地克隆读取流程**：先确认 `git remote get-url origin` 指向该仓库，再运行：
> ```bash
> git fetch origin refs/heads/feat/v3-r02-template-library:refs/remotes/origin/feat/v3-r02-template-library
> git rev-parse refs/remotes/origin/feat/v3-r02-template-library
> git show refs/remotes/origin/feat/v3-r02-template-library:<仓库内相对路径>
> ```
> 逐个将 `<仓库内相对路径>` 替换为上列确切路径。若 fetch 因本地远端跟踪分支分叉而失败，不得强制覆盖或重置；改用 `git fetch origin refs/heads/feat/v3-r02-template-library`，随后以 `git show FETCH_HEAD:<仓库内相对路径>` 读取。不要切换或重置正在工作的批次分支。
> **无本地克隆时**：直接使用 GitHub 文件/API/连接器，指定仓库与 `ref=feat/v3-r02-template-library`，按相同路径读取；不得要求用户上传 ZIP。若某个路径真实返回 404，记录确切路径和错误，继续其余任务，不得用邻项代替或创建空壳原件。
> **完整性核验**：将每份原件的 `template_id`、正式 `name`、清单 `bytes` 和 `sha256` 逐项比对。计算 SHA-256 必须使用原始字节；若文本展示器去掉末尾换行，不能据展示文本直接判为原件损坏，应从 Git blob/原始字节核验。
> **ZIP 规则**：任何 ZIP 都只是可选备份/交叉核验材料，不是开始工作的前置条件；如 ZIP 与当前分支 HEAD 不一致，以当前分支 HEAD 为准并记录差异。不得要求用户重新上传原始 ZIP。



你是一个全新的独立审查会话。不得依赖旧会话记忆，也不得要求用户上传 ZIP。开始工作前必须按上方 GitHub 资料定位与读取顺序，自行取得本批原件和公共要求。ZIP 仅是可选备份，不能成为执行前提。**本轮必须实际完成审查并交付文件，不是只制定计划。**

## 你的责任范围

- 批次：`T07-A`
- 领域：`T07`｜部门行政与正式信息发布
- 本批次模板数：4
- 本批次必须逐份审核的模板：
  - `T07-T01`｜部门公文、请示、决议与发文核稿审批
  - `T07-T02`｜单位一般对外合同、协议的实质内容审查与用印
  - `T07-T03`｜单位授权函、介绍信与对外正式函件核验
  - `T07-T04`｜二级单位网站建设、二级域名申请与网站变更审核

- 本领域当前已存在的全部模板 ID（用于识别同领域重复/边界冲突）：T07-T01, T07-T02, T07-T03, T07-T04, T07-T05, T07-T06, T07-T08
- 本领域预期目录中未找到正式 Markdown 的 ID：T07-T07（校内信息公开申请和保密披露范围审核）

## 必须执行的工作

1. 逐份完整读取本批次所有 Markdown，不能只看 YAML、摘要、前几节或搜索片段。先核对身份、版本、结构与引用完整性。
2. 按 GitHub 当前分支的 `docs/design/review-agent/business-templates/R02/dispatch/00_统一审查标准.md` 全部维度逐份审查。对可能影响实际规则的点，使用联网检索核查官方来源；优先官方原文、正式通知和法规数据库。记录确切 URL、文号、日期、条款与适用范围。
3. 检查正文中的政策陈述是否有来源支撑、是否现行、是否适用于相应学生/教师身份、学段和批次。若证据不可访问或学校授权未确认，记录精确缺口并继续；不得把这作为停止交付的理由。
4. 对本批次模板之间做边界/重复/术语/角色/结果字段交叉检查；利用 `00_模板清单_128.tsv` 标注可能的跨领域邻接模板 ID，但不必替未分配的模板做完整审查。
5. 不得虚构校级制度、批准权限、阈值、表单、系统入口、流程或已实现的技术能力。把“政策证据不全”与“模板设计质量差”分开记录。
6. 对 P0/P1 问题必须给出可执行修订建议；若能在不猜测政策/权限的前提下安全修正，提供完整修订版 Markdown。需要学校解释或授权的部分，不得猜测补齐；可保留保守的人工复核门禁。
7. 不重写所有模板，不改 `template_id`、正式业务名称或既定业务边界。原始文件只读，不覆盖。修订稿单独放 `patches/`。

## 必须交付的文件

请把以下内容打包为 `CDUT-R02-QA-T07-A.zip`，并在最终回复提供下载链接：

1. `AUDIT-T07-A.md`：批次摘要；每份模板的质量结论、政策证据状态、P0–P3 数量；逐条问题及证据；同领域/跨领域冲突；建议优先级。每份模板都必须有独立结论。
2. `ISSUES-T07-A.tsv`：机器可读问题清单，列名固定为：`issue_id, template_id, severity, category, location_or_section, finding, evidence_or_source, required_action, policy_or_quality, cross_template_related_ids, patch_status`。无问题时保留表头并写明零问题。
3. `STATUS-T07-A.tsv`：每个本批次模板一行，列名：`template_id, name, quality_status, policy_evidence_status, p0_count, p1_count, p2_count, p3_count, requires_patch, short_conclusion`。
4. `patches/`：仅放有明确、低歧义修正的完整 Markdown 修订稿，规范文件名保持原文件名；若没有可安全修订项，写 `patches/NO_PATCHES.md` 解释原因。
5. `README.md`：交付清单、研究日期、来源范围、限制及修订稿与原件的关系。

## 状态规则

- `quality_status` 只能是 `PASS`、`PASS_WITH_WARNINGS`、`REVISE`。
- `policy_evidence_status` 只能是 `VERIFIED`、`PARTIAL`、`UNCONFIRMED`。
- **禁止 `BLOCKED`**。学校授权待确认时，继续完成质量审查，并确保未经确认的最终决定由有权人员人工作出。
- 严重级别按统一标准：P0 安全关键；P1 重大；P2 中等；P3 轻微。

## 完成标准

每份模板都被实际检查；问题有定位、有依据、有修复动作；官方来源可追踪；未核事实没有被包装成确定规则；批次文件可供总集成会话直接合并。不能只回复“已审阅”或只给一份概述。


---

# 强制追加：本批必须完成 V3 实现并提交仓库（优先级高于“只交审查报告”的旧表述）

你本批负责的 4 份模板：`T07-T01;T07-T02;T07-T03;T07-T04`。**审查后直接实施，不要只输出问题报告或 patches。** 本批原件必须按上方已展开的 GitHub 路径自行读取；ZIP 只作可选交叉校验，不得要求用户上传。

## A. 先取回统一实现契约
1. 读取 GitHub 当前分支中的 `docs/design/review-agent/business-templates/R02/dispatch/00_V3实现与提交契约.md` 与 `docs/design/review-agent/business-templates/R02/dispatch/00_集成分工与文件所有权.md`。
2. 读取仓库当前集成分支最新 HEAD 中的 `docs/design/review-agent/R02-V3-IMPLEMENTATION-CONTRACT-20261023.md`。不要依赖固定历史 SHA；以当前分支实际读取到的文件为准。
3. 如 GitHub 连接可用，直接在仓库分支上工作；不得把“无法读取旧会话记忆”当阻塞。

## B. 必须提交的代码与文档
对每个模板 `T07-T01` 等本批所有 ID，逐项生成：
- 审阅后源 Markdown：`docs/design/review-agent/business-templates/R02/{TEMPLATE_ID}.md`。把本 ZIP 的原稿复制进去；仅修复有来源支持、低歧义的缺陷。
- V3 运行时定义：`apps/electron/src/main/lib/review/r02-template-catalog/definitions/{TEMPLATE_ID}.ts`，导出类型化 `TemplateVersion` 和 `r02Metadata`。metadata 至少包含 ID/名称、源文档路径、源文档 SHA-256、`officialSchoolTemplate:false`、研究/政策证据状态、每个 criterion 对应的 SRC IDs 与 evidence status。
- 批次专项测试：`apps/electron/src/main/lib/review/r02-template-catalog/definitions/T07-A.test.ts`。
- 审查报告：`docs/design/review-agent/business-templates/R02/audits/T07-A.md`。
- 问题台账：`docs/design/review-agent/business-templates/R02/audits/T07-A.tsv`。

## C. Runtime 数据规则
- 保留 `templateId` 和正式 `name`，`schemaVersion:2`，`catalogKind:'builtin'`，`status:'draft'`（由集成 Owner 统一注册/本地发布），`policyVersionIds:[]`，不要伪造政策版本。
- `sourceNote` 必须以 `R02_RESEARCH_TEMPLATE_NONOFFICIAL:` 开头并说明非校方正式模板。模板 description 需包含“本地研究模板 · 非校方正式模板”。
- 所有模板 `autoPassPolicy: { enabled: false }`。最终阶段用通用本地 `reviewer`/`teacher` 角色；`workflowOwner:'local'`。不推断校方最终批准人，不生成学校远端回写。
- `fields`、`materialSlots`、`sections.criteria`、`stages`、`outputs` 必须来自本批 MD。每条 criterion 有稳定 ID、清晰 requirement、`execution:'semantic'|'manual'`；除非是完全不涉及校规的客观结构/算术校验且测试证明安全，不得使用 deterministic。未知政策条件必须保持待确认/人工复核。
- `r02Metadata.criteria` 逐项映射 sectionId/criterionId/SRC IDs/证据状态；研究来源 SRC 不得伪装成案卷材料 `SourceRef`。
- 不允许只创建 Markdown 或仅生成死代码；runtime 模块必须符合现有 `TemplateVersion` 类型且通过 `validateTemplate`。

## D. 文件所有权红线
本批只新增上面列出的独占文件。**禁止修改**统一注册器、`builtin-templates.ts`、`template-store.ts`、`packages/shared` 类型、V3 Main/Case/Run/Batch/Decision/Outbox 服务、IPC、preload、renderer、README/AGENTS。共享接线由唯一集成 Owner 完成；发现核心问题写进报告并给出精确复现，不要自行改共享文件。

## E. 测试
至少在本批测试中验证：每个 ID/名称正确且唯一；字段/材料槽/分项/criterion 引用无悬空；阶段图无非法跳转；source metadata 完整；auto-pass 关闭；无伪造 PolicyVersion；政策未确认不会映射成自动正式通过。执行本批测试、`bun run typecheck`、`bun run check:boundaries`。不要每批跑全量 CI。若命令无法运行，记录实际命令和原始错误，不可谎报通过。

## F. 必须提交 GitHub 分支和 PR
- 目标仓库：`Fuck-GH-Admin/cdut-studio-review-agent`。
- 本批分支已预创建：`feat/v3-r02/templates-T07-A`（本批 `T07-A`）。直接在该分支提交；只有确认仓库中不存在此分支时才从 `feat/v3-r02-template-library` 新建。
- 把上述文件作为代码提交到该分支；PR base 必须是 `feat/v3-r02-template-library`，不要直接提交/合并 main。
- PR 标题：`feat(review-v3): implement R02 templates T07-A`。PR 描述必须列出模板 ID、修正摘要、测试真实结果、剩余政策证据缺口。
- 最终回复必须给出分支名、commit SHA、PR URL、审查/测试结论。ZIP 交付只是备份，不能代替仓库 PR。

## G. 学校授权不阻塞
任何学校授权/当前制度待确认都不是停止工作的理由。继续完成审查、模板数据定义、测试和 PR；只把相关规则标为部分/未确认，并保证该规则不能自动产生正式通过/拒绝。
