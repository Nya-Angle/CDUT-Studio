# F07｜持久恢复与旧入口边界｜阶段交付（2026-10-24）

## 0. 当前定性

- **任务**：F07，持久恢复、旧 V1/V2 边界隔离，不新增第二套 Case/Run/Decision 真值。
- **独立实施基线**：`59612a7a1e42c4066ac5cc1074f4009652fad5bc`（PR #249，`fix/v3-single-review-run-supplement-20261024`）。
- **本地分支**：`fix/v3-f07-recovery-legacy-boundaries`。#246/#249/#250 尚无已验证统一 HEAD；因此本报告**不宣称**跨 PR 完整端到端验收。
- **阶段结论**：F07 的 T05 持久化基础、迁移案卷旧 V2 决定拒止、旧 V1 直写拒止已有代码和定向测试；真实 Electron 退出/重启、与 #250 报告归档联测，以及可信 Main 物理确认端口接线仍待统一集成。

## 1. 原先错在哪里

1. `review-v3-t05-main-service.ts` 使用 `Map<caseId, confirmation>` 保存本地业务发布确认。退出进程后信息丢失，冻结 CanonicalPlan 被降级为技术预审；且登记 API 实际上仅被单测调用，不能据此认为真实 Main 授权来源已经接通。
2. `stage-workflow.ts` 已挡住 `isNativeWorkspaceCaseV3` 的旧阶段决定，却没有覆盖由 V1 迁移、后续绑定 CanonicalPlan 的 V2 聚合。这类案卷在旧入口可生成 `basedOnRunId=run@rev...` 的虚拟决定。
3. `case-store.ts` 已保护原生 V3 直接 `saveCase/updateCase`，但迁移案卷进入正式 Plan/Run/Decision 后仍允许旧 V1 shadow 写入；底层 `saveRun` 也未自行检查原生业务写入边界，仅靠 IPC 入口拒止。

## 2. 为什么这样修改

- **不加新真值仓库**：确认放入现有 `CaseAggregateV2`，通过 `submitCommand` 逐案 CAS、revision、requestId、回执原子落盘；读取从原案卷状态恢复。
- **不伪造发布身份**：确认仅代表本机试办，必须有可信 Main 的现场授权回调；拒绝 Renderer 自称的教师/学校角色。D2 技术预审、归档案卷、Plan/模板不匹配均不获得业务权限。
- **不牺牲历史读取**：迁移案卷的历史 V1 投影可读，真正被冻结的是旧入口向它写入当前结果；普通尚未冻结的迁移案卷仍保留原有兼容行为。
- **不与集成会话争夺 IPC**：本批没有改写 `review-ipc.ts`、Preload 或 #246/#249/#250 的共享接线；旧入口拒止放在最终落盘服务/领域事务校验中。

## 3. 改动清单

| 文件 | 修改 | 预期保护 |
| --- | --- | --- |
| `packages/shared/src/types/review-v2-contracts.ts` | 聚合内新增可选本地业务确认字段 | 与既有 Case 真值和回执一起恢复，不另建文件 |
| `review-v3-t05-main-service.ts` | 删除 Map 登记，提供需 Main 可信确认回调的 CAS 写入及聚合读回；指纹、模板、操作者、归档校验 | 退出后不丢确认；旧确认不跨升版生效 |
| `stage-workflow.ts` | 旧 V2 决定拒止延伸至任何已绑定 CanonicalPlan/技术 V3 Run 的聚合 | 迁移案卷不能借旧入口生成 `run@rev` 决定 |
| `case-store.ts` | 冻结或产生 V3 权威状态的迁移案卷禁止旧 V1 直写；底层 `saveRun` 在建立文件前校验 | 不能写影子案卷/影子 Run；历史读不受影响 |
| 三份关联测试 | 新增/扩展本地确认、升级失效、伪教师拒绝、旧入口跨类型拒止 | 反例覆盖并保证零额外回执/不产生影子文件 |

## 4. 验证记录

