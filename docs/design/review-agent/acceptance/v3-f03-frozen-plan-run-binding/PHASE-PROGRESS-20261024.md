# Review V3｜F03 冻结 Plan 与权威 Run 身份绑定｜阶段交付（2026-10-24）

## 0. 本次边界与基线

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`。
- 独立任务：**F03｜冻结 Plan 与权威 Run 完整绑定**。
- 源基线：`integration/v3-r02-pr246-249-250-20261024@7773de6afc9c4a16934076b8b5bdb61a2e8bc9a2`（集成 Draft PR #265）；不改来源 #246/#249/#250，也不推到 `main`。
- 本任务分支：`fix/v3-f03-frozen-plan-run-binding`；保持独立 Draft，未经统一集成负责人验收不得合并。
- 仅调整 Main 审核计划/Run 读写校验、共享 Run 类型、反例测试与本报告；不修改 R02 业务模板，不创立第二套 Case/Plan/Run/Decision 存储。
- `AGENTS.md` 要求 README/AGENTS 变动须用户单独同意，本轮未修改二者。

## 1. 原来错在哪里

集成 #265 已经把 T04 专项规则放入同一个 `run-pi-*`，并且在部分场景写入 `inputManifest.planFingerprint`；这部分不能重复判定为“没有指纹”。剩余缺口更具体：

1. 单个字符串指纹没有携带原始 `CanonicalPlan.planId` 和完整 `PlanBinding(checkKey×targetKey×objectKey×subjectId×sourceVersionIds)`；D2 也没有在 Run 中冻结对应技术任务包的逐项 mapping。普通 Pi Run 的 Check 目标身份缺少一份创建时清单。
2. `isWorkspaceRunStaleV2` 和 `assertCurrentRun` 主要按案卷材料/事实哈希判断当前性；**若 Plan/Check 绑定独立变化而这些输入未变化**，旧 Run 可能继续参与人工待办、决定及报告的“当前”解释。
3. Pi 续跑和结果提交只显式核验部分 D2 指纹，没有全面检查 T04 PlanId、原始指纹、完整绑定与结果 Check 目标是否仍一致。
4. V2 兼容执行器 `run-service-v2.ts` 曾将裸 `policyVersionIds` 默认登记为 `version:1`。这不是可信的 PolicyVersion 来源。
5. T04 编译器适配来源列表的展示顺序可能影响计划指纹，尽管内容未变；会造成不必要的旧 Run 失效。

## 2. 为什么这样修

保留唯一持久 RunStore 和现有 `CaseAggregateV2`，在 **Run 自身的 inputManifest** 增加只读快照，由可信 Main 用当前聚合与模板编译结果再次比较。这样既能追溯历史输入，也能在作决定之前拒绝旧计划/串换 Check，而不需要新增第二套写入真值。

两类计划不能混同：

- **已发布模板 T04**：由编译器提供真正的 `planId + fingerprint + PlanBinding[]`；现有派生运行指纹保留兼容，但不能冒充 CanonicalPlan 原始指纹。
- **D2 技术预审**：保存 `d2-technical` 指纹与业务对象/来源 mapping；D2 没有 C0 PlanId，绝不伪造。其技术检查不产生正式校方批准。
- **已经绑定独立 C0 CanonicalPlan 的案卷**：普通 Pi Run 不是 C0 `RunEvidenceIdentity`，不能借普通 Pi 存储“认领”权威技术执行资格；必须经原有可信 C0 Run 路径。

缺少新计划证明的旧 `run-pi-*`/`run-tpl-*` 继续可以作为**历史运行读取**，不得自动按当前有效审核依据处理。真正 V1/V2 的遗留 Run 保留原有兼容校验边界，交 F07 统一处理。

## 3. 本轮实现内容

| 路径 | 变更 |
|---|---|
| `packages/shared/src/types/review-v2.ts` | 对 Run `inputManifest` 增加区分来源的 `frozenPlan` 和 Pi `plannedCheckBindings`，字段均可选以支持旧 JSON 历史读取 |
| `review-v3-run-plan-binding.ts`（新增） | 快照真实 D2/T04 计划；回读后重编译核对 PlanId、指纹、Check×目标×来源版本及 Pi 检查身份；失败给出原因 |
| `pi-case-review-service.ts` | 创建唯一 Pi Run 时冻结上述身份；续跑与提交前统一校验，旧计划不得混进同一 Run |
| `workspace-business-service-v2.ts` | 人工处置、业务决定、当前 Run/报告的共享新鲜度判定追加 Plan 证明检查 |
| `review-v3-main-template-run.ts` | 既有 T04 只读编译结果同时携带编译器原始 `CanonicalPlan` 身份；兼容 `run-tpl-*` 保留此快照 |
| `review-v3-main-template-plan-bridge.ts` | 当前有效来源版本按稳定 `versionId` 排序，避免仅展示顺序引起假升版 |
| `run-service-v2.ts` | 裸政策 ID 不再映射成凭空的 v1；只记录精确存在的 PolicyRef 版本 |

### 本轮不能宣称的事情

- 本地 PolicyRef/负责人确认 **不是** 真实学校正式政策发行权。没有认证时，报告不得称“校方制度已核验”。
- T04 编译器的语义待确认项不是已经由确定性算子执行；`not-executed` / `awaiting-confirmation` 仍然阻断自动通过。
- 普通 Pi Run 的动态 Check 清单来自该 Run 的可信初始计划，不能以其代替独立 C0 执行签收；真正的 C0 还有独立 RunEvidenceIdentity 与 Owner 证明链。
- 不自动合并 F01、F02、F06、F07，也不承接 F04/F05 的重分类/升版 UI。

## 4. 可重复验证与反例

运行时：**Bun 1.4.2 / TypeScript 5.9.3**，基于仓库 `bun.lock` 安装，无新增项目依赖。

```bash
NODE_OPTIONS=--max-old-space-size=4096 bun run --filter='@profer/electron' typecheck

