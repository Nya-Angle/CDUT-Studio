# CDUT Studio Review V3｜M4 F18 离线往返与 SchoolPort 交付 R01

- Owner：F18；协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定开发祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 交付分支：`feat/v3-m4-f18-offline-ports`；本分支不合并 main，也不写协调分支。
- 验收映射：C01–C04、U12（其中学校正式联调 S01–S03 为 `BLOCKED_EXTERNAL`）。
- 真实标签：`CODED` / `PASS_SCOPED`；原有 T09 学生补件 IPC 保留 `WIRED`，新评委路径 `INTEGRATION_PENDING`，完整 C01–C04 `NOT_ACCEPTED`。

## 1. 先核对已有成果

固定 main 已有：

1. T09 `review-v3-t09-offline-codec`：学生/评委包 SHA-256、任务锁、版本冲突、附件校验、去重回执；SHA 仅检查文件完整性，**不是发送者认证**。
2. T09 Main + IPC：学生补件签发、预览、附件登记和补件答复，回执持久化；现有 Main 对评委回件直接拒绝。
3. T07：独立评委的分配、回避、评分、排名、冻结和轮次 CAS 持久化；不能再造第二份评分记录。
4. `external-ports`：Mock 模拟任务/来源/核验/冲突；LocalPackageAdapter 已分离“签发”和“等待独立回执”。

没有重建上面四项，也没有自行改动 `review-ipc.ts`、共享类型、Preload、Case/Run/Batch/T07 writer。

## 2. 本轮实际生产代码

### 2.1 评委独立回件 ↔ T07 适配

- `review-v3-t09-judge-adapter.ts`：从**持久的** T07 轮次和已分配任务签发匿名 T09 评委包。包绑定 batchId、轮次、T07 revision、案卷 revision、模板及量表版本，原件和实名字段默认不出包。
- 独立副本用已有 `answerT09Task` 形成回件；导入时读取原本任务和最新评分轮次，预览版本、回避、冻结、任务状态、量表差异；不接受过期回件覆盖新状态。
- `importT09JudgePackage` 要求 Main 侧显式组织者确认回调，评分只通过注入的**既有 T07 Main CAS action**写入；绝不通过 `CaseAggregate.ratings` 再造一票，包内 respondent 不构成学校可信身份。
- T09 已有持久 actionId 回执用于重导去重，复用相同的回执文件格式。不同载荷复用同一 actionId 被拒绝。
- `review-v3-t09-offline-issuer.ts`、`review-v3-t09-offline-codec.ts` 以**可选绑定字段**保持历史学生/旧评委包兼容；新 T07 适配必须具备完整批次绑定。

### 2.2 SchoolPort 兼容和缺失数据保护

- `review-v3-f18-school-profile.ts`：`IntegrationProfile` 显式指定 `workflowOwner`、字段映射和校方状态映射。
- `negotiateSchoolPort` 区分本地决定、离线待回执、模拟/正式建议待回执和缺授权不可用。Mock 不冒充真实身份；正式学校缺可信身份/写能力时不宣称可审批。
- `mapExternalCase` 对缺字段返回 `unknown`，不杜撰成绩/材料；未知外部状态也保持 `unknown`，不误判为 completed。
- 两个新增模块均是可被统一 Main 消费的领域适配，尚未声称在普通 Renderer 操作链中可达。

## 3. Main 集成合同请求（CONTRACT_REQUEST）

### CR-F18-01｜接通 T09 评委离线往返

**归属**：Local Main/IPC Owner；依赖 F15 的 T07 轮次结构，以及本 F18 `review-v3-t09-judge-adapter.ts`。

当前 IPC 只有 `T09_ISSUE_STUDENT`、`T09_PREVIEW_REPLY`、`T09_IMPORT_REPLY`，并且 Main 的 `buildT09State().assignments = {}`，故评委回件无法走普通客户端。不要把 T07 真实轮次平铺成新的 Case writer。

建议最小端口：