执行环境：Bun `1.4.2`，依赖来自仓库锁文件。用独立测试沙盒，不碰用户真实案卷。

### F07 定向行为回归

```text
bun test --isolate \
  review-v3-t05-business-mode.test.ts \
  stage-workflow.test.ts \
  review-v3-legacy-entry-gates.test.ts

60 pass / 0 fail
```

### 邻接回归

```text
bun test --isolate \
  review-v3-t05-main-service.test.ts \
  case-store.test.ts \
  case-store-v2.test.ts \
  case-lifecycle-v3.test.ts \
  plan-binding-v3.test.ts \
  review-v3-t05-business-mode.test.ts

57 pass / 0 fail
```

### TypeScript

`NODE_OPTIONS=--max-old-space-size=3584 bun run --filter='@profer/electron' typecheck`：**通过**。最初默认 2 GiB 堆 OOM，5 GiB 超过当前容器可用内存遭 SIGKILL；3.5 GiB 调整成功，前两次不是 TypeScript 错误。

### 可验证反例

- 冻结 Plan 的迁移案卷：旧 V1 `saveCase`、`updateCase`、`saveRun` 均拒绝，原 Case/Plan 未变化，拒绝不会创建额外运行文件。
- 冻结 CanonicalPlan 的迁移案卷：旧 V2 `RecordStageDecision` 无法生成虚拟 `run@rev`，无新决定与回执。
- T05 确认：与 Case 同时落盘，重新从磁盘读回可复原；相同 requestId 重放不增加 revision/回执；教师伪角色、错误指纹、缺 Main 端口均不能确认；升版后旧确认不生效。
- 未冻结的历史迁移案卷仍可按旧合同修改普通标题，历史读取不被破坏。

## 5. 尚未关闭的风险及集成交接

1. **Main 物理授权端口待接**：本次实现的是安全持久化写入端口，不凭空安装一个授权源；目前不存在生产路径调用旧的进程内确认登记。集成负责人必须接入真实本机确认/Owner 来源后，才能声称 CanonicalPlan 本地业务发布可由普通 UI 完成。不得用固定 `()=>{}` 在生产中冒充物理确认（单测使用模拟回调仅验证持久化）。
2. **报告跨版本验收待 #250 集成**：本基线没有 #250 的新版 T08/F16 快照归档，实现不能证明历史报告重开与新 Run、决定一致；这需要统一 HEAD 的 Electron 实测。
3. **真实重启未完成**：当前用磁盘冷读覆盖了关键确认状态，但尚未执行完整 Electron 退出→重开→补件、Run、决定、报告恢复旅程。不能把聚合单测替代 GUI 验收。
4. **真实用户/学校权限不是 F07**：本地确认不等于学校政策发布、真实教师认证、正式审批签署；F02/F03 必须独立完成。
5. **跨分支冲突**：提交以 #249 为基线；#246/#250 的汇合尚未完成。最终 PR base、共享服务接线及 Electron 证据归属由统一集成负责人裁定；本批不主动向 `main` 或模板库分支合并。
6. **README/AGENTS 同步**：仓库 `AGENTS.md` 规定修改需用户另行许可，本批未擅改这两份文件；以本阶段报告登记变化，集成时申请文档同步授权。

## 6. 最终验收建议（统一 HEAD 上执行）

1. 真实材料建案、模板/Plan 绑定、本地显式确认、Pi 初审并生成当前 Run；强退/重启后读回确认、材料版本、Run。
2. 补件与纠错导致旧 Run 失效，重新冻结与复审；人工决定仅引用新真实 Run；再次重启仍一致。
3. 原生与迁移后升级的 V3 案卷，分别尝试 `RUN_REVIEW`、旧 V1 写入、旧 V2 阶段决定和跨案伪参，全部失败且无新伪回执。
4. 使用 #250 的历史报告快照；新 Run 或改决定后，历史内容保持只读不变，新的报告只引用新 Run。

**当前不应标记 F07 全部 LIVE 关闭；可标记为“核心安全/持久化补丁已实现，定向验证通过，等待集成与实机”。**
