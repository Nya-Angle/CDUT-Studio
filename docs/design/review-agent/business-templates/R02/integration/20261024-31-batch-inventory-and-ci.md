# CDUT Review V3 R02｜31 批次收集与集成候选核查（2026-10-24）

> **性质：集成审计与候选代码快照，不是已发布模板库的验收通过证书。** 本文复核了 GitHub 31 条批次分支、28 个开放 PR、27 份 Library 中可访问的 QA ZIP，且将 28 PR 中的独占源码与审阅件合并至独立候选分支，未覆盖权威 `research-original/`，未修改主集成分支或 `main`。后续应在候选 PR 上执行联合 CI。

## 1. 冻结对账和实际产出
- 资料/基础集成分支：`feat/v3-r02-template-library`，检查时 HEAD `150acfe761cb7ad0424a2ca009fd57f12dbfddfd`。
- 集成候选分支：`feat/v3-r02-batch-integration-20261024`，代码汇集 HEAD `d9815e28a39cd19b012fb6f285b2f673853c935f`；四次不覆盖父提交的增量 Git tree 组合，来源为 28 个 PR 的精确 blob SHA。
- 按 Git Tree 实测：**115 份 `[ST]xx-Txx.ts` TemplateVersion 定义、115 份审阅业务 Markdown、28 个批次 `.test.ts`、72 个审计文件**，与基础分支既有 128 份原始研究 Markdown 并存；115 个业务 ID 全部唯一，均属于原 128 项清单。
- **尚无实现 PR 的 3 批，合计 13 个业务模板：** `T01-A` (T01-T01—T01-T05)、`T02-A` (T02-T01—T02-T04)、`S08-B` (S08-T07—S08-T10)。三个分支之前只含资料基线；Library 中虽然找到对应 QA ZIP，但 ZIP 均不含 TS 定义。
- 本地 QA ZIP 对账：27 个批次、共 110 条 STATUS 记录（`PASS_WITH_WARNINGS` 92；`REVISE` 18）；全部 27 个 ZIP CRC 正常，但 **0 个 ZIP 含 `.ts`**，它们是评审/补丁交接资料，不可当作完整 V3 代码包。未找到本地 QA ZIP：`S03-C`、`S08-A`、`T01-B`、`T08-A`，但这四批在远端有源码 PR。
- 28 个 PR 在各自**最新 head SHA** 上的 `PR CI` / `Review Baseline CI` / `D2 Scoped Pi Review Tests` 均为 SUCCESS。**这是批次级 CI；集成候选联合 CI 需单独核验，不得冒称已通过。**

## 2. 按批完整覆盖

