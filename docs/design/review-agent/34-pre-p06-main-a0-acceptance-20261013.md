# 34｜进入 P06 前：Main 接线与本地 A0 验收（2026-10-13）

> 用户本轮授权：补齐进入 P06 前的前置项，更新测试仓库，**先不合并**。沿用 27 号 v1，不重新设计 P05、不重新审历史问题。本报告与 [29 号账本](29-background-session-preflight-audit.md)、[30 号交接](30-background-session-handoff.md)、[32 号 P05 门禁](32-p05-stage-acceptance-and-local-gates.md)共同使用。

## 1. 结论与前置清单

**P06 LOCAL ENTRY READY**：本地 Main start/read/stop、最小前台接线、P05 自动化复验、A0 四项与证据交接全部完成。下一阶段可验证同案两轮与迟到旧 stop/失败回调；**本轮未执行或签收 P06/P07/P08**。

| 前置项 | 结果 | 证据 |
| --- | --- | --- |
| 32 号本地 P05 自动化 | PASS：原冻结 43/43；当前代码再次 43/43 | [33 号原始复验](33-p05-local-automation-recheck-20261013.md)、本报告 §4 |
| Main 可信启动与真实 ACK | PASS：owner/模型/预设/指派/轮次由 Main 校验；真实 `onRunOwned` 后受理 | Main 7 项受控测试、A0-01/02/04 |
| Main 业务读态与当前轮停止 | PASS：只返回案卷/run 业务态，停止等待既有执行器释放 | 状态 7 项、复用 13 项、A0-03 |
| 前台接线与回访恢复 | PASS：不创建普通聊天；受理前 preparing，受理后只回读 V2 | Controller 30 项、A0-02、截图补测 |
| 真实 Electron/Pi 本地 A0 | **4/4 PASS**：真实 provider 正例、预检、停止、受控 HTTP 失败 | §5、summary、持久账本、截图 |
| 冻结代码质量门禁 | PASS：全仓 3849 pass / 5 skip / 0 fail；九步退出 0；四项 CI SUCCESS | §4/§6、完整日志及哈希 |
| 云端交接 | 测试分支及 Draft PR #21；不合并、不解除 Draft | 27/29/30/31/32/33/34 与 PR 说明 |

**仍然 MERGE NO-GO**：P05-RELAY-ROUTE-01 保持 BLOCKED / NOT-RUN；P05-POCKET-FIFO-01 保持 PATCH READY / TARGET NOT-RUN。完整 P05 PARTIAL，LIVE 没有任何完整项目被自动改 PASS。这里的 READY 只适用于本地 P06 工程验证。

## 2. 冻结版本、环境和数据

| 项目 | 实际值 |
| --- | --- |
| 执行者 / 日期 | Codex / 2026-10-13，北京时间 |
| 应用及验收驱动 SHA | [`14bc7d6c3625aaa6eec2675aa9ce4dc446475297`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/14bc7d6c3625aaa6eec2675aa9ce4dc446475297) |
| 实现历史 | `3a6b766c` Main/前台 → `c0d5f53d` 复用预设与故障回放 → `115bdd4c` 隔离引导初始化 → `14bc7d6c` 显示问题复测 |
| 版本 | Electron 应用 0.15.156 / Electron runtime 43.2.0 / shared 0.1.66 / core 0.2.14 |
| OS / 工具 | Ubuntu 26.04.1 LTS、Linux 7.0.0-38-generic x86_64；Bun 1.4.0、Node v22.23.2 |
| worktree / 分支 | `/home/miku/Bot/CDUTStudio/.workdir/review-pre-p06-20261013` / `feat/review-owned-background-sessions` |
| Electron 私有隔离 profile | `/home/miku/Bot/CDUTStudio/.workdir/review-pre-p06-a0-v156-20261013`；新建，不使用原日常案卷/聊天 |
| A0 实际起止 | 04:35～04:38 CST；精确起点及各轮终点见 environment/summary/ledger |
| provider / model | 既有授权 DeepSeek 渠道 / `deepseek-flash`；凭据只在私有隔离配置，不归档上传 |
| 合成材料 | [纯文本申请](acceptance/pre-p06-a0-20261013/synthetic-source.txt)：虚构活动、预算 100 元；无真实个人资料 |
| 合成模板 | [A0 synthetic-only 模板](acceptance/pre-p06-a0-20261013/synthetic-template.json)：一个案卷级预算检查，不是学校行政政策或模板产品验收 |

