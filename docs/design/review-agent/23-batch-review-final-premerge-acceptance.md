# 23｜批量审核 A+B+C 合并前最终复验报告

> **后续独立验收入口：[24 号报告](24-batch-review-independent-final-acceptance.md)。使用者已授权合格直接合入测试仓库 main，本文“暂不合并/等待明确同意”是该授权前的历史状态。**

> 2026-10-11；测试仓库 Fuck-GH-Admin/cdut-studio-review-agent；功能分支 `feat/batch-review-triage-v1`；PR #1（Draft）。
>
> **结论：本地批量审核功能收口、路径安全与最新版 Electron 六项定向复验通过；仍须核对最终提交五条 CI 并由使用者明确同意，暂不合并。**
>
> 本文是 19–22 号文档之后的当前状态入口。18 号“可以直接合并”属于已被后续复核取代的旧结论；20/21 号保留为旧 HEAD 的现场证据，22 号记载后续修复。

## 1. 功能范围

- A：批次候选分流、保守相似问题聚类、技术异常与业务问题分离。
- B：批次队列、中断恢复、定向重试、按问题组选择案卷、人工逐案 V2 事务与持久回执。
- C：默认辅助模式；逐批受控自动补件；严格全局、模板、批次授权的自动通过；补件核验后重审；统一正式决定定稿条件。
- 安全/可靠性：V2 ID/IPC 路径拒止、权限/角色不可伪造、Outbox 原载荷持久恢复、与 D2 场景固定任务和正式审批禁止门槛的主线集成。
- **范围外**：正式学校 SSO 权限、生产 SchoolPort、真实模型成功审读的业务准确性、跨案自动推断、Windows/macOS 安装包的原生发布矩阵。

## 2. 本轮实际 Electron / IPC 复验结果

[Review batch Electron acceptance · Run 38111442432](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38111442432)：Ubuntu GitHub Actions + Bun 1.4.0 + Electron/Xvfb + Vite；全新隔离配置目录，仅合成 V2 案卷，真实 renderer 交互与 preload IPC。上传的 `batch-electron-qa` artifact 包含 JSON 结果、Electron/Vite 日志、服务回归日志、文件系统断言与五张截图。

| 检验点 | 实际结果 | 状态 |
| --- | --- | --- |
| 离线演示入口 | 进入 CDUT 专区 → 材料审核 → 批次管理，没有真实 CAS 调用 | PASS |
| 20 号路径穿越 PoC | Electron 真正调用 `createCaseV2`，`../../path-poc` 被拒为“非法 caseId”；隔离根目录外无意外新建路径 | PASS |
| 21 号补件回流 | 当前显示“待本轮重新审核”，上次自动退回单独显示为历史回执 | PASS |
| 21 号自动授权拒绝 | 未开启全局代批时 UI 显示业务原因，不出现 Electron IPC transport 前缀 | PASS |
| 21 号定稿拒绝 | 不满足正式业务终态的案卷被拒定稿，弹窗/提示没有 transport 前缀 | PASS |
| 21 号队列失败 | 合成案卷状态为 `failed`，用户看到失败提示，不再误报“全部成功”；后续独立复验发现此时实际原因是夹具缺模板，尚不能证明缺模型渠道分支，纠正见 24 号 | PASS（失败提示） |

真实 Electron UI/IPC **6 pass / 0 fail**。同一工作流另外运行 `review-ipc-path.test.ts`、`review-storage-id.test.ts`、`batch-ui-feedback.test.ts`，**11 pass / 0 fail**。

**证据边界：** 合成数据与真实渲染器 UI 的成功，不等于真实模型的材料审读成功，也不代表学校有权批准；真实模型缺席是用于测“执行失败”分支。GitHub Actions 的 PR checkout 可能产生合并测试 SHA，artifact 内 `commit-sha.txt` 可能与功能分支 head SHA 不同。以 GitHub 对应 PR run 和最新源码提交共同判定。本轮为提升截图中文可读性追加字体依赖，因此要以**最终 head 上重新执行的同一工作流**确认截图与结果。

后续证据纠正：原回放仅断言 `failed`，未核对失败原因。24 号复验补齐合成模板并要求持久化错误包含“未配置可用模型渠道”，避免其他失败原因冒充缺模型测试。

## 3. 合并前剩余门槛

- 在 PR #1 **最终 head** 上确认以下五项均显示成功：`Review batch Electron acceptance`、`Review batch focused tests`、`D2 Scoped Pi Review Tests`、`Review Baseline CI`、`PR CI`。
- 确认 Electron UI 原始截图和测试 JSON，尤其是原 PoC 不产生越界文件、旧退回显示成历史、自动授权/定稿拒绝文案、队列失败提示。
- 重新检查测试仓库 `main` 到功能分支的 ahead/behind、冲突、Electron `0.15.150` 与 CHANGELOG。若主线移动，先同步并重新验证。
- 使用者明确认可后，才允许从 Draft 解除并合并 PR #1。此前 PR #7 / #10 的合并只是 `main → 功能分支`，不等于本功能已进 `main`。
- 若要将功能同步到 `Nya-Angle/CDUT-Studio` 主仓库，须另外基于它的最新 `main` 合并、处理冲突并做最终 CI；本仓库测试绿色不代表主仓库已经交付。
- 生产落地继续单列学校可信 SSO/角色授权、SchoolPort 回执幂等、真实模型、数据 ACL/加密/生命周期和 Windows/macOS 包的验收。不能把本地 `system` 来源冒充学校正式签批。

**当前策略：PR #1 保持 Draft，不代替使用者自行批准合并，也不以旧提交绿灯代替最终提交验证。**

## 4. 实际重跑入口

- 合成 fixtures：`scripts/qa/batch-premerge-seed.mjs`，强制仅写入隔离 QA profile。
- 真实 Electron 回放：`scripts/qa/batch-premerge-electron.mjs`。
- GitHub Actions：`.github/workflows/review-batch-electron-acceptance.yml`。
- 历史闭环：`19-batch-review-premerge-round2-acceptance.md`、`20-batch-review-qa-round3.md`、`21-batch-review-offline-ui-acceptance.md`、`22-batch-review-qa-remediation.md`。
