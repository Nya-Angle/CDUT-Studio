# 审核当前状态与开发者交接

> **当前交付安排（2026-10-11）：** 已授权向上游创建阶段成果 Draft PR，范围及剩余工作见 [28 号状态](28-review-stage-delivery-status.md)。模块化模板已初次验证但仍在开发，大批试测模板未纳入，富文本完整解析等待上游更新。[27 号后台会话建议](27-background-review-session-proposal.md)仅有文档，未改实现。以下“不提交上游 PR”是此前阶段的历史安排，已被本轮授权取代。

> 当前版本 `0.15.153`：上游后续两个提交与审核的压缩账本策略已整合；实际 `bun run dev` 和离线审核回放见 [26 号复验](26-upstream-refresh-dev-acceptance.md)。下文及 24/25 号保留各自基线的证据。

> 前次整合记录：已将上游 `8126059c` 与测试仓库审核模块合并为完整项目，Electron `0.15.152`、shared `0.1.65`；当时交付到测试仓库继续开发、不向上游提交 PR。整合与验证边界见 [25 号整合记录](25-upstream-review-integration.md)，下文及 24 号保留此前批量审核的验收基线。

> 2026-10-11 最新入口：[24 号独立复验](24-batch-review-independent-final-acceptance.md)。路径安全与 21 号 UI 问题已修复，版本为 `0.15.151`；使用者已授权验收合格直接合入测试仓库 `main`。内置离线账户入口仍是 **CDUT 专区 → 材料审核 → 批次管理**，账号见 [B 阶段验收入口](16-batch-review-stage-b-local-acceptance.md#离线桌面验收入口)。20/21 号以及下文的 `38acb1d0` 验证记录保留为历史证据，不表示当前仍有旧阻断。

更新日期：2026-10-11。最新代码验证以 26 号为准，阶段交付和剩余工作以 28 号为准；下文保留初始交接详情。

## 初始交接的分支与仓库（历史基线）

- 交接目标仓库：公开副本 `https://github.com/Fuck-GH-Admin/cdut-studio-review-agent`，分支 `feat/batch-review-triage-v1`。
- 功能核验基线：`38acb1d0348e74651978cd942584ba7b1cb4fe73`（短 SHA：`38acb1d0`）。本地测试工作区快进至该提交时与远端功能分支一致；本交接文档记录的是该代码基线的状态。
- 对照公开副本 `main`：`122d26e3a0c04e6adcd55653ded289ec7efe56d8`。核对时功能分支含有 69 个 `main` 不含的提交，且 `main` 另有 2 个功能分支尚未包含的提交；功能分支未合入公开副本 `main`。合并前要检查这 2 个提交并处理差异，不能只凭“领先”数字直接合并。
- 此工作区的 remote 命名容易混淆：`mine` 指向公开副本；`origin` 与 `upstream` 都指向 `Nya-Angle/CDUT-Studio`。在这个工作区更新公开功能分支时使用 `mine`。新开发者可以直接从公开副本克隆该分支：

  ```bash
  git clone --branch feat/batch-review-triage-v1 https://github.com/Fuck-GH-Admin/cdut-studio-review-agent.git
  cd cdut-studio-review-agent
  bun install --frozen-lockfile
  ```

- 本轮没有向 `main` 合并。文档交接提交不改变已核验的批次功能代码；所有验证结果对应上面的功能核验基线。

## 初始交付状态（后续复验见 24 号）

当前功能分支包含批量审核 A、B，以及需要审核员先逐批授权的 C 阶段自动处理。B+C 的专项自动化回归、全 workspace 类型检查、边界检查和 Electron 构建均已在本地通过。真实桌面 UI 流程仍未端到端验收；测试使用合成数据，没有对真实申请材料或学校业务系统写入。

| 能力 | 当前状态 | 边界 |
| --- | --- | --- |
| 批次创建、队列执行、中断恢复 | 已实现并纳入专项测试 | 仅执行显式排队案卷；中断恢复后需审核员检查运行再定向重试 |
| 技术失败/运行不完整案卷定向重试 | 已实现并纳入专项测试 | 不应重跑有效完成或已有正式业务决定的案卷 |
| 候选分流、相似问题组 | 已实现并纳入专项测试 | 分组和“可通过/可补件候选”本身不等于业务决定 |
| 选择部分案卷集中处置 | 已实现并纳入专项测试 | 服务端重新读取当前案卷、运行、材料、模板、证据与阶段；预览确认后逐案走既有 V2 事务 |
| 正式人工通过、退回和补件 | 复用既有 V2 事务，已覆盖专项回归 | 每案独立校验、审计和返回成功/排除/冲突/失败；无权限或过期数据不能绕过 |
| 显式批次自动处理 | 已实现；专项测试通过，界面待人工验收 | `assist` 是默认；`auto-return`/`auto-approve` 需要本地审核员逐批确认，并受批次修订与模板版本约束 |
| 自动退回补件 | 受限实现 | 仅在已确认发布规则、检查有效、问题均可补正且存在有效证据时创建正式退回；所需材料来自规则的 `requirement` |
| 自动通过 | 受限实现 | 除逐批授权外还要求全局 `reviewAgentAutoApproval` 与模板 `autoPassPolicy.enabled`；须单阶段、非校方归属、无评分/名额/逐事项人工认定，全部有效材料和规则检查均有本轮覆盖且业务门槛通过 |
| 补件满足后的回流 | 已实现并纳入专项回归 | 所有有效补件请求经人工确认满足后才重新入队；必须新跑审核，旧运行不能用于新决定 |
| 批次定稿 | 已实现并纳入专项回归 | 所有案卷都须有可追溯最终决定且无未结补件 |
| 学校身份、校方授权和远端生效 | 未接入 | `actorSource='system'` 是本地审计来源，不是学校身份或校方签章 |
| 跨案推断、自动最终驳回、无人审阅的无条件审批 | 未实现/不支持 | 不属于当前自动化范围；未知、冲突、证据不足或需人工业务判断时保留给审核员 |

“自动通过”是一个需要人先授权且有严格硬门槛的本地工作流功能，不表示模型可以自行决定是否启用，也不等同于学校已授权的正式审批。功能开关与策略撤销、材料完整读取、有效政策来源、输入哈希、事务幂等都是复核重点。详细场景见 [C 阶段自动化验收](17-batch-review-stage-c-local-acceptance.md)。

## 代码入口

从这里追踪一条完整链路：

1. [分流、有效性校验与保守聚类](../../../packages/shared/src/review/batch-review-triage.ts)：按批次/案卷/运行/规则与证据生成候选路由及问题组，不直接写业务决定。
2. [队列状态、恢复、定向重试与批次存储](../../../apps/electron/src/main/lib/review/batch-store.ts)。
3. [自动动作准入门槛](../../../apps/electron/src/main/lib/review/batch-automation-gates.ts) 和 [自动处理服务](../../../apps/electron/src/main/lib/review/batch-automation-service.ts)：再次验证批次策略、有效材料读取、规则覆盖、来源证据、案卷阶段和业务就绪条件。
4. [问题组人工操作服务](../../../apps/electron/src/main/lib/review/batch-group-action-service.ts)：预览、逐案复验、幂等应用和回执。
5. [审核 IPC](../../../apps/electron/src/main/lib/review/review-ipc.ts) 与 [Preload API](../../../apps/electron/src/preload/index.ts)：队列、批次操作、人工问题组操作、自动处理和定稿的受控入口。
6. [BatchPanel](../../../apps/electron/src/renderer/components/content-review/BatchPanel.tsx)、[人工集中处置弹窗](../../../apps/electron/src/renderer/components/content-review/BatchGroupActionDialog.tsx) 和 [自动处理策略弹窗](../../../apps/electron/src/renderer/components/content-review/BatchAutomationDialog.tsx)：批次交互。
7. 正式业务写入仍复用 [V2 workspace business service](../../../apps/electron/src/main/lib/review/workspace-business-service-v2.ts) 与 [stage workflow](../../../apps/electron/src/main/lib/review/stage-workflow.ts)，不要在批次层另造一套决定存储。

主要回归位于 `packages/shared/src/review/batch-review-triage.test.ts`、`apps/electron/src/main/lib/review/batch-store.test.ts`、`apps/electron/src/main/lib/review/batch-group-action-service.test.ts`、`apps/electron/src/main/lib/review/batch-automation-service.test.ts`、`apps/electron/src/main/lib/review/stage-workflow.test.ts`、`apps/electron/src/main/lib/review/workspace-business-service-v2.test.ts`、`apps/electron/src/main/lib/review/case-store-v2.test.ts` 和 `apps/electron/src/main/lib/review/template-store.test.ts`。

## 本次验证记录

在提交 `38acb1d0` 上执行：

```bash
bun test --isolate --timeout 30000 \
  packages/shared/src/review/batch-review-triage.test.ts \
  apps/electron/src/main/lib/review/batch-store.test.ts \
  apps/electron/src/main/lib/review/batch-group-action-service.test.ts \
  apps/electron/src/main/lib/review/batch-automation-service.test.ts \
  apps/electron/src/main/lib/review/stage-workflow.test.ts \
  apps/electron/src/main/lib/review/workspace-business-service-v2.test.ts \
  apps/electron/src/main/lib/review/case-store-v2.test.ts \
  apps/electron/src/main/lib/review/template-store.test.ts
bun run typecheck
bun run check:boundaries
bun run electron:build
```

结果：**109 项通过、0 失败**；workspace 类型检查通过；`check:boundaries` 通过；Electron 主进程、预加载、renderer、CLI 与资源构建通过。构建仍会报告既有的 `pdf.worker.mjs` externalization、EMF 浏览器端 Node 模块 externalization 和大 chunk 警告，没有阻断构建。本地 Bun workspace 已把 OOXML 包提升到根 `node_modules`；最新分支的构建脚本已支持此布局，不需手工改依赖或 stub WASM。

尚未完成：真实 Electron 页面上的多案批次手动验收、确认不同授权策略对应的控件和回执、合成材料从补件到重新入队再审核的整条可视流程，以及公开副本 `main` 上那 2 个独有提交与此分支的合并评估。上述项目没有被本次单元回归或构建覆盖，不能标成“完整 UI 验收通过”。建议按 [B 阶段场景](16-batch-review-stage-b-local-acceptance.md) 与 [C 阶段场景](17-batch-review-stage-c-local-acceptance.md) 使用合成案卷逐项操作并记录结果。

## 新开发者建议顺序

1. 阅读本页，确认自己在公开副本的 `feat/batch-review-triage-v1`，并记录当前 `HEAD`；不要把当前功能分支误认为上游 `Nya-Angle/CDUT-Studio` 已包含的内容。
2. 阅读 [16 批次行为规范](16-batch-review-automation-and-issue-clustering-spec.md)、[B 阶段验收](16-batch-review-stage-b-local-acceptance.md)、[C 阶段验收](17-batch-review-stage-c-local-acceptance.md)。若需理解整个审核模块，再从 [审核设计导航](00-overview.md) 按阅读顺序继续。
3. 先运行上面的 8 文件专项回归，再运行类型检查、边界检查和 Electron 构建；接着使用全新的临时 `PROFER_CONFIG_DIR` 和 `PROFER_USER_DATA_DIR` 启动开发版，再测合成案卷。仅指定 Electron `--user-data-dir` 不足以保证本项目认证配置隔离；不要用日常主配置跑初次验收。
4. 先做 UI 验收和记录失败，不改业务规则。确认默认 assist 不写正式决定、逐批授权能撤销、自动动作逐案回执可查、每个阻断原因可见、补件满足后要求新运行，以及定稿拒绝不完整批次。
5. 再处理公开 `main` 的两个独有提交与功能分支的分叉，检查 CI/手动验收结果。只有用户验收和合并策略明确后再合入 `main`；上游源项目与公开副本仍要区分。

Linux 有图形桌面时，可在仓库根目录使用下面的命令启动隔离开发实例；无图形桌面时在 `bun run dev` 前加 `xvfb-run -a`。它会使用全新的配置和 Electron 用户数据目录，不读取日常 CDUT 登录态：

```bash
review_profile="$(mktemp -d /tmp/cdut-review-dev.XXXXXX)"
PROFER_CONFIG_DIR="$review_profile/config" \
PROFER_USER_DATA_DIR="$review_profile/user-data" \
PROFER_DEV_INSTANCE=review-handoff \
PROFER_VITE_PORT=5176 \
bun run dev
```

结束开发进程后可删除该临时目录。审核页面若显示登录门槛，表示本次没有完成对应 UI 操作；不要以 renderer 成功加载冒充审核功能通过。初次验收使用合成案卷，不要把真实申请材料放进测试批次。
