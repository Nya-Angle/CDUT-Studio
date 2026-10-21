# D2 · 情景/逐操作映射到真实 Pi 审核任务包（技术预审）

状态：D2 试点实现与合成回归，**未获得任何高校制度发布/审批授权**。基于已合并 main 中设计 15/16、D0.5、D1 的作者态与服务发布资格。D2 不建设第二个模型 Harness，不把所有自然语言责任强制改成复杂 DSL。

## 1. 设计目标与已实现的对应关系

| 作者态与输入 | 运行中的现有数据面 | 不变量 |
| --- | --- | --- |
| D1 工作区 + 显式 scenario | previewDemo 精确展开全部当前适用责任 | 分支未知/不支持时拒止，不因未激活嵌套引用漏项 |
| 对象的稳定 objectKey | ReviewCaseV2.subjects（D2 custom ReviewSubject） | 档案件/read 与 档案件/copy 分别拥有 subjectId、独立 sectionId |
| 每条审查责任 | ReviewCaseV2.reviewRules[] 中的 RuleSpec | 固定 checkId → ruleId → 独立 scope；不是只在提示词标注业务对象 |
| 制作来源/候选制度 | D2RuleBinding + RuleSpec.confirmation | 未核政策及跨校参考只能待确认；synthetic/request-scope 不冒充校规 |
| 已安装的计划 | CaseAggregateV2.d2RuntimePlan | 作者态/展开责任/来源/RuleSpec/主体均有 SHA256 固定指纹 |
| 普通 Pi 会话 | pi-case-review-service.preparePiReviewRunV2 + submitPiReviewResultV2 | 运行前和结果提交前检查计划；从现有素材工具读取，真实 SourceRef |
| Pi 结果与材料 | ReviewRunV2 inputManifest、effectiveRuleSetHash、CheckResult | 核验案卷输入、规则集、版本/哈希及所有独立检查；未知与缺证不假合格 |
| 人工决定 | decideWorkspaceCaseV2 现有业务事务 | D2 技术预审案卷显式拒绝正式批准（AGENT_DECISION_DISABLED） |

**这里的“complete”仅表示必核责任的本轮回执完成且版本/证据来源形式通过校验，不表示业务资格合格，更不表示发卡/档案利用已获准。** 不用规则层 `confirmation:'confirmed'` 当作校方制度认证：它在纯 request-scope 责任中只说明运行规则已确定，制度权威单独保留为未核。

## 2. 简单审核和复杂情景

- **text-review**：零业务对象、零 Claim/Evidence 图，仍可生成整案自然语言核对 RuleSpec，Pi 收到明确责任、来源、限制。
- **special-campus-card/family**：家属关系、代办操作分别核验；已故教职工不能机械解释为申请必败；独立的校本资格检查保留 `awaiting-confirmation`。
- **special-campus-card/temporary-service**：核对具体人员与接收单位、服务期限的对应；派遣协议不等于任意人员自动获准。不会包含 family 责任。
- **archive-access**：对 `item-1/read`、`item-1/copy`、`item-1`（开放状态）分别登记 target/subject/RuleSpec。查阅的证据不能作为复制的审核结果；目录可见不等于已开放。

**单模板仍只有一个审核目的**。D2 使用条件引用，不将两种校园卡拆成两个完整模板，也不以目录展示位置决定审核适用性。

## 3. Authoring JSON 与 Agent-first 命令

示例 JSON（均为合成数据）：

- `docs/design/review-agent/fixtures/d2-workspace-synthetic.json`：D1 workspace，含原始模块、情景、来源绑定；
- `d2-selection-text.json`、`d2-selection-family.json`、`d2-selection-temporary.json`、`d2-selection-archive.json`：稳定的对象和操作引用。

```bash
# 1. 只预览：准备 caseV2 JSON，模板 ID 须匹配 selection
bun apps/electron/scripts/review-d2-plan.ts preview \
  docs/design/review-agent/fixtures/d2-workspace-synthetic.json \
  docs/design/review-agent/fixtures/d2-selection-archive.json \
  /tmp/d2-case-input.json

# 2. 隔离配置目录中显式登记不可发布的候选壳
PROFER_CONFIG_DIR=/tmp/d2-testing bun apps/electron/scripts/review-d2-plan.ts register \
  docs/design/review-agent/fixtures/d2-workspace-synthetic.json \
  docs/design/review-agent/fixtures/d2-selection-archive.json

# 3. 创建技术预审案卷，固定情景、对象和实际 RuleSpec
PROFER_CONFIG_DIR=/tmp/d2-testing bun apps/electron/scripts/review-d2-plan.ts create \
  docs/design/review-agent/fixtures/d2-workspace-synthetic.json \
  docs/design/review-agent/fixtures/d2-selection-archive.json \
  d2-case-id "档案利用合成预审" author-agent

# 已存在但尚未绑定的 D2 草稿可显式用 attach + expectedRevision 修复
PROFER_CONFIG_DIR=/tmp/d2-testing bun apps/electron/scripts/review-d2-plan.ts attach \
  docs/design/review-agent/fixtures/d2-workspace-synthetic.json \
  docs/design/review-agent/fixtures/d2-selection-archive.json \
  d2-old-case-id 0 author-agent
```

