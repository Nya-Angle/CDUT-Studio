# V3 M4 F16｜报告格式与只读交接包交付回执 R01

- Owner：F16；协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`。
- 固定共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`。
- 交付分支：`feat/v3-m4-f16-report-formats`；独立 Draft PR，**NO MERGE**。
- 验收范围：A13/F16，只读 Renderer T08 业务报告与交付序列化；不更改 Case/Run/Batch/Decision writer，不代替 F18 离线回件。

## 用户能做什么

1. 在现有 V3 T08 报告面板选定某个真实 Run 和受众，下载 MD、JSON、可打印 HTML、含概览/检查/原件/事项/补件的 XLSX，以及现有中文图片页 PDF。
2. 下载 `*-delivery.zip`，其中包含上述五份报告、`manifest.json` 和 `README.txt`。清单记录 caseId、runId、输入哈希、模板版本、受众、运行状态、历史标识、时间及每个文件 SHA-256。仅校验文件内容一致性，**不是签名、学校审批或外部收讫回执**。不打包原件本体。
3. 学生/申请人投影只公开模板明确标注 public 的当前事项字段，不包含内部检查理由、来源摘录、模型诊断、全量输入清单、内部政策文件名；未知字段默认不公开。审核人和组织者的内部报告保留核对信息。历史 Run 不把当前未冻结的事项/补件混入旧报告。
4. 电子表格中的用户原文按文本写入，类似公式的前缀主动中和，防止交接时被表格软件当成公式执行。

## 已执行的定向检查

- `bun test .../review-v3-t08-case-report.test.ts .../review-v3-t08-pdf.test.ts .../review-v3-f16-report-delivery.test.ts`：10 PASS / 0 FAIL；包括真实 ZIP 解压、SHA-256 比对、XLSX 读取、学生投影、历史 Run、非法文件名和公式输入。
- `tsc --noEmit --project /tmp/cdut-f16-typecheck.json`（选取 F16 变更模块并包含真实 Preload 声明）：PASS。
- 仓库规定的 `bun run --filter='@profer/electron' typecheck` 已启动，但本执行环境以 SIGKILL/exit 137 终止，**不能列为通过**。
- 未运行 Electron GUI 文件保存/重新打开、跨平台安装和 A13 全程验收；标记 `NOT_RUN`。

## 需要 Local Main Owner 接线/裁决的合同请求

**F16-CR-01｜可信受众报告快照。** 现有 T08 仍由 Renderer 从全量聚合和 Run 生成受众投影，并允许 UI 切换受众；这个筛选不能代替可信角色权限。建议 Main 提供从指定 caseId、runId、audience 读取的受控 `ReportSnapshot`，校验真实 actor 权限与 Run/模板/决策版本，输出已脱敏的只读快照/拒绝原因。F16 的导出器接收该投影即可，无需另建状态真值或让 F16 修改共享 IPC/DTO。

**F16-CR-02｜直接生成可检索 PDF。** 当前直接 PDF 是 A4 图片页，不可选择/检索文字；本交付仍附带可打印 HTML，可由用户打印为文字 PDF。目标是由 Main 在受控、无远端资源的 HTML 上调用 Electron `printToPDF`，并通过既有文件保存选择器返回准确的保存回执。此项属于 Main/IPC 桥接；本分支不越权改 `review-ipc.ts` 或 Preload。

此外，`AGENTS.md` 规定功能更改后 README 与 AGENTS 文档需要用户同意才能修改，因此本分支未擅自改这两份仓库级文件；请在集成时申请并同步项目总体状态。包版本 patch 已按仓库规则推进，集成时与其他 F 分支统一处理版本号冲突。

**范围结论：** `CODED` / `PASS_SCOPED`，完整 `A13` 与可信受众交付仍为 `CONTRACT_BLOCKED`、`NOT_RUN_GUI`，不申报 USER_JOURNEY_ACCEPTED。
