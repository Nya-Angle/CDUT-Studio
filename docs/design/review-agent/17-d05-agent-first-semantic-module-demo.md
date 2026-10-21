# D0.5 Agent-first 轻量语义模块 Demo：运行与验收说明

> 2026-10-11；开发基线 `design/review-template-editor-g01-v01`，实现分支 `feat/review-d05-agent-semantic-modules`。
>
> **性质：技术试验，不是正式模板编辑器、生产模块库、校规验证系统或 Pi 端到端审核通过声明。**
> 样例全部为明确标识的合成案例；没有根据第 16 号分析稿编造五份 G01 Markdown 的实际校规。请勿直接发布样例。

## 1. 已核对基座与最小增量

- 已有 `TemplateVersion.sections[].criteria`、`TemplateCriterionSpec` 和 `resolveEffectiveRules`，后者把每条 criterion 映射为 Pi 可消费的 `RuleSpec`，并由现有 `pi-case-review-service` 给 Pi 主会话发送任务。这是本 Demo 的投影边界，**没有重建审核执行引擎**。
- `template-store` 已有 `saveDraft` / `validateTemplate` / `publishTemplate`，以及发布版保护。D0.5 新增一个专用发布守卫，阻止被标识为 `D0.5_DEMO_ONLY:` 的示例草稿被正式发布。
- `TemplateWizardPanel` 目前编辑字段、材料槽、分项与标准；本轮**不调整 GUI**，其现有编辑能力仍可用。新接口先是本地、JSON 驱动的 Agent 结构化操作。
- 新文件 `semantic-module-demo.ts` 提供纯函数事务、固定版本模块、受控局部绑定、组合校验、生效责任预览、最低限度覆盖账本校验及简单任务向现有 `TemplateVersion` 草稿投影。
- `scripts/review-semantic-demo.ts` 是本地可调用入口：一次 JSON 事务包含多个动作，按 revision 乐观锁校验，并以临时文件/重命名原子保存。没有引入依赖、localStorage、数据库或独立运行内核。

D0.5 未锁定 D1 作者态协议：`DemoModule` / `DemoState` / `DemoModuleUse` 均为试验性接口。自然语言审核责任是正常数据；结构化内容只约束 ID、引用、版本、参数、情景及输出。没有强制 Claim、EvidenceSet、ConditionAST 或节点坐标。

## 2. 本地复现

在仓库根目录执行：

```bash
# 将跟踪的合成状态复制为可修改工作副本，绝不直接编辑 fixture
cp docs/design/review-agent/fixtures/d05-synthetic-state.json /tmp/d05-state.json

# 查看双分支中的家属卡预览（只展开此情景与共同检查）
bun apps/electron/scripts/review-semantic-demo.ts /tmp/d05-state.json docs/design/review-agent/fixtures/d05-preview-card-family.json

# 档案利用：同一 item 的查阅、复制保持两个独立 objectKey 和 checkId
bun apps/electron/scripts/review-semantic-demo.ts /tmp/d05-state.json docs/design/review-agent/fixtures/d05-preview-archive.json

# 一次事务：从模块 v1 派生 v2，再仅替换文本模板的固定引用
bun apps/electron/scripts/review-semantic-demo.ts /tmp/d05-state.json docs/design/review-agent/fixtures/d05-agent-edit.json
```

编辑后的 `/tmp/d05-state.json` revision 应为 2。旧版 `text-structure@1` 仍存在，其他模板引用不会被强制升级，`text-review` 的实例改为固定引用 `text-structure@2`。

按需创建如下命令 JSON 交给 CLI（无需任何完整节点图）：

```json
{"kind":"preview","templateId":"special-campus-card","version":1,"scenario":"temporary-service"}
```

或者：

```json
{"kind":"preview","templateId":"text-review","version":1}
```

使用 `kind: "list"` 查看库中模块及模板版本。使用 `kind: "project"` 只能将**完整引用树均无条件、无逐操作 objectKey、无尚未映射结构属性**的简单审核责任输出成现有 `TemplateVersion` 草稿 JSON；投影前遍历全部子引用（包括预览时未激活的子模块），不允许先跳过再投影。投影包含每条检查的固定追溯 ID、合成来源性质、任务目标和禁区，并保留 `status: "draft"`。

只有在明确提供 `confirmDemoWrite: true` **且设置隔离的 `PROFER_CONFIG_DIR`** 时，`kind: "project-draft"` 才会调用已有 `saveDraft`，同时拒绝覆盖已有版本。不要把演示状态导入正式用户模板库。演示草稿不得通过 `publishTemplate` 正式发布。

## 3. 验收观察点

| 场景 | 实际可自动检查的事实 | 尚不意味着 |
| --- | --- | --- |
| 普通文本 | 一条语义责任展开到 `TemplateCriterionSpec`；`resolveEffectiveRules` 能读到相同任务与追溯标签 | Pi 已读过真实文章或自动确认文章合格 |
| 校园卡双分支 | 未选择情景则阻断；`family` 与 `temporary-service` 只激活各自责任与公共项 | 本校存在这些具体发卡要求，或关系/服务事实等于发卡批准 |
| 档案逐操作 | `item-1/read` 与 `item-1/copy` 使用同一授权模块的独立实例；不同 checkId | 查阅授权自动覆盖复制，或目录公开等于档案开放 |
| 修改模块 | 批量派生新模块版本并只重绑一个实例；旧预览指纹保留 | 能原地修改已发布版本 |
| 错误/并发 | 缺版本、参数越权、环、重复 ID、revision 冲突原子拒绝 | 程序已理解全部自然语言政策矛盾 |
| 覆盖记录 | 一组回执必须携带与预览一致的 fingerprint；漏项、旧回执、无引用的确定性判断、失败或缺说明会拒绝完整覆盖 | 提供非空模拟 sourceId 就等于实际核验过可信原件 |

