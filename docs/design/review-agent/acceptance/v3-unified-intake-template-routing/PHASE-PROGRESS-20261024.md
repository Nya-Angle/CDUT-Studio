# V3 统一收件—模板路由阶段性进度（2026-10-24）

> 本文记录当前真实实现与验证状态，不把 PR 创建、类型检查或 CI 通过等同于端到端验收。后续修改应在本文件基础上追加结论，避免重复盘点或把未完成项误报为完成。

## 1. 当前基线

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
- 工作分支：`fix/v3-unified-intake-routing`
- 集成目标：`feat/v3-r02-template-library`
- PR：[#246 feat(review-v3): complete unified intake-to-template routing](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/246)
- 本次核验 HEAD：`a6372a8a6ec4bd53787d67260f52d6c8b984493c`
- PR 状态：Open，尚未合并；GitHub 报告 mergeable。
- PR 变更：16 个文件，约 +1131 / -333 行。
- CI：在上述 HEAD 上，以下 5 个工作流均为 success：
  - D0.5 Semantic Module Tests
  - D1 Review Authoring Tests
  - D2 Scoped Pi Review Tests
  - Review Baseline CI
  - PR CI

**验证边界：**目前已确认远端自动化工作流通过；尚未完成真实 Electron 桌面端的人工操作验收、真实模型供应商联调和完整材料—运行—结果闭环验收。不得把这些项写成“已通过”。

## 2. 本阶段已经落地的内容

### 2.1 收件入口与材料角色确认

- `ReviewV3QuickIntake.tsx` 支持拖入/选择多份原件，入库前可逐份修正“申请主件 / 附件”角色。
- 文件名只用于给角色提出初始建议；系统要求用户确认且只能指定一份申请主件，避免把多份独立申请静默合成一案。
- 缺少可读取本机路径时取消本次导入，避免部分文件悄悄漏入。
- 导入后进入当前原生案卷的模板匹配工作区。

### 2.2 Main 端真实材料与候选路由

- `review-v3-main-local-product-intake.ts` 以当前原生案卷为边界，重新校验物理原件字节与 SHA；通过 B2 暂存、B30 当前材料清单和 B3 路由会话生成只读路由结果。
- 路由候选来自明确业务声明、模板标题/编号/别名、关键词组合，以及 D4 的业务对象—办理动作信号。
- 自动候选必须来自 Main 当前授权目录；候选模板草稿/被暂扣模板不能因搜索或模型输出而变成可选已发布模板。
- B3 对候选所引用的材料来源、SHA、案卷候选范围、角色和 Subject 一致性进行校验；多个合格候选按稳定顺序进入 20 秒技术选择倒计时。
- 已有持久模板绑定在重新读取时不会重新启动倒计时；Main 对原件的校验仍在读取时进行。

### 2.3 全模板搜索与 AI 深度匹配

- 新增共享合同 `review-v3-template-routing.ts`：精确声明/名称/编号优先，其次是可解释的关键词组合；提供标题、编号、别名、关键词和描述搜索。
- 为未来 JEV 与当前配置的通用模型定义相同的深度匹配端口；模型不能创造目录外模板 ID，也不能把被暂扣候选伪装成已授权模板。
- 规则没有可靠候选时，UI 自动尝试通用模型；明确超出覆盖范围才转入公共兜底草拟。信息不足、模型失败或结果不确定时，不自动判定为“超出范围”。
- 规则与模型候选显示为统一排序列表；切换到公共兜底时取消目录路由倒计时，防止过期异步响应继续触发选择。
- 模板库编辑器新增业务关键词、别名维护字段；高级作者/第 51 套候选编辑器不再与主路由流程争夺首屏。

### 2.4 测试覆盖

- 新增共享路由合同测试，覆盖明确声明、关键词组合、通用表单字段不应误匹配、目录搜索、模型返回目录外/被暂扣 ID、out-of-scope 与 uncertain 区分，以及通用模型端口。
- 新增 B3 测试，覆盖多候选倒计时、20 秒后默认选择、被暂扣候选拒绝，以及无证据候选不自动选择。
- 上述测试所在的远端 CI 工作流当前全部通过。

## 3. 从源码复核发现的后续缺口（本次继续实现的工作项）

以下项目尚不能因为当前 PR 的 CI 通过而视为完成。它们是端到端流程闭环的下一阶段工作。

### P0 — 模板选择后必须确实进入可运行的 V3 计划

- 当前工作台把 `canRun` 绑定到已安装的 `activePlan` 或原生聚合中的 `d2RuntimePlan`。
- D4 选择路径会进入对象/场景配置并安装 D4 技术计划；非 D4 已发布模板路径则使用 `chooseLocalNativeProductTemplateV3` 绑定模板并回调 `onTemplateBound`，没有在此路径上显式生成 `d2RuntimePlan`。
- 必须继续追踪非 D4 模板是否存在真实、V3 原生、可执行的计划编译路径；如果没有，就补齐编译/安装合同。不能留下“界面显示已选择，但运行按钮不可用或退回旧 V2 Run”的半闭环。

### P0 — 模板驱动的材料分类与关键缺件判定

- 当前 `buildRouteCandidatesForRead` 解决的是“这份申请属于哪个业务模板”，不是“每份材料对应模板的哪一个材料槽位/规则依据”。
- 必须以选定模板自身的材料槽位、字段、规则和情形矩阵为准，对原件进行可解释分类；允许用户纠正 AI 分类，并保留来源与原件哈希。
- 需要区分“关键前提/规则完全缺失或无法判定”与“少量附件/证明缺件”。前者在计划固定或运行前明确阻断并请求补充；后者应允许用户完成初审，生成待补件事项，在同一案卷中补件并触发重审。
- 不能硬编码综测等某一个业务的材料要求，也不能把 OCR/模型猜测当成正式政策。

### P0 — 路由倒计时与选择的可信边界

- B3 Main 计时器与 Renderer 内部的 AI 候选 20 秒倒计时目前是两条实现路径。需要核对两者是否有统一的开始时间、取消状态、候选排序和默认候选语义。
- AI 候选的自动选择不得因为渲染层合并了低可靠度规则候选，就覆盖更可靠的深度匹配结果；用户手动选择、倒计时默认选择、切换模式、切换案卷和材料变化都必须共享同一套过期响应/中断规则。
- 对材料角色/主体不明确、多个申请主件、无申请主件、ZIP 多事项未分案的情况，必须明确停在人工确认，而不是给出误导性的“已匹配”。

### P1 — 导入失败与待办的持久可见性

- 快速入口遇到部分导入失败时，必须保证失败文件列表在跳转案卷后仍可见，能直接补传；全部导入失败但草稿已创建时，也必须给用户返回该草稿入口，避免重试产生一串不可见空案卷。
- ZIP/文件夹批量分案需要与单案快速入口明确分界；单案入口不能声称已经完成多事项自动分案。

### P1 — 初审、补件、重审和最终结果的连续性

- 验证同一案卷中的材料分类、关键缺件提示、Pi Run、结果与原始材料一一对应。
- 补件后旧 Run 应明确标记为过期；重审必须基于当前材料版本重新运行，不能复用旧 `run@rev` 冒充当前结论。
- 待办必须能直达对应材料/问题/结论；补件、人工确认与最终决定在同一案卷完成。T08 报告/导出必须引用真实当前 Run，并保留审计来源。
- 本阶段尚未证明申诉链路、ZIP 批量分案、离线导入导出等其他优先项在此 PR 中闭环；不把它们计入本 PR 的已完成范围。

## 4. 下一步执行顺序

1. **先解决 P0 计划可运行性：**沿 Main/IPC/Case/D2/Pi 的真实调用链追踪 D4 与非 D4 模板选择后的计划安装与 Run 启动，删除旧 V2 旁路，不伪造计划回执。
2. **实现模板驱动的材料分类合同：**读模板真实定义，输出材料槽位、分类证据、待确认项与关键缺件/普通缺件分级；用户纠正必须能回写当前案卷并保留来源。
3. **接入初审—补件—重审：**关键缺件阻断点明确；普通缺件允许初审结束并生成补件待办；补件后使旧 Run 失效并重跑。
4. **统一倒计时与取消状态：**Main 为权威状态，规则/模型候选统一排序，避免 Renderer 单独触发不一致的自动选择。
5. **补齐测试与人工验收清单：**覆盖导入成功/部分失败/全部失败、多主件、无主件、模板不匹配、低质量解析、候选被暂扣、20 秒倒计时/中断、D4/非 D4 计划安装、关键缺件/普通缺件、补件重审、旧 Run 过期、T08 导出。

## 5. 验收原则

- 以当前源码和可复现证据为准，不以组件名称、注释或 PR 描述代替行为证明。
- 模板负责业务规则、材料槽位与适用情形；路由层只负责候选匹配，不创造校规。
- Main 负责授权、真实原件和状态校验；Renderer 不得凭 UI 状态制造审核成功。
- 一个案卷只认一套当前材料与计划；一个结论必须指向真实 Run 及其材料版本。
- CI 全绿是进入人工验收的条件，不是端到端验收的替代品。


## 6. 第二次阶段核验：统一运行与材料分类（2026-10-24 09:42，Asia/Shanghai）

> 本节是对第 1 节所述早期 HEAD 的增量记录。早期“CI 全绿”只对 `a6372a8` 成立，不能外推到此节的新改动。

### 6.1 当前提交与实际构建状态

- 分支 HEAD：`4dc8dd98e1050bf0d1ef306006038067d7d976fb`。
- `PR #246` 仍开放且 GitHub 报告 mergeable，**尚未合并**。
- 在该 SHA 上共 6 项 workflow：`Review Baseline CI`、`Review batch focused tests` 通过；`D0.5 Semantic Module Tests`、`D1 Review Authoring Tests`、`D2 Scoped Pi Review Tests`、`PR CI` 失败。
- 失败点均为 Electron TypeScript 编译阶段（不是运行期模型验收）；四个任务共用同一批约 9 条类型错误，不能误报已经通过。

### 6.2 这一轮实际写入分支的改动（待修复与复验）

1. `review-v3-main-template-run.ts` 将模板确定性检查抽出为无 Run 写入的 `evaluateTemplateRuleReview`，保留旧独立入口供尚未迁移的消费者使用。
2. `pi-case-review-service.ts` 在构造和提交 Pi Run 时将已发布模板材料槽位/数值约束检查并入同一 `run-pi-*` 记录，不再依赖 UI 先创建 `run-tpl-*`。
3. `ReviewV3UnifiedRun.tsx` 取消双 Run 启动，统一从原有后台 Pi 入口启动并刷新一个运行。
4. `review-v3-main-template-plan-bridge.ts` 开始支持当前案卷 case 与 Subject 目标，并使“未确认分类”与“已确认缺件”区分。
5. `native-workspace-case-v3.ts`、`material-service.ts`、`review-ipc.ts`、`preload/index.ts` 加入 Main 授权的分类动作、原件版本替换、目标修订重校验及实际存储快照。
6. `ReviewV3LocalCandidateWorkbench.tsx` 接入模板材料槽位列表、人工确认与提示；允许非 D4 已发布模板在分类完成后启动统一审核。
7. `run-service-v2.ts` 的当前输入指纹加入原件 `role/materialSlotId`，分类变化使旧 Run 自动过期。
8. 加入“未分类不等于缺件”和 Subject target 的测试用例。

以上是“已写代码”，并非“已验收”。其中关键问题为尚存在类型编译失败、规则计划覆盖身份差异，以及模型结果提交时 Run 当前性/补件状态需要复验。

### 6.3 从失败 CI 获取的确切修复清单

- `native-workspace-case-v3.ts:460`：`SourceDocument` 没有 `versionId`。
- `pi-case-review-service.ts:254/371/871/1061`：`EvidenceLink[]` 与 `Record<string, unknown>[]` 的错误混用。
- `review-v3-main-template-plan-bridge.test.ts:147`：`T04PublishedRuleBinding` 使用了不存在的 `target` 属性，真实属性为 `binding`。
- `review-v3-main-template-run.ts:95/101`：抽取纯计算函数时漏移了 `sourceRefsOf` 与 `fingerprintOf` 函数。

### 6.4 接下来实施与验收顺序

1. 先将上述编译错误逐条修正到 CI 通过。
2. 再确认“分类确认→冻结/运行→统一 Run 的确定性+语义检查→待补件→补传→新 Run→旧 Run 过期”的真实顺序。禁止以两个独立 Run 冒充一次审核。
3. 补齐模板分类对同名多份材料、版本替换失败、多主件、非必需缺件、主体级/组级规则与未编译业务条件的防错；未知不能视为已通过。
4. 对照 Main/V3 的审计与权限，确认 Renderer 不能提交自造计划或写入其他案卷，旧 run@rev 不得冒充当前。
5. 补焦点测试与桌面验收证据；此前已经通过的工作流结论按对应 SHA 记录，不追认后续 SHA。

**记录约定**：每次复核在文档末尾追加带 HEAD、测试结果、功能清单和未完成项的增量段；不要覆盖或倒写历史结果。


## 7. 第三次阶段实现检查：编译恢复、先初审后补件、槽位格式约束

- 实施 HEAD（文档提交前）：`2bdf7f599d0789bfe180f71b3e3d644e7241aebb`。
- PR 仍为 #246 / `fix/v3-unified-intake-routing`，尚未合并。
- 第二阶段所列约 9 条 TypeScript 错误已经按日志来源修改：Main 文件重分类投影 ID、Pi 证据类型、T04 测试目标字段，以及抽出的来源/指纹辅助函数。
- 复核中，修复提交 `7369e524` 的 D0.5、D1、D2、基线与批次测试已通过；PR CI 未完成时，不把它视为通过。
- 最新 HEAD 的验证：`Review Baseline CI` 与 `Review batch focused tests` 已成功；其他 4 项仍在执行或排队。**完整编译+全部单测+Electron 实机验收尚未通过。**

### 7.1 新实现内容

1. `ReviewV3UnifiedRun.tsx` 删除“点击开始初审时隐式调用 submitCaseV2”的旧流程：**初审不等于正式提交**；既有 Pi Main 入口负责同一轮的检查和模型运行。
2. 将 `run@rev`、正式审批决定与分析阶段继续分开，不在开始初审时构造任何学校审批结果。
3. 实际 Run 返回 `awaiting-supplement` 后，工作区呈现每条待补件检查，可按对应已发布模板的材料槽位调用系统原件选择器，补传后标记本轮输入过期并要求重新运行；不会篡改旧 Run。
4. `getWorkspaceRunValidityV2` 用于刷新窗口中的历史 Run 当前性，防止分类/补件后的旧结论继续以“本轮”展示。
5. `reviewV3MaterialFileKind` / `reviewV3SlotAcceptsFile` 按模板 `acceptedKinds` 验证文件扩展名类别；Main 分类事务入口拒绝明显不兼容的文件类型；T04 材料槽计数不会把不兼容或解析失败原件视为确认齐全。
6. 新建 `review-v3-main-template-run-unified.test.ts`：验证模板检查只读计算不会产生独立 `run-tpl-*`、未分类不冒充缺件、槽位确认改变计划指纹；共享模板路由测试加入常见扩展名/类型限制。该测试最初缺少 `appeals` 夹具字段，已修复。
7. 沿用现有 `PR CI` 的 `bun test --isolate --timeout 30000` 验证新增测试，没有为此新增工作流或额外 CI 任务。

### 7.2 仍未解决的 P0/P1

- **全量真实 Run 同一性：**目前新工作台取消了独立模板 Run 调用，Pi 在同一 Run 内记录确定性/语义检查，但旧 `runTemplateRuleReview` 独立 IPC 仍保留给兼容入口；需扫净其他实际调用处、实现不可绕过的 Main 层统一业务入口。
- **规则/槽位判定完整性：**模板确定性编译仍可能受 group scope 或未绑定 Subject 影响；对失败情况按 `not-executed/awaiting-confirmation` 显示而不是强行通过。下一步须完整覆盖 group 及多主体规则，保持冻结 Check×target 身份。
- **缺件的业务分级：**当前初审允许已确认分类但少量缺件进入运行；“严重关键缺件是否前置阻断”和“初审生成持久待办并交学生答复”仍需统一到模板条件和业务任务合同，不得以 UI 提示冒充已建补件任务。
- **Run/Decision 合同：**旧 V2 阶段办理逻辑中仍存在虚构 `basedOnRunId: run@rev` 的实现（`stage-workflow.ts`）；新 V3 的决定入口必须显式绑定真实 Run 与当前输入哈希，不得将其误认为已解决。
- **用户体验：**本次材料分类先以文件名给建议、由用户确认；面向图片/扫描件的语义分类和可靠 OCR、ZIP 分案、模型深度实测仍未完成。
- **人工验收：**需在 Electron 中操作拖入→模板选择→分类→缺件初审→补传→新一轮 Run→T08 报告→人工决定，并检查刷新/重启后状态连续性。

**继续实现顺序：**以单 Run/字段、目标覆盖一致性为先；随后将补件状态接进持久业务待办，修复虚构决定 Run 引用，最后做真实桌面回归。没有通过的检查和业务步骤不写“完成”。


## 8. 第四次阶段提交：原生阶段决定的真实 Run 绑定

- 源码提交：`ac90f0fd5c7ea2ea1ea437d0ae886ae08e8640b7`。
- `stage-workflow.ts` 对 **V3 原生案卷** 在决定事务内读取本案真实已完成 `run-pi-*`，校验模板版本与当前输入新鲜度，并拒绝仍在运行/无真实 Run 的阶段决定；`BusinessDecision.basedOnRunId` 写入这个真实 ID，而非伪造 `run@rev`。
- 兼容性：非原生旧案卷暂时保留旧行为，不在本次强行迁移历史数据；其他 T05/V3 专用决定路径仍须单独核对身份授权与签发资格。
- 独立接口 `runTemplateRuleReview` 尚未整体下线，但新单案工作台只启动一份 Pi Run；单纯代码入口收敛不等于所有历史按钮都已迁移完毕。
- 新增的 `review-v3-main-template-run-unified.test.ts` 和 `review-v3-template-routing.test.ts` 由仓库既有 `.github/workflows/ci.yml` 的全量 `bun test --isolate` 覆盖，不额外新建工作流。
- 过程中修复了一次专门测试夹具缺少 `appeals` 的类型错误，并修正 `reviewV3MaterialFileKind` 扩展名匹配表达式，防止常见 PDF/图片/表格被误判为未知类型。

**此提交后的 CI 尚待重新核对；请只引用最新 HEAD 对应的 workflow 结果。** Electron GUI 人工验收、完整的模板条件缺件分级以及同案补件请求持久事务仍需要落实。


## 9. 第五次核验：最新 PR 全绿、真实运行决定、继续验证边界（2026-10-24 11:15，UTC+08）

> 本节覆盖先前各节记载的阶段状态；仅对指定 SHA 的 CI 结果做结论。旧节保留为修复审计记录。

- 核验 HEAD：`dcb3b49d43f68dea6c10c167259ff9a38b748b23`；工作分支 `fix/v3-unified-intake-routing`；集成目标 `feat/v3-r02-template-library`；[PR #246](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/246) 仍开放、未合并。
- 本 HEAD 的 GitHub Actions **六项全部 success**：`Review batch focused tests`、`Review Baseline CI`、`D2 Scoped Pi Review Tests`、`D0.5 Semantic Module Tests`、`D1 Review Authoring Tests`、`PR CI`。这说明本 SHA 的 CI 构建和配置的自动回归成功，**不等于 Electron 真实用户验收通过**。
- 自上一节新增代码：
  - `stage-workflow.ts` 原生 V3 阶段决定不再以 `run@rev` 代替 Run，而是在 Main 决定事务中读取本案真实已完成、模板相同、输入未过期的 Pi Run；兼容旧案卷路径另记。
  - `review-v3-main-template-run-unified.test.ts` 及模板扩展名/材料槽位测试加入；修复测试夹具与格式匹配错误。
  - `ReviewV3UnifiedRun.tsx` 不在开始初审时隐式正式提交案卷，待补材料显示及补件后重新运行的入口已经接入。
- 已确认的**尚未完成事项**：
  1. 缺件检查结果可显示于 Run，但尚不能把它等同于案卷 `SupplementRequest` 持久业务任务；需要决定「初审待补件」与「正式退回补件」两层的状态与入口边界。
  2. 模板当前有 `requiredAt`、`requiredWhen`、`acceptedKinds` 和材料计数；需要复核不同阶段与条件下的材料槽位计算，不得将尚未满足条件/尚未归类解释成缺件。
  3. 仍有 Renderer 侧模型候选 20 秒计时与 Main 侧规则候选倒计时两条代码路径，尚未证明跨重新打开、材料变化、冲突选择时的完全一致性。
  4. 没有真实 Electron 实机拖入→匹配→分类→初审→补件→新 Run→决定→T08 导出证据；禁止宣称产品闭环已验收。
  5. 还需要检验源码对“旧 Run 检查待补件与过期历史”是否有混淆以及 Main 对补件操作的实际材料版本/槽位授权。

**本轮之后的执行顺序**：先以真实代码修复明显的安全与状态缺口，再增补聚焦测试并检查新的 HEAD/CI；最后再出一次增量回执，不覆盖上述历史。


## 10. 第六次阶段推进：不同模板的条件材料、正式提交与决定阶段（2026-10-24，同日）

### 10.1 本阶段起点与修正过的真实回归

- 起点 `dcb3b49d43f68dea6c10c167259ff9a38b748b23` 对应 GitHub Actions **6/6 success**，PR #246 仍未合并。
- 本轮最初增加严格的 V3 槽位格式校验后，在中间提交 `cf5c43f`、`6c13165` 的 Review Baseline CI 中重现一项旧 V1 单案回归：`single-case-workspace.e2e.test.ts` 使用兼容的 `.txt` 材料，新增校验把它们误判成不兼容。这是**真实发现的兼容缺陷**，不是测试环境故障。
- `0ed74dc` 已将严格的模板条件+类型门禁限制到 **原生 V3**，旧 V1 单案保留原有计数门禁。在此 SHA 上 `Review Baseline CI`、`Review batch focused tests`、`D1 Review Authoring Tests` 已成功，其余工作流核验时仍在运行；不得将这个中间状态记为 6/6 成功。

### 10.2 新增业务能力

1. 新增 `review-v3-submission-material-gate.ts`：正式提交时按**本模板本槽位** `requiredAt / requiredWhen / minCount / maxCount / acceptedKinds` 判断材料，不再把全部模板的必需数量简单加总。
2. 对 `requiredWhen` 使用与 T04 相同的三值条件计算：`false` 为不适用，`true` 才核实材料数量，`unknown` 为“适用性待确认”，绝不擅自视为缺件或豁免。
3. `stage-workflow.ts` 在正式提交前和提交事务内重新校验模板身份与当前材料条件；用户**初审仍可在提交之前进行**，少量缺件继续显示为初审待办，避免把初审和校方提交合并成同一个动作。
4. `pi-case-review-service.ts` 放行“已发布模板的真实可执行检查仅来自材料槽位”的情形，不再仅因 `effectiveRules.length===0` 就拒绝启动统一 Run；仍要求实际检查目标存在。
5. `recordStageDecision` 原生 V3 的通过/部分通过动作必须满足 `requiredAt='decision'` 的模板条件和材料要求；“退回补件”动作不被该门禁提前锁死。决策调用继续要求同一案卷未过期、已完成的真实 Pi Run。
6. 新增 `review-v3-submission-material-gate.test.ts`：覆盖条件真/假/未知、格式不符、解析失败、决策阶段材料、超量以及非相关附件不影响计数。

### 10.3 对应源码提交

- `50e768e`：V3 条件化正式提交材料检查。
- `cf5c43f`：材料条件与格式单测。
- `6c13165`：允许材料槽位驱动的模板进入单一 Pi Run。
- `0ed74dc`：隔离 V3 严格门禁，修复 V1 兼容性回归。
- `e02a5a4`：原生决定阶段材料门禁。
- `3f10acd`：决策阶段材料条件回归测试。

### 10.4 验收状态和继续事项

- **已提交，但新 HEAD 的 CI 尚在执行**；旧六绿结果仅归属于 `dcb3b49`，不能外推。
- 正式提交/决定材料校验现在按模板定义及三值条件运行；条件需要的字段如果尚未确认，系统会阻断正式提交或批准，并要求人工核实。
- 还未完成真实 Electron 操作验收、真实模型测试、初审结果到持久 `SupplementRequest` 的事务投影、完整多主体/Group T04 判定、跨重启的 20 秒规则/AI 候选计时统一以及 T08 导出回归。
- 后续优先：复查最新 CI，处理失败原因；然后继续补充持久补件合同和全链路人工验收。不能把按钮文案当作完整业务完成证据。


## 11. 第七次增量：部分 Run 不能被误用为整案通过

- 对应源码提交：`58ae25cac09310dd38f06010a9acba63bb0f4ff6`、`b8856fb1e95a9a469153bef5a735bdf5d628b4ab`。
- 在 `stage-workflow.ts` 原生 V3 阶段决定事务中新增通过门禁：`stage-pass`、`item-pass` 若当前真实 Pi Run 的 `coverage.pendingChecks>0`，或仍存在 `awaiting-supplement`、`awaiting-confirmation`、`not-executed`、`execution-failed`，则拒绝直接通过。具体的有证据不合规判断仍留给有权人工决定；`return-for-supplement` 与明确的部分决定不会被简单的“检查未完成”门禁阻断。
- 中间构建曾发现 `nativeRunId` 使用早于声明，导致 D0.5/D1/D2 TypeScript 错误及批次历史阶段测试异常。已将真实 Run 的解析提前至同一 Case 事务中的所有门禁之前，提交 `b8856fb`。
- `b8856fb` 的 `Review Baseline CI` 和 `Review batch focused tests` 已 success；其余 D0.5、D1、D2、PR CI 在此记录时还未结束。**不能宣称最新全部 CI 已通过。**
- 下一阶段需要专门增加“原生案卷部分 Run 不可整案批准 / 补件后新 Run 可批准”的事务级回归，并用实际 Electron 桌面流程核实初审缺件与正式办理是独立步骤。持久的初审补件任务、跨重启计时器统一、Group target 覆盖、T08 报告仍是未完成项。


## 12. 第八次核验：统一收件与材料门禁恢复全绿（2026-10-24 13:42，UTC+08）

### 12.1 当前快照

- 分支：`fix/v3-unified-intake-routing`
- 核验源码 HEAD：`7b5a5612c88b544f229ad67edf6c1ee97a95673e`
- 集成目标：`feat/v3-r02-template-library`
- PR：[ #246 — feat(review-v3): complete unified intake-to-template routing](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/246)
- PR 状态：open、未合并；GitHub 报告可合并。
- PR 改动快照：32 个文件，约 +2,442 / −534 行。
- **该 HEAD 的六项 workflow 全部 success**：
  - `Review batch focused tests`
  - `Review Baseline CI`
  - `D0.5 Semantic Module Tests`
  - `D1 Review Authoring Tests`
  - `D2 Scoped Pi Review Tests`
  - `PR CI`

上述结论只对应本节记录的 HEAD。六项自动化检查全绿表示配置中的构建/自动回归通过，不等于 Electron 实机业务闭环已经验收；PR 未合并。

### 12.2 当前已提交实现

1. **模板匹配与收件**：加入模板精确匹配、关键词候选、深度匹配协议与通用模型适配；候选匹配是技术路由，不授予审核或决定权限。未匹配/不确定情形保留人工确认和通用兜底路径。
2. **模板驱动材料分类**：根据已选择模板展示材料槽位；分类动作经 Main 授权，针对明确的源材料版本写入角色/槽位，重新校验模板版本和材料版本，避免 Renderer 伪造归属。
3. **格式与数量门禁**：根据模板 `acceptedKinds` 检查扩展名对应的材料类别；条件材料按三值逻辑处理（真/假/未知），区分未分类、条件不适用、已确认缺件、格式不兼容和解析失败。正式提交与决定阶段分别执行各自的材料要求；旧 V1 兼容门禁不被原生 V3 的严格规则意外改变。
4. **统一初审 Run**：单案工作台不再在开始初审时隐式提交案卷；确定性模板检查和 Pi 语义检查被收敛到同一真实 Run，新增测试覆盖只读模板计算与材料分类指纹。
5. **补件后旧 Run 失效**：当前材料/分类变化会让旧 Run 失效；补传后提示基于当前原件版本更新审核，不把历史结论冒充当前结论。
6. **真实 Run 决定门禁**：原生 V3 阶段决定要求本案存在模板一致、输入未过期的真实 Pi Run；未解决的检查、待确认、未执行或执行失败项目不能被直接当作整案通过。决定写入真实 Run ID，不再使用伪造的 `run@rev` 充当原生 V3 的运行引用。
7. **错误可行动化**：最新提交保留材料门禁的具体失败原因，供上层调用方显示和处理，而不是只给出无法定位的笼统错误。

### 12.3 本轮关键提交链接

- [7b5a561 — 保留可操作的材料门禁错误](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/7b5a5612c88b544f229ad67edf6c1ee97a95673e)
- [3069fb — 记录原生部分 Run 审批保护与 CI 恢复](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/3069fbbae581ac22aa24dabaf328bc9792eb28ac)
- [b8856fb — 在校验审批前解析真实 Run](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/b8856fb1e95a9a469153bef5a735bdf5d628b4ab)
- [58ae25c — 阻止未解决检查被整案批准](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/58ae25cac09310dd38f06010a9acba63bb0f4ff6)
- [e02a5a4 — 正式决定阶段材料门禁](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/e02a5a406421de10e1923668033373a71f144531)
- [0ed74dc — 限定原生 V3 严格门禁并修复旧版兼容](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/0ed74dc786f12fe5daab039f9cb1317ba083ecc7)
- [ac90f0f — 原生阶段决定绑定真实 Run](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/ac90f0fd5c7ea2ea1ea437d0ae886ae08e8640b7)
- [56a009e — 初审先于正式提交并接入补件入口](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/56a009e1ce3d6d81cfe98da0ff3787bb31ac0dd8)
- [480636c — 按模板槽位校验材料格式](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/480636c3112edfb95cd105f0903add40efbea29e)
- [cf3e481 — 按已选模板分类材料](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/cf3e48145a19b560e3397f177171ad9bdd4678df)
- [2e16f68 — 持久化用户确认的模板材料分类](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/2e16f68746727e50040888fc172601da5d6bc01d)

### 12.4 仍不能宣称完成的部分

1. **持久补件业务任务**：Run 中发现的待补件结果与案卷正式 `SupplementRequest` / 学生回复 / 人工核验之间，仍需确认完整的事务投影和状态闭环。当前 UI 补传入口不能代替持久补件流程。
2. **单一入口的全仓收敛**：普通单案工作台已经走统一 Run，但兼容用的独立模板规则入口仍存在；还需逐个核查实际调用点，确保没有其他按钮或 IPC 旁路产生第二份有效 Run。
3. **模板规则覆盖**：继续核验多主体、Group scope、条件字段未知、多个同槽材料、超量/重复材料及规则无法编译时的行为，所有未知和未执行情况必须显式保留。
4. **倒计时与候选一致性**：Renderer 和 Main 仍存在不同候选计时/自动选择代码路径；需要确认重开窗口、并发选择和材料变化时的单一权威状态。
5. **Electron 实机验收**：尚缺有留存证据的完整流程：拖入材料 → 自动/手动模板匹配 → 分类确认 → 初审 → 少量缺件 → 补传 → 新 Run → 人工决定 → T08 报告/导出，并覆盖刷新和重启后的状态连续性。
6. **本 PR 范围外优先项**：申诉闭环、ZIP 自动分案、离线导入/导出不应因为 PR #246 通过 CI 而算作已完成。

### 12.5 下一步

- 以最新 HEAD 为基线，继续补持久补件合同和统一入口调用点审计。
- 为每一个关键状态转换补最小聚焦测试，不增加无必要的 CI 工作流。
- 随后执行 Electron 桌面人工验收并保存截图/操作证据；未实测的部分继续标为未验收。
- 本节记录后如有新提交，以新 HEAD 再查 workflow；不要把本节六绿结果自动沿用到后续提交。

## 13. 独立接管核验：Main 深度路由与唯一 Run 旁路修复（2026-10-24）

### 13.1 源码与证据边界

- 核对基线：`fix/v3-unified-intake-routing` @ `067e45c0cd33acf20bdff698c9e4b6afde5a8d65`；目标 base `feat/v3-r02-template-library` @ `150acfe761cb7ad0424a2ca009fd57f12dbfddfd`。
- 本节是相对于该 HEAD 的增量修复记录，不继承先前 HEAD 的 CI 绿灯；正式 PR 检查需在本次提交推送后重新读取。
- 已对照 PR246 交接文档复核 `Main/Preload/Renderer/Run` 可达调用点：原生 V3 新工作台原本执行同一 Pi Run，但旧高级规则按钮、T03 事实更正后自动检查以及 T08 建议应用后自动检查仍能创建另一份 `run-tpl-*`。

### 13.2 已实施的源代码修复

1. **封闭原生 V3 独立规则 Run 旁路**：`runTemplateRuleReview` 的 Main 服务拒绝原生 V3 的旧独立写入；原生案卷不再展示旧规则按钮。T03/T08 对原生案卷执行字段/事实修改后只刷新并要求从统一 Pi 入口重新审核，不会自造一份规则 Run。旧非原生案卷原有示例/兼容 API 不变。
2. **统一两层规则与 AI 的选择时钟**：新增 `LOCAL_PRODUCT_DEEP_MATCH_V3`，从 Main 当前案卷及已授权模板目录调用现有通用模型与共享深度匹配协议；匹配仍只输出技术建议，不创建业务决定。高置信度（至少 `0.95`）模型候选进入现有 Main B3 的 20 秒选择会话；低置信度、目录外或 held 候选只能等待人工选择。Renderer 不再另开 20 秒自动选择计时器；模型结果与规则候选使用同一个 Main 自动选择出口。
3. **强化异步当前性**：Renderer 模型结果绑定 `sessionKey`；材料换版、角色重分类、案卷变更后清除旧模型状态和草案。模板选择 IPC 必须提供当前 Main 返回的 `sessionKey`，不一致时拒绝绑定；`selectionMode=default` 还必须由 Main 再确认当下仍处于倒计时已完成、未中断且首选候选一致的状态，不能把过期自动回调当成人工选择。异步模型完成后重新核对 Main 会话身份及原件快照。界面并发选择增加进行中保护。
4. **快速导入部分失败可见**：已建案卷但部分/全部导入失败时，不直接卸载失败清单，不允许同一操作悄悄重建第二个案卷；显示真实案卷 ID 和进入该案卷继续补件的入口。

### 13.3 已执行验证（非 GUI）

- 原生 V3 旧规则 API 拒绝且不写任何 Run：新增反例通过。
- Main 模型候选授权/置信度过滤、B3 统一倒计时与人工中断：新增回归通过。
- 六套已发布业务模板的旧兼容执行与公共兜底示例链：聚焦回归通过。
- 定向 Bun 测试至少 18 项通过、零失败（包含 B3 既有四项；各测试命令见提交说明）。
- Electron 类型检查 `bun run --filter='@profer/electron' typecheck` 成功；第一次按默认 2 GiB 堆执行因 OOM 中止，改用 `NODE_OPTIONS=--max-old-space-size=5120` 后通过；OOM 不计作代码类型错误。

### 13.4 仍须独立验收，不能宣布全流程正式完成

1. 真实 Electron + 真实配置模型联调（含断线/延迟/并发/冷重启）：Main 模型结果只保存在技术路由会话内，重启后应重新安全匹配，尚无跨重启保留原始倒计时的正式持久合同。
2. 多主体、Group scope、复杂情形矩阵、关键材料分级、OCR/扫描件可靠分类仍没有覆盖各业务模板的实样验收；一个申请主件的单案入口限制和 ZIP/文件夹多案分流也未在本轮改变。
3. 补件后的真实 F12 回复/人工核结、新 Pi Run、阶段决定、T08 报告及历史归档尚需 Electron 全链实测与截图/Run ID/原件版本证据；本次新增单测不能冒充 A13 用户旅程通过。
4. 失败清单目前在快速导入页面内可见，已有案卷可从本机案卷列表恢复；失败文件清单的**跨重启持久化**及重试幂等性尚未作为独立存储合同完成。
5. 本轮未合并 PR、未声明学校授权/正式审批，旧 V2 仅保留必要兼容；主线上其他 PR 的报告签发与申诉功能须另行验收。
