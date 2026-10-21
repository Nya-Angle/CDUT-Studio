# Review V3 M4｜F05 事实纠错与修订交付及共享接口请求 R01

- Owner：F05；协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`
- 共同祖先：`main@5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
- 分支：`feat/v3-m4-f05-fact-corrections`；状态：**本领域增量编码完成，待 Main 接线和实机 A05/U02**。
- 既有 T03 事实投影、纠错动作、拆并 proposal 和案卷命令均保留，**没有新建案卷或 Run 存储**。

## 本领域修复

1. 事实投影只认最后一条有效人工确认：新人工更正失效后，不能回退复活被其替代的旧确认；重新确认当前原件后，不因已替代的旧历史而永久显示“待处理”。原始观察历史仍完整显示。
2. 来源正规化：保留当前引用的 `caseId`、`documentVersionId`、`parseRevision`、精确 `location` 与 `quote`；显式引用旧解析版本、跨案或停用原件时拒绝提交，要求重新核对。仅真正没有位置的原件选择降级为文件级引用。
3. 事实工作台点击哪条候选就使用那条候选的原件，避免取末条候选来源并错误归属；更正输入检查零值、合法日期。
4. 拆并 proposal 对来源缺失、不同事项类型和有效事实冲突做拒止。更正后的当前事实优先于原填表值比较，不将旧字段误认为另一条当前事实。

## CONTRACT_REQUEST：Main Owner / local integrator

### CR-F05-01：单次 CAS 拆并写入（阻断“预览→保存”）

- 当前入口：`ReviewV3T03RestructurePanel` → `ReviewV3T03FactWorkbench.onRestructure`。生产 `V2CasePanel` 挂载时没有传 `onRestructure`，所以只能预览。
- 现有纯领域代码：`review-v3-t03-subject-restructure.ts` 的 `proposeT03SubjectSplit` / `proposeT03SubjectMerge`，可返回明确的 retire/new subject、观察和关联、blockedReasons、受影响检查。
- 所需可信动作：Main 新增 `restructureCaseSubjectsV2`，输入 `caseId`、`requestId`、`expectedRevision`、可信 IPC actor 以及**拆并意图**（原主体、目标主体、字段/证明分配；或合并主体列表、目标名）。不要信任 Renderer 传来的完整 proposal 作为真实写入。
- Main 应从当前 Aggregate/当前版本重算 proposal；拒绝冲突、失效原件、缺失明确分配、已决定/归档状态；一个 CAS/Receipt 事务中退役旧主体、追加新主体/待确认 observations/候选 evidence links，并保持旧 Run 不可变。
- 输出：现有 `ReviewCommandResult<CaseAggregateV2>` 风格，含 CAS revision 与 requestId 幂等回执；失败至少区分 `CONFLICT`（旧 revision）、`VALIDATION_FAILED`（归属不完整）、`STALE_INPUT`（原件已变）和 `FORBIDDEN`（无权操作）。成功后重读 Aggregate/Run 过期标记。
- 共享文件：`application-service.ts`、`review-c0-case-service.ts`、`review-ipc.ts`、`preload/index.ts`、共享命令 DTO；**F05 未抢写**。可由 Main Owner 接线并将回调传到 `V2CasePanel`。

### CR-F05-02：更正理由与源版本的可信持久化

- 当前调用：`use-review-workspace-actions.ts` 通过 `correctObservationV2` 发送 `{subjectId,fieldKey,value,sourceRefs,reason}`。Main `application-service.ts:correctObservation` 检查 `reason` 非空，但 `Observation` 只保留值/来源/时间/替代链，`receipt.summary` 亦不记录原因。现有 `reason` 实际只参与 payload hash，无法在历史 UI 找回原文。
- 所需最低兼容增量：由 Main Owner 在唯一 CAS/Receipt 账本中保留每次更正的真实 `reason`、可信 `actor`、时间与 `observationId` 关联，提供只读查询/投影；旧 Observation 允许无理由的历史兼容展示，不补假理由。
- Main 必须复核 `sourceRefs.caseId/documentVersionId/parseRevision` 和当前原件状态；Renderer 侧拒止不能代替正式写入校验。缺失主体、跨案/旧解析、CAS 冲突须返回明确错误。
- 依赖：Main Owner；F05 历史 UI 可在端口就绪后展示原因和操作人。

### CR-F05-03：准确的依赖级重审（F09 协作，不由 F05 新建 Run）

- F05 `planT03Recheck` 仅提供保守的受影响检查预览，**不能宣称已经实际增量重审**。
- F09/Main 需要消费 Observation/DocumentVersion/EvidenceLink 版本变化，确认 RuleSpec 对字段、主体和原件的真实依赖，运行新 `ReviewRunV2`，旧 Run 继续只读；无法证明依赖时全量重新执行，不能复用假精确缓存。

## 验收与未完成

- 本线定向测试：`review-v3-t03-fact-workflow.test.ts` 7/7 PASS，覆盖人工更正不复活、来源位置/旧版本拒止、日期和合并有效值冲突；`review-workspace-write-fence.p06-fix02.test.ts` 5/5 PASS，核实工作台异步写入隔离。
- A05 的拆并实际落盘、原件替换后新 Run/报告及普通用户 GUI 完整往返**尚未签收**。F05 局部代码不能代替 A05 `PASS`。
- 使用现成 Bun 1.4.0 与离线缓存恢复项目依赖后，定向测试已完成；`bun run --filter='@profer/electron' typecheck` 因运行环境发出 `SIGKILL`（exit 137）中止，未获得类型检查通过结论。仍需 CI/本地稳定环境重新运行。`AGENTS.md` 和 `README.md` 的文档同步依仓库规则等待用户授权，未自行修改。
