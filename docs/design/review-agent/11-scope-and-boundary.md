# 团队工作边界说明（审核专区 AI Agent 接入线）

> 本文档划清我们在 CDUT-Studio 项目中**负责交付的内容**与**不属于我们范围的内容**，供协作方（Nya-Angle/CDUT-Studio 原作者与团队）对照。
> 分支：`fix/ci-gate-and-version-sync`。版本：electron 0.15.143。
>
> **本项目副本（公开）**：<https://github.com/Fuck-GH-Admin/cdut-studio-review-agent>
> —— 这是本次审核 Agent 工作的独立公开副本，**未改动、未推送到原项目 `Nya-Angle/CDUT-Studio`**。
> 上游项目为 AGPL-3.0 开源（本副本保持同一许可证）。

## 1. 我们负责的范围

### 1.1 审核专区 V2 的 AI Agent 接入（主线，全部已交付）

围绕「让通用 Agent 能受控操作审核案卷」这条线，我们做了从设计到真实验收的完整交付：

| 模块 | 位置 | 说明 |
|---|---|---|
| 可信指派 | `apps/electron/src/main/lib/review/review-agent-assignment.ts` | 显式指派的创建/五重校验/撤销/建案绑定；Agent 写权限的唯一来源 |
| Agent 工具门面 | `apps/electron/src/main/lib/adapters/pi-review-ops-tools.ts` | `review-ops` 能力组 14 个工具（查询/建案/登记/提交/运行/导出/决定类），realpath 路径防逃逸，摘要不回材料原文 |
| 异步运行服务 | `apps/electron/src/main/lib/review/run-async-service.ts` | `startReviewRunAsync`（runId 预分配+initiatedBy+同案去重+取消）与报告导出 `report-export-v2-service.ts`，从 IPC handler 抽成共享服务 |
| 决定门控 | `apps/electron/src/main/lib/review/stage-workflow.ts` | `assertAgentDecisionAllowed`：事务校验内对 agent 来源默认拒绝；C2 起接入代批开关 |
| 操作者身份 | `packages/shared/src/types/review-v2.ts` 等 | `ActorSource` 增 `'agent'`；`CommandReceipt.actor/assignmentId/sessionId`、`ReviewRunV2.initiatedBy` 同事务落盘 |
| 重启恢复 | `apps/electron/src/main/lib/review/run-store-v2.ts` | `markStaleRunsInterrupted`：崩溃遗留 running/queued 标 interrupted |
| AI 代批开关 | `settings-service.ts` + `main/ipc.ts` + 审核专区 UI | 默认关；专用确认通道（通用设置通道剥离该字段）；风险确认弹窗；开启留痕 |
| 时间线 | `case-timeline.ts` + `CaseTimelinePanel.tsx` | receiptLog+运行构建，人工/AI/未记录徽标，操作者筛选 |
| 案卷 UI | `apps/electron/src/renderer/components/content-review/` | `ReviewAssignmentCard`（指派卡+隐蔽开关+风险弹窗）、`MaterialDropZone`（点击/拖入双通道导入）、`ObservationConfirmPanel`、`V2CasePanel` 改造 |
| 运行时修复 | `document-parser.ts`、`review-model-gateway.ts`、`system-tesseract-ocr-adapter.ts`、`token-crypto` 调用链 | pdf-parse 捆绑 bug、网关 URL 兜底与 429 重试、取消信号穿透、系统 tesseract OCR 真实引擎、Wayland 对话框坑规避 |

### 1.2 文档

- `docs/design/review-agent/08-agent-integration-design.md`——接入设计（含团队修订）
- `docs/design/review-agent/09-dev-agent-ops-implementation.md`——开发文档（代码地图/身份模型/授权链/已知边界）
- `docs/design/review-agent/10-user-guide-agent-ops.md`——使用指南（面向最终用户）
- 本文件——边界说明

### 1.3 工程配套

- `apps/electron/package.json` 版本递增（0.15.138 → 0.15.143）与 `CHANGELOG.json` 条目
- CI bun lockfile 修复（三 workflow bun-version 1.3.14 → 1.4.0，已推送至原仓库 PR #7）
- BDD 测试与全量回归（基线 3069 pass / 0 fail，每批 typecheck 0）

## 2. 我们**不负责**、也**没有改动**的范围

- **审核专区 V1（预审工作台三栏的核心逻辑）**：`LeftPanel/CenterPanel/RightPanel/FindingCard/SourceBlockView` 等既有实现原样保留，我们只在其上新增 V2 线；工作台「审核依据」的导入走原有 CaseManagerBar 通道，未改动。
- **Pi Agent 内核与 Agent 编排器主体**：`agent-orchestrator.ts` 仅在会话停止级联处新增「撤销该会话审核指派」一段；`pi-agent-adapter.ts` 只在 `customTools` 注入点调用我们的 `buildReviewOpsTools`，未改内核行为。
- **渠道管理/飞书集成/移动模式/协作委派**等其他产品线：未触碰。
- **模型渠道与 Key**：AMD Radeon Cloud 渠道为验收用本地配置（`~/.cdutai-dev/channels.json`），未写入仓库，随环境走。
- **原仓库的版本发布、Release、国内更新源**：均未触碰（我们只本地递增版本号）。

## 3. 交付物形态

- 全部工作在分支 `fix/ci-gate-and-version-sync`，每批独立提交、独立过门禁（全量测试 3069/0、typecheck 0）。
- 公开副本已推送至 <https://github.com/Fuck-GH-Admin/cdut-studio-review-agent>（`main` 分支，含完整上游历史 + 我们的提交）。
- **原项目 `Nya-Angle/CDUT-Studio` 未被写入**；除 PR #7（CI 修复，已经原作者合并）外无其他原项目远端写入。
- 推送前已扫描 git 全历史：无 API Key / token / 渠道配置 / 运行时用户数据入库。

## 4. 验收口径

- 零 mock/fixture/mock fallback：所有验收走真实渠道（AMD Radeon Cloud）、真实 UI 点击（xdotool）与真实文件（申报表 PDF/证书图片 OCR）。
- 安全红线：Agent 决定默认拒绝；代批开关 Agent 不可自行开启；材料原文不进 Agent 上下文；路径 realpath 授权；教师终审等模板角色门控不因代批越过。
