# 54｜材料自动分类真正落案（2ab7f3aa3 基线）

日期：2026-10-25

实施分支：`feat/c-material-auto-apply-2ab-r01-20261025`
**唯一基线**：`2ab7f3aa32bd5481d85c8e457df2866afc16bcea`（不是早先的 `fix/c-pi-run-r01` 或 `feat/c-material-classification-r01-20261025`）。

## 1. 要解决的真实问题

`2ab7f3aa3` 已有本地材料归类器（角色词典 + 模板槽位 BM25）、复用 System Tesseract 的本地 OCR、审核模型网关兜底，却存在三段断口：

1. `MaterialClassificationSuggestions.tsx` 自动算出候选后**停在“应用建议”按钮**，无可靠的 C Main 自动写回。用户被迫逐项确认，且该组件自行调度 OCR/AI，容易与新后台方案重复请求。
2. `REGISTER_MATERIAL_PATH_V2` 在原生案卷上把 `attachment` 提前冒充成 `evidence`，导致未分类文件错误出现在“证明材料”。而 `2ab` 的 V2 账本和 V1 投影实际上允许未归类附件，并有独立 `attachment` 含义。
3. 模板选定之后，文件上传早于模板选择的场景没有自动重检槽位的机制。新的 `acceptedRoles`、`acceptedKinds`、批量人工改类和正式 Plan 冻结合同也不能被旧分支的实现绕过。

此次从上述 SHA **重新适配**；没有直接合并旧自动分类分支，也没有用旧的登记函数签名覆盖 `2ab` 新增的 `materialSlotId` / `replacesVersionIds` / `fileName` 入参。

## 2. 用户行为与实际执行顺序

**一页内完成：拖入 → 登记原件 → 后台自动分类 → 原栏位更新 → 初审。没有分类确认页/弹窗。**

- `ReviewV3QuickIntake` 通用入口不靠猜测文件名把材料直接标成申请件；全部先按真实 `attachment` 登记。未绑定槽位的 `MaterialDropZone` 点击/拖入也直接按附件登记，无需先选择材料槽。
- C Main 先使用**已有 `registerMaterial`** 落盘、解析、计算哈希、写 V2 案卷；未分类原件不会从 V2 列表消失。若本地规则已明确区分角色，立即发 `AutoClassifyNativeWorkspaceMaterialV3` 命令 CAS 写回。
- 本地无法确定时，仅在后台限并发 2 的队列中尝试现有 OCR（最多 3 页、沿用既有路径/字节安全检查）。仍不明确则在已有审核模型渠道上发起**一次短 JSON 分类**（最多约 2600 字摘录 + 当前模板前 20 个槽位，`maxTokens:160`，网络超时 4 秒）；**不启动 Pi，也不新建分类 Agent**。已有 OCR 结果直接作为模型输入，不重复 OCR。
- Main 收到机器候选后核对角色白名单和当前模板槽位：槽位名称存在不等于可用，还必须匹配 `reviewV3SlotAcceptsFile` 以及 `acceptedRoles`。槽位不可接受时仅写可判定的角色，不伪造槽位绑定。结果附机器来源 `local-rules/same-byte-confirmation/local-ocr/ai`、依据和时间。
- 案卷处于草稿且没有冻结 `canonicalPlan/d2RuntimePlan` 才能写入。每次 CAS 在提交时再次核**当前 documentId、versionId、模板 ID 与版本、active 状态和人工修改**；同案导入造成的 revision 冲突只重试有限次数。迟到请求不得覆盖替换件、手动纠错或新的模板。
- 模板变更后，C Main **串行重检**未分类附件及没有材料槽的机器分类；后续 OCR/AI 仍进入原来的限并发队列。既有人工改类和明确绑定不会被自动推翻。没有新槽且角色未变时不无意义地追加 revision。
- 成功自动分类会通过 `MATERIAL_AUTO_CLASSIFIED` 通知原来的单页审核视图，按**当前选中案卷**重读 C Main 权威数据；切换案卷不回跳。
- 所有用户仍可在既有单页通过拖动和改类纠错。人工改类写 `classificationCorrection`、撤掉当前 `automaticClassification`，但不可变 command receipt 保留机器历史。这里“自动分类”不是审核通过、人工确认、政策真实性或事实核验。

## 3. 为什么没有重复造 OCR / Pi

