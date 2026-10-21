# Review V3 实机闭环验收记录（2026-10-20）

**基线**：`main` @ `8b72b4415`（含本轮 4 个修复提交）
**环境**：Linux / Electron 43.7.7 / xvfb 虚拟屏 1600×1000×24 / Bun 1.4.0
**渠道**：第三方赞助测试渠道（OpenAI 兼容中转，地址不公开），模型 `minimax-m3`（真实 Provider，非 mock）
**材料**：`work/e2e/materials/evidence.pdf`（6 页真实 PDF，含文本层）、`evidence.docx`（合法 OOXML，含标题与表格），均为合成数据

## handoff §4 逐步结果

| 步 | 内容 | 结果 | 真实证据 |
|---|---|---|---|
| 1 | 原生案卷创建与重新打开 | **PASS** | `createCase` → 回执 `CreateNativeWorkspaceCaseV3`；`getAggregateV2` 重开后 stage/revision 一致 |
| 2 | 真实 PDF / DOCX 选取导入（点击选择） | **PASS** | PDF 391~413ms `parsed`；DOCX 80~82ms `partial`（结构解析正常，图片块受限） |
| 2b | 拖拽通道（`registerMaterialPathV2`） | **PASS（IPC 层）** | 拖放后路径登记 → `doc-1-…` → `parsed` → 回执 `RegisterMaterial`。与 `MaterialDropZone.onDrop` 完全同一条通道。<br>**未覆盖**：OS 级拖放事件命中 DOM 的端到端验证——`webUtils.getPathForFile` 只认真实拖放携带的文件句柄，CDP 合成的 DragEvent 无法提供；且审核专区 UI 需先导航并选中案卷才挂载拖拽区，该导航在自动化下不稳定。属测试夹具限制，非产品缺陷 |
| 3 | D4 50 套 + 对象与 Plan 固定 | **PASS** | `listD4Templates` **50/50** 且 **50/50 带非空 targets**，636ms；`attachD4TechnicalPlanV3` → **checks=60**，fingerprint `71bfc0d6b9faadabc27392f8b0e558a099fd725c10d5e1a631e2cbfaef6ccf3b`，`verifyD2InstalledPlan` 无错 |
| 4 | 真实 Provider → Pi → 持久 Run/Check | **PASS** | 多次运行均产生真实判定，**无 `execution-failed`**。最佳一次（干净 main 复验）：`completed`，**60/60 检查完成**，`effectiveVerdicts=2`（2 项不合规）、`pendingChecks=58`；覆盖记录 `doc-1: read`、`doc-2: partially-read（9/9 块，解析状态 partial 故不能确认全文）`；耗时 901s |
| 5 | 人工复核 + MD 导出 | **PASS（决定被正确拒绝）** | `exportReportV2` 产出 **42KB / 263 行** MD，含真实运行状态、输入哈希、覆盖统计、逐项规则结论；`decideWorkspaceCaseV2` 被 `AGENT_DECISION_DISABLED` 拒绝——D2 技术预审**不得**形成校方正式决定，符合「不伪造校方审批」红线 |
| 6 | 冷重启恢复 | **PASS** | 两次独立进程：`phase-prepare` 建案卷+材料+Plan → `phase-verify`（新进程）读回：案卷在列、2 份材料在、**60 项 Plan 与同一 fingerprint 恢复**、回执链 `CreateNativeWorkspaceCaseV3 → RegisterMaterial ×2 → AttachD2TechnicalReviewPlan` 完整、revision=3 |
| 7 | B1 第 51 套自定义模板 | **PASS** | `saveLocalCandidateAuthorV3` revision=1 → `readCurrentAuthorRevisionV3` 读回 `candidate-held` → `previewLocalCandidateAuthorV3` fingerprint `44b7ef2a…` → `freezeLocalCandidateAuthorV3` 同指纹 → `attachB1TechnicalPlanV3` **checks=1** → 真实 PDF 材料导入 `parsed` |

## 本轮修复（已合入 main）

| 提交 | 修复 |
|---|---|
| `91d3ad46a` | 恢复 G01-I `fixtures/selections.json` 冻结资产；D4 候选缺件逐条隔离，不再一缺件炸掉整个 50 套目录 |
| `cb8b7a7fd` / `642ebd370` | 真实 PDF 导入 30 秒卡死：根因是逐页截图反复整份栅格化（单页实测 35s），改为只渲染目标页 + 首帧失败即停 + 24 页上限降级 partial。**35s → 0.2~0.4s** |
| `379e25ef9` | 合并上游 CDUT Science 更新（62 文件冲突），保留全部审核 V3 与 CDUT 专区业务 |
| `d62092ecc` | 审核轮次无进展看门狗：请求级首字节 + 整轮级无进展，命中落 `failed` 带中文原因，杜绝 run 无限 `running`；`review_*` 工具不再记为 `external_or_unknown` |
| `8b72b4415` | 真实 Electron E2E 驱动（CDP，零新增依赖），覆盖上述全部步骤 |

## 看门狗实测

