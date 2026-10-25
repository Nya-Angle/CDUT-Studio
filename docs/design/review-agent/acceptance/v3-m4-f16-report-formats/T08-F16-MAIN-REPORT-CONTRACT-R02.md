# CDUT Studio Review V3｜T08 / F16 Main 报告合同 R02

更新日期：2026-10-24
实现分支：fix/v3-t08-f16-main-report-contract-20261024
基线：150acfe761cb7ad0424a2ca009fd57f12dbfddfd
状态：代码 SHA 4d35f38 PR CI 全绿（含 T08/F16 专用与全量测试）；真实 Electron GUI / 原生保存对话框验收尚未执行

## 1. 本次范围

按 07 应用层设计第 8 节、03 架构报告版本约束、06 用户工作流 U11，以及 F16 R01 的 CR-01 / CR-02，统一 T08 / F16 的报告投影、快照、导出和历史归档。文档为设计依据，代码与测试结果才是实现和验收证据。

旧原生 V2 报告导出入口已撤除：共享 IPC 常量 EXPORT_REPORT_V2、Main handler、Preload exportReportV2 和 report-export-v2-service 不再保留。旧案卷文件不删除；V1 EXPORT_REPORT 只服务旧 V1 预审模型，不作为原生 V3 报告链路。

## 2. 唯一报告数据流

1. Renderer 请求 Main 对指定 caseId / runId / audience 生成预览。
2. Main 校验案卷和 Run 归属，读取确切模板版本、关联决定和当前有效性，计算受众投影。
3. 预览指纹绑定 case revision、Run inputHash、模板摘要、关联决定摘要、受众、渲染版本和完整报告正文。
4. Renderer 只接收已投影 T08Report，不接收用于报告生成的全量 Aggregate / Run。
5. 导出时 Main 重新计算预览指纹；输入、模板、决定或案卷 revision 已变化时拒绝导出，要求刷新。
6. Main 创建唯一 reportId 的不可变 ReportSnapshot，先持久化 snapshot.json、report.md 和 report.json，再生成用户选择的格式。
7. Main 通过原生保存对话框交付文件；取消时仍保留内部报告档案，但返回 status=cancelled，不宣称外部保存成功。
8. 历史档案从 snapshot.json 校验哈希后重新打开；再导出只读取该快照，不读取当前案卷重建历史正文。

## 3. ReportSnapshot 契约

快照至少绑定：

- reportId、caseId、caseTitle、caseRevision；
- runId、inputHash、templateId / templateVersion / templateDigest；
- decisionIds / decisionDigest；
- audience、historical、renderVersion；
- 已脱敏 T08Report 正文、JSON 投影与表格记录；
- createdAt、由 Main 调用入口确定的创建主体（UI 导出为 local reviewer；受指派 Agent 工具记录 agent 来源和指派 ID，不接受 Renderer 自报身份）；
- projectionHash、snapshotHash。

哈希用于检测报告内容与绑定元数据被意外改动，不是数字签名、发送者认证或学校审批证明。创建主体是本地 reviewer，不得冒充教师或学校认证身份。

## 4. 格式与安全

- MD、JSON、HTML、XLSX、PDF、ZIP 均消费同一份已投影报告。
- XLSX 将疑似公式前缀的外部文本转为纯文本。\n- 申请人版决定理由、原始 finalScores、内部补件原因及申诉详细文字默认不公开；申请人仍可见决定状态和需要补交的材料要求。
- PDF 由 Main 使用隐藏的 Electron BrowserWindow + printToPDF 从无远端资源 HTML 生成；正文是可选择、可搜索的文本，而不是图片页。
- ZIP 包含报告文件、README 与 F16 SHA-256 清单；不包含原件本体，也不宣称哈希等于数字签名。
- 学生版只有精确匹配的模板 public 字段可见；未知字段默认不公开。内部检查、原文引用、完整输入清单不进入学生版。
- 档案使用安全案卷 ID / 报告 ID 作为路径片段；同目录临时文件 + 原子硬链接拒绝覆盖已有快照，读取时同时核验快照哈希与 MD/JSON 基线一致性。
- 原生保存取消、写入失败和成功分别处理；另存为不能覆盖任意案卷数据及符号链接指向的报告档案。导出临时写入再原子替换，失败不删除内部快照或截断原有外部报告。

## 5. 决定和历史语义

