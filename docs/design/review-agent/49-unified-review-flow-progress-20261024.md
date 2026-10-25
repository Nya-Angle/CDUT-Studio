# V3 统一审核链路阶段性进度（2026-10-24）

> 本文记录 PR #249 当前真实状态，作为下一阶段实现与验收的交接依据。它不是完成报告，也不表示 PR 已通过验收。
>
> - 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
> - 工作分支：`fix/v3-single-review-run-supplement-20261024`
> - 本文创建时分支 HEAD：`c1908aed7c224424d0a9b3ccbd862bbbf3b1b5e7`
> - 目标基线：`feat/v3-r02-template-library`
> - PR：[#249](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/249)
> - 记录时间：2026-10-24（UTC+8）

## 1. 当前结论

**状态：实现进行中，尚未达到可合并条件。**

本轮改动已覆盖 Main、shared contract、Preload/IPC、renderer、审核运行与回归测试等 23 个文件。基线 CI 通过；全工作区类型检查和 D2 scoped Pi BDD 步骤通过；但现有 Pi 审核回归、批量/全链路专项回归曾失败，PR CI 查询时仍在运行。不得将“类型检查通过”或“基线 CI 通过”写成整条链路通过。

## 2. 本轮要解决的业务闭环

目标是让单案审核路径有唯一、可追溯的业务事实来源：

1. 用户导入多份材料，系统不假设每个事项都使用综测材料清单。
2. 用户先确认材料分类（申报材料、证明材料、审核依据）和模板材料槽映射；AI 只提供建议，不直接写入或决定结论。
3. 依据实际材料和模板匹配/绑定审核依据。缺少关键申报原件、有效规则或规则要求的申报对象时，必须阻断；少量可补材料缺件则允许进入初审并显式记录待补/待确认状态。
4. 确定性规则检查、模板计划检查、材料槽检查、Pi 语义检查必须归并到同一份权威 ReviewRun，不得产生第二份独立 Run 来表达同一轮审核。
5. 补件请求绑定当前 Run、输入哈希、材料槽和请求创建时的材料版本快照。补件回复只能引用当前案卷中有效且符合请求约束的版本。
6. 材料替换、重新分类、补件回复等改变输入的操作必须使依赖旧输入的观察/结论失效；最终决定前重新验证材料槽、规则覆盖、证据与未处理项。
7. 旧 V2/诊断入口不得冒充当前权威审核结果或参与最终决定。

## 3. 已提交的实现范围

以下为分支中已提交、仍需回归验证的实现，不代表每个行为已验收：

- **材料分类 UI**：新增 `ReviewV3MaterialClassification.tsx`，支持手工分类、拖放分类、材料槽绑定、AI 建议预览和经用户确认后逐份应用。
- **Main 分类写入**：新增原生案卷材料重新分类 IPC/Main 写路径；保留原材料版本身份，并让旧审核输入失效；不允许直接改写已归档/已定稿案卷或冻结计划。
- **统一审核 Run**：Pi Run 初始检查集合尝试合并确定性检查、模板计划检查、材料槽状态和语义检查；renderer 的普通审核入口读取/显示同一 Run。
- **初审与缺件**：提交时校验真实有效材料、申报材料角色、有效规则和 subject-targeted 规则要求的申报对象；不再把所有材料槽缺件一律当作提交失败。
- **补件和最终决定**：补件请求可识别材料槽检查，验证当前槽状态；回复校验材料版本有效性、请求时版本快照及槽位约束；最终决定仍须重新验证材料槽要求。
- **观察失效与兼容 UI**：重新分类保守地使既有观察失效；旧模板诊断 Run 从主要 Run 选择中排除，并调整相关 UI 标识。
- **测试尝试**：增加材料槽提交/最终决定测试，调整全链路旅程中申报原件的角色。

## 4. CI 证据与已知问题

以本记录时观察到的 PR 检查为准：

| 检查 | 状态 | 证据/说明 |
|---|---|---|
| Review Baseline CI | 通过 | 运行 ID `40040441072` |
| PR CI | 进行中 | 运行 ID `40040441210`，查询时 verify job 尚未结束 |
| D2 Scoped Pi Review Tests | 失败 | 运行 ID `40040441325`；类型检查和 D2 scoped Pi BDD 步骤通过，既有 Pi Run/authoring 回归失败 |
| Review batch focused tests | 失败 | 运行 ID `40040441146`；专项套件 146 tests 中 142 pass、4 fail，4 个失败都集中在全链路旅程前置提交被拒绝后引起的后续任务缺失 |

### 已从日志确认的具体失败

1. `pi-case-review-service.test.ts`：开放/部分完成的 Run 被插入 `execution-failed` 的材料槽占位检查；续审后检查数量从原预期 5 变为 10。说明当前初始检查、语义占位和完成时合并之间存在重复/错误状态映射，必须修复实现，而不是简单放宽测试。
2. `real-chain-journey.test.ts`：`submitCaseV2` 因当前测试案卷未解析出有效规则而抛出 `DEPENDENCY_UNRESOLVED`，导致后续 automaticTask/openTask/firstTask 不存在。必须检查该测试使用的模板发布状态、有效规则解析和案卷绑定；不能为了让旧测试通过而删除生产环境的“无有效规则不准审核”门控。
3. `Review batch focused tests` 中上述 4 个失败为链路前置失败后的级联失败，不应将后续 `undefined.id` 当作独立根因。
4. 最新提交 `c1908aed` 增加了材料纠正时保留唯一申报材料的保护，并修正材料槽元素值提取的类型假设；该提交之后尚需重新读取新 CI 结果。
5. 补件路径仍需检查 `cancelled` 的关闭语义、槽位 ID 的规范化，以及最终决定门控与同一 Run 检查账本的一致性。

## 5. 下一阶段执行顺序（必须按顺序推进）

### P0：修复 Run 检查账本

- 逐行核对 `pi-case-review-service.ts` 的初始检查构建、`expectedSemanticChecks`、流中断/续审、`semanticResultMap` 合并、coverage 更新。
- 不把“材料数量/类型已满足，但必需要素尚待 Pi 核验”标成最终 `execution-failed`；应使用合法的待执行状态/占位契约，并保证同一 `checkId` 只存在一条权威记录。
- 确保模板计划检查、确定性规则、材料槽检查与语义检查的身份空间明确，不重复运行或重复计数。
- 增加回归断言：初始运行、被拒绝的流、续审后复用原 runId、完成后无重复检查、未完成检查仍保持可续审状态。

### P1：恢复真实全链路旅程

- 读取 `effective-rules.ts`、模板编译/发布与 `real-chain-journey.test.ts` 的真实实现。
- 找出为什么旅程所用模板在 `submitCaseV2` 阶段解析为零有效规则；判断是测试 fixture 缺失有效规则、模板引用/发布不一致，还是规则解析遗漏。
- 生产门控只允许基于真实规则/固定计划通过，不允许空规则下由模型猜测制度。优先修正 fixture 或真实规则解析；只有源码证据证明门控逻辑错误时才改门控。
- 让旅程的首任务创建、审核执行、补件回复、任务回流、申诉更正都重新进入测试。

### P2：补件、槽位和最终决定

- 核验 `assessMaterialSlotV2` 的条件表达式、适用阶段、min/max、文件类型、必需要素和材料复用约束。
- 区分“允许初审的少量缺件”和“最终决定不能越过的阻断项”。
- 校验请求快照与回复版本约束：不接受请求前已经存在的材料冒充新增补件；材料槽必须匹配；过期 Run/inputHash 不可处置。
- 检查 `satisfied`、`cancelled`、`rejected` 的状态迁移与任务回流，不允许取消被错误解释为材料已满足。

### P3：UI 与 IPC 的真实路径

- 验证单案 renderer 只从当前案卷读取权威 Run；旧模板诊断 Run 不得覆盖最新权威 Run。
- 验证材料分类确认在案卷/模板变化后失效，冻结计划时禁写。
- 检查 IPC sender 身份门禁、参数校验、Main 端授权和并发 revision/CAS。
- 确认补件和人工确认在案卷内完成，不引入新的独立审核页面或第二套状态源。

### P4：验证和交付

- 重新跑类型检查、D2 scoped Pi 测试、既有 Pi/authoring 回归、全链路旅程、材料槽与最终决定测试。
- 重新读取 PR CI 与失败 job 日志，直到所有相关检查通过。
- 在本文件追加验证记录（commit SHA、workflow run ID、测试结果、剩余限制），并更新 PR 描述。
- 未完成上述验证前保持 PR 为 Draft，不合并、不声称整条链路已解决。

## 6. 验收标准

- 一次用户发起对应唯一权威 ReviewRun；模板诊断不能生成/覆盖权威业务结果。
- 同一 Run 的 checkId 唯一，检查状态合法；被拒绝/中断/续审不会复制检查、错误结束运行或丢失待执行项。
- 没有申报原件、没有有效规则、subject-targeted 规则缺少对象时明确阻断，不调用 Pi 伪造制度结论。
- 少量材料槽缺件可进入初审，并清晰显示待补/待确认；最终决定无法越过未满足槽位。
- 补件只能绑定当前案卷、当前请求和有效材料版本；补件后旧结论失效并能回到正确的审核阶段。
- 重新分类保留原件版本，旧观察/结论失效；不能将唯一申报材料错误地改为证明材料/审核依据。
- Main/IPC/renderer 的状态与 RunId 一致，刷新、重开和更新审核不会切换到诊断 Run。
- 相关 CI 全绿，测试覆盖正常、缺件、错误输入、过期输入、续审和最终决定的正反路径。

## 7. 后续维护约定

本文件是本轮修复的阶段性进度和交接记录。后续工作必须继续以当前源码与 CI 日志为准；每次提交后更新实际 HEAD 和验证结果。不要用计划代替实现，不要用修改测试预期掩盖业务缺陷，也不要在未读源码的情况下根据旧文档猜测行为。


## 8. 2026-10-24 09:40（UTC+8）阶段性更新（先记录，再修复）

本次从最新远端 HEAD `9c123965b9fb9d3e21e0930cd437c8aea079d297`、草稿 PR #249 以及最新完整 PR CI 读取，不采用旧进度作为现状。

### 当前代码与检查事实

- PR 已涉及 **31 个文件**。在上次记录之后补入材料槽角色语义、Main 登记/批量分类的角色和槽位限制、AI 建议分批处理、decision 阶段材料槽校验、更多专项测试。
- 完整 PR CI `40045798371`：typecheck、package boundaries、内置皮肤契约、main/preload/renderer 构建成功；单元与回归 **5,020 pass / 5 skip / 3 fail（共 5,028）**。因此 CI 仍为 failure。
- 同一 HEAD 的专项 CI 全绿：Review batch `40045798574`、Review Baseline `40045798456`、D2 Scoped Pi `40045798593`、D1 Review Authoring `40045798358`、D0.5 Semantic `40045798390`。

### 三个失败根因定位（最新 CI 日志）

1. `review-pi-run-bridge.main.test.ts:128`：`F09 T04 新 Run 不遮挡更早 Pi 部分完成轮次续审`。更新审核拿到了**新的 runId**，而不是已有部分完成 runId。这是业务语义缺陷，必须修改 Main 更新选 Run 的逻辑，确保同案、模板、输入快照一致时复用可续审 Pi Run。
2. `submit-case-v2.test.ts:71`：旧案恢复后 `caseV2.revision` 实际 4、旧测试预期 3。检查登记、旧状态注入、恢复提交分别引入的 revision，断言应以事务真实前后差异为准，不能固定猜测一个 revision。
3. `native-case-material-slot.test.ts:57`：主进程拒绝了错误 role，但异常文案为 `材料槽「实验计划」只接受 evidence 类材料，当前类别为 application`，测试期待出现“材料类别”。保持实际拒绝，统一可理解的错误文案，并测试精确角色约束。

### 本次继续实施的顺序

- **立即先修** F09 续审同 Run；这是用户可见核心链路。
- 随后校对 revision 回归和材料槽异常文案。
- 重新运行专项检查和全量 PR CI，并以新 SHA 的结果追加记录；不以旧绿灯冒充新绿灯。
- 延续原计划 P2/P3：补件历史快照、分类归位、规则和主体判定、最终决定限制、人为复核与同案工作区路径审查。
- 此时仍保持 PR Draft；合并与全链路验收没有完成。


## 9. 2026-10-24 后续实现记录（续审与旧阶段决定隔离）

### 已完成的代码提交

- `5866ffdb00414acde9ddedccfe5809bbd17f23f2`：修复 Main `review-pi-run-bridge.ts` 的 Pi 部分完成轮次续交门控。新 Run 的未完成检查写作 `not-executed`，旧入口却只识别 `execution-failed`，导致更新审核新建 Run。现在仅对真实 `executedBy === 'semantic'` 且状态为上述两个未完成占位值的检查识别续审，仍维持现有输入快照、Assignment、会话身份核验。
- 同一提交：`submit-case-v2.test.ts` 现在准确检查“模拟旧提交状态”自身已经写过一次 revision，恢复动作只应再增加一个 revision，并验证首任务与回执；此前期待的固定 revision=3 不符合真实事务历史。
- 同一提交：`native-workspace-case-v3.ts` 与 `material-service.ts` 的错误角色拒绝统一说明“材料类别不匹配”，保留 Main 双层拒绝约束。
- `d0b694c0eab10f40ebc7a7ce5a8042c250bb5d48`：读源码确认原生案卷 UI `V2CasePanel` 使用 `ReviewV3T05HumanWorkflow`、可信 `T05_RECORD_STAGE_DECISION`；而旧 `recordStageDecision` 仍然将 `basedOnRunId` 伪装为 `run@rev...`。现在旧服务对 **原生 V3 案卷拒绝**，统一要求走 T05；旧 V2 非原生案卷暂保留兼容。补充“提交后旧入口不能生成原生 V3 决定”的回归断言。

### 验证与边界

- 上述修复提交推送成功，尚未宣称全量 CI 已通过。
- `5866ffdb` 观察到五组专项 CI 已通过、完整 PR CI 尚在运行；后续新提交 `d0b694c` 已触发新一轮检查，其结论必须以该最新 HEAD 为准。
- **仍需处理的遗留边界**：旧 V2 阶段服务为非原生兼容案卷生成 `run@rev...`，且 `RECORD_STAGE_DECISION_V2` IPC 仍在。当前已阻断原生 V3 通过该服务写决定；删除完整兼容路径需同步核对仍存旧案卷的办理入口，不能直接删到用户无法处理历史案卷。
- 补件 `satisfied/cancelled` 回流和旧历史运行/凭据的长期清理仍需要针对当前 V3 的回归验证，不能因上面三处 CI 故障关闭而自动视为完成。

### 后续验收记录位置

请在本小节下续写最新 HEAD 的全量 PR CI / 专项结果、失败日志、剩余问题、是否仍为 Draft；不得删掉历史失败记录。


## 10. 2026-10-24 09:46（UTC+8）续审进度核对

### 权威版本及变更

- 本次重新读取远端分支 HEAD：`53b3eed910853f30d1bb4bd43133715f66a7b432`；其最后提交为 `docs(review-v3): record run continuity fixes and native V2 decision fence`。
- 草稿 PR [#249](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/249) 仍为 OPEN / Draft，变更文件 **32 个**。与第 8 节 31 个文件的历史快照不同，后续核验必须固定本轮新 HEAD。
- `5866ffdb`、`d0b694c`、`53b3eed` 的修复与进度已经在第 9 节交代，此处不重复声称已经通过全量验收。

### 最新 HEAD 的 CI 状态（本次读取）

| Workflow | Run ID | 读取时状态 |
| --- | --- | --- |
| Review batch focused tests | `40051238093` | **success** |
| Review Baseline CI | `40051238095` | **success** |
| D2 Scoped Pi Review Tests | `40051238072` | **in_progress** |
| D1 Review Authoring Tests | `40051238080` | **in_progress** |
| D0.5 Semantic Module Tests | `40051238142` | **in_progress** |
| PR CI | `40051238122` | **in_progress** |

这里的绿灯只属于 **53b3eed** 在查询时已完成的两套检查。完整 CI 尚未有本轮最终结论，不能沿用此前 SHA 的测试结果替代。

### 继续实施的工作点

1. 先分析最新 CI 完成后的具体失败；不要因为上一轮的 F09/旧案 revision 失败修过就假定不再回归。
2. 对 `stage-workflow`、`review-v3-t05-main-service`、`review-pi-run-bridge`、`pi-case-review-service` 继续做 V3 单一 Run + T05 决定链路核对，重点关注数据身份（`runId`、`inputHash`、案卷 revision、材料槽、补件请求）。
3. 继续排查 `material-slot-readiness-v2` 的 applicability 与所选模板的 `requiredAt` 边界，最终决定不能因为初审允许缺件而放行。
4. 以新增的小范围回归防止修一处破另一处，再以同一个最新 commit 读取 CI 才能对外报告完成度。
5. 继续保留 Draft、保留历史失败与修复证据；后续新提交的准确 SHA 与验证结果写入下一节。


## 11. 2026-10-24 续审实施回报（T05 补件、终审、人工处置身份）

> 本节续第 10 节的 HEAD `53b3eed` 检查，按实际提交记录，不声称 PR 已完成或全部 CI 已通过。

### 新增已推送提交

- `954dbf44761b37325fcabb7553e3f23204c13410`：补写第 10 节阶段性进度、最新工作流和待办。
- `973b52ca28b136a7d8a3f47998b8674a4d6ff4f6`：补齐 T05 可信补件创建时的 `documentVersionIdsAtRequest` 快照；T05 可信阶段补件的 `satisfied/insufficient` 判定要求先有回复记录；终审 `stage-pass` 在 Main 事务内重新核查所有适用模板材料槽，未满足则拒绝；只读能力投影也展示同一材料阻断。新增 T05 领域与阶段补件回流单测。
- `644cf56d07a432b29c75edfb8d183c9b4570388d`：修正 T05 材料槽测试夹具的 TypeScript 类型使用，避免不可赋值的 `never` 属性路径。
- `10dc0701d0e9749b6ec7e10a4b73ba5bcccd4cee`：T05 人工处置只采纳同时匹配当前 `runId` 与 `inputManifest.hash` 的记录；单个 `ruleId` 对应多个检查目标时，规则 ID 级的泛化豁免不得一次解除全部检查。新增错误哈希、无哈希和多目标豁免的反例回归。

### 当前实际行为边界

1. **初审与终审分层**：缺少少量证明材料可先审核；终审 `stage-pass` 不因为初审允许缺件而自动通过。涉及 `requiredAt='decision'` 的材料，已存在时仍由 Pi 参与必需要素核验；仅数量、类别齐全不等于要素已由 Pi 确认。
2. **补件必须能区分新旧原件**：新创建的可信 T05 补件带请求时文档版本集合，旧版本不能冒充新增附件。人工核验“满足”必须先有提交方回复；`cancelled` 仍为有理由的显式豁免，不等于材料槽已齐全，终审门控继续检查。
3. **人工复核必须使用同一轮输入**：历史无 Run 哈希的处置只作为历史；T05 `stage-pass` 不得借助该处置放行。规则多目标时必须逐目标处置，避免“同一规则 ID”扩大豁免范围。
4. **旧路径仍需长期迁移**：非原生 V2 业务案卷继续使用旧阶段服务的兼容路径；原生 V3 已拒绝旧 `run@rev` 写决定，继续使用 T05。

### CI 状态与证据层级

- 对 `644cf56d` 的工作流，查询时 Review Baseline `40051568506`、Review batch focused `40051568609`、D1 Authoring `40051568441`、D0.5 Semantic `40051568531`、D2 Scoped Pi `40051568437` 均报告 **success**；PR CI `40051568469` 查询时仍为 **in_progress**。
- 对当前代码提交 `10dc0701`，新一轮 PR CI `40051706219` 尚未报告最终结果；专项流程已触发并开始执行。**不得把前一提交的成功当成当前 HEAD 的成功**。
- 本次变更仍留在 PR #249 的 Draft 状态；最终验收必须由当前代码 HEAD 的全量类型检查、专项回归、完整 PR CI 与真实主流程核对共同支持。

### 尚未关闭的工作

- 完整读取 `10dc0701` 及其后提交触发的全量 CI 日志；出现失败时按真实堆栈/源码修复，不仅修改断言。
- 覆盖实际 UI/IPC 的整案步骤：从模板确认、材料归类、初审、补件、回流、二次审核、人工认定直到终审；检查刷新/恢复/历史 Run 不会改变权威决定来源。
- 对多个补件请求、撤销/不适用、证据材料重新分类与 Run 过期的交叉场景补齐操作级验收。
- 完成上述事项前，不撤 Draft，不合并，也不报告“整条链路完全修复”。

## 12. 2026-10-24 10:25（UTC+8）最新进度复核：本轮 CI 全绿，继续审查业务门控

> 本节的结论仅针对远端 HEAD `a07adda635cd64faafc9379f9c237bdb6df158e7`。此前第 8～11 节记载的失败/修复过程为历史，不是此刻的 CI 状态。

### 分支与 CI 实况

- 草稿 PR [#249](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/249) 仍为 Open / Draft，基线 `feat/v3-r02-template-library`，37 个变更文件；GitHub 报告可合并性为 true，但这不等于业务验收完成。
- 以下 6 项均为**同一 HEAD** 的 GitHub Actions 完成结果，不混用其他 SHA：
  - Review Baseline CI：**success**，run `40051760857`
  - Review batch focused tests：**success**，run `40051760911`
  - D1 Review Authoring Tests：**success**，run `40051760842`
  - D2 Scoped Pi Review Tests：**success**，run `40051760906`
  - D0.5 Semantic Module Tests：**success**，run `40051760848`
  - PR CI：**success**，run `40051760809`

### 源码继续审查的结论

- 上一轮 Run 续审、真实综测 fixture 的有效政策规则、原生 V3 对旧 `run@rev` 决定写路径的阻断、T05 补件版本快照与人工处置哈希限制，均已在分支代码中发现对应落点，自动测试当前全绿。
- 当前仍需要额外审查 **T05 阶段通过门控的检查账本真实性**：`t05ActionEligibility` 当前按 `checks.length >= plannedChecks` 和规则 ID 的存在判断覆盖，但未单独拦截重复的 `checkId`；重复结果可能使覆盖数量看似足够。这属于额外发现的防伪边界，应先补失败反例，再在 Main 门控增加唯一性和实际覆盖计数约束。尤其不能只因为 `checks.length` 达标而批准。
- 材料槽数量/类型检查与必需要素语义检查属于不同责任；后者应在 Pi 中有真实结果或明确待确认，不能把“已绑定材料槽”解释为已核对所有必需要素。
- 本轮继续保留 PR Draft；只做精准补强与小范围测试，不重复大批模板制作或重构历史 V2。

### 接下来执行与验收记录

1. 增加 T05 Run 检查身份重复、覆盖计数不足、规则目标未核验等反例，修实际 Main 门控。
2. 对新增 HEAD 重跑专项和 PR CI，不把 `a07adda` 旧绿灯用于后续提交。
3. 再核对 UI/IPC 到 T05 决定与补件回流的真实身份链、案卷刷新时权威 Run 不切换。
4. 未通过新提交检查与人工业务核验前，不合并，不声明彻底完成。

## 13. 2026-10-24 继续实施：T05 正式阶段通过门控防伪

### 本轮提交（均已推送工作分支）

- `5c5942fdb801c245b07292a763e641b676a3bc60`：本文件追加第 12 节，以同一 HEAD `a07adda` 的六项 CI 全绿结果作为真实历史进度证据；将新发现的 T05 检查账本信任问题登记为待实施。
- `fe730aed6db600adbd809800db95b0be63de2a4e`：在 `t05ActionEligibility` 中要求 `stage-pass` 使用真正 `completed` 的权威 Run；拦截重复/空 `checkId`，不再让重复检查凑足覆盖数量；阶段通过前进一步核对 `coverage.completedChecks/plannedChecks/pendingChecks`。新增重复 ID、部分完成 Run、伪造覆盖计数等反例。
- `24f4db62827699d89a269efea0719ad4cc9197a0`：当 Run 有 `inputManifest.effectiveRuleIds` 时，拒绝将不属于冻结规则集的非 `system:` 检查作为通过依据；全部检查均 `not-applicable` 时禁止“无待办所以通过”。新增伪造规则和全部不适用两项反例。
- `21823f59b8b5ad03dfc2f24f6838f8121314da8e`：修正覆盖数值的 TypeScript 类型收窄，避免未定义计数进入比较表达式。
- 本节写入前 HEAD：`21823f59b8b5ad03dfc2f24f6838f8121314da8e`。

### 设计和实际效果的边界

- 上述加固**只收紧积极通过（`stage-pass`）**：`partially-completed` 的 Run 如确属当前案卷，原有“退回补件/要求复核/有依据地驳回”等路径保持独立的适格判定，不因为待审问题被迫冒充通过。
- 当前 CheckResult 可能合法地一条规则对应多个事项/目标，禁止的是重复 `checkId`，不是一律禁止重复 `ruleId`；`system:` Main 自有检查允许存在，但仍受非空唯一 Check 身份和覆盖账本约束。
- 此轮仅变更 `review-v3-t05-main-service.ts` 与 `review-v3-t05-business-mode.test.ts` 的逻辑/反例，不建立新的 Run、Decision、Plan 或持久化状态。
- CI 证据不能继承：`a07adda` 的 6 项成功是**本轮代码变更之前**的历史结果。`21823f5` 的新检查查询时 尚未全部完成；完整通过与否待后续新 HEAD 的实际结果。

### 下一轮重点

1. 固定最新 HEAD 跟踪 6 项 CI；若出现失败，优先查看日志并修复真实生产逻辑。
2. 复查 UI → IPC → T05 阶段事务对最新单一 Pi Run 的选择，特别是补件后旧 Run 过期、人工处置 `runId/inputHash`、取消补件不等于材料已满足。
3. 记录实际完成的专项/全量结果；验收前继续保持 Draft，不合并。

## 14. 2026-10-24 人工复核兼容修正（继第 13 节）

- `14dc876b4a0a50685f94f4d92874fddda8e4ef17`：对第 13 节新增门控做了语义纠正。`coverage.pendingChecks` 是原始检查账本统计，并不会因当前人工处置而改写，不能把它用作**无条件阶段通过阻断**，否则有效的 `human-confirmed-compliant` 也无法放行。
- `dcbb265316c89ab7cfd592a07154d919bc854fdb`：增加反例，验证当前 `runId + inputManifest.hash` 对应、具名并人工确认的待确认项，在原始 `pendingChecks=1` 时仍可 `stage-pass`。如果无该处置，仍由 `t05ActionEligibility` 的逐 Check 待确认检查拒绝通过。
- **最终约束**：重复/缺失 Check ID、错误冻结规则、非已完成 Run、检查覆盖不足、全部不适用继续阻断积极通过；可以被当前可信人工处置解决的是待确认/特定问题检查，不是未执行/执行失败。
- 本次修正没有修改业务数据或正式 Decision 的存储方式；检查基于原有同一 Run 的 `coverage` 和 `dispositions`。
- 本节写入时，最新代码 HEAD 为 `dcbb265316c89ab7cfd592a07154d919bc854fdb`，该 SHA 的全量 PR CI 与专项工作流仍在运行，**尚不得宣称新提交六项 CI 全绿**。之前 `a07adda` 的六项成功证据不迁移到新 SHA。

## 15. 2026-10-24 11:15（UTC+8）阶段进度同步及下阶段缺口

> 本节依照当时远端 HEAD `2359bbb249dcd2453f3c9f21d891dcd322f2f94a` 和同一 SHA 对应的 Actions 读取；先记录，再继续改动。以前各节中的失败与正在运行记录是历史快照。

### 最新远端 CI

- D1 Review Authoring Tests：`success`，run `40054513969`
- D2 Scoped Pi Review Tests：`success`，run `40054513915`
- Review Baseline CI：`success`，run `40054513931`
- D0.5 Semantic Module Tests：`success`，run `40054513982`
- PR CI：`success`，run `40054513919`
- Review batch focused tests：`success`，run `40054513938`

- 当前 PR #249 仍为 Open / Draft；本次读取的六项检查均为同一 HEAD 的 `success`。
- 这意味着当前提交的自动化基线/专项/PR CI 已通过，**不等于实机端到端已验收**。
- 目前覆盖 Main/IPC、材料槽、单 Run、Pi 检查、T05 阶段决定及人工处置；对客户端界面多材料纠错、真实补件/恢复与多事项模板，还需要业务级实测。

### 本轮深入源码确认的新风险

- `stage-workflow.ts::resolveSupplementV2` 对 `satisfied` 已有角色与回复状态校验；但绑定 `materialSlotId` 的补件请求可能仅根据回复状态被核结，**未强制复算该模板槽位是否真正满足**。这会在终审门禁之前造成补件状态与材料事实不一致。
- 同一模块的补件回复校验已有 `documentVersionIdsAtRequest` 和关联槽位版本校验；应让该版本快照契约和最终槽位准备度联合约束 `satisfied`，同时保证 `cancelled` 是有理由的豁免而不是伪造“材料已齐”。
- 计划在 Main 事务中补判定前置检查，并新增负例：已回复但槽位仍缺件、角色/类型不符合时不能设为 `satisfied`；补齐并绑定槽位后才允许核结；最终决定仍必须单独审查 Run 与材料。

### 剩余验证要求

1. 实现和测试补件槽位真实性门禁，覆盖同一补件请求的有材料与无材料回复路径。
2. 修复后必须读取新 HEAD 的检查，不能沿用本节 `2359bbb249dcd2453f3c9f21d891dcd322f2f94a` 的六个绿灯。
3. 继续核对补件结束后同案新 Run、旧人工认定和证据归属不会在最终决定中误用。
4. 保持 PR Draft，未通过实机验收前不得声称整条业务线已经交付完毕。

## 16. 2026-10-24 11:15 后续实施：补件核结真实性与模板级初审阻断

> 本节在第 15 节记录 CI 绿灯之后继续提交实现。新增提交的检查必须单独核对，不得继承旧 SHA 的绿灯。

### 源码改动及提交

- `51386c20296d03644b0155e90cd1837db0f37d53` — `stage-workflow.ts::resolveSupplementV2` 在 `satisfied` 且请求绑定 `materialSlotId` 时，要求存在真实回复，重新加载当前案卷模板材料槽，调用 `assessMaterialSlotV2` 复查类别、文件类型、数量和适用条件；如果仍是待补/待确认或槽位已删除，不能把请求登记为“已满足”。明确取消 `cancelled` 是有理由豁免，最终决定仍须独立核验材料与 Run。
- 同提交更新 `native-case-material-slot.test.ts`：构造来源任务、真实材料版本快照、材料槽补件请求，覆盖“只回复说明但缺材料不得标记已满足”、“新证据按真实槽位绑定之后才能核结”和“来源阶段任务恢复”。
- `2f100b2c46ba3ecb0b0408c1990a696d2853d0c8` — 模板材料槽契约新增可选的 `initialReviewPolicy: 'block' | 'defer'`；模板发布校验拒绝非法值和“仅在终审必需却声明初审前强制阻断”的矛盾组合；`submitCaseV2` 对 `block` 槽位在初审前拦截，对 `defer` 槽位维持“初审可跑、生成待补项、终审必检”的现有行为。
- `5203f4f970b368a59d0da204a040e759687871e5` — 对新增严格门控测试夹具补充显式 `TemplateVersion` 类型，避免不安全的 `never` 展开；没有改变生产契约。
- 新增严格门控反例：同样缺少实验计划证明，普通可延期模板允许进入初审，声明 `initialReviewPolicy: 'block'` 的模板必须先补齐，且不能创建首阶段任务。

### 业务裁决与兼容性

- “少量缺件”的判断不是全校统一的件数百分比，也不应靠模型猜。模板负责指定哪些槽位对初审属于关键输入。默认 `defer` 对历史模板保持兼容；模板声明 `block` 的关键材料严格阻断。
- 仍然无条件阻断的关键前提包括：缺少真实有效材料、未明确申报材料、无法获得有效规则，以及 subject-targeted 规则要求的必要申报对象未确认。
- `initialReviewPolicy` 当前是运行时和模板发布层的字段；批量 R02 模板的显式关键槽位标注还需要独立业务审校，不能通过字段存在就推断所有模板都已经完成关键材料配置。
- 本轮未修改原先的单一权威 Run 设计、历史材料版本和决定记录。补件之后仍需新的真实运行，不能以“已满足”的补件状态冒充补件内容通过 Pi 复审。

### 最新提交的 CI 状态（本次写入前）

- 本节写入前代码 HEAD：`5203f4f970b368a59d0da204a040e759687871e5`。
- D2 Scoped Pi Review Tests：`in_progress`，run `40057952568`
- D1 Review Authoring Tests：`in_progress`，run `40057952558`
- D0.5 Semantic Module Tests：`in_progress`，run `40057952578`
- Review batch focused tests：`in_progress`，run `40057952572`
- PR CI：`pending`，run `40057952660`
- Review Baseline CI：`success`，run `40057952569`
- 任何 pending、queued、in_progress 都是未验证，不得宣称本轮全绿。
- PR #249 仍保持 Draft；随后须读取该 HEAD（以及进度文档提交之后 HEAD）的完整 Actions 结果，失败时从日志定位并修正源码，不用修改测试预期掩盖缺陷。

### 下一步

1. 优先检验补件新旧材料版本校验、`initialReviewPolicy` 的严格与宽松双路径测试；若触发 CI 失败，按失败堆栈回到源码。
2. 在真实界面上走通“选模板—纠正类别—初审少量缺件—初审结果—人工要求补件—补件核结—再审—有权决定”的完整流程，尤其确认清理旧 Run、旧处置和材料引用。
3. 确认 PR 最新源码与并行施工分支无冲突。保持 Draft 直到目标路径可复现通过，并将最终验收结果另行写明。
