# 22｜批量审核第三轮 QA 修复闭环与复验边界

> 后续状态：使用者已授权“验收合格直接合入 main”；独立复验、小修与最终合并条件见 [24 号报告](24-batch-review-independent-final-acceptance.md)。本文的保持 Draft/等待认可记录描述的是当时状态。

> 2026-10-11 · 功能分支 `feat/batch-review-triage-v1`，对应 [19 号第二轮收口](19-batch-review-premerge-round2-acceptance.md)、[20 号 QA 报告](20-batch-review-qa-round3.md) 和 [21 号离线 UI 补验](21-batch-review-offline-ui-acceptance.md)。  
> 20/21 号是特定旧 HEAD 的真实现场证据，**不应直接将其中的发现或已观察操作覆盖为“最新版通过”**。本文件记录后续修复，最新 CI 与人工复验结果以 PR #1 当前 HEAD 为准。

## 一、P0：V2 路径越界写入

20 号报告复现了公开 renderer IPC 的 `CREATE_CASE_V2(caseId='../../path-poc')`，在配置根目录外创建文件。修复必须覆盖操作源头、落盘底层和旁路服务，不只改前端表单。

| 入口 | 本轮修复 |
| --- | --- |
| `review-ipc.ts` | `CREATE_CASE_V2`、`GET_AGGREGATE_V2`、`LIST_RUNS_V2`、`GET_RUN_V2`、`RUN_REVIEW_V2` 等入口校验 case/run ID |
| `application-service.ts` | 创建服务在模板读取、字段处理和写入之前验证 `caseId` |
| `case-store-v2.ts` | `aggregatePath`、`writeAggregate`、`submitCommand`、`createAggregate` 均调用共享校验；创建参数 ID 必须与聚合内容一致；目录枚举跳过不可信名称 |
| `run-store-v2.ts` | `caseId/runId/nodeId` 逐段校验，覆盖读取、落盘、运行恢复及产物；查询缺失记录不创建目录 |
| `batch-store.ts` | 批次创建逐项验证 `caseIds`，禁止空/重复/非法列表；持久化和读取的成员 ID 重新校验 |
| `pi-case-review-service.ts` 与 `report-export-v2-service.ts` | Pi 材料目录和审核报告目录统一验证 V2 `caseId` |

共享安全边界是 `review-storage-id.ts`：ID 是**文件名的一段**，不允许被当作相对路径；拒绝分隔符、`.`、`..`、连续点、空白、编码路径及超长字符。**本轮主要验证字符串路径穿越，不声明已经实施防本机恶意符号链接的 OS 级隔离。**

负面测试：
- `review-storage-id.test.ts`：服务、聚合、命令、运行、产物、Pi 材料目录、报告和批次成员的恶意 ID；并检查受控配置根目录之外**没有产生文件**。
- `review-ipc-path.test.ts`：调用真实 `registerReviewIpc()` 注册的 `CREATE_CASE_V2` 等处理器，发送同一类 `../../path-poc`，验证在到达创建服务和文件系统前拒绝。
- 正常案卷与运行产物路径继续可读写；原有批量审核、Outbox、安全角色和主线基线测试全部保留。

## 二、21 号 UI 补验发现的三个问题

| 21 号发现 | 改动与验收 |
| --- | --- |
| 补件回流显示旧“已自动退回” | `batchAutomationDisplay` 区分本轮生效的运行与已归档回执；重新入队后显示“待本轮重新审核”，历史记录独立展示 |
| 某案执行失败仍弹通用成功提示 | 根据本次批次执行结果统计检查完成、失败、剩余队列，并读取最新运行分流计算待人工/技术异常；有失败或异常时使用 warning |
| Electron IPC 错误前缀污染业务原因 | `reviewBusinessError` 只去掉 Electron transport 错误包装，保留实际拒绝原因；批次操作与自动化授权弹窗复用 |

这些文案回归在 `batch-ui-feedback.test.ts` 覆盖。**它们不替代 21 号中 Xvfb/Electron 实际交互证据**；需要在新构建中至少重试补件回流显示、缺模型渠道导致队列失败时提示、全局自动授权和定稿拒绝弹窗。

## 三、工程与版本收口

- 变更集中在测试仓库 `Fuck-GH-Admin/cdut-studio-review-agent` 的功能分支，PR #1 继续 Draft，不合并本仓库 `main`。
- 依项目版本规范，受影响 `@profer/electron` 原由 `0.15.148` 升至 `0.15.149`；同期主线 D2 亦使用了 `0.15.149`。完成主线合并后，保留 D2 的 `0.15.149`，将本次 QA 修复顺延到 `0.15.150`，两个版本的 CHANGELOG 记录均保留。共享包未改动，不无依据 bump。
- 检查 `Review batch focused tests`、`Review Baseline CI` 与 `PR CI` 的**同一最新 HEAD**；不引用旧提交成功记录代替当前通过。
- 20 号报告还指出公开主仓库 `Nya-Angle/CDUT-Studio` 的 `main` 与测试仓库存在独立变更和 README 合并冲突。合并到那个仓库前仍须按其最新主线处理冲突、验证最终合并候选。测试仓库的成功不能证明生产仓库已完成同步。

## 四、明确未覆盖的部署事项

学校 SSO/角色可信映射、生产 SchoolPort 幂等回执、跨进程锁、明文配置目录的 ACL/加密/备份/生命周期，以及 Windows/macOS 安装包真实操作，仍属于后续部署验收。它们不该被描述为本次本地合成数据演示已经证明。

**合并口径**：先要求路径穿越 PoC 与相关回归通过，所有现有 CI 在同一 HEAD 全绿；随后由使用者检查新版桌面 UI 三项提示并确认，最后再按目标仓库实际主线合并。未完成前维持 Draft。

## 五、与 D2 主线的集成复核（2026-10-11）

- 本次修复后的主分支继续前进至 `98708f96`，新增技术预审 D2 场景固定规则、来源与提交范围校验，以及对正式审批的禁止条件。
- 已按 `main → feat/batch-review-triage-v1` 方向生成**双父提交** `6df7cbd8`，消除 PR #1 与当前 `main` 的冲突；**没有**把 B+C 代码提前合入 `main`。关联同步 PR #10 已因同步完成关闭。
- 对冲突文件采用保留双方能力的合并：`pi-case-review-service.ts` 同时保留 D2 固定任务包守卫、动态分项、来源证据校验和 V2 路径防穿越；`stage-workflow.ts`、`workspace-business-service-v2.ts` 同时保留 D2 禁止行政审批与 B+C 既有角色、事务门控。
- `@profer/electron` 正式版本顺延为 `0.15.150`；`0.15.149` 留给已合入主线的 D2。
- 合并后的首轮 `Review batch focused tests` 结果为 **143 pass / 0 fail**，`Review Baseline CI` 通过。完整工作区与 D2 专项均必须以最终 HEAD 对应的工作流为准；如果其中一项失败，仍阻断合并。
- 20、21 号报告中的旧 HEAD 路径 PoC 和桌面 UI 实测记录继续作为历史证据保存，不能把本轮服务级测试冒充新版 Electron 的实际 UI 复验。正式桌面复验、生产学校身份与 SchoolPort 联调按此前验收边界分别办理。
