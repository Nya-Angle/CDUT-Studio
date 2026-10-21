# V3 M4 本地 Agent 最终回执（Local-L）

**依据**：`LOCAL-AGENT-M4-FINAL-CLOSEOUT-R02`（`53f7d5702`）+ `TEMPLATE-ASSET-AND-FALLBACK-RESEARCH`（`71f9ae0e8`）
**台账**：`L3-DELIVERY-LEDGER.md`（唯一验收总账，本文为结构回执）

---

## 1. 来源与合并

```text
SOURCE:  PR #206 HEAD = b0d3c3f69b089c1e673c4003c08c2f499a631bc8（与分支头一致）
BASE:    main-before = 5ca7ceead640650b39326085d918bc746144f7cf
         merge       = 9132e9abd（独立 merge commit，可回滚点）
         rollback    = 5ca7ceead
SCALE:   129 文件 / +6884 −720
CONFLICT: 0 处文本冲突
```

未重复接收 #188–#205 的 18 个子 PR；#186/#187 仅文档，未混入功能合并。

**零冲突不等于合并正确，已逐项核对**：8 个关键通道（`T05_STAGE_CAPABILITY`、
`T05_RECORD_STAGE_DECISION`、`T06_PICK_PHYSICAL_SOURCE`、`T09_ISSUE_STUDENT`、
`T01_MODEL_DRAFT`、`T07_GET_VIEW`、`TEMPLATE_RULE_RUN_V3`、`T02_STAGED_INVENTORY_V3`）
在 IPC / Preload / Shared 三层齐备；7 个既有桥接文件
（t05 / t06 / t09 / t07 / t01-model-draft / template-plan-bridge / template-run）全部保留。

## 2. CI 与门禁（在新 merge SHA 上重跑，不沿用旧绿灯）

| 门禁 | 命令 | 结果 |
|---|---|---|
| 类型检查 | `cd apps/electron && bun run typecheck` | **PASS** |
| 架构边界 | `bun run check:boundaries` | **PASS**（无边界违规） |
| 主进程构建 | `bun run build:main` | **PASS** |
| Preload 构建 | `bun run build:preload` | **PASS** |
| 渲染构建 | `bun run build:renderer` | **PASS**（1m10s） |
| 全量测试 | `bun test --isolate` | **5004 pass / 0 fail / 5 skip**（597 文件） |

## 3. A15 状态

| Gate | 状态 | 证据 |
|---|---|---|
| S1 | **PASS** | 模板发布/重开一致/复用建案；`objectType=organization`、6 字段、材料槽、初审→终审、无学年 |
| S2 | **PASS** | 四案例真机：18→`compliant`、21→`non-compliant`、人数未知→`awaiting-confirmation`、缺计划书→`awaiting-supplement`；四 Run 冻结各自不同 `planFingerprint` |
| S3-01 | **PASS** | 补件两轮：`insufficient`（1 份）→ `satisfied`（2 份，新 `doc-2-*`）→ 新 Run；旧 Run 状态不变 |
| S3-02 | **PASS** | 真实 Run 绑定初审 `finality=stage` → teacher 终审 `finality=final`；reviewer 冒充终审被 `T05_ACTOR_NOT_ASSIGNED_TO_STAGE` 拒绝 |
| **S4** | **PARTIAL / BLOCKED_ENV** | 六段中五段 PASS（建案、规则检查、阶段决定、报告导出、冷重启），**仅「OS 文件选择器导入原件」一段无法自动化** |

**S4 第 2 段的完整尝试**（四种方式均失败，`documents` 恒为 0）：
CDP `Input.dispatchDragEvent`（`webUtils.getPathForFile` 拿不到真实路径）、
headless xvfb（无窗口管理器）、真机 `:0` + mutter 逐窗口 `windowactivate`+`key/type --window`、
真机 `:0` 依赖模态焦点直接输入。

**已定位的根因**：Electron 在 Linux 上的原生 `dialog.showOpenDialog` 是独立 GTK4 窗口
（`xwininfo` 抓到 `"Open Files" ("electron" "Electron")`），xdotool 事件无法投递到其输入焦点；
且**对话框打开期间 `Runtime.evaluate` 永不返回**，因此不能用轮询等待。
按任务书要求**未伪造 GUI 通过**。

**人工验收素材已备**：`work/e2e/manual-kit/`（4 份真实 DOCX + `env.sh` + `README-A15-S4.md`，
含 6 步验证清单与 21 人反例）。

## 4. 模板体系（四类对象严格分开）

| 对象 | 结论 |
|---|---|
| **50 套 D4 G01–G08** | `catalog.json` **50 条**、50 条均带 `workspaceGitBlobSha`；逐套挂载**非零技术计划**通过（`review-v3-d4-catalog-attach.test.ts`）。资产未缩减。`candidate-held` / `publicationAllowed=false` 未改动。**学校正式发布 = NOT_AUTHORIZED** |
| **COMMON-01/02** | `review-d4-common.ts:compileD4Generic` 保留并有测试。**是通用编译能力，不是「任意材料可直接审核」的固定模板** |
| **第 51 套候选** | UI 可达：`prepareLocalNativeUnmatchedV3` → `freezeLocalCandidateAuthorV3` → `attachB1TechnicalPlanV3`。产物 `candidate-held`，**不是已发布业务模板**，按 D2 不能形成正式业务决定 |
| **公共兜底** | **WIRED（本轮补齐）**：新增 `fallbackDraftFromB1`（B1 作者文档 → `TemplateVersion(draft)`，`policyVersionIds`/`policyRefs` 一律为空、判据强制 `semantic`、不生成确定性约束）+ IPC `FALLBACK_TEMPLATE_DRAFT_V3` + 候选工作台「转为可编辑业务模板草稿」按钮。**整链 Main 层已实证**：草稿 → `saveDraft` → `publishTemplate` → `createCaseFromTemplate` → 真实 `ReviewRunV2`；兜底判据全部停在 `awaiting-confirmation`（「该规则不是确定性执行类型」），**既不判 compliant 也不算执行失败** |
| **六套完整业务示例** | `T01_STANDARD_EXAMPLES` = student / activity / scholarship / judging / expense / agreement，打包与表单校验测试通过。**未逐一跑真实业务 Run**，不据此推断六类业务全通过 |

