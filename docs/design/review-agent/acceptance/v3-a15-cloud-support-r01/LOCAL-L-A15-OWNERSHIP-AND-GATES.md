# Review V3｜A15 分阶段验收与本地 Agent 减负分工 R01

**性质**：Local-L04 十线集成任务书的非替代性补充。本页是单次交接，不创建并行的产品进度总账。起点依据 2026-10-21 main@9840a64f25a 的 L3 接收记录，开工请重新读取最新 main。

## 原任务书确实有 A15，但不等于完整可执行脚本

固定版 LOCAL-L04-T01-T10-INTEGRATION-EXECUTION.md 第 21 行设定 A15 为必验收用户旅程，第 132 行要求无学年、组织模板、人数上限 20、计划材料、初审终审、最终决定及报告。第 129 行还要求复用现有 Electron E2E 驱动。原文**没有**冻结正反例文件与每一步验收断言。

截至当前 L3 的实际结论：十条源码进入 main；T07 评分和冷重启真实 PASS；T01 发布/建案局部 PASS；T02 只读 staging preview 缺 IPC；T04 缺已发布模板 → CanonicalPlan/RuleSpec 语义连接；T09 离线签发/回件缺 Main 桥接。

尤其不能把已有 flow-t01-bind 认作完整 A15：它创建的是 objectType=document、两个字段、一个 manual-review 阶段的模板，不含计划材料槽、人数确定规则或初审终审。因此将它定为 **S0：无学年绑定烟测 PASS**。

## 收回到云端的职责（不抢正在开发的四个会话）

| 内容 | 责任人与交付 |
| --- | --- |
| **固定测试材料/期望值** | **本云端支持线已交付**：work/e2e/a15-fixtures/generate.mjs，运行后五份真 DOCX、文本对照、四个场景 manifest 和 SHA-256；policy-LAB-SIM-v1.md 为模拟负责人要求，非学校制度 |
| 模板自然语言起草与六完整样例 | 用户已安排的对应功能 Owner（若为 T01）；L 不重新实现 |
| 扫描/OCR/复杂 Office | 用户已安排的对应功能 Owner（若为 T02）；不要求先完成才做 A15 |
| 物理文件夹/ZIP 批量分案 | 用户已安排的对应功能 Owner（若为 T06）；A15 单案不受阻 |
| 真实 PDF/助手建议应用 | 用户已安排的对应功能 Owner（若为 T08）；A15 可先以现有 MD 报告验证核心链 |
| **发布模板→可执行规则** | T01 和 T04 领域 Owner 定义字段、RuleSpec、PlanBinding 的**最小确定合同**，T04 提供可以消费的规则/运算语义；不能由 L 从纯 requirement 文本臆测政策、不能再新造规则引擎 |
| **两级阶段与补件语义** | T05 领域 Owner 担任缺口负责人；若本轮需要独立续作可由云端额外承接 T05 纯领域/局部 UI，保留原 Main writer 和可信 actor 不动 |
| **Main/IPC/正式接线** | **唯一本地 L**：CaseAggregate、DocumentVersion、SourceRef、ReviewRun 可信写入；T01×T04 产物的运行入口；业务任务、补件、最终决定的 Main 事务；必要 Preload/IPC |
| **真机签收和 main 合并** | **唯一本地 L**：复用 work/e2e/v3-e2e.mjs、真实文件导入、业务操作、冷启动、源版本/运行状态检查、合并与回滚；签收结果只写当前 L3 总账 |

已经开出的四条会话以**各自收到的实际任务 ID 与文件范围**为准。不要因为本页写了 T01/T02/T06/T08 就误把用户口中的“四个会话”重新编号、抢别人已经认领的文件。

## A15 分段执行顺序

| Gate | 可开始的时刻 | 必须用真机证明什么 |
| --- | --- | --- |
| **S0：无学年建案 smoke** | 已完成 | 绑定模板、无 academicYear，不算整体 A15 |
| **S1：普通用户配置** | T01 模板编排准备好即运行 | 组织对象、人数/时间/用途、计划书、≤20、无评分、初审→终审、发布、二次复用，不改业务 TS |
| **S2：真实材料与规则** | T01×T04 确定 RuleSpec 合同后立刻运行 | 真 DOCX → DocumentVersion → 已确认字段/来源 → 真实 Plan/Run/Check；18 符合、21 不符合、未确认人数 pending、未交计划书待补件 |
| **S3：真实人工办理** | T05 两阶段合同 + L 可信事务准备好 | 计划书第一次补充仍不足、第二次补齐后关联新 Run；初审通过只能转终审；具名 local final 决定；历史补件与旧 Run 不删除 |
| **S4：全流程 UI 验收** | S1–S3 已连通 | 无 CLI 伪造业务状态、用户可从 Electron UI 一次完成整个申请→最终报告，重启恢复，引用可回原件 |

**本地 L 不必自己发明五份材料、不必重跑全仓历史考古、不必替 T04 决定算子含义、不必为 A15 首跑补齐 ZIP/扫描 OCR/PDF 文件格式。** 只要领域 Owner 能提交真实 RuleSpec/Stage 适配，L 就在统一 Main 接线并运行 S2/S3；若缺领域实现，把最小 CONTRACT_REQUEST 给 Owner，转做可并行的真实接线，不无限等待。

运行素材生成器：node work/e2e/a15-fixtures/generate.mjs。输出默认位于 work/e2e/a15-fixtures/generated/，不要把 .txt 成功当 .docx 读取成功。

最终报告记录每个 Gate 的 PASS / PARTIAL / BLOCKED_OWNER / BLOCKED_BRIDGE / NOT_RUN，实际 Main SHA、RunId、DocumentVersionId、人工 actor 来源、报告路径；严禁只用 CI 绿色、fixture 或 T01 trial 作为真实结果。