`createD2TechnicalCase` 是与正式建案隔离的技术预审专用服务：先校验 D1 服务端 candidate-held 资格和任务，再以现有案卷事务创建案卷并固定计划。原 `createCaseFromTemplate` 继续只允许 `status='published'`，**不能借 D2 让未发布模板进入正式申报**。技术建案后可以沿用原材料注册和普通 Pi 审核能力。

技术建案与计划绑定是两次受控事务：极端 I/O 故障可能留下没有 D2 任务包的草稿。此状态不能通过 D2 运行核验，只能由操作者显式 attach 修复，不能自动升级为正式审核。


## 4. 测试门禁与安全预言

`apps/electron/src/main/lib/review/review-d2-runtime.test.ts` 覆盖合成文本、两个卡情景、档案 read/copy 和开放状态，真实调用现有 Pi 准备/结果提交/业务决定服务，以保留或拒止回执的方式判断实际对象范围。和模型直接连通的真实质量评估不同，测试使用合成材料和合成工具回执，不提供真实政策认证。

静态审计包括：缺分支/未知分支、未登记业务对象、操作键不一致、同一审核对象重复、未绑定来源、未映射高级 Claim 关系；运行审计包括：指纹被篡改、检查遗漏、缺真实 SourceRef、材料内容哈希或版本变化、未确认规则被宣布合格、整案审批拒止。历史草稿及已固定作者态版本仍按 D1 的历史链保护。

完整 CI 同时执行全仓 typecheck、main/preload/renderer 构建、全仓测试。专项 CI 校验 D2 回归、既有 Pi 服务和 D1/D0.5 模板回归；只有真实绿色才能声称测试通过。

## 5. 尚未纳入正式行政产品的能力

- D2 首版以 **明确的情景与对象登记**为输入，不依赖模型临时推测 family/service 资格或未声明的档案操作。复杂 Claim/Evidence 的任意合取、择一/替代、阶段适用结构仍 fail-closed，不允许静默转文本。
- 合成 `SourceRef` 只在真正 Pi 工具提交阶段由现有材料块核验；编辑态引用源声明不是替代材料真实性证明。
- 运行正确性测试验证范围/来源/版本约束，不宣称大模型在全部真实校园文件上达到某个准确率；本地 Pi 服务要求真实可用模型出口才能开展模型端到端对照。
- 模块库正式冻结和跨工作区共享属于 D3；丰富的人类编辑 UI 属于 D5。本阶段保留 JSON Agent-first 接口与轻量数据结构。

## 6. D2 收口增量：真实建案入口及防混入门禁

- **建案入口分离**：正式 `createCaseFromTemplate` 坚持只能使用 published 模板；D2 的 `createD2TechnicalCase` 限定 reviewer 身份、合法案卷 ID、服务端 candidate-held 且纯技术预审的壳，先完整编译情景，再两次受控事务创建案卷与绑定固定计划。Agent JSON CLI 分为 `register` → `create` → 现有材料录入/Pi 审核。错误情景在写入之前拒止。
- **单一真值**：D2 的静态候选壳必须没有任何 fields、materialSlots、静态 sections、policyRefs、额外政策版本及审批输出；审核要求仅以已固定 `D2RuntimePlan.rules` 投影，后续擅改候选壳将拒绝 Pi 运行。候选案卷没有固定计划不能直接启动 Pi；已绑定案卷如添加未登记的 RuleSpec/ReviewSubject，也须拒止。
- **条件主体边界**：当前 D2 校园卡分支试点严格要求 **1 个明确的 campus-card 目标**，不得把对象丢弃后把主体检查降级为整案规则；也不允许把该目标伪装成档案对象。多申请人、同案多独立申请的扩展应先定义明确的主体与责任实例，不以当前单目标试点代替。
- **逐操作独立凭据**：可断言的档案查阅、复制、开放状态必须各有与对应 subjectId 和操作键一致的用户确认证据链接（本案当前有效文件版本）。一份查阅证据不能证明复制；复制权限未知时保留 `awaiting-confirmation`。有证据链接也只证明技术核验来源，**不是学校/档案馆已作出许可**。
- **完整度边界**：`verifyD2PiRun.complete` 只表示技术检查都收到有效回执且任务/规则/材料输入一致，不代表档案实际开放、家属/临时人员取得发卡资格，更不表示最终审批已完成。实际业务生产化还须独立制度治理、真实 Agent 金标评估及 UI 接入；本轮使用模拟材料和现有 Pi 结果提交链路验证。