| 批次 | 负责模板数 | 远端 PR | TS 定义已归集 | 批次 CI | 本地 QA 记录 |
|---|---:|---|---|---|---|
| S01-A | 4 | [#245](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/245) | YES | 3/3 SUCCESS | 4 WARN |
| S01-B | 3 | [#227](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/227) | YES | 3/3 SUCCESS | 3 WARN |
| S02-A | 5 | [#244](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/244) | YES | 3/3 SUCCESS | 5 WARN |
| S02-B | 5 | [#242](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/242) | YES | 3/3 SUCCESS | 4 WARN / 1 REVISE |
| S03-A | 5 | [#241](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/241) | YES | 3/3 SUCCESS | 5 WARN |
| S03-B | 4 | [#236](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/236) | YES | 3/3 SUCCESS | 4 WARN |
| S03-C | 4 | [#240](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/240) | YES | 3/3 SUCCESS | local ZIP missing |
| S04-A | 4 | [#243](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/243) | YES | 3/3 SUCCESS | 4 WARN |
| S04-B | 3 | [#233](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/233) | YES | 3/3 SUCCESS | 3 REVISE |
| S05-A | 3 | [#230](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/230) | YES | 3/3 SUCCESS | 3 WARN |
| S06-A | 3 | [#234](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/234) | YES | 3/3 SUCCESS | 3 WARN |
| S07-A | 4 | [#228](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/228) | YES | 3/3 SUCCESS | 3 WARN / 1 REVISE |
| S07-B | 4 | [#225](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/225) | YES | 3/3 SUCCESS | 4 WARN |
| S08-A | 5 | [#237](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/237) | YES | 3/3 SUCCESS | local ZIP missing |
| S08-B | 4 | — | NO | N/A | 4 WARN; no runtime PR |
| T01-A | 5 | — | NO | N/A | 5 WARN; no runtime PR |
| T01-B | 4 | [#223](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/223) | YES | 3/3 SUCCESS | local ZIP missing |
| T02-A | 4 | — | NO | N/A | 4 WARN; no runtime PR |
| T02-B | 4 | [#222](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/222) | YES | 3/3 SUCCESS | 4 WARN |
| T02-C | 4 | [#231](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/231) | YES | 3/3 SUCCESS | 4 REVISE |
| T02-D | 4 | [#229](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/229) | YES | 3/3 SUCCESS | 4 WARN |
| T03-A | 5 | [#224](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/224) | YES | 3/3 SUCCESS | 4 WARN / 1 REVISE |
| T03-B | 4 | [#219](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/219) | YES | 3/3 SUCCESS | 4 REVISE (4 P0) |
| T04-A | 5 | [#238](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/238) | YES | 3/3 SUCCESS | 5 WARN |
| T04-B | 4 | [#226](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/226) | YES | 3/3 SUCCESS | 4 REVISE (shared P1) |
| T05-A | 4 | [#218](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/218) | YES | 3/3 SUCCESS | 4 WARN |
| T05-B | 4 | [#232](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/232) | YES | 3/3 SUCCESS | 4 WARN |
| T06-A | 5 | [#221](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/221) | YES | 3/3 SUCCESS | 5 WARN |
| T07-A | 4 | [#220](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/220) | YES | 3/3 SUCCESS | 4 WARN |
| T07-B | 3 | [#235](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/235) | YES | 3/3 SUCCESS | 3 WARN |
| T08-A | 5 | [#239](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/239) | YES | 3/3 SUCCESS | local ZIP missing |

## 3. 需要保留的质量阻断点
- **T03-B（4 项 P0）**：涉密科研材料的合法处理环境、通道与预导入安全门禁，必须在文件选取、落盘、OCR/解析、模型调用前执行；批次内 criterion 只能产生后验检查，不能代替预收件门禁。该批 QA 全部 `REVISE`，严禁当成可接收涉密项目资料的功能。
- **T04-B（4 项共享 P1）**：基础 `template-store.ts:isCandidateDraft` 未识别 `R02_RESEARCH_TEMPLATE_NONOFFICIAL:` 前缀，经普通 `saveDraft` 可能进入 `regular-draft` 分类；必须在共享注册/发布服务强制候选身份与发布禁止测试，不得以源码注释当资格门禁。
- **S07-T02（P1）**：正式业务研究稿仍为 `ROUND1_DRAFT`，第 06—14 节实质材料/字段/规则不足；当前运行时只能作保守身份和材料路由，不得宣称具备完整授位资格审核。
- **T02-C（4 项 REVISE）**：政策批次、岗位/权限以及敏感健康材料处理基础未核实；存在无法由现有单链 `WorkflowStageSpec` 精确表达的多入口撤回/补件/复核分支。
- **S02-B（1 项 REVISE）、S04-B（3 项 REVISE）、S07-A（1 项 REVISE）、T03-A（1 项 REVISE）、T03-B（4 项 REVISE）、T04-B（4 项 REVISE）、T02-C（4 项 REVISE）** 合计 18；质量状态为 ZIP 审计时点结论，必须与最新 PR 的审计文件核对后复验，不能只凭单批 CI 变绿自动升级为 PASS。
- 标有 `PASS_WITH_WARNINGS` 且显示 P1 数量的部分记录包含已修订事项或尚须人工确认的事项，应逐条结合 `ISSUES` 的 `patch_status` 判断；不能仅从聚合数量推定已解决或未解决。

## 4. 还欠什么，什么不能声称
1. **13 项有研究源文档、缺真实 V3 TS 实现与单批 CI：** T01-A 5、T02-A 4、S08-B 4。其本地 ZIP 只能用于质量差异输入，不能当程序实现。
2. **另外 16 项正式研究原件缺失：** S01-T04；S05-T02、T03、T06、T07；S06-T03、T04、T06、T07、T08；S07-T09；S08-T02；T02-T08；T03-T08；T07-T07；T08-T06。它们不计入现有 128 项实现承诺，不得冒充已完成。
3. **共享 V3 接线仍缺：** 基础集成分支不存在 `r02-template-catalog/index.ts`、统一 registry/criterion→CanonicalPlan 桥以及 115 模板进入真实 Case/Plan/Run 的核验入口。候选分支目前仅汇集独占模板定义、审阅件与测试，不应当被 UI 当作可直接审批的完整模板库。
4. **发布权限/敏感材料门禁与人工决定：** 补齐研究草稿正式发布防护、涉密预收件阻断、政策有效性/SourceRef 证据分离、Main 可信身份和 Run 新鲜度门禁；联合 CI 后再进行合成材料端到端验证。

## 5. 使用与合并限制
- 候选 PR 应保持 **Draft**，以运行联合 CI 和暴露跨批次问题；未解决 P0/P1、未完成共同 Registry/Plan/Run 接线以前不可合并成可用生产模板库。
- 所有业务模板仍应为研究草稿（`autoPassPolicy.enabled=false`、不得伪造 `PolicyVersion` 或校方身份），政策证据不全不允许自动正式批准/拒绝。
- 独立批次 PR 保留，聚合提交引用所选 HEAD blob 内容但不取代各 PR 的完整提交历史。整合时跳过 T04-A PR 中已存在于基础分支的资料/清单文件，避免倒灌旧版权威原件。
- 当前的 `PASS_WITH_WARNINGS` 仅证明限定范围的研究预审准备度，不是学校授权或 V3 端到端成功。

## 6. 核验依据与复跑入口
- 31 批派发责任与 128 项清单：`docs/design/review-agent/business-templates/R02/dispatch/prompts/`、`00_模板清单_128.tsv`。
- 本地审计来源：`CDUT-R02-QA-{BATCH}.zip` 中 `STATUS-*.tsv`、`ISSUES-*.tsv`、`AUDIT-*.md`，共 27 个可获得的批次归档。
- GitHub 28 个原批次 PR：#218—#245；以本报告表内链接和当时 head SHA 对照。
- 集成验证命令：`bun run typecheck`、`bun run check:boundaries`、`bun test --isolate apps/electron/src/main/lib/review/r02-template-catalog/definitions/`，再在联合 CI 上做全量回归。