**触发实测**（`PROFER_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS=15000`，AMD Radeon / GLM-5.3-Flash，
`run-pi-mvh1snzx-bq89c`）：`phase=incomplete`、`run.status=**failed**`、耗时 23.3s，
`piReviewOutcome.error` 与 `run.error` 同时为
`模型请求 20 秒无任何数据返回（渠道：AMD Radeon，模型：GLM-5.3-Flash），本轮审核已中止。请检查该渠道连通性，或更换响应更快的模型后重新发起审核。`
（90s 阈值下同样触发并落 `failed`，`run-pi-mvgzbh47-bf47n`，耗时 96.8s。）
修复前同样条件下 run 会无限停在 `running`。

**对照实测（不误杀）**（默认阈值：首字节自动取 `min(240s, 传输层空闲超时-15s)=285s` / 整轮 20min）：
`run-pi-mvh06oqi-7bgob` 在真实慢渠道上 195.9s 正常跑完，`checks=60`，
日志只有 `已启用` 行、**没有任何命中行**。此前同渠道另一次 901s 的完整审核同样 `completed`。
结论：看门狗不会误杀真实的慢审核。

**过程中发现并修复的第二个缺陷**：看门狗首次触发时 `run.error` 只有 `执行出错`，
真实原因丢失。根因在 `agent-orchestrator.ts` 的「不可重试 TypedError 终态」分支：
它只置 `runEndedWithError` 而不传 `resultSubtype`/`resultErrors`，`createAgentRunOutcomeReporter`
于是只能回退到 `endReasonLabel`。已补 `resultSubtype: 'error_during_execution'` +
`resultErrors: [typedError.message]`，并加回归测试（`agent-run-outcome.test.ts`）。
同一函数内 `empty_output` 分支本就是正确写法，说明这是遗漏而非设计。

**过程中还修掉两个「看门狗看起来生效、实际没兜住」的缺口**：

1. **响应头被当成首字节**。`onResponse` 一到就 `markFirstByte`，而兼容网关（实测的 GLM
   自部署 vLLM）会先回响应头、再长时间不吐 token。结果首字节看门狗被提前满足，
   轮次又退化成无限 `running`（实测复现：90s 阈值下 run 停在 `running` 超过 5 分钟）。
   已改为：响应头只 `noteActivity`，真正的首字节只由内容类事件
   （`message_update` / `tool_execution_*`）标记；`message_start` 同样不算。
2. **失败原因没到界面**。`ReviewBackgroundPiRunState` 没有 `error` 字段，
   `getBackgroundPiReviewStateV2` 只回 `phase`，界面知道「没成功」但不知道「为什么」。
   已在 shared 类型补 `error?`，`summarizeBackgroundPiReviewState` 从 `run.error` 带出。

**原始日志**（本次留档，避免 E2E 清空配置根后证据丢失）：
`evidence-logs/watchdog-fired-with-error.txt`（触发 + 原因透出）、`evidence-logs/watchdog-fired-90s.txt`（90s 触发）、
`evidence-logs/watchdog-control-default.txt`（对照不误杀）、`evidence-logs/review-completed-901s.txt`（默认阈值下 901s 完整审核）。

**`partially-completed` 的归因**（`run-pi-mvgqvzt-xs4yg`）：`execution-failed` = 0，
实际分布为 `awaiting-confirmation 48 / not-applicable 9 / awaiting-supplement 3`。
诊断是「Pi 会话结束时未收到明确的完成提交」——模型 10 次 `review_submit_result` 全部
`finish` 缺省/False，写完总结就停了。这是**模型行为**（小模型不遵守「全部提交后必须 finish=true」），
不是看门狗误杀，也不是 JSON 解析失败；`finishPiReviewRunV2` 把它落成 `partially-completed` 是正确降级。

## 明确的边界（不得误读为已完成）

1. **学校正式授权未接入**。本记录全部是本地技术预审，`formalApproval: false`，`publication: candidate-held`。任何输出都不得冒充校方审批。
2. **D2 技术预审案卷不能形成正式业务决定**，这是设计约束（`AGENT_DECISION_DISABLED`），不是缺陷。
3. **DOCX 导入为 `partial`**：结构解析（标题/段落/表格单元格）正常，但图片块受上限约束，报告里如实标注「不能据此确认原件全文已读」。
4. **`observations` 为 0**：合成材料缺少可确认的学籍字段，模型未抽取事实属正确行为（而非失败）。因此人工复核的「确认」分支未在真实数据上触发，仅验证了命令通道可用与决定被拒。
5. **渠道延迟**：该赞助渠道首字节 5~20s 波动，一轮 60 项审核实测 10~15 分钟。生产环境应选稳定渠道，并依赖看门狗兜底。

## 复现方式

```bash
cd apps/electron && bun run dev:vite        # 渲染进程需 Vite（未打包固定走 localhost:5174）
source work/e2e/README.md 中的环境变量
xvfb-run -a node work/e2e/v3-e2e.mjs flow-full
```

详见 `work/e2e/README.md`。
