# V3 M4 F15｜独立评委、回避、缺评、排名与定稿交付 R01

- Owner: F15，协议 ACK `M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 固定共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 分支：`feat/v3-m4-f15-judge-ratings`，Draft PR，**NO MERGE**
- 对应原始目标：F15 / A14；F18 的真实评委离线回件不在 F15 内替代开发

## 本线实现（增量，不重造 T07）

1. 工作台建立轮次时读取 `getBatchV2` 所绑定的 `templateId@templateVersion`，再读 `getTemplateV2`。只有模板确已发布、版本一致、存在合法 `RubricSpec` 才能初始化。保留完整案卷列表，不再最多只读取前 50 项，不注入 `e2e-default-rubric` 演示值。构造逻辑放在纯领域 `review-v3-t07-round-setup.ts` 供 Main 后续复用。
2. 已提交的评委后来发现利益关系时，可由本人或组织者记名回避；有效票即时撤出汇总，原票及理由写入轮次 `revisionHistory`。缺评仍只用于未提交任务，不伪造零分；允许组织者另分配替补。
3. 提交新票、退回改分、撤销已交票时，清除该案旧的分歧复核记录和相关同分人工排序，以免后来改变分数还沿用旧裁决。禁止非同分集合的排序裁决、空批次直接定稿。
4. 组织者界面展示有效人数的分母、回避/缺评/待评人数与各维度参与票数；评委界面提供已交票后的主动回避操作。换批次/角色清空旧视图并防异步旧响应覆盖。

## 留给唯一 Main/IPC Owner 的精确接口请求

### CR-F15-01｜评分初始化与批次锁的可信核验（P0）

- **当前入口**：`review-ipc.ts` 的 `T07_INIT_STATE` 直接收 Renderer 提供的整份 `T07State`；`review-v3-t07-main-service.ts:initT07MainState` 校验 actor role 和 `batchId` 相等后写盘；目前没有以可信 `getBatchV2`/已发布 `TemplateVersion` 重建并检查评分量表、案卷列表、轮次。
- **风险**：改写 Renderer 请求可以替换正式模板量表/案卷集合，绕过本轮 Renderer 校验。F15 的 UI 修复不是可信边界的完成。
- **最小接口**：`initT07State({batchId, expectedBatchRevision?})`，Main 读取当前 `ReviewBatch`、固定 `TemplateVersion` 并使用本线纯领域函数 `createT07RoundFromPublishedTemplate` 派生不可变初始 T07State；对不存在/未发布/不匹配/无量表/空案卷返回明确错误。拒绝 Renderer 传入自定义 rubric、case roster、actor 时间戳。保留现有 `T07_STATE_ALREADY_EXISTS` 及 revision 语义。
- **归属**：Main 集成 Owner；依赖 F14 提供批次锁真值。无需另建批次或 Run store。

### CR-F15-02｜身份、匿名材料与条件 N/A 的可信派生（P0）

- **当前入口**：`deriveT07Actor` 接受 Renderer 任意输入的本地 `reviewerId`，只能说明是本机角色演示；`T07_GET_VIEW` 还接受客户端传入 `safeMaterials`；`T07_APPLY_ACTION` 未提供 Main 来源的 `naEligible` 判定，故含条件 N/A 的完整 A14 尚不能签收。
- **最小接口**：Main 使用可信会话或已签发的离线分配证明绑定 `actorId/actorSource` 与 assignment；由 Main 从原件及授权脱敏资产构造 `T07SafeCaseMaterial[]`，客户端不得自行补充匿名材料；提交 N/A 时按当前已锁模板条件、指定 case 与已核实事实派生 `(caseId, dimensionId) => boolean`。无可信条件时拒绝 N/A 并保留明确待确认状态。
- **归属**：Main/可信身份 Owner、F06 来源权限；正式学校认证另列外部门禁。本机切换评委只作为演示，不计作身份隔离证明。

### CR-F15-03｜T09 评分回件对齐 T07（P1）

- **当前入口**：`review-v3-t09-offline-codec.ts` 已定义 `judge-rating-reply`，`review-v3-t07-rating-adapter.ts` 已可生成 T07 提交提案，但 T09 导入业务仍未原子写入当前 T07 有效 assignment/round/rubric 及回执。
- **最小接口**：签发包绑定 `assignmentId`、可信 recipient、case revision、rubricVersion、round；导入核对 package hash/actionId 幂等、任务和未冻结状态、有效评分与 N/A，然后通过现有 `applyT07MainAction` 及 revision/CAS 提交，冲突提供预览而不覆盖现有票。
- **归属**：F18 开发 offline codec/回件与 Main 集成 Owner 持久接线；F15 不复制一套评分仓库。

## 本轮验证与未签收事项

- 代码路径：`review-v3-t07-rating-workflow.ts`、`ReviewV3T07JudgePanel.tsx`、`ReviewV3T07Workbench.tsx`、新增 `review-v3-t07-round-setup.ts` 和两份定向测试。
- 定向 Node 24 TypeScript 运行时断言：模板锁、60 案、已交票撤销、最低有效人数与冻结均通过。`git diff --check` 通过。
- 当前执行容器没有 Bun 与 monorepo `node_modules`，尝试 `bun run --filter='@profer/electron' typecheck` 返回 `bun: command not found`。因此新增 Bun 单测、TypeScript 完整类型检查与 Electron GUI **未签收**，后续需在正常工程环境执行。
- 尚待 A14 联合验收：3 人分配+1 回避、条件 N/A、独立工作副本/评分包、正确匿名材料、缺评/分歧/同分/名额/历史与冷重启。局部业务代码不等于 A14 PASS。
- 仓库 `AGENTS.md` 要求更新该文件及 README 前先取得用户许可；本线没有擅自修改这两个共享文件，由后续获授权的协调者决定文档同步。
