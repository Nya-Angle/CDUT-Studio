# M4 F09｜运行生命周期与增量恢复交付 R01

- Owner：F09（自动执行、取消、重试、恢复、增量重审）
- ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 分支：`feat/v3-m4-f09-run-lifecycle`；提交后的实际 source SHA 以 Git 及 Draft PR 为准
- 本轮状态：`CODED / WIRED / PASS_SCOPED`；**不是 A11/A18 全链验收**

## 1. 已存在的能力（本轮未重造）

- `review-pi-run-bridge.ts` 使用 Main owner 会话与 Pi 执行器启动、停止，停止等待执行权释放。`review-pi-admission.ts` 只在真实 `onRunOwned` 后报告受理。
- `pi-case-review-service.ts` 对同输入下的部分失败检查可续交，同一运行保留已接受的检查；变化输入新建 Run，并且仅在原件版本/内容哈希及完整读取证据相符时继承原件读取凭据。
- `run-service-v2.ts` 与 `review-run-graph.ts` 对技术节点有产物和检查点恢复；`run-store-v2.ts` 将冷重启遗留的运行标记失败并拒止旧授权。这是另一条执行路径，不能等同普通 Pi 的逐检查增量恢复。

## 2. 此次实际变更

1. `ReviewV3LocalPiControls.tsx` 接入 F09 的只读状态投影：区分预写 `running` 与真实 Main 受理、已停止/中断、部分完成、待输入、技术完成及旧输入过期；按钮和下一步说明随状态变化，显示来自真实 `ReviewRunV2.coverage` 的检查覆盖而非假造的模型进度。
2. `review-v3-f09-run-lifecycle.ts` 给出独立、可复用的状态投影。无 Main 身份一致性证明时拒绝显示可信执行权；技术完成不升级为学校/人工决定；Main 新鲜度查询失败显示未知，不默认为有效。
3. UI 同一案卷后发刷新优先；迟返回的旧读取不能覆盖新状态。新鲜度由既有 Main `getWorkspaceRunValidityV2` 判断，不在 Renderer 另算输入指纹。
4. `review-pi-run-bridge.ts` 在所有 V2 Run 中选择最近的 `run-pi-` 记录，而非不分类型取最近一条。避免 T04 模板计算 Run 在 Pi 部分完成之后插入，导致原 Pi 续交候选被遗漏。依然保留同会话/模型、旧指派、输入 hash、执行失败及排他性校验。
5. 新增 F09 读模型 BDD 断言和真实 Main 薄桥回归，覆盖 T04 与 Pi 历史并存时继续同一 Run 的选择。

## 3. 定向验证与未运行项

- `bun test apps/electron/src/renderer/components/content-review/review-v3-f09-run-lifecycle.test.ts apps/electron/src/main/lib/review/review-pi-run-bridge.main.test.ts`：最终 **19 PASS / 0 FAIL**，其中 F09 新增 9 条（8 条状态投影 + 1 条 Main 桥回归）。
- Electron 原始 `bun run --filter='@profer/electron' typecheck`：容器 cgroup 内存紧张，进程被系统 `SIGKILL`（137），**不记为 PASS**。
- 使用同一 Electron tsconfig、所有实际修改源码与 Preload/ambient 声明组成的临时缩小入口运行 `tsc --noEmit`：**PASS**。临时配置文件未纳入提交。
- 未在本轮重跑本地 Agent 的 A15 S4、真实 Electron GUI、真实模型、断电测试或 100 案规模测试；不替代这些验收。

## 4. CONTRACT_REQUEST：CR-F09-01，跨 Run 逐检查增量复用

**现状：** 同输入、同 Pi 会话的 `partially-completed` 轮次可以补交未完成语义检查；变化输入会新建 Run，但跨轮目前只安全继承整份已核验原件的读取凭据，不能证明“只重做某一字段/绑定影响的检查”。

**缺少的可信数据：** 现有 `ReviewRunV2.inputManifest` 有整体 hash 和规则的 `fieldKeys` 声明，但没有每项检查在执行时冻结的实际字段值/Observation 与 EvidenceLink 修订、所用原件解析版本、完整政策/规则指纹和执行配置指纹。不能仅凭“未引用某文件”或同名/同数量就跳过检查。

**请求 Main Owner 与 F05/F06/F07/F08 统一的最小合同：**

1. 在现有 Run 的检查/节点产物中附带可验证的逐项依赖摘要：`checkId/checkKey`、规则及计划指纹、执行器版本、目标主体、实际依赖的字段/Observation/EvidenceLink ID+内容摘要、DocumentVersion+parseRevision 和来源覆盖证据。快照须与实际输入及 Run 一致，缺少依赖证明则不复用。
2. `resume/update` 适配层收到新输入时，Main 先冻结新 Run，再核对旧产物的内容、依赖摘要及当前计划。如果逐项完全一致且旧项已完成，才作为明确可追溯的继承检查纳入新 Run；变化/失去证据的项及其下游重算。**不能把旧 `CheckResult` 直接写进新 Run 而无来源与版本关系**。
3. 继承只允许技术检查与不可变产物。补件命令、人工决定、评分、外部通知和学校动作必须保留各自幂等回执与权限门禁，不因恢复而重放。
4. 返回给 F09 读模型的最小可观察信息：`newRunId`、`parentRunId`、`reusedCheckIds`、`invalidatedCheckIds`、各自原因和已提交状态。可放在既有受控 Run 产物/诊断投影，不另建 `RunV3` 或第二存储。

**影响范围：** Pi 结果生成与 Run 写入、F05/F06 事实/来源版本、F07 检查计划与覆盖、F08 确定性检查、F11 正式决定资格。此 CR 不授权 F09 分支直接修改共享 writer、IPC、Preload 或公共 DTO；集成前仍由已有 Main 严格重审，不声称依赖级增量完成。

## 5. 交付后仍须签收

- A18：模板与原件就绪后的一次启动 → 全部可自动步骤 → 必要待办 → 停止/继续，不重复业务动作的普通 GUI 旅程。
- A11：同时切换两案、慢回调、同案不同代次、崩溃重启、材料/政策/事实版本变更与历史报告一致性。
- CR-F09-01：在真实跨 Run 不同输入中，证明未受影响检查保持可追溯结果，受影响检查精确重跑，旧决定绝不自动升级。
- 本仓 `AGENTS.md` 要求功能变更同步 `AGENTS.md` 与 `README.md`，但又要求修改前取得用户许可；本 F09 分支**未擅自修改这两个共享文件**，由协调者批准后在集成阶段统一同步。Electron 包 patch 版本按仓库规则前进一版，合并时需要与并行分支协调。