测试时产品代码已提交冻结；待归档改动仅文档/采集器。原项目 main 没有切换、合并或推送。后续文档提交会产生新的分支 HEAD：它不能冒称本报告的冻结执行 SHA，其 CI 需另行核对并登记 PR 说明。

## 3. 实际交付与限制

- 新 Main `review-pi-run-bridge.ts` 复用可信 owner factory、`preparePiReviewRunV2`、admission、`runAgent`、`stopAgentAndWait`。没有新增执行引擎、数据库或第二份持久任务账本。
- 模型先读取审核模块设置，再读取持久全局选择；渠道/模型无效就明确拒绝，创建 owner 前结束预检。复用要求 Pi、未归档、同案/同模型及 `review-operator` 预设；默认会话沙箱不继承普通聊天工作区。
- Renderer 启动只传案卷/模式，停止只传案卷/runId。Main 持有执行 Promise，真实 `onRunOwned` 后 ACK。前台显示 preparing/审核中/未完成/待人工决定；卸载只清理显示轮询。
- 旧 prepare/abort/指派 IPC 不可读写新 owner；新业务入口限定真实主窗口 sender。普通列表、单条 metadata 与普通聊天 Tab 不暴露 owner。A0 的宿主维护读取仅用于本地证据核验，不是普通产品 API。
- HTML/EML 修复与申报事项识别仍在 Renderer 准备阶段；该阶段离页不保证继续。只在真实受理后的 Pi 阶段提供后台保障。应用退出后不承诺持续运行，重启/强杀/删案属于后续 P07。

## 4. 本地自动化命令与结果

执行器：[run_local_gates.py](acceptance/pre-p06-a0-20261013/run_local_gates.py)。按顺序执行以下九步，**全部 exit 0**；逐步 argv、cwd、UTC 起止、耗时、环境和日志 SHA-256 见 [local-gates-results.json](acceptance/pre-p06-a0-20261013/local-gates-results.json)。配置另用 `/tmp/review-pre-p06-local-gates-*`，未指向 Electron A0 或日常 profile。

| 步骤 | 命令（除注明外 cwd=仓库根） | 实际结果 / 完整日志 |
| --- | --- | --- |
| 01 | `bun run typecheck` | [全包 PASS](acceptance/pre-p06-a0-20261013/01-typecheck.log) |
| 02 | `bun test --isolate --timeout 30000` + Main bridge / business-state / reuse / controller 四文件 | [57 pass / 0 fail](acceptance/pre-p06-a0-20261013/02-main-renderer-focused.log)：7+7+13+30 |
| 03 | `bun test --isolate --timeout 30000` | [3849 pass / 5 skip / 0 fail](acceptance/pre-p06-a0-20261013/03-full-tests.log)：3854 tests / 438 files / 15969 expects |
| 04 | `bun test --isolate --timeout 30000 apps/electron/src/main/lib/review/*.p05.test.ts` | [43 pass / 0 skip / 0 fail](acceptance/pre-p06-a0-20261013/04-p05-focused.log)：六文件按实际 argv 展开 |
| 05 | `bun run check:boundaries` | [PASS](acceptance/pre-p06-a0-20261013/05-boundaries.log) |
| 06 | `bun run check:skin-contract`（apps/electron） | [PASS](acceptance/pre-p06-a0-20261013/06-skin-contract.log) |
| 07 | `bun run build:main`（apps/electron） | [PASS](acceptance/pre-p06-a0-20261013/07-build-main.log) |
| 08 | `bun run build:preload`（apps/electron） | [PASS](acceptance/pre-p06-a0-20261013/08-build-preload.log) |
| 09 | `bun run build:renderer`（apps/electron） | [PASS](acceptance/pre-p06-a0-20261013/09-build-renderer.log) |

5 skip 仍是 Linux 下一个 macOS shell 和四个 Windows PowerShell 条件测试，来源及名称与 33 号相同；不记为通过。构建的 pdf worker external、emf-converter Node 模块 externalization 和 chunk 大小提示保留在日志，不替代原件预览验收。

