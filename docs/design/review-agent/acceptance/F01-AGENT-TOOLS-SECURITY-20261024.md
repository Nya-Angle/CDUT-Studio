# Review V3｜F01 Agent 工具安全合同｜阶段交付 R01

日期：2026-10-24（Asia/Shanghai）
仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
固定起点：`feat/v3-r02-template-library@150acfe761cb7ad0424a2ca009fd57f12dbfddfd`
独立分支：`fix/v3-f01-agent-tool-contract`
状态：**CODED / PASS_SCOPED / 待统一集成 HEAD 实机验收**。此分支不合并其他任务，也不直接向统一 base 推送。

## 1. 原来错在哪里

1. 指派 `turnId` 虽落盘，`checkAssignment` 与工具注册却不绑定一次真实 Pi `sendMessage` 执行轮次；同一会话在后续用户轮次可能重复使用旧授权。
2. `review_get_case` 只需 `caseId`，未校验任何有效指派；`review_list_cases` 不带指派可列出所有案卷。`review_get_run_status` 同样可无指派读取任意案卷的运行摘要。
3. `review_cancel_run` 虽验证指派的 `caseId`，但调用 `cancelAsyncRun(runId)` 前没有证明 `runId` 归属该案卷。并且未绑定案卷的建案型指派可以越过若干案卷操作的可选 `caseId` 判定。
4. `review_create_case` 的工具描述承诺 requestId 幂等，但参数没有 requestId；每次随机生成 caseId，重试可能产生不同案卷。

上述是确定性的源码合同缺口，不等于已经复现真实跨用户入侵。学校身份与权限另由 F02 等批次负责。

## 2. 为什么这样改、具体改了什么

| 合同 | 修复选择与理由 | 改动文件 |
|---|---|---|
| 轮次 | 复用 Main 编排器已经生成的 `runGeneration` 作为 `executionTurnId`，由 Pi 内置工具层传递；首次工具调用绑定指派并持久化，后续执行轮次复用拒绝。避免信任 Renderer 自称的 `turnId` | `agent-orchestrator.ts`、`pi-builtin-tools.ts`、`review-agent-assignment.ts` |
| 查询权限 | 列案卷、读案卷、读 Run 状态都需 `assignmentId`，且必须匹配已绑定案卷；不再向无指派 Agent 枚举所有案卷 | `pi-review-ops-tools.ts` |
| Run 取消 | `getRunById(caseId,runId)` 返回非空、内部 `caseId/id` 双匹配后，才能按 runId 执行取消；未绑定案卷的指派不能操作任意案卷 | `pi-review-ops-tools.ts` |
| 幂等建案 | 显式必填 `requestId`；由 `assignmentId + requestId` 哈希得到确定性 caseId，使用现有 V2 创建回执的 payloadHash 识别同一载荷。成功重试返回原案、不同载荷拒绝、并发碰撞按原回执恢复，无需第二套幂等真值存储 | `pi-review-ops-tools.ts` |
| 可继续使用 | 指派首次被真实轮次使用后，UI 标明“本轮已使用”，允许后续轮次再次显式指派；不长期锁死“交给 Agent”按钮 | `ReviewAssignmentCard.tsx` |

业务案卷仍由已有 `createCaseFromTemplate` / `createAggregate` 写入。**没有添加第二套 Case/Plan/Run/Decision 真值存储，没有新增学校身份或自动批准。**

## 3. 最小反例、验证与结果

### 真实执行的专项测试

`bun test apps/electron/src/main/lib/review/review-agent-tools-f01.test.ts`：**5/5 PASS**。

- 未指派不得读取或列举；指派 A 仅读 A，跨案 B 拒绝。
- 同一 `assignmentId` 的执行轮次 A 成功，执行轮次 B / automation / 其他 session 失败。
- 错案卷传入合法运行 ID，不执行取消；非归属 Run 状态不外泄；未绑定案卷指派拒绝跨案操作。
- 同一 `requestId` 重试返回同一案卷且仅一条创建回执；相同 ID 不同载荷拒绝，不同 ID 不能复用一次性建案指派。
- 两个并发同 requestId 建案调用只产生一个聚合，两个调用返回同一个 caseId。

### 关联回归

`bun test` 三个文件：F01 新测试、`pi-builtin-tools.test.ts`、`review-strict-profile.p02.probe.test.ts`：**51/51 PASS，265 assertions**。

`NODE_OPTIONS=--max-old-space-size=4096 bun run --filter='@profer/electron' typecheck`：**PASS**。

第一次使用默认 2 GB Node 堆做 Electron 类型检查发生 **Node OOM（exit 134）**；把堆设置为 4 GB 后完整通过。不能把首轮 OOM 当作 TS 代码错误。

另将 `review-pi-run-bridge.main.test.ts` 加入 Bun headless 组合运行时，**51 PASS / 1 ERROR**：该测试在导入 Electron `ipcMain` 时触发 `Export named 'ipcMain' not found`（需要专用 Electron mock/运行环境）；发生于测试初始化，不是 F01 断言失败。仍需在对应测试宿主验收。

`git diff --check` 与新增测试文件的 TypeScript 解析：PASS。

## 4. 兼容性与剩余风险

1. `review_get_case`、`review_list_cases`、`review_get_run_status` 现在都需要 `assignmentId`；`review_create_case` 必须带 `requestId`。旧 Agent 提示词/调用参数若未更新，将得到明确拒绝，不能默默降级。
2. Main `runGeneration` 是可信**执行**轮次，UI `turnId` 仍是按钮生成的授权记录字符串。当前保证“首次使用后不可跨执行轮次复用”；**尚未证明 UI 的 grant turnId 与真实 SDK user message ID 相等**。更严格的授权来源映射需要统一入口 owner 后续完成。
3. `ReviewAssignmentCard` 目前使用历史 `local-main` 会话占位，不代表学校真实身份；真实多用户/角色级授权由 F02 与统一 Main 权威身份任务负责。
4. 没有 Electron GUI 的真人手动点击、跨进程崩溃恢复、学校账户或三 PR 统一 HEAD 的实机验收。本分支不宣称 PRODUCT_ACCEPTED。
5. `README.md` 与 `AGENTS.md` 因仓库要求修改前先获得用户授权，本分支没有擅自修改；交由仓库所有者确认后按集成版本同步说明。

## 5. 接收与集成合同

- F01 只修改 Agent 工具/指派权限及必要的 Host 执行轮次传递和 V2 指派卡片；未改共享 `review-ipc.ts`、`preload/index.ts`、C0 Case/Run 或 144 套模板。
- 本分支基于固定 R02 HEAD；后续由 #246/#249/#250 集成负责人在统一已验证 HEAD 上审查/cherry-pick，不自动合并、不强推。
- 合并后最小验收：**两案跨读拒绝 → 不同执行轮次旧授权拒绝 → 错案跨取消拒绝 → 相同 requestId 单案并发重试成功 → 原正常收件/审核不回退**。

## 6. 五项复盘

- **错误**：旧指派复用、无授权读取、取消缺 Run 归属、建案幂等参数虚设。
- **原因**：Main 真实轮次未下传到工具；读取被视为公开；取消按全局 runId；建案直接随机生成 ID。
- **修改**：可信轮次租约、案卷绑定强制门禁、取消前读取 Run 身份、确定性 idempotency + 原创建回执验证。
- **证明**：上述 5 项 BDD 反例与 51 条合并专项/关联单测通过，Electron 类型检查通过。
- **未闭**：学校身份认证、真实 GUI、跨版本集成、历史 grant→SDK user message 精确映射。
