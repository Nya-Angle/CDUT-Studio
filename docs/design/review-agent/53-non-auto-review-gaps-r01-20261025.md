# 审核链路非自动分类缺口修复 R01（2026-10-25）

## 基线与范围

- 基线：`2ab7f3aa32bd5481d85c8e457df2866afc16bcea`，Electron `0.15.169`。
- 修复分支：`fix/review-non-auto-gaps-20261025`，Electron patch 升至 `0.15.170`。
- **明确排除**：第 52 号文档的自动分类候选是否自动写入 Case。本轮不改变分类算法、自动触发、AI/OCR 候选、`onApply` 按钮与 `classificationCorrection` 的人工来源语义。
- 不新增 Pi 会话、不绕开 C0 身份/正式 Plan、T05、版本 CAS、材料版本或来源有效性门禁。

## 已实现

### A. F05 人工改类后的受控 D4 方案恢复

原行为：D2 纠错撤回旧技术计划，同时清空 `templateId`、`subjects`、`reviewRules`，返回待选模板草稿。旧运行不能继续使用，这是正确的安全边界；但用户不得不重新选择整套技术方案。

新行为：`APPLY_NATIVE_REMEDIATION_V3` 先独立提交既有 F05 纠错，再由 Main 尝试恢复：

1. 冷读当前案卷，核对已应用的纠错和归档中对应的 `invalidatedPlanFingerprint`。
2. 仅对原 D4 候选目录仍含同一模板版本的案卷尝试恢复。重新读取受控 workspace 与冻结情景/对象选择，调用原 D2 编译器。
3. 要求重新编译结果与旧来源的 `fingerprint`、`workspaceId`、`authoringDigest` 一致。以此证明选择与作者态来源未被替换，并非无条件重放历史 Plan。
4. 在真实写入前以候选聚合执行 `verifyD2InstalledPlan`，逐份核对当前物理原件字节；之后通过现有 `attachD2RuntimePlan` 版本 CAS 装入。新运行仍须重新启动，旧 Run 输入哈希因 F05 纠错代次而失效。
5. 重新进入已恢复状态时幂等返回，不重复写入。任一前提不成立时恢复为 `pending`，**绝不把纠错成功伪装成失败，也绝不降级继承旧审核结论**。

边界：只自动恢复来源可严格重编译的受控 D4 候选；B1/F06 作者候选和正式 CanonicalPlan 不通过此路径恢复。正式计划的用户提示改为“由有权发布者升版”，不再误称“模板管理员必须改模板”。

### B. Pi 可读材料漏读的提交门禁

- `finish=true` 时先按真实块读取、视觉预览、人工回执及来源引用重算材料 coverage。
- 活跃原件处于 `parsed`、确有非空文本块但没有完整读取凭据时，将文件名和 `DocumentVersionId` 作为待补读目标返回给**同一 Pi 轮次**，保持 `running`；不会另开专用 Pi，也不会在所有 Check 提交后静默结案。
- 无文本层扫描 PDF、解析失败文件不要求 Pi 读取不存在的文本块；其部分/未读状态仍保留，在业务就绪门禁转人工核验，绝不因此自动通过。
- 不能再仅凭过去 `coverage.status=read` 就沿用“全文已读”：重新解析增加块但缺本轮真实凭据时会重新标成部分读取或未读。

这提高了漏读可观测性和继续补读概率，不等于保证所有扫描件或复杂材料自动读完，也不保证模型最终一定按反馈调用工具。

### C. 证明材料识别事实的当前来源投影

- 原生 V3 证明材料行改为使用已存在的案卷 Observation 和当前运行提取的事实；只采纳与当前案卷、活跃 DocumentVersion、当前 parseRevision 精确匹配的 SourceRef。
- 排除 `sourceValidityRevocations` 中已撤销的历史观察，以及过期/缺失运行的 AI 暂存事实。
- 显示“已确认/待核实”，不把 AI 抽取冒充人工核验；旧 V1 `EvidenceDocument.recognizedFacts` 不做伪回写，非原生 V1 显示维持原样。
- 多份事实引用同一原件时可以投影到对应材料行；正式事实与权限仍以 V3 Observation、Run 和 SourceRef 为准。

## 回归与证据

新反例包括：

- D4 原计划撤回 → 同源重新编译 → 当前原件不变且类别变更 → 新 Plan 验证通过 → 旧输入哈希失效；错误指纹不写案；重复恢复不追加事务。
- 五项语义检查全齐但另有一份真实可读材料没读 → Pi 保持 running → 补读后同一 Run 可完成。
- 旧 `read` 遇到解析块增量不可冒充完整阅读。
- 待核实事实、跨案引用、旧 parseRevision、已退役版本与已撤销事实不能进入当前证明卡展示。

定向 F05/D4/coverage/事实投影/改类请求测试：**35 PASS、0 FAIL**；Electron TypeScript 类型检查 PASS；边界检查 PASS。

`pi-case-review-service.test.ts` 另有两项既存的 preupload 断言仍失败：测试期望 `PROFER_REVIEW_TEST_PREUPLOAD_BLOCK` 导致拒绝写入，但当前 `review-preupload-gate.ts` 实现明确仅提醒、不抛错。这项合同分歧非本轮改动造成；未借本轮放宽或伪造通过，应另行裁决其授权边界。

## 尚未关闭及真实验收边界

1. B1/F06 与非 D4 计划无法凭旧任务包自动安全复原，须继续补持久重建来源和同源编译路径。
2. CanonicalPlan 仍由有权发布者独立升版，不能由工作台本地撤回。
3. 解析失败、扫描图像材料的 OCR/视觉证据覆盖不保证完整；T02 的 OCR 依赖和正式写块链路不在本次修改范围。
4. 一份原件对多个材料槽的多对多关系尚未扩展；现有 F06 EvidenceLink 对事项的多对多关联不可等同于模板槽位多对多。
5. 缺少真实样本准确率/漏读完成率/时延数据，也没有 Electron GUI 自动测试或真人实际材料验收。命令行 PASS 不作生产放行声明。
6. 根据仓库 `AGENTS.md` 要求，修改 `AGENTS.md`/`README.md` 需事先获得用户许可；本轮保留两文件原样，专项合同更新仅写本文档。