- 报告仅选择 basedOnRunId 与所选 Run 完全相同的决定，并记录全部关联决定 ID，不再以“聚合中最后一条决定”冒充唯一决定。
- 当前 Run 报告中阶段决定、最终决定与更正关系分列；后续决定不改写已归档快照。无归档快照的历史 Run 不把当前聚合中的决定混入历史报告。
- 已归档历史 Run 的正文从当时保存的 ReportSnapshot 读取。若只是选择了一个尚无归档快照的旧 Run，报告明确标记历史标题快照不可用，并排除当前标题、当前事项字段、补件、后续决定、后续认定与后续处置；不能把当前聚合伪装成当时报告。
- 没有正式决定时，报告明确写明技术检查不能代替正式决定。
- 当前本地 reviewer 可以生成学生、审核人和组织者的不同内容投影；这只是本地报告受众投影，不表示真实学生登录、校方认证或外部送达已经接通。

## 6. 代码入口

- 纯投影：packages/shared/src/review/t08-report.ts
- Main 快照 / 归档 / 导出：apps/electron/src/main/lib/review/review-v3-report-service.ts
- IPC：apps/electron/src/main/lib/review/review-ipc.ts
- Preload：apps/electron/src/preload/index.ts
- UI：apps/electron/src/renderer/components/content-review/ReviewV3T08ReportPanel.tsx
- 共享契约：packages/shared/src/types/review.ts
- 定向测试：apps/electron/src/main/lib/review/review-v3-report-service.test.ts、apps/electron/src/renderer/components/content-review/review-v3-t08-case-report.test.ts

## 7. 验收状态

**CI：PASS**（最新验证代码 `4d35f38f15ae45d5e5d314cc068a74207e5d58ea`，2026-10-24；详细阶段账见 `T08-F16-STAGE-PROGRESS-20261024-R03.md`）。

- PR CI：workspace typecheck、package boundary check、Main / Preload / Renderer build、unit and regression tests 全部通过。
- Review Baseline CI：PASS。
- Review batch focused tests：PASS。
- D2 Scoped Pi Review Tests：typecheck、scoped Pi BDD、既有 Pi run / authoring regressions 全部通过。
- 新增定向测试覆盖快照哈希与绑定篡改、归档持久化重开、HTML 转义、XLSX 公式中和、PDF 生成器接口、ZIP 文件清单与哈希、取消保存与成功保存回执。

**仍未验收**：真实 Electron 窗口中逐一操作受众 / Run / 历史档案，原生保存对话框的真实取消 / 覆盖 / 失败行为，实际 Electron printToPDF 生成的 PDF 可搜索性，以及关闭应用后再启动的人工 GUI 复验。上述项目保持 `NOT_RUN_GUI`，不能因为 CI 通过而宣称完整用户旅程已验收。

## 8. 2026-10-24 补充：报告性质、动态更正提示与本机保存台账（待统合）

本节对应 PR #250 之后的独立补强工作分支，不回写或冒充 PR #250 原有 SHA 的已验收功能。

1. **报告性质**：投影与结构化正文明确标识 `preliminary`（初审）、`supplement-needed`（待补件初审）、`decided`（关联当前 Run 且存在未被更正的最终决定）、`historical`（历史/过期）。`decided` 仅表示本地业务决定已形成，不是学校身份认证或正式签章。所有类型均允许作为只读本地报告导出，非 `decided` 绝不被界面称为正式决定报告。
2. **旧报告更正关系**：历史档案列表读取时从现有追加式业务决定计算 `amendedByDecisionIds`，包括连续更正链；更新 Run 后通过 `noLongerCurrent` 提示。两者仅是当前查询的附加状态，旧 `snapshot.json`、原始报告正文和哈希不变。
3. **本机保存记录**：每次 Save As 成功、取消或失败，在对应报告目录下追加独立的 `local-save-records/save-<id>.json`，保存格式、时间、结果、生成文件 SHA-256，成功时保存本机目标路径。读取逐条检验记录自身哈希与 reportId/snapshotHash；记录损坏只标本机审计异常，不否定已校验的原始报告快照。
4. **旧档案兼容与未归档历史来源**：新增 `reportKind` 为可选投影字段，缺失时不改变既有 `/2` 快照指纹与正文。归档不因升级重渲染，禁止自动修改旧档案以补新字段。没有历史快照的旧 Run 仅按其输入 manifest 展示原件版本/哈希，不能从当前聚合借用已经更名、重分类或重新解析的文件元数据与精确出处。
5. **边界**：本机 `saved` 不代表对外发送、收件确认、审批或签发。未来如接 SchoolPort/正式送达，必须另建可信身份与回执合同，不能复用本机保存台账冒充正式送达。

目标回归覆盖类型分级、旧快照兼容、完整更正链、成功/取消/失败记录、记录篡改隔离和重新打开；真实 Electron GUI 与跨平台验收仍须独立完成。