## 5. F01–F18 状态

判定口径：`PASS_SCOPED`（代码+定向测试）/ `WIRED`（有真实入口+Main 接通）/
`JOURNEY_VERIFIED`（真机完整路径）/ `BLOCKED_EXTERNAL` / `NOT_RUN`。

| F | 功能 | 状态 |
|---|---|---|
| F01 | 首次使用引导与就绪 | PASS_SCOPED / WIRED |
| F02 | 模板作者与负责人签认 | PASS_SCOPED / WIRED（A15 S2 真机使用） |
| F03 | 政策/来源冲突解析 | PASS_SCOPED（Main 内部消费者 `effective-rules.ts`，冲突以 pending 检查呈现） |
| F04 | 原件接入与栅格完整性 | PASS_SCOPED |
| F05 | 图像/OCR 事实提取 | PASS_SCOPED（OCR 依赖外部引擎，缺资源只能 partial） |
| F06 | 证据归属工作台 | PASS_SCOPED / WIRED |
| F07 | 冻结绑定覆盖与 0-check 阻断 | **真机门禁已验证**（21 人拒 stage-pass） |
| F08 | 数值上下限算子 | **真机 18/21 验证**；`gte` 下限算子仍缺（CONTRACT_GAP） |
| F09 | 运行生命周期与增量恢复 | PASS_SCOPED |
| F10 | 事实确认与来源导航 | PASS_SCOPED / WIRED |
| F11 | 可信业务阶段 | **JOURNEY_VERIFIED**（S3-02） |
| F12 | 补件周期 | **JOURNEY_VERIFIED**（S3-01） |
| F13 | 申诉、撤回与独立复审 | PASS_SCOPED；正式申诉改判需 teacher，本地无此身份（设计边界） |
| F14 | 批次工作清单 | PASS_SCOPED / WIRED |
| F15 | 独立评委、回避、排名、定稿 | **JOURNEY_VERIFIED**（双评委→排名→定稿→冷重启）；本轮修正：轮次改由 Main 从已发布模板派生 |
| F16 | 报告格式与投递 | PASS_SCOPED / WIRED |
| F17 | 助手建议与来源落地 | PASS_SCOPED |
| F18 | 离线往返与 SchoolPort | PASS_SCOPED / WIRED；**学校正式联调 S01–S03 = BLOCKED_EXTERNAL** |

## 6. 稳定性与易用性

**三层防护**：

| 层面 | 状态 |
|---|---|
| 渲染白屏 | 审核视图由 `CdutZoneErrorBoundary` 包裹，子模块崩溃只降级该区域 |
| 发射后不管的 IPC | 全仓扫描 `void window.reviewAPI.*`，**0 处缺 `.catch`** |
| 主进程 | **本轮新增 `lib/process-guards.ts`**：`unhandledRejection`/`uncaughtException` 一律记录且**不终止进程**；按类型+消息指纹节流；条目上限 50 |

**易用性小修**（不改设计、不放宽门禁）：非法合规理由不再打印内部 `checkId`；
单材料槽自动选中；无案卷时建案区默认展开；新增 `review-error-text.ts` 把 12 类技术错误
翻译成可执行中文（原始错误仍写 console，未识别错误原样透出）。

## 7. 未完成项与发布建议

**BLOCKED_ENV**：A15-S4 的 OS 文件选择器导入段。需要在能操作原生对话框的桌面会话人工完成一次
（素材与步骤见 `work/e2e/manual-kit/`）。

**CONTRACT_GAP**（交回 T01/T04 Owner）：
1. `gte` 下限算子在 T04 尚无实现，当前判 unresolved，不冒充上限规则；
2. `B1AuthorDocument → TemplateVersion` 的**正式语义映射**（哪些字段/阶段/材料槽应如何转换）
   仍属领域定义，本轮只做了保守脚手架（全语义、无政策、无确定性约束）。

**NOT_RUN**（重负载与发版项，不代表失败）：
100 案 / 500 文件批量极限、安装包与无开发依赖启动、评委独立工作副本、
全部导出格式、跨平台样本。

**BLOCKED_EXTERNAL**：真实校方身份、政策批准、校园 API（本地可用模拟角色完成业务闭环，
但**不标为学校接入已完成**）。测试账号仅用于联调，不写入仓库。

**发布建议**：
- 代码层面可进入集成收尾（`INTEGRATED`），但**不建议宣布 PRODUCT_ACCEPTED**——
  A15-S4 仍 PARTIAL，F 项多数只有单测没有真机旅程；
- 若要发版，需另做：统一版本号与 `CHANGELOG` 对齐、Windows/Linux 安装包与无开发依赖启动验证、
  包内资源与回滚确认，当前状态为 `RELEASE_NOT_RUN`。

## 8. 结论

```text
DECISION: INTEGRATED —— 代码已统一收口；A15 未全通过；RELEASE_NOT_RUN
```

**一句话**：F01–F18 的代码与四类模板资产已在 main 上干净合并并通过全部门禁；
A15 的确定性规则链、补件两轮与两段业务决定均已真机通过；
唯一缺口是 headless 环境无法自动操作原生文件对话框，该段已备好人工验收材料。