**覆盖与批准不同：** 所有检查已给出局部状态，覆盖账本可以是完整的；其中仍可能有 `awaiting-confirmation`。这并非整案具备审批条件。Demo 中的 `sourceIds` 只检查存在性，并未接入真实 `SourceRef` 权属/内容哈希校验；这项校验正式运行时仍应由原审核服务负责。`checkDemoCoverage(preview, { fingerprint: preview.fingerprint, entries })` 对整个回执包核对指纹，拒绝将不同模块版本、任务内容或情景的旧覆盖直接记为当前完成；**指纹不是可信主体签名，也没有绑定实际材料输入哈希**。

## 4. 运行测试

```bash
bun run typecheck
bun test apps/electron/src/main/lib/review/semantic-module-demo.test.ts
bun test apps/electron/src/main/lib/review/template-store.test.ts
```

BDD 测试覆盖基础语义、现有规则映射、模块版本重绑、原子批量修改、错误拒止、校园卡两分支、档案逐操作和覆盖状态。本轮**没有实际调用 Pi 模型审核合成 PDF，也没有真实 G01 文件回归**。因此静态测试通过只表示编辑、投影和源规则的最小结构验证；不能外推审核准确率。

## 5. 下一阶段需要讨论的接缝，而非本轮已完成

1. `TemplateCriterionSpec` 到 `RuleSpec` 的权威性映射：目前原解析器对模板 criterion 使用 `confirmation: confirmed`，其含义不等于“已验证校规”。D0.5 用 `D0.5_DEMO_ONLY` 阻止发布，D1 必须设计真正的制度/来源/权限分层和无损绑定。
2. 复杂情景在 D0.5 **只作所选情景预览，不导出可发布模板**，因为旧 `TemplateCriterionSpec` 没有精确 `when` 与按业务对象的关系范围。D1/D2 应明确未知三值与业务对象键如何绑定到真实 `ReviewSubject`，不能靠描述里的 `objectKey` 代替授权校验。
3. 模块包与运行快照目前通过固定版本引用和预览指纹演示。要真正部署需有不可变模块仓库、发布签名、解析来源映射、审计与差异迁移。
4. 批量 Agent 编辑目前经 CLI 和 JSON 文件完成；**还没有注册成 Pi 原生工具**、没有 GUI 交互或跨会话角色授权。正式接入优先依托项目现有 Pi 会话/命令授权机制。
5. 五份 G01 Markdown 原文、独立标准答案、已证校规及真正材料的读图/出处校验需由后续阶段接入。模拟样例绝不替代制度确认或行政审批。

依照仓库 `AGENTS.md`，功能状态变化后 `AGENTS.md` 与 `README.md` 的同步更新应先经项目负责人确认；本分支未擅自修改它们。本文件记录当前 Demo 的真实状态。

## 6. 设计审计增补：嵌套条件与回执版本一致性（2026-10-11）

用户审查发现两个 P0 漏洞，本次均在 D0.5 修复：

1. **嵌套条件静默丢失**：原投影守卫只遍历模板顶层引用；子模块的 `scenario` 在无匹配情景时被 `previewDemo()` 忽略。现由 `visitTemplateUses()` 静态遍历完整的固定引用树，`validateDemoState()` 确认子分支都属于模板声明情景并拒绝父子互斥的不可达组合；`projectSimpleDemoDraft()` 对任何层级的条件分支、`objectKey` 或无法映射的结构化字段一律拒绝投影，而不是误生成看似完整的无条件标准。常规复杂分支仍可按明确 `scenario` 预览，不影响 Agent 的自主工作顺序。
2. **覆盖回执跨版本复用**：原 `checkDemoCoverage(preview, entries)` 只看 `checkId`，模块文案/版本变化而 ID 不变时可能误用旧检查。现改为 `checkDemoCoverage(preview, { fingerprint, entries })`，`fingerprint` 缺失或不等于当前预览指纹时结果不可能是 `complete`；增加同一检查 ID、内容升级后的回放回归测试。

另外三个已明确的风险与处理边界：

| 风险 | D0.5 处理 | D1/D2 必须保留的约束 |
| --- | --- | --- |
| 子模块默认参数覆盖父模块继承参数 | 已明确并测试优先级：**子引用显式参数 > 父引用继承参数 > 子模块默认值**；各模块仍使用明确的参数声明 | 完整参数来源、冲突和授权校验，不允许隐式跨对象授权 |
| 草稿在相同版本号下可重复编辑 | 仍为试验态 `revision` 乐观锁 + 固定模块版本；**不宣称完整历史回滚** | 区分草稿修订号与发布版本；冻结后不得原地修改；历史快照及差异回滚要有审计来源 |
| 回执只要求 `sourceIds` 非空 | 保留合成检查，仅防止无依据直接宣称符合；不冒充真实引用核验 | 接回已有的 `SourceRef`、`ReviewRunV2.inputManifest.hash`、文档版本、parseRevision 与实际引用有效性校验，旧输入不能被当作当前有效结果 |

**剩余边界**：本文所谓「无损投影」指 D0.5 **已声明的结构化引用约束**不被静默丢弃，不代表能自动证明所有自由文本的制度适用性或自然语言语义等价性。对复杂审核继续坚持明确分支预览，不开放正式发布。