- 复用 `material-classification-ocr.ts` → `SystemTesseractOcrPort` 与 `recognizeDocumentImages`，不添加 npm 包或 OCR 服务。
- 复用 `material-classifier.ts` 的确定性词典和模板检索，以及 `material-classification-ai.ts` / `review-model-gateway.ts` 的单次模型调用；不另开 Pi/Run。
- 删除需要用户“应用建议”的 `MaterialClassificationSuggestions.tsx` 页面组件，并解除 CenterPanel 挂载，因此只有 Main 后台能够自动调度 OCR/AI；同名 suggestions-model 纯函数和原有测试作为算法回归保留，不再驱动网络或用户确认。
- 自动分拣限流、超时仅约束分类额外开销，**不会阻断上传操作等待远程 AI**。OCR 执行时间取决于本机 Tesseract，不能宣称所有材料 4 秒内一定归类；4 秒仅指模型网络调用预算。

## 4. 与 2ab 权限、模板、Plan 的关系

| 情形 | 行为 |
| --- | --- |
| 用户上传普通附件 | 落真实 `attachment`，本地高置信则自动转角色；难例后台 OCR/AI |
| 上传时明确指定角色/槽位 | 保留用户明确分类，系统不擅自覆盖；槽位仍走原校验 |
| 先上传，后绑定模板 | 重检没有槽位的机器分类与未分类附件 |
| OCR 引擎缺失、模型渠道未配置、请求失败 | 保留原件与 `attachment`；允许后续初审/手动改类，但不伪称已识别 |
| 并发改类、换版、人工拖动 | 版本栅栏阻止旧自动请求；人工修订优先 |
| 已经冻结 Plan、最终决定或归档 | 自动分类不继续写入；不突破 T05/D2/Run 权威 |
| 模型捏造槽位、格式/角色不符 | 槽位拒绝；绝不代替模板、校方政策或人工决定 |

## 5. 代码变更索引

- 新增 `main/lib/review/material-auto-classification.ts`：纯候选检查、槽位白名单、C Main CAS、后台队列、模板变更重检。
- 改 `main/lib/review/review-ipc.ts`：两种用户附件导入入口与模板绑定后的异步重检，按实际版本广播事件。
- 改 `main/lib/review/material-classification-ai.ts`：同一模型服务允许可信 Main OCR 摘录、精确版本、跳过重复 OCR、4 秒请求预算。
- 改 `main/lib/review/native-workspace-case-v3.ts`：人工纠错清除当前机器标记，保留旧历史。
- 改 `packages/shared/src/types/{review,review-v2}.ts`：自动分类元信息和事件契约。
- 改 `preload/index.ts`、`review-actions-controller.ts`、`use-review-actions.ts`：只读事件和当前案卷刷新。
- 改 `ReviewV3QuickIntake.tsx`、`MaterialDropZone.tsx`、`CenterPanel.tsx`：通用附件入口无需分类确认或强制选槽；移除旧建议组件。
- 版本补丁：`@profer/electron 0.15.169→0.15.170`、`@profer/shared 0.1.77→0.1.78`，未引入外部依赖。

## 6. 验收与边界

本分支包含 `material-auto-classification.test.ts`：真实原生案卷 + `registerMaterial` 入库、即时自动归类、机器回执、人工后置纠错、旧版本与模板拒绝、弱候选拒绝、模型槽位格式/角色白名单；同时回归原有 OCR、AI prompt/解析器、模板槽位初审测试。

验证命令：

```bash
bun test src/main/lib/review/material-auto-classification.test.ts src/main/lib/review/material-classification-ai.test.ts src/main/lib/review/material-classification-ocr.test.ts src/main/lib/review/native-case-material-slot.test.ts
bun run typecheck  # 在 packages/shared 和 apps/electron 分别执行
```

**实测边界**：上述测试能验证写案、类型和守卫，但不代表已在最终打包 Electron 上用真实多页中文扫描件及外部模型跑完整用户可见延迟。OCR 识别率与是否安装 `chi_sim`、模板的 classificationHints 完整度、网关网络波动仍需实机样本检验；这些不能用虚构成功率取代。

本分支独立于其它并行改动，暂不合入主干；合并时必须以 `2ab7f3aa3` 为 merge base 审核差异。`AGENTS.md`、`README.md` 按仓库维护边界未修改。