## 5. 真实 Electron A0

开发实例使用 Xvfb 1600×1000、Vite 5176、CDP 9222。启动命令如下；`A0_PROFILE` 是新隔离目录，具体值和环境见 [environment.json](acceptance/pre-p06-a0-20261013/environment.json)。本机容器 wrapper 使用 `--no-sandbox --disable-gpu --remote-debugging-port=9222`，没有改变产品启动默认值或权限策略。

```bash
A0_PROFILE=/home/miku/Bot/CDUTStudio/.workdir/review-pre-p06-a0-v156-20261013
xvfb-run -a -s '-screen 0 1600x1000x24' env \
  PROFER_DEV=1 PROFER_DEV_INSTANCE=review-pre-p06-a0-156 PROFER_VITE_PORT=5176 \
  PROFER_CONFIG_DIR="$A0_PROFILE/config" PROFER_USER_DATA_DIR="$A0_PROFILE/user-data" \
  ELECTRON_OVERRIDE_DIST_PATH="$A0_PROFILE/electron-dist" bun run dev

QA_REPORT_DIR="$A0_PROFILE/artifacts" QA_PROFILE_ROOT="$A0_PROFILE" \
  QA_SOURCE_PATH="$A0_PROFILE/source.txt" node scripts/qa/review-background-a0.mjs

QA_REPORT_DIR="$A0_PROFILE/artifacts" node \
  docs/design/review-agent/acceptance/pre-p06-a0-20261013/feedback-isolation-check.mjs
```

脚本通过真实 preload IPC 初始化隔离实例的首次引导，使用文档中的离线演示账户进入 CDUT 专区，没有访问学校 CAS。当前预审工作台未挂载 CaseManagerBar，故测试案卷由 **真实 Jotai store + 真实 Controller.selectCase** 选择；开始/重新审核/停止及关闭审核子页均点击真实界面控件。该方法不证明“创建和选择案卷”的整条用户 UI 流程已验收。

| 项目 | 真实步骤与实际结果 | 结果 |
| --- | --- | --- |
| A0-01 | 在隔离实例停用所选渠道，点击开始。出现可读预检原因；0 run、0 新 owner；无 IPC 技术前缀。随后恢复渠道 | **PASS** |
| A0-02 | 点击启动，Main 返回真实 `accepted`。普通 list 不含 owner、普通 meta=null、无 owner 聊天 Tab。**关闭真实审核子页**后打开设置，Pi 持续运行；约 97 秒 completed，1 completedCheck、1 SourceRef；重进从持久 V2 恢复完成状态 | **PASS** |
| A0-03 | 独立合成案卷启动获得 ACK，点击“停止审核”；现有执行器释放，V2 写 cancelled，前台恢复可重审状态 | **PASS** |
| A0-04 | 切换到本机 HTTP 500 合成 provider；真实 Main/Pi 获得 ACK 后实际发送 6 次请求（含重试），V2 写 failed，前台未完成，不误报 completed。恢复 DeepSeek 选择 | **PASS** |
| 显示补测 | 真实停止提示存在时切换到预检案卷，旧绿色回执消失；仅检查显示归属，不检验迟到 stop 竞态 | **PASS** |

执行顺序为 01 → 02 → 04 → 03。实际 caseId/runId/终点见 [a0-summary.json](acceptance/pre-p06-a0-20261013/a0-summary.json)、[selected-business-ledger.json](acceptance/pre-p06-a0-20261013/selected-business-ledger.json)、[反馈隔离补测](acceptance/pre-p06-a0-20261013/feedback-isolation-result.json)。HTTP 失败是受控 loopback 服务，执行器没有 mock；不能将其称为生产 DeepSeek 故障演练。

截图：[预检拒绝](acceptance/pre-p06-a0-20261013/a0-01-preflight-rejection.png)、[真实受理](acceptance/pre-p06-a0-20261013/a0-02-accepted-in-review.png)、[离页后完成](acceptance/pre-p06-a0-20261013/a0-02-settings-after-completion.png)、[重进恢复](acceptance/pre-p06-a0-20261013/a0-02-result-restored.png)、[受理后失败](acceptance/pre-p06-a0-20261013/a0-04-runtime-failure.png)、[停止](acceptance/pre-p06-a0-20261013/a0-03-stopped.png)、[切案清除旧回执](acceptance/pre-p06-a0-20261013/a0-display-feedback-isolation.png)。截图表现业务状态；真实检查和出处以 V2 账本为准，不能凭旧版“申报事项 0”汇总推断 synthetic case 级检查不存在。

