# Review V3｜F01–F07 统一集成与分层验收（2026-10-25）

> 本文记录同一 HEAD 上的源码集成、跨分支冲突裁决、可重复的离线行为回归及尚未签收的实机门槛。**Draft 集成 ≠ 正式合并，更不等于学校业务或产品生产放行。**

## 0. 固定基线与交付边界

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`。
- 独立集成分支：`integration/v3-f01-f07-unified-acceptance-20261025`。
- 目标 PR base：`integration/v3-r02-pr246-249-250-20261024`（Draft PR #265）；本轮不直接修改 R02、main 或七条专项来源分支。
- #265 固定 HEAD：`7773de6afc9c4a16934076b8b5bdb61a2e8bc9a2`，对应 #246/#249/#250 已集成的真实 Tree。
- 2026-10-25 本轮读取并固定：

| 批次 | 来源 | HEAD | 本轮接收范围 |
| --- | --- | --- | --- |
| F01 | PR #266 | `530e013b77016b34959baf2d8237e76e1c31b156` | Agent 执行轮次、案卷指派、取消 Run 归属和建案幂等 |
| F02 | PR #270 | `d5a3a425764b20a82bf4c331c8447391d6cea714` | 受众授权、归档重验和报告导出 |
| F03 | PR #268 | `d10740340b42d8d66b98ee6bf1b190427658f1d0` | Plan/Check 身份冻结及消费时验真 |
| F04 | PR #269 | `fa95dc39ceb09081aafbe28c3f0bb3e4074350cb` | 多份申请材料路由、本地模板槽位预分拣 |
| F05 | PR #271 | `6449a813b69873e8370605d7f3e0f43dffdc2929` | 纠错提案、冻结后技术重建与旧 Run 失效 |
| F06 | PR #267 | `948ad84f316993a219265bace8eb3f12d13c27e5` | 库外事项固定事实/政策不确定检查 |
| F07 主线 | PR #264 | `894d16b23bd6f17486d04cd4df6d70cae6b48a3c` | 持久业务确认、冻结旧写入与兼容边界 |
| F07 补充审阅 | `fix/v3-f07-recovery-legacy-isolation` | `0f60ec9cc29b` | **只取独有安全判断**，不叠加第二套确认实现 |

上述七个 PR 均为独立 Draft；**没有操作其 merge、base、HEAD 或 review 状态**。本集成没有更改 `README.md` / `AGENTS.md`（仓库规定需用户单独许可）。

## 1. 分阶段纳入、为什么这样裁决

1. **F03 → F04 → F06**：先让真实 Run 的冻结 Plan 身份成立，再接多材料路由，最后接保守通用候选；三批均保留 #265 的既有 C0/Case/Pi 真值，未增加新的 Store。
2. **F01 → F02**：F01 的 `assignment.caseId === input.caseId` 必须留存；同时保留 #250 的 T08 Main 快照链。F02 再将 Agent 报告改成授权后的 `student` 投影，防止回退已删除的 V2 报告出口和恢复无授权 `reviewer` 导出。
3. **F05**：纳入纠错提案与现有 Main/Preload/工作台，保留冻结正式 CanonicalPlan 必须由有权发布源另行升版的拒止，不调用本地按钮假解除。
4. **F07 主线**：接收 PR #264 将 T05 发布确认写入唯一 CaseAggregate CAS/Receipt 的实现和旧写入守卫；保留提交时可信 Main 确认端口，防止只凭本地用户角色或 Plan 存在自动发布。
5. **F07 双轨去重**：第二条 `recovery-legacy-isolation` 也实现了 `localBusinessConfirmation`，但它的确认函数不要求 #264 同级的 `authorizeAtCommit` 回调。为避免合并后绕开更严的授权，**不合并第二套确认函数和字段结构**。仅提炼其独有的「原生创建回执即使投影损坏也不得降级旧 V2」判断，新增 `review-v3-legacy-decision-gate.ts` 统一守卫，供旧阶段决定、旧最终决定和旧申诉改判共用，并有 5 条新反例测试。

### 跨 PR 实际冲突/修复

| 冲突点 | 原因 | 最终裁决 |
| --- | --- | --- |
| F06/F01 的 `package.json` 与 `bun.lock` | 两条专项记录 `0.15.164`，#265 使用 `0.15.165` | 保留较新 `0.15.165`，不倒退 workspace 元数据 |
| F01 的 `review_export_report` | F01 基于早期 R02，包含已删除的 V2 报告导出函数 | 保留 T08/F16 快照 API 与 F01 强制指派案卷一致性 |
| F02 与 F01 同改 Agent 报告出口 | F02 必须阻止 Agent 自称 reviewer | 使用 F02 可信 Main 受众授权，仅导出申请人版；保留 F01 的轮次与案卷检查 |
| F07 的 `stage-workflow.test.ts` | #265 初审补件测试与 F07 旧入口测试改动相邻 import | 保留两套测试覆盖所需的 `ReviewRunV2`、`writeAggregate` 和补件构造函数 |
| F04/F05 `ReviewV3MaterialClassification.tsx` | Git 自动合并无文本冲突，但 F05 回调仍引用 F04 已重命名的 `ClassificationSuggestion` | 统一为 `MaterialClassificationSuggestion`，Electron typecheck 复测通过 |
| 旧决定错误码/文字 | 新 F07 共用门禁最初覆盖了旧阶段接口的 `INVALID_TRANSITION` 及 T05 提示 | 保留原阶段拒绝码与用户提示；旧最终决定保留原有 D2/Canonical 错误码，再补原生回执门禁 |
| Electron `CHANGELOG.json` | #265 的 package `0.15.165`、CHANGELOG 最新 `0.15.163`，原有打包守卫失败 | 增补 `0.15.165` 候选版本说明，不删守卫、不假装正式发布 |

## 2. 实际运行验证（本地、同一组合代码树）

环境：Linux headless；Bun `1.4.2`；TypeScript `5.9.3`；`bun install --frozen-lockfile` 完成；没有变更第三方依赖或锁文件的外部版本。

| 验收组 | 文件数 | 首轮与复验结论 |
| --- | ---: | --- |
| F05/F07、T05 模式、阶段事务、旧 V2 兼容 | 5 | **62 PASS / 0 FAIL**；曾发现拒绝错误码回归，修后重跑全绿 |
| F01/F02/F03/F04/F06、T04 规则与统一 Pi Run | 11 | **73 PASS / 0 FAIL** |
| T08/F16 快照、原生案卷、材料槽、Pi 续跑、旧入口及生命周期 | 7 | **63 PASS / 0 FAIL**；曾发现提示文字回归，修后对应文件全绿 |
| Electron packaging guards | 1 | **19 PASS / 0 FAIL**，包括版本与 changelog 一致性 |
| 库外兜底完整技术链、T08 申请人/历史报告投影 | 3 | **10 PASS / 0 FAIL** |
| **去重后的定向测试总计** | **27** | **227 PASS / 0 FAIL**；不同组未将失败后的重复复测累加 |

- `NODE_OPTIONS=--max-old-space-size=6144 bun run --filter='@profer/electron' typecheck`：**PASS**（修复 F04/F05 类型名交叉冲突后退出 0）。
- `bun run check:boundaries`：**PASS**，无包边界违规。
- `git diff --check`：**PASS**（本次新增/修订的代码与文档）。
- 本轮的最初两次失败及其修复均明确保留在上述冲突表中，不把第一次失败藏作不存在。

### 三条最小业务闭环的证据等级

| 路径 | 目前真正证明了什么 | 尚未证明什么 |
| --- | --- | --- |
| A：多份原件 → 路由 → 分类 → Pi Run → 报告 | 多件/零已分类材料保守候选、模板槽位、冻结 Plan、唯一 Pi Run、T08 申请人投影的组合级 BDD 通过 | 单次真实 Electron GUI 与配置模型全链操作尚未运行 |
| B：初审缺件 → 补件/纠错 → 新 Plan/Run → 人工结果 → 历史报告 | 补件门禁、材料版本、纠错 CAS、旧 Run 失效、D2 重建边界、报告快照不可变均有同 HEAD 测试 | 正式 CanonicalPlan 的学校有权升版、真实电子端重建和跨进程一气呵成仍缺 LIVE 证据 |
| C：库外事项/越权/冷恢复 → 安全降级 | F01 跨案与轮次、F02 受众、F06 未认证政策、F07 旧链路与冷读确认、T08 历史隔离的失败反例通过 | 真实校方 CAS/角色、敏感材料模型出站门禁、真实 Electron 冷启动/断网/模型延迟尚未实测 |

## 3. 保留的 P0/P1 门禁与不能冒称关闭的范围

1. **P0：预上传敏感材料出站门禁**。独立 PR #261 尚未纳入本 F01–F07 集成；#246 深度匹配和 #249 AI 分类的外部模型路径必须等共享 Main 门禁与授权来源真正联测后才能允许敏感材料无人值守外发。
2. **P0：正式身份与权威**。F02 对没有可信学校身份的 reviewer/organizer 版 fail closed；这不是学校账号/老师权威真正完成。T05 本地 actor 和 F07 本地发布确认均不得等同学校审批或政策签发。
3. **P1：F05 正式 CanonicalPlan 升版**。当前仅能保存提案并拒止未授权解除；有权 Main 发布者、Check 删除 ACK、回填新 Plan 和实机复跑仍需独立完成。
4. **P1：F07 Main 真实现场确认来源**。持久写入能力和冷读测试已成立，生产现场确认端口仍未接通，缺授权继续按技术预审处理。
5. **P1：完整 Electron LIVE**。没有操控用户设备完成同一案卷从多份真实文件拖入，到 AI 模型、多候选 20s、分类纠错、补件重审、报告保存、关闭重启的全程录像/日志，不可称 `USER_JOURNEY_ACCEPTED`。
6. **P1：R02 模板与政策质量**。144 套模板是否已接入、是否具备真实政策适用效力，属于独立审计轨道，不因本次测试通过自动关闭。
7. **其他**：批量/离线、跨设备共享、Windows/macOS 真实 Save As/PDF、历史损坏案卷人工迁移均未由本轮模拟测试签收。

## 4. 交付裁决

- 源码状态：**INTEGRATED / TARGETED_TESTS_PASS / TYPECHECK_PASS**。
- 产品状态：**DRAFT / LIVE_NOT_RUN / NOT_PRODUCTION_READY**。
- 不合并任何已有 PR，不解除 Draft，不向 `main` 或 R02 基线写入。
- 下一步：统一集成 Owner 在本 Draft HEAD 上加入 #261 出站门禁后，进行三条真正 Electron 主路径的 LIVE A/B/C；正式 CanonicalPlan 和学校角色只有在权威服务就绪后才能进行正向签收。