bun test \
  apps/electron/src/main/lib/review/run-service-v2.test.ts \
  apps/electron/src/main/lib/review/review-v3-main-template-run-unified.test.ts \
  apps/electron/src/main/lib/review/review-d2-runtime.test.ts \
  apps/electron/src/main/lib/review/pi-case-review-service.test.ts \
  apps/electron/src/main/lib/review/workspace-business-service-v2.test.ts \
  apps/electron/src/main/lib/review/review-v3-t05-main-service.test.ts \
  apps/electron/src/main/lib/review/review-v3-t05-business-mode.test.ts \
  apps/electron/src/main/lib/review/review-v3-core-t03-run-gate.test.ts \
  apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts
```

第一组结果（本次修改后的同一工作树）：**106 PASS / 0 FAIL / 518 assertions**；Electron typecheck **PASS**。

追加相邻集成回归（5 个不重复的测试文件）：`review-v3-report-service.test.ts`、`review-v3-main-template-plan-bridge.test.ts`、`stage-workflow.test.ts`、`material-lifecycle-v3.test.ts`、`review-v3-main-author-plan-ipc.test.ts`：**64 PASS / 0 FAIL / 349 assertions**。两组合计 **170 PASS / 0 FAIL / 867 assertions**；修改后的最终 Electron typecheck 再次 **PASS**。没有将未执行的 Electron LIVE/学校认证流程算入测试通过数。

重点 BDD 反例：

1. 真实 Pi Run 保存 T04 `planId`、原始指纹、绑定列表和所有 Check 目标；在材料/输入哈希不变时，改掉 PlanId、任何绑定的 `sourceVersionIds` 或结果 Check 目标，当前性校验拒绝；还实测 RunStore 持久数据读回后的 stale=true。
2. D2 合成案卷：原技术 mapping 可验；任一来源映射被替换，旧 Pi Run 不能冒用。现有档案“查阅不等于复制”三次分批语义提交仍通过。
3. 两份相同内容原件仅更换显示顺序，T04 原始 Plan 与派生运行指纹保持不变。
4. 只有裸 `policyVersionIds`、没有精确 `policyRefs`，Run 不再生成 `version:1` 的假政策引用。
5. T03/T05 的既有阶段门禁、旧 V2 决定兼容、Pi 续交、历史读取没有被本轮改写为第二种真值。

## 5. 剩余风险与集成签收

1. 目前是**代码级/自动化验收**。真实 Electron GUI、跨进程关闭恢复、真实模型提交、补件后 C0 升版重建与 T08 多角色权限仍未在本 F03 HEAD 做 LIVE 验收。
2. 现有历史 `run-pi-*`/`run-tpl-*` 缺少 F03 追加证明时只能按历史读；需新审核生成当前绑定。旧 V1/V2 迁移清理由 F07 负责。
3. C0 Plan 已安装案卷须沿用独立可信技术执行口，不能用普通 Pi Run 代替。将来如要在同一个 UI 聚合两类 Run，需要统一集成人负责明确权威来源，不得引入多 Run 竞争。
4. 若学校 PolicyVersion 真实认证服务仍不可用，只有本地政策版本可核验，不能向师生显示为“学校已批准”。
5. 后续由集成负责人以 PR #265 及 F01/F02/F04/F05/F06/F07 通过验收的固定 HEAD 做最终 cherry-pick/合并，针对共享类型与 F07 对 `workspace-business-service-v2` 的边界做复验；保持 Draft，不自动合并。

**当前结论：F03 代码实现与定向回归通过（PASS_SCOPED），生产可用性仍是 PENDING_INTEGRATION/LIVE。**

## 6. GitHub 连接器发布记录

- 本地实现提交：`9e203e932bdc0374bcebde8f25bc1195f5cf9cff`。
- 通过 GitHub 连接器逐文件上传并校验 Blob，远端重建提交：`1154577778d7c0220416fd7fed23defbcc1b2053`。两端 SHA 不同是创建提交机制所致，并非代码不一致；**代码+本报告初版 Tree SHA 均为 `5c46b81843e09a1c27f432e6ce6e56d44082b868`**。
- 建立 [Draft PR #268](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/268)，head 为 `fix/v3-f03-frozen-plan-run-binding`，base 为 `integration/v3-r02-pr246-249-250-20261024`（PR #265 对应集成分支）。比较记录：ahead 1、behind 0、11 个变更文件。
- 连接器复查 PR：`draft=true`、`state=open`、`mergeable=true`，但 `mergeable_state=unstable`；不得解释为 CI/实机验收已通过。
- 追加本节仅为发布元数据更新，**不更改已验证功能代码**；最终分支提交以 GitHub PR 的最新 HEAD 为准。

## 7. 继续复核：远端 CI 根因与旧模板 Run 的真实材料身份（2026-10-24）

用户要求复核 F03 最新进度并继续后，再次通过 GitHub 连接器读取 PR #268 的最新 HEAD、四条 Actions 结果与失败作业完整日志：

| CI 工作流 | 结果 | 实际证据 |
|---|---|---|
| Review batch focused tests（run 40098698109） | PASS | `test-batch` 成功 |
| D2 Scoped Pi Review Tests（run 40098698099） | PASS | `scoped-pi` 成功，含 workspace typecheck |
| Review Baseline CI（run 40098698105） | FAIL | `packaging-guards.test.ts:180`，版本 `0.15.165` ≠ CHANGELOG 首条 `0.15.163` |
| PR CI（run 40098698120） | FAIL | 同一打包版本断言；其余 **5078 pass / 5 skip / 1 fail**，typecheck、构建、T08/F16 定向测试均通过 |

使用 `git show 7773de6a:apps/electron/package.json` 与 `git show 7773de6a:apps/electron/resources/CHANGELOG.json` 在 **F03 修改前的 PR #265 基线**独立确认已经分别为 `0.15.165` 与 `0.15.163`。F03 从未改动这两份文件，两个红灯属于**可复现的基线打包元数据不一致**，不归因于 Plan/Run 功能，也不擅自在本独立子 PR 改动产品发版信息。由集成/发布负责人统一修正。

继续代码复核发现 F03 自身真实兼容缺口：非原生 V3 的 `run-tpl-*` 仍允许作为历史兼容入口，但其 `inputManifest.documentVersions` 以前只收录 active 原件，并使用 `byteHash ?? versionId` 充当 `contentHash`；新 F03 当前性检查要求**包括非 active 旧版本的完整原件清单与真正 `contentHash`**，因此刚产生的运行也可能被误判过期。

修复边界严格限定为 F03 身份一致性：

1. `review-v3-main-template-run.ts` 的 `run-tpl-*` Manifest 改为冻结**所有原件版本**，仅写入真实 `contentHash`；T04 判定仍只读取 active 原件，不让旧版本参与业务结论。
2. `review-v3-fallback-chain.test.ts` 增加反例：同案 active 与 inactive 两个版本、`byteHash ≠ contentHash`。先以旧代码重现实验 **FAIL**（新 Run stale=true），再修复为 **PASS**；新 Run 的全部精确版本身份被断言，原 Run 在变更原件后仍须 stale=true。
3. 同时补测旧模板独立 Run 六套示例与统一 Pi 入口，保证未因修复恢复原生 V3 的第二份 `run-tpl-*` 写入。

继续复核后的同一工作树，**16 个相关测试文件、177 PASS / 0 FAIL / 917 assertions**；Electron 全量 TypeScript typecheck **PASS**；`git diff --check` **PASS**。曾尝试容器内更广泛的 `apps/electron/src/main/lib/review` 测试目录，部分 WebSocket/本机 `listen(127.0.0.1)` 测试受执行沙箱 `EPERM` 阻断，该尝试不计入通过数；远端独立的全仓 PR CI 已实际执行 5084 项，只因上述基线版本断言红灯。

本阶段保持 **CODED / PASS_SCOPED / CI_BLOCKED_BY_PREEXISTING_RELEASE_METADATA / PENDING_INTEGRATION_LIVE**。F03 不自行合并，不扩大到产品发版文件、学校身份授权、F07 双轨去重或 F01/F02/F04 改动。