## 6. 冻结代码云端 CI

以下四项 **SUCCESS** 均对应 `14bc7d6c`；原始响应见 [core-ci-snapshot.json](acceptance/pre-p06-a0-20261013/core-ci-snapshot.json)。文档归档 HEAD 的四项 CI 必须另外核验，最新 SHA/run ID 登记在 [PR #21 说明](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/21)，不得用本表冒充。

- [PR CI #38305239415](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239415)：Typecheck、边界、皮肤、main/preload/renderer 构建、全部测试。
- [D2 #38305239388](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239388)。
- [Review Baseline #38305239392](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239392)。
- [Review batch focused #38305239385](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38305239385)。

## 7. 发现、修复和仍未通过的项目

| 观察 | 处置 / 适用边界 |
| --- | --- |
| 重新选案时旧 V2 running 汇总可覆盖 Main preparing | 已修：所有回读路径以实际 admission 判定；新增回归，不把账本状态当 ACK |
| 旧 owner 复用未再确认审核 preset | 已修：必须仍是 review-operator；新增普通预设不复用测试 |
| 预检错误卡保留 Electron IPC 前缀 | 已修：错误卡/底部提示共用可读原因；单测和 .156 Electron 复测通过 |
| 切案/新轮后上一轮停止回执残留 | 已修：按案卷/轮次清除显示回执；真实补测通过。**迟到异步回执/旧 run 控制仍归 P06** |
| 早期回放卡在引导、不存在的 CaseManagerBar 选择器，或只打开设置浮层 | 修正驱动初始化/实际选案方式；明确设置浮层不等于卸载审核页，最终先关闭子页。早期失败不计 PASS，原始排查记录留在本机私有 profile |
| 隐藏 `?window=agent-preview` 在 dev 报 `ERR_BLOCKED_BY_CLIENT` | [原始单行观察](acceptance/pre-p06-a0-20261013/preview-navigation-observation.log)已归档；正文回退完成。**原件视觉未签收**，需单独复现实际预览入口/导航许可与回执；不能依据纯文本成功关闭 LIVE-02 |

[observed-tool-calls.json](acceptance/pre-p06-a0-20261013/observed-tool-calls.json)只记录正例中真实出现的三个审核工具调用名；没有完整 provider 工具清单快照或 PNG 视觉证明。不能据此宣称 LIVE-01 全部通过。

以下保持未完成：HTML/EML/逐事项准备实机、扫描 PDF/PNG、长轮次续审与压缩、完整工具负例、部分完成矩阵、搜索/归档/旧 Tab/多窗口、真实 Relay/Pocket/飞书、Windows/macOS、P06 连续两轮迟到控制、P07 重启强杀删案、P08 普通 Agent 与批量 A/B/C 实机回归。29 号 LIVE-01/04/05/06/07 仅将 A0 子集登记 **PARTIAL**；LIVE-02/03/08 仍 **NOT-RUN**。

P04-TECHDEBT-01 的永久 ID-only tombstone、安全不 GC 与容量增长风险原样保留，没有引入 TTL 或清理策略。独立 Pocket 没有验证，故本轮未应用其 patch，也没有 Pocket CI/发布证明；以后验证必须额外读取该 patch 并核对目标 SHA。

## 8. 归档和下一批

公开证据目录：[acceptance/pre-p06-a0-20261013](acceptance/pre-p06-a0-20261013/manifest.json)。清单记录文件大小与 SHA-256；只包含合成材料、业务字段、无凭据截图和测试日志。原始 Electron dev/transcript、device/channel 配置及真实 API 凭据留在本机隔离目录，不上传。

下一批按 P06 现有定义：同案连续两轮、旧 run/assignment 的迟到停止和失败回调、停止真正释放后立即重启，确认旧请求不能中止或改写新运行。优先对真实 Main bridge 调用链写可编排序的负例；普通 Agent 回归照常保留。**本轮交付到此，Draft PR #21 保持 Open/未合并。**
