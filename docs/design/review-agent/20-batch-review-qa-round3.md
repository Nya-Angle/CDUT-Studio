# 批量审核第三轮本地 QA 与生产风险报告

> 日期：2026-10-11
> 对象：测试仓库 `Fuck-GH-Admin/cdut-studio-review-agent` 的 `feat/batch-review-triage-v1`，HEAD `1032ef0e99541b9dbfe3790248ccd85fdabf517d`
> 环境：Linux、Node 22.23.2、Bun 1.4.0、独立 Electron 配置目录与合成数据

## 1. 结论

**当前分支不能合并或直接部署。** 自动化回归、类型检查、边界检查和构建通过；renderer 可调用的 V2 案卷创建 IPC 接受带 `../` 的 `caseId`，并在配置目录外创建文件。这个可复现的路径越界写入需要修复并在同一最终提交上重跑验收。

初次 UI 检查漏查了项目内置的离线演示账户，错误地把专区登录页记为验收阻塞。2026-10-11 补验已通过演示账户进入材料审核与批次管理；登录不阻塞本地 B+C 验收。入口和演示凭据见 [B 阶段验收说明](16-batch-review-stage-b-local-acceptance.md#离线桌面验收入口)，实际桌面操作结果见 [离线 UI 补验报告](21-batch-review-offline-ui-acceptance.md)。学校身份/审核角色和真实校方端口属于正式校方审批的部署边界，不是离线 demo 的验收前提。

## 2. 基线与仓库关系

- 本报告精确对应上方 HEAD。测试仓库的 `main`（`c84c6216`）是该功能分支祖先，功能分支比测试仓库 `main` 多 98 个提交。
- 已抓取 Nya-Angle 主仓库当前 `origin/main`（`3d83c226`）。该主线有 6 个共同基线之后的提交尚未进入测试功能分支；模拟合并发现 `README.md` 内容冲突。这里的验证对象仍是测试仓库当前功能分支，报告不代表已完成与 Nya-Angle 当前 `main` 的集成。面向生产仓库合并前，需要处理这段差异并在最终合并候选上重跑验收。
- 本轮只更新验收文档，没有修改审核功能代码。

## 3. 自动化验证

| 检查 | 结果 |
| --- | --- |
| `bun install --frozen-lockfile` | 通过；安装 1263 个包 |
| 批量审核专项（CI 的 10 个测试文件） | **132 pass / 0 fail，562 `expect()`** |
| 全仓 `bun test --isolate --timeout 30000` | **3626 pass / 5 skip / 0 fail，10540 `expect()`；408 个文件**。跳过项为 macOS shell 和 Windows PowerShell 环境测试 |
| `bun run typecheck` | 通过；所有 workspace 包通过 |
| `bun run check:boundaries` | 通过；无边界违规 |
| Electron `bun run check:skin-contract` | 通过；8 个内置皮肤和官方模板满足 Surface Contract v2 |
| `bun run electron:build` | 通过；main、preload、renderer、CLI 和资源构建完成 |

构建输出包含既有警告：PDF worker `require.resolve` externalization、`emf-converter` 的 Node 模块被 Vite externalize，以及部分 renderer chunk 超过 500 KB。它们没有导致本轮构建失败。

## 4. 阻断问题：V2 案卷 ID 路径越界写入

### 复现

在隔离 Electron renderer 中调用公开的 `window.reviewAPI.createCaseV2`，使用已发布的合成模板和合成申请数据，将 `caseId` 设为 `../../path-poc`。IPC 返回成功，并在 QA 配置目录之外创建 `path-poc/state.v2.json`。该 PoC 只在 `/tmp/cdut-review-batch-qa-latest-20261011` 下操作，验证后已清理目标目录。

### 代码路径

- [review-ipc.ts](../../../apps/electron/src/main/lib/review/review-ipc.ts)：`CREATE_CASE_V2` 只验证 `caseId` 非空，随后直接传给创建服务。
- [application-service.ts](../../../apps/electron/src/main/lib/review/application-service.ts)：`createCaseFromTemplate()` 没有校验 `caseId`，直接调用 `createAggregate()`。
- [case-store-v2.ts](../../../apps/electron/src/main/lib/review/case-store-v2.ts)：`aggregatePath()`、`writeAggregate()` 将案卷 ID 直接拼入 `join(getConfigDir(), 'review-cases', caseId, ...)`。
- [run-store-v2.ts](../../../apps/electron/src/main/lib/review/run-store-v2.ts)：运行与产物目录也将 `caseId` 直接拼接到文件系统路径。

旧 V1 案卷存储有 `assertSafeId()` 白名单，V2 对应边界没有同等保护。测试还发现批次创建只验证批次 ID，没有验证 `batch.caseIds`；所有参与路径拼接的 V2 ID 都应经过统一校验。

### 修复验收要求

1. 在 V2 存储路径辅助函数和 IPC 写入/读取入口统一拒绝分隔符、`.`、`..` 与非法 ID；同时验证 `runId`、`nodeId` 等路径片段。
2. 批次创建时逐项校验 `caseIds`，不能依赖 renderer 只传入列表中已有的案卷。
3. 增加 `CREATE_CASE_V2`、案卷聚合、运行记录、产物与批次边界的路径穿越负例测试；确认拒绝调用且配置根目录外没有文件变化。
4. 在包含修复的最终 HEAD 上重跑本报告第 3 节全部检查。

## 5. 生产部署边界

- **校方身份和授权未接入**：本地 `reviewer` / `system` actor 不能代表学校身份、教师终审角色或学校签章。当前需要把该功能视为本地辅助工作流；学校正式审批需先接入 SSO、审核角色授权和审计身份映射。
- **真实校方写入端口未联调**：Outbox 现在保存原始 payload，并对未知回执保持 `pending`，恢复时重用同一个 `actionId`。这依赖外部端口按 `actionId` 幂等和可查询回执；当前证据来自模拟端口，没有生产联调，也没有跨多个 Electron 进程的分布式锁。
- **审核案卷是本地明文 JSON**：案卷、材料索引、运行产物和审计记录写入配置目录。部署涉及学生个人信息时，需要先明确本机账户 ACL、磁盘加密、备份、保留期限和删除策略。
- **本地 UI 补验**：内置演示账户已验证可用；混合批次、问题组子集操作、自动补件/通过、补件回流、定向重试、恢复与定稿已有实际桌面操作记录，见 [补验报告](21-batch-review-offline-ui-acceptance.md)。使用预置合成运行结果的场景与真实模型执行分开记录。

## 6. 合并建议

修复案卷路径校验之前不要合入测试仓库或 Nya-Angle 的 `main`。本地 B+C 合并门槛是路径修复、必要的 UI 验收与最终基线上的自动化检查；正式学校身份和生产端口接入另按部署范围验收。合并前仍需根据目标仓库的最新 `main` 对齐基线并重测。包版本当前仍为 `@profer/electron 0.15.148` 与 `@profer/shared 0.1.64`；提交代码修复/合并时按项目版本规则递增受影响包的 patch 版本。
