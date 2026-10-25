# 24｜批量审核独立复验与合并依据

> 2026-10-11；目标仓库 `Fuck-GH-Admin/cdut-studio-review-agent`；PR #1 → `main`。
>
> 使用者已明确授权：合格直接合并，小问题直接修复，大问题记录返工。本轮本地复验通过，未发现需要继续返工的合并阻断；执行合并还须确认本报告提交对应的五条 CI 全部成功且目标主线未移动。

## 1. 源码与范围

- 重新 fetch 后的功能基线：`8f2fed6e8692fda8ac1d14c928df2a0cbba3261f`。
- 测试仓库主线：`98708f965f09f83541deef64f577767cb0c753b6`，已是功能分支祖先，初次核对 ahead/behind 为 `146/0`，不需要再做冲突合并。
- 独立工作树：`/home/miku/Bot/CDUTStudio/.workdir/batch-review-final-20261011`；Bun `1.4.0`、Node `22.23.2`、Linux/Xvfb、真实 Electron 与 preload IPC。
- `Nya-Angle/CDUT-Studio` 主线仍为 `3d83c226`。此次合并目标是测试仓库；生产仓库有独立提交，后续同步仍须单独处理和验收。
- 功能验收对照 16/17 号 B/C 阶段要求；队列、定向重试、角色/证据/版本拒止、人工逐案事务、自动授权、补件回流、定稿和幂等纳入专项回归。21 号保留此前实际完整流程补验，本轮对返工修复做定向桌面复验。

## 2. 本轮顺手修复

1. **CI 路径**：批量测试 workflow 的一项 `paths` 将三个文件名串成一条。保留正确的 `real-chain-journey.test.ts` 路径，其余两个已有独立匹配项；YAML 和路径检查通过。
2. **无模型测试夹具**：旧 Electron 夹具没有 `qa-review-template@1`，实际失败原因为“模板不存在”，原六项回放不能证明缺模型分支。补齐合成模板，并要求落盘错误明确包含“未配置可用模型渠道”。23 号证据说明已纠正。
3. **全部失败的数量提示**：没有已完成案卷时，不需要再读取分流才能知道待人工数，界面明确显示 `待人工处理 0 案`。服务统计断言与真实 UI 回放均覆盖。

受影响 Electron patch 从 `0.15.150` 升为 `0.15.151`，保留 `0.15.149` D2 与 `0.15.150` 路径/UI 修复的 CHANGELOG。README、AGENTS 与交接入口同步更新。依赖版本未改。

## 3. 独立验证结果

| 检查 | 结果 |
| --- | --- |
| 冻结锁文件安装 | 1263 packages；锁文件未变化 |
| 全 workspace `bun run typecheck` | PASS，包括 Electron |
| `bun run check:boundaries` | PASS |
| Electron `check:skin-contract` | PASS，8 个皮肤及模板 |
| 13 文件批量/安全/UI 专项 | **143 pass / 0 fail** |
| 全量 `bun test --isolate --timeout 30000` | **3653 pass / 5 skip / 0 fail**，412 文件；skip 为平台限定用例 |
| Electron 完整构建 | PASS，包含 main/preload/renderer/CLI/resources |
| 修正夹具后的真实 Electron 回放 | **6 pass / 0 fail** |

真实 UI 六项：

| 场景 | 观察 |
| --- | --- |
| 离线登录入口 | 文档内置账号进入 CDUT 专区 → 材料审核 → 批次管理，未保存 `cdut-account.json` |
| 原 V2 非法 ID 请求 | 真正调用 renderer API，被拒为“非法 caseId”；配置目录外未出现测试路径 |
| 补件重新入队 | 显示“待本轮重新审核”；旧退回单独显示“上次动作…（历史记录）” |
| 自动通过授权拒绝 | 显示“全局 AI 代批授权未开启”，无 IPC transport 前缀 |
| 未完成批次定稿拒绝 | 显示业务拒绝原因，无 transport 前缀 |
| 缺模型渠道队列失败 | 案卷 `failed`，持久化原因为“未配置可用模型渠道，无法执行真实审核（请在设置中配置渠道）”；提示完成 0、失败 1、待人工 0，未误报成功 |

五张截图已实际查看，包括历史行、授权弹窗和失败提示。测试仅使用合成配置/案卷，没有向学校系统写入。构建既有的 pdf.worker externalization、emf-converter 浏览器外置模块和大 chunk 警告不属于本次新增阻断。

## 4. CI 与合并执行

拉取基线 `8f2fed6e` 的五条 CI 已逐一核对为 success：

- [Electron acceptance · 38111599151](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38111599151)
- [Batch focused · 38111599146](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38111599146)
- [D2 scoped Pi · 38111599152](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38111599152)
- [Review Baseline · 38111599170](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38111599170)
- [PR CI · 38111599150](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38111599150)

本轮小修提交后再次检查 [PR #1 的最终检查与合并状态](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/1/checks)，不得用上述旧基线的成功代替新提交。五项成功、head 未变化且主线仍已包含后，解除 Draft 并使用指定 head SHA 合并，保留双方提交历史。合并结果以 PR #1 的 merged 状态及 `main` 包含最终提交为准。

本地原始日志/截图保留在 `/tmp/batch-premerge-qa-local-20261011/artifacts`（工程测试/构建）与 `/tmp/batch-premerge-qa-local-final-20261011/artifacts`（修正后 UI 回放）。CI 会上传最终提交的 Electron 证据 artifact。临时运行进程在验收后关闭。

## 5. 生产部署仍需验证

合入测试仓库主线只代表本地批量审核达到此次要求。以下事项没有由合成测试证明，生产启用前须独立验收：

- 真实模型对各业务模板材料的审读准确性、耗时和费用；此次测到了缺模型的失败路径，没有完成真实模型成功审读。
- 学校可信身份、实际审核角色与授权；本地 reviewer/system 审计标记不等于学校正式签批。
- SchoolPort 的生产回执、幂等与恢复；当前验证为本地及测试端口。
- 多进程并发、配置目录 ACL/加密/备份/生命周期，以及本机符号链接攻击的隔离。
- Windows/macOS 原生安装包与升级后的真实操作。

这些范围边界不再作为离线演示账号登录或此次本地功能合并的额外审批条件。