1. 新增 `T09_ISSUE_JUDGE`，输入 `{caseId,batchId,assignmentId}`。Main 用 `getCaseV2Aggregate(caseId)` + `issueT09JudgePackage` 签发并持久记录原任务，返回 `{packageId,actionId,json,batchId,round}`。
2. 现有 `T09_PREVIEW_REPLY` 按离线包 `reply.kind` 分支；评委走 `previewT09JudgePackage` 并返回可见批次/轮次和 `T09Preview`，不改学生路径。
3. 现有 `T09_IMPORT_REPLY` 对评委走 `importT09JudgePackage`：主进程先验证发送者及本机组织者的**明确点击确认**，Main 把 `submitRating` 绑定到 `applyT07MainAction({batchId,claim:{role:'judge',reviewerId},action,expectedRevision})`。`reviewerId` 必须来自本机存档的原任务分配，不能读取 Renderer 任意自报值。该模型只承认本地独立副本回件，不能写 `actorSource: 'school'`。
4. F18 原有 T09 面板增设评委任务签发/回件预览和冲突提示；接线后让真实 UI 检查：两份独立副本、回避、重新开轮次、重启、重复导入、评委匿名视角。

最小错误集合：`T09_JUDGE_BATCH_NOT_FOUND`、`T09_JUDGE_TASK_NOT_FOUND_OR_UNBOUND`、`T09_LOCAL_ORGANIZER_CONFIRMATION_REQUIRED`、`T09_CASE_MISMATCH`、`T07_REVISION_CONFLICT`；冲突保留 `ready/conflict/rejected` 原语义，不冒充成功回执。

### CR-F18-02｜回执与 T07 CAS 原子性

当前 T07 评分 CAS 成功之后、T09 回执写盘之前若断电，**不会产生重复票**（T07 同分配只能提交一次），但可能无法把该次导入识别为 accepted duplicate。最终 Main 需将离线 actionId/任务包 hash 与既有 T07 评分提交来源原子关联，或提供 crash recovery/Receipt 查询，不能仅靠进程内 Map 宣称 exactly-once。此项不授权 F18 修改共享评分 writer。

### CR-F18-03｜SchoolPort UI 能力协商

Main 选择实际 SchoolPort 时提供 `IntegrationProfile` 和只读能力快照，Renderer 根据 `negotiateSchoolPort` 的 `mode` 显示可用操作；校方 `workflowOwner=school` 时，提交内容只进入 outbox 等真实回执，不由本地直接推动学校审批状态。真实校方认证、URL/字段/状态映射配置、S01–S03 联调依赖授权：`BLOCKED_EXTERNAL`。

## 4. 本轮验证与未签收

| 范围 | 实际结果 |
| --- | --- |
| 新增 F18 评委往返 | 3/3 PASS，包含真实 T07 轮次写盘、重复包、版本变化、回避、匿名投影、未授权拒绝 |
| 新增 SchoolPort 映射 | 3/3 PASS，能力/身份/缺失字段和未知状态 |
| 既有 T07/T09/External Port 定向回归 | 19/19 PASS |
| F18 7 个变更源码/测试文件定向 TS 校验 | PASS：`tsc --noEmit --project /tmp/f18-typecheck.json`（临时本地配置，不进入 PR） |
| 全 Electron `bun run --filter='@profer/electron' typecheck` | 已执行；当前执行容器 SIGKILL/137，未签收全量类型检查 |
| Electron 真机普通用户体验 / 真实校方 | NOT_RUN / BLOCKED_EXTERNAL |

还缺正常 IPC/Preload/UI 接线、真正两台或两个独立客户端往返、崩溃窗口恢复及全量 Electron 检查。`SOURCE_READY` 只代表本领域可审代码，不代表 C01–C04/U12 产品级 PASS。

遵循仓库 AGENTS.md，本轮将 Electron patch 版本从 `0.15.162` 升到 `0.15.163` 并同步 `bun.lock`。README/AGENTS 文档同步需要用户先确认，故未越权修改；集成者应在获批后同步记载 F18 正式交付状态。
