# 47｜P06 实测驱动的后续顺序与验收细则调整（2026-10-15）

> 本文是**设计增补与执行计划**，不是新一轮测试 PASS。基线：`feat/review-owned-background-sessions@f716d2efaed0dcd8924d5acc30cd3012eb093348`，Draft PR #21。先读 [27｜v1架构规范](27-background-review-session-proposal.md)、[28｜原阶段快照](28-review-stage-delivery-status.md)、[29｜唯一LIVE台账](29-background-session-preflight-audit.md)、[32｜P05跨仓门禁](32-p05-stage-acceptance-and-local-gates.md)、[46｜独立实机原证据](46-p06-recheck-live-local-acceptance-20261014.md)。基线自托管 7/7 CI SUCCESS，[PR CI #38602829396](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38602829396) 3894 pass / 5 skip / 0 fail、3899 tests / 445 files；**此数字不是未来新文档 HEAD 的测试结果**。

## 一、目标和实测事实

**最终用户目标**：案卷内直接启动 Pi 审读，Main 真正获得执行权后才 ACK；离开工作台不把内部 owner 暴露到普通 Agent；返回时可信恢复审读状态、依据、补件和待人工处理。分析结束不等于业务审批通过，用户不应被技术阶段/token/原始 transcript 打断。

**已证实的部分**：46号隔离真实 Electron/Main/Renderer/Pi：E05真实旧响应迟到交付 **9/9 PASS**、E03真实 stop Promise 的受控 pending/busy/restart **8/8 PASS**、E04真实旧 outcome 闭包受控迟到重放 **7/7 PASS**；实际 8MiB tmpfs ENOSPC、双持久化及owner失写、故障保持与可写恢复两次重启各 **8/5/2/3** 断言PASS。普通 Pi 的 Read/Write 权限、stop、Office/扫描PDF**预览**、普通会话恢复及批次队列/拒止有真实子集证据。所选 **16/16 实机场景、77/77 显式断言**通过，不代表全部 LIVE 或完整 E06 通过。**E06 PARTIAL**，三案 C `execution-failed` 不能算业务判断成功；普通 PDF canvas 可见不等于严格审核模型已看到原件。

**经验结论**：Main-owned Pi + V2单一业务状态 + 薄Bridge + 分离 owner/业务授权 + 可重建Renderer投影的架构仍成立。下一阶段最有效的是**调查技术失败是否真实、完成可审计的A/B/C业务闭环和严格原件证据**，不是重复开发已通过的竞态修复。

## 二、不可改变的合同

1. [27](27-background-review-session-proposal.md) 是**架构和 PR 允许改动范围**：复用现有 AgentOrchestrator、SessionManager、runAgent、V2和工具/权限服务，不新造Agent引擎、第二账本、通用调度器或EventBus。Main ACK与数据库 `running` 不等价，Renderer只持有可丢弃视图。
2. `owner.kind=review-case` 是会话归属、不是业务授权；`caseId/sessionId/turnId/runId/assignmentId`、材料/模板/规则版本、SourceRef、覆盖率、权限与严格白名单不降低。磁盘异常必须fail-closed，不能为了让C案成功而扩大权限。
3. **E06回归现有A/B/C不等于在本 PR 开发新批量产品功能**；真正新特性另经28号产品计划或独立PR审查。授权自动通过需要既有全局代批、模板政策、逐批明确授权与逐案事务校验；模型 `compliant` 不是校方审批。
4. P04永久ID-only tombstone和owner UUID journal不能无安全证明TTL/GC；P05生产Relay可信ticket/多viewer仍**BLOCKED**，Pocket FIFO独立目标仍**PATCH READY / TARGET NOT-RUN**。没有跨仓真实证据绝不放行LIVE-06/08。
5. 37/38/44首败和历史FAIL保留。原38风险探针仍3 PASS/1 FAIL、exit1；裸 `store.set` 的旧WORKSPACE-WRITER不等价生产写入者；旧SETTLE对主文件chmod未命中新的原子tmp失败。45号双轨门禁保存原始失败、单独检查Hook/Controller，不能为了CI全绿改写旧Gold/探针。
6. **P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / PR Draft/Open/MERGE NO-GO**。不越权合并、不进入P07/P08，必须按29的LIVE-01～08逐项验收。

## 三、P06-RECHECK-LIVE-02 的建议执行顺序

仅调整**P06内的排序和测试细则**，不倒排已完成的P01～P06实现，不推翻28号从模板治理到正式部署的全产品依赖。

