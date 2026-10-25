# T08 / F16 Main 报告闭环｜阶段性进度 R03
日期：2026-10-24（阶段检查）
仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
分支：`fix/v3-t08-f16-main-report-contract-20261024`
审查基线 SHA：`5c35e77c14c20627c36df966bd410fb3a194fc2b`
PR：#250（Draft，尚未合并；基线 `feat/v3-r02-template-library`）

## 一、口径与已落地事实

本文件是持续更新的工程进度账，不取代源码与测试证据，也不将“能编译”写成“GUI 实机已验收”。

- **Main 唯一导出链**：移除了 `review-v2:export-report`、`exportReportV2`、`report-export-v2-service.ts`；旧 Agent/Renderer 调用方与原有路径安全/E2E 测试已经切换到 V3 T08/F16 入口。其他仍为案卷业务服务的 V2 API/数据不在本次清理范围，不能粗暴删除。
- **单一业务报告投影**：T08 纯报告逻辑迁到 `packages/shared/src/review/t08-report.ts`；Main 读取 case/run/template/decisions 后执行 student/reviewer/organizer 受众投影，Renderer 报告组件不再自行按 Aggregate 拼装可交付正文。
- **快照版本/审计合同**：按 Run inputHash、模板 id/version/digest、决定摘要、生成时案卷 revision、受众和正文计算预览摘要；导出前重新比对，生成唯一 ReportSnapshot，保留完整性哈希，支持只读归档重开和历史重导出。
- **格式**：MD、JSON、HTML、XLSX、文本 PDF（Electron printToPDF）、ZIP 交接包共享受众报告；保存回执区分 saved/cancelled；学生版不输出内部字段/输入清单/检查原因或模型原文。
- **历史修正**：尚未归档的旧 Run 不再把后续决定、人工处置、认定、补件与当前标题冒充为历史事实；已有快照按快照原文重开。
- **现有局限**：SHA-256 只提供本地内容一致性，不能证明学校签名与发送者身份；本机 local reviewer / 被指派 agent 的报告生成，不等于正式学校审批。原生 GUI 操作、PDF 实际搜索与冷启动重开尚未验收。

## 二、CI / 验收证据（冻结到本次检查）

| 对象 | 执行结果 | 链接 / 说明 |
|---|---|---|
| 5c35e77 Review Baseline CI | PASS | Actions #40045915706 |
| 5c35e77 Review batch focused | PASS | Actions #40045915769 |
| 5c35e77 D2 Scoped Pi | PASS | Actions #40045915759 |
| 5c35e77 PR CI 类型检查 | PASS | Actions #40045915781 内 Typecheck workspace |
| 5c35e77 PR CI 主/预载/渲染构建 | PASS | Actions #40045915781 内 Build |
| 5c35e77 PR CI 全量测试 | **BLOCKED / RUNNER_CRASH** | Bun v1.4.2 `bun test --isolate --timeout 30000`，在 `remote-service-send-message.test.ts` 后触发 Bun Segmentation fault 0x28，退出码 139；没有基于日志把它判定为断言失败或功能通过 |
| T08/F16 定向投影、归档、导出测试 | 待独立证明 | 当前 PR 的全量测试因运行器崩溃没有完成整个套件 |
| T08/F16 真机 Electron 用户旅程 | NOT_RUN_GUI | 未验证原生保存对话框、PDF 可搜索性、重启后历史归档 UI |

CI 页面：`https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40045915781`。

## 三、下一实施批次（按优先级）

1. **隔离 CI 运行器故障**：针对 T08/F16 定向测试提供独立执行证据，明确报告代码是 PASS 还是 FAIL；不要通过静默跳过既有全量测试伪造绿灯。
2. **修强约束与回归**：检查历史 Run 的数据冻结边界；加学生公开版泄漏/公式注入/归档篡改/取消保存/异步失败/无报告选择等有意义的反例。
3. **落盘语义**：归档 snapshot/report.md/report.json/delivery 的一致性、目录存在和符号链接安全；避免“写出一半却显示可用”。
4. **最终合同与验收**：在源代码证据确认后更新 T08-F16-MAIN-REPORT-CONTRACT-R02 和此进度账；CI、GUI、外部学校接口分别陈述。

## 四、未宣称完成

- **PR 未合并**，当前 main / 集成基线并没有因此自动获得这些修复。
- 没有真实 GUI 或学校环境测试证据，不标 JOURNEY_VERIFIED。
- 不扩大任务去重写旧案卷状态存储、F13 学校身份或无关业务模板。

## 五、继续实施与最新验收（2026-10-24）

代码提交：`4d35f38f15ae45d5e5d314cc068a74207e5d58ea`。本节是前面阶段检查的增量，不覆盖旧 CI 原始失败证据。

**本轮已完成代码改动：**

1. T08 申请人版对决定内部理由、未经批准的最终分值、补件内部原因和申诉复核私密文字实行默认不公开；仍保留状态和申请人需要补交的项目。添加申请人/审核人双受众反例。
2. Main 归档新文件使用同目录临时文件和原子 `linkSync` 创建，拒绝已存在文件；报告快照或 MD/JSON 基线被修改时，归档索引及重开验证失败。
3. F16 外部保存禁止覆盖**任意案卷**或报告归档，包括 symlink 指向的数据；正常另存为采取临时文件再重命名，保存失败不截断旧文件，内部不可变快照仍可重开。
4. PR CI 增加 T08/F16 定向测试，紧随构建执行，**保留**原来的全量回归，不通过删测试掩盖 Bun 崩溃。

**实际 CI 证据（同一代码 SHA）：**

| 检查 | 结果 | Actions |
|---|---|---|
| Review Baseline CI | PASS | [40051469934](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40051469934) |
| Review batch focused tests | PASS | [40051469964](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40051469964) |
| D2 Scoped Pi Review Tests | PASS | [40051469919](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40051469919) |
| PR CI：类型、边界、三端构建 | PASS | [40051469937](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40051469937) |
| PR CI：独立 T08/F16 定向合同测试 | PASS | 同一 PR CI，独立绿色步骤 |
| PR CI：`bun test --isolate --timeout 30000` 全量测试 | PASS | 同一 PR CI，全量回归绿色 |

早期 `5c35e77` 曾因 Bun 1.4.2 运行器自身崩溃（exit 139）导致 PR CI 失败；最新 `4d35f38f` 的报告专用与全量 CI **均已实际通过**，因此不能继续把早期崩溃当作当前失败，也不能删掉历史原因。

**当前工程判定：PR_CI_PASS / WIRED，未合并。** 尚缺真实 Electron GUI 选择 Run / 受众 / 导出、原生保存的取消与覆盖、PDF 实际可搜索性、重启后界面重开和跨平台样本；保持 `NOT_RUN_GUI`，不得宣称 `JOURNEY_VERIFIED`。校方正式身份、审批和外部收件回执不在本次修复范围。
