# V3 核心架构收口 R01｜T03 真实 Run 与业务动作门禁交付

- **T03 Owner**：核心架构收口任务 D3（不是历史「事实提取 T03」）
- **交付**：apps/electron/src/main/lib/review/review-v3-core-t03-run-gate.ts + .test.ts
- **状态**：领域能力与定向回归已提交；共享 Main 的正式写入桥接 **未在本 PR 修改**，不可宣称 A15 S2/S3 已通过
- **基线**：main@5643959a4219fe2bcc6ca8c315a05fb3c4fde86d
- **总裁决**：PR #180 中 V3-CORE-ARCHITECTURE-CLOSURE-R01.md，D3 章节

## T03 实际完成

新的纯函数：

```ts
assessT03RunAction({
  aggregate: CaseAggregateV2,
  run: ReviewRunV2 | undefined,
  action: 'stage-pass' | 'return-for-supplement' |
          'return-to-previous-stage' | 'final-reject',
  evidence?: T03TrustedRunEvidence  // 只能由 Main 填
}): T03RunGateResult
```

既不读写磁盘，也不派生 Actor，专门解决 R01 的三个问题：

1. **Run 新鲜度**：检查 run/case/template 版本、不可变 documentVersions 的全部 versionId/contentHash 集合，拒绝 `run@rev` 合成 ID。Main 必须额外提供当前的 case field、事实、证据、parseRevision、rule set 等完整快照一致性的可信验证结果 `inputSnapshotFresh`，缺失或 false 均阻断 Run-backed action。
2. **覆盖范围**：Run 的 planned/completed/pending、实际 Check ID 是否完整；CanonicalPlan 时要求可信的 planFingerprint 和准确的计划绑定 Check ID 清单，不能把 0 checks 或“部分跑完”变成 stage-pass；0-check 的明确人工业务需要 Main 核实 `manualOnlyTemplate`。
3. **按动作适格**：21 人超限 `non-compliant` 不能默认 stage-pass；有真实当前 Run 时可允许 `final-reject`、`return-to-previous-stage`（其余 actor/任务/阶段由 T05 再核验）。要通过不符合项，必须有 Main 对模板许可例外/真实具名审批核验过的 checkId + policyVersionId + actorId + 理由。缺件开补件不要求虚构 Run，未回复的补件不能视为满足。

这里的 `allowed=true` **绝不是审批授权**；只意味着在 Run 证据层面具备该动作的前置条件，模板发布来源、业务模式、角色、任务、expectedRevision、CAS 仍由 T05 Main 服务检查。

## Local-L 唯一可信 Main 接线清单

所有改动集中在现有：

`apps/electron/src/main/lib/review/review-v3-t05-main-service.ts`。

### L1：Run 选择

本 PR 还提供 `selectT03CurrentRun({ aggregate, runs, prove })`：Main 传入现有 `listRunsV2(caseId)`、每个候选 Run 的可信快照/Plan 证明；函数只返回真实有效且输入未过期的 Run，**不读取或修改 RunStore**。这是替换 `currentT05Run` 内旧文件子集判断的最小可复用实现。

当前 `currentT05Run` 在读取 `inputManifest.documents`，但真实 `ReviewRunV2` 只有 `inputManifest.documentVersions`。先修改为完整读取；优先复用当前 `workspace-business-service-v2.ts:isWorkspaceRunStaleV2` 来比对现有 RunStore + `computeRunInputHash`。比对时必须包含新材料版本及 caseFields、有效规则、Observation/Evidence，不能只判断当前材料 ID 都存在。

读取 Run 期间对旧运行允许保留历史；一旦存在后续输入变化，旧运行不应被挑作当前批准依据。现有 `isWorkspaceRunStaleV2` 可以作为 `T03TrustedRunEvidence.inputSnapshotFresh` 的主要来源，并在 L 内补齐 Plan 绑定验证。

### L2：Plan 绑定

仅在已有可信安装收据/RunEvidenceIdentity 可以证明当前 Run 执行了本案卷 `canonicalPlan.fingerprint` 后，传入 `runPlanFingerprint` 和 `expectedCheckIds`。未接 T01/T04 RuleLedger 时，**不要构造虚假的列表传给此模块**。无该证据就让 A15-S2 标为 BLOCKED_OWNER 或 BLOCKED_BRIDGE，而不是把 `inputSnapshotFresh=true` 当万能放行。

T04 `toT04CheckResult` 当前采用 `t04:` + [checkKey,targetKey,objectKey] JSON 串作为 checkId；映射必须从 Main 已验证的冻结绑定工件产生，不应靠自由文本猜。

### L3：写入阶段动作

`recordT05StageDecision` 在 `submitCommand` 原子事务的校验点调用此纯函数：
- `stage-pass` 要求 gate.allowed；`final-reject` 和 `return-to-previous-stage` 依据各自 gate，而非套用 stage-pass；
- `return-for-supplement` 允许没有真实 Run（仍按 T05 业务规则校验任务、必填补件原因及责任人）；
- `T05VerifiedRun.decisionReadiness` 只从可信 gate 结果派生，绝不接受 Renderer 的布尔值；
- **每次 submitCommand 内重算**，读投影 `readT05StageCapability` 只能展示；
- 21 人 non-compliant 的无例外 stage-pass 明确拒绝，但拒绝/退回有实际业务通路；
- 不能绕过 `isLocalBusinessCase`/正式学校授权限制；技术预审绝不能借此成为合法审批案卷。业务模式解析改由 R01 D2 对应 Main 变更负责。

### L4：验收

本 PR 的单测是纯领域行为验证，Local-L 接入后再跑真机：

1. A15 18 人、真实冻结 RuleSpec+Run、已确认材料：gate 允许进入具名 reviewer 初审；teacher 最终决定。
2. 21 人：运行产生 `non-compliant`，禁止无例外 stage-pass，但可拒绝/退回。
3. 12 人缺计划书：可先开补件且不伪造 Run；不完整第一回复不能当 satisfied；二次回复新文档版本使旧 Run stale，新运行后重新审。
4. 人数未知/检查未执行/覆盖数量不一致：不能因 Run completed 变成通过。
5. 完整 Electron 操作、重启与旧 Run 追溯由 L 在原 L3 总账记录；本 PR 不修改 L3 或伪称完成 S3/S4。

## 文件隔离、后续配合

本 T03 PR **不改写** `review-v3-t05-main-service.ts`、`case-store-v2.ts`、`run-store-v2.ts`、`packages/shared`、`review-ipc.ts`、`preload/index.ts` 或既有 E2E 文件，以便 L 不受十个并行会话文件冲突影响。

请本地 Agent 只选择本 PR 的纯模块、测试和本文，同时按 PR #180 D3 实施共享桥接。若 T01/T04 尚未给出 PlanLedger，允许先接入本模块和修复 legacy stale 选择，但不能用虚构 Plan fingerprint 把 A15 标成 PASS。