| 小批次 | 目标和实际退出条件 | 失败/外部条件 |
| --- | --- | --- |
| **L02-00：事实归因（先执行）** | 冻结46证据和当前HEAD，按29台账列完整 E06缺口。针对A/B/C尤其C的`execution-failed`，逐案读取可追溯run/assignment/工具/模型/材料/账本，区分技术失败、正确拒止、材料不足、夹具无效；交付来源可复查的矩阵，**不修改生产代码**。 | 缺日志/未复现记`UNDETERMINED/NOT-RUN`，不猜测或改提示词求绿。 |
| **L02-01：已有批量业务闭环** | 完整测原A/B/C的人工确认/否决、补件→回流→重审、授权有限自动审批正反例、幂等/重复提交、旧批次及版本冲突；V2/SourceRef/有效授权/人工动作/逐案回执/批次账本一致。 | C的真实`execution-failed`如实重试归因；正确拒止PASS不冒充正确审读。需要新批量特性另立变更，不在P06内偷做。 |
| **L02-02：严格原件及长上下文** | 真实Pi调用`review_inspect_original`查看扫描PDF/PNG、多页与解析失败、跨案越权负例；`CompactContext`及现有约70%空闲压缩触发下分轮续审，保留版本hash、覆盖、检查点与引文。 | 只看到Office/PDF预览不能算模型读图；上游解析导致缺失则登记依赖，不自建第二解析器。 |
| **L02-03：普通Agent/窗口/平台兼容** | 在获合法配置时测Claude普通create/list/send/权限/Read/stop与fork，真实双窗口/Tab恢复、删案、模型停用、Windows/macOS独立环境；内部owner不复活、普通会话正常。 | 未提供Claude/设备记`NOT-RUN`，不能借Pi/Linux结果覆盖。 |
| **L02-04：外部证据与最终签收** | 生产中心Relay真实多viewer/ticket与Pocket独立目标补丁验收**可并行协调**，随后按29号LIVE-01～08逐行签收。 | 外部`BLOCKED/TARGET NOT-RUN`不妨碍可独立执行的01～03，但**继续阻断最终合并**。 |

执行优先：`L02-00 → L02-01 → L02-02`；`L02-03`依模型/设备就绪情况调度，`L02-04`可提前沟通、最后验收。这是**测试排期**而非产品运行时的新流水线。

## 四、每一批强制执行的细则

**A. 逐案真证据。** 至少记合成case别名、模板/政策/材料版本、`inputManifest.hash`、run和assignment别名、模型/runtime、真实工具及provider回执、SourceRef/覆盖、V2终态、人工/授权动作、错误归因、批次ledger、原始exit、脱敏及raw/public SHA-256；私有密钥、SDK原始transcript、真实账号不能上传公开仓。

**B. 原因分类与独立性。** 在保留原V2状态的前提下标注`CORRECT_DENIAL`、`BUSINESS_INCOMPLETE`、`EXECUTION_FAILURE`、`HARNESS_INVALID`、`UNDETERMINED`。同功能涵盖成功、证据不足/冲突、未经授权、版本变更、重复/幂等、过期回调、失败恢复；真实模型错误与业务正确拒止不可混为“失败”。Gold独立、首败不删除，禁止按追求通过率改标准。

**C. 证据等级不可跳跃。** 受控单测→Electron真实Main/IPC/Renderer→真实provider及工具→具体业务人工动作→外部中心/Pocket/跨平台，逐级见证。E03/E04是**真实生产链上的可控注入**，不是穷尽自然网络时序；普通扫描PDF预览不代替审核原件工具回执。

**D. 以变更影响决定回归规模。** 已有16项无需每个小批次无差别重新运行付费模型；先测目标负例、普通Pi正例、最小跨案权限与相应CI。但触及MainBridge、runAgent、owner/assignment/RunStore、权限/工具、Renderer写资格时应扩展E05/E03/E04/ENOSPC/重启回归；**最终放行前必须统一完整E2E**。失败也应保留，可用数据质量优先于绿色比例。

## 五、版本职责与文档协调

| 文件 | 权威范围 | 本次处理 |
| --- | --- | --- |
| [27](27-background-review-session-proposal.md) | 原v1架构和改动边界 | 加现行优先级提示；旧实现顺序仍属历史 |
| [28](28-review-stage-delivery-status.md) | 2026-10-11产品交付快照及上游界限 | 补今日交叉索引，不篡改历史的“当时后台化未实现” |
| [29](29-background-session-preflight-audit.md) | **唯一LIVE-01～08状态/发布门禁** | 五批仅`PLANNED`，8行状态不变 |
| [30](30-background-session-handoff.md) | 新会话恢复/并发保护 | 以本47作为最新版入口 |
| [31](31-background-session-continuation-prompts.md) | 当前批次执行合同 | 新增L02-00正式接手提示 |
| [32](32-p05-stage-acceptance-and-local-gates.md) | P05中心/Pocket跨仓条件 | 只添加并行协调，阻断不放宽 |
| [46](46-p06-recheck-live-local-acceptance-20261014.md) | 独立实机证据、首败、原始日志/哈希 | **不改历史原件** |

**本次仅更新文档**，无生产代码、测试Gold或旧证据改动。下一批唯一入口为 `P06-RECHECK-LIVE-02 / L02-00`：**PLANNED，未执行**；PR #21仍保持Draft、MERGE NO-GO。
