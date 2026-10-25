# 未完成问题与计划恢复记录（2026-10-25，自动应用/F05 集成后状态）

> 当前分支：`integration/v3-f01-f07-local-preserve-20261025`
> 本轮合并：`1de8a0494`（父 `474d170cb` + 源 `54a203e6f`），Electron `0.15.171`、shared `0.1.78`。
> 本文只描述当前实现与已跑过的服务级验证；GUI、真实模型质量、全页 OCR 与真实用户材料仍未验收。

## 0. 本轮合并了什么

完整合入 `origin/integration/material-auto-apply-review-f05-20261025`（HEAD `54a203e6f`），不是只 cherry-pick 57：

- `c7af040d`：材料上传后由 C Main 自动分类并落案（本地规则 → 本地 OCR → 一次短模型请求），删除“应用建议”页面组件；模板变更后重检未绑槽材料。
- `d681fb75`：F05 人工改类后的受控 D4 方案恢复；Pi 文本块完整读取门禁；证明材料事实按当前 Observation/Run/SourceRef 投影。
- `c4d47cd9`：上述两线的统一整合。
- `0a9a9176`：自动分类 → 审核 → 人工改类 → 重跑的贯通测试。
- `54a203e6`（57 号）：`获奖证书 ↔ 荣誉证书` 等同义槽位绑定、兼容槽预过滤、角色已定时后台短模型补槽。

对应设计记录：[54](54-material-auto-classification-2ab-baseline-20261025.md)、[55](55-material-autoapply-remediation-unified-20261025.md)、[56](56-material-auto-to-review-journey-verified-20261025.md)、[57](57-material-slot-auto-binding-remediation-20261025.md)；非自动分类线原始缺口见 [53-non-auto](53-non-auto-review-gaps-r01-20261025.md)。本轮简短集成记录见 [58](58-material-autoapply-f05-integration-20261025.md)。

## P1 D2 冻结计划下人工改类会清空模板绑定（部分已修）

### 现状

1. 普通（未冻结）案卷人工改类仍直接写 V2 角色/槽位，不清模板。
2. D2 冻结案卷改类仍先走 F05 提案/确认/apply；apply 仍会把旧 D2 放入 `d2RuntimePlanHistory` 并撤销当前绑定，这是“旧计划不得继续冒充当前输入”的安全边界。
3. **本轮新增**：apply 成功后，Main 会尝试从**原 D4 受控候选目录与冻结选择**重新编译；只有 `fingerprint/workspaceId/authoringDigest` 与旧来源一致、且 `verifyD2InstalledPlan` 核对当前物理原件通过时，才通过既有 `attachD2RuntimePlan` CAS 重新绑定。恢复幂等；任一前提不成立则留在草稿待用户重选，不继承旧运行结论。
4. **仍然不可自动恢复**：B1/F06 作者候选、非 D4 技术计划、正式 `CanonicalPlan`。正式计划只能由有权发布者升版；本地撤回不会伪造新的学校计划。
5. 槽位语义未变：请求省略 `materialSlotId` 仍等于清空槽位；F05 apply 直接写 `proposal.nextMaterialSlotId`。本轮 57 只修自动分类的槽位绑定，不改这个协议。

### 已验证

`review-v3-main-d4-local-plan.test.ts`、`review-v3-remediation.test.ts` 在本轮合并树通过（见 58 号记录）；覆盖同源重编译、旧输入失效、错误指纹不写案、重复恢复不追加事务。

## P2 Pi 材料完整读取（门禁已加强，真实整批仍待验）

- `finish=true` 时按真实块读取、视觉预览、人工回执与 SourceRef 重算 coverage；有可读文本但未完整读取的活跃原件会让同一 Pi 轮次继续补读，而不是静默结案。
- 无文本层扫描件、解析失败材料不要求 Pi 读取不存在的文本块，仍转人工核验；旧 `coverage.read` 在解析块增量后不得冒充全文已读。
- **未完成**：真实整批材料、真实模型调用与扫描件全页 OCR 的端到端验收；改门禁不等于保证模型一定调用工具或读完全部页面。

## P3 `recognizedFacts` 旧状态持久化（显示已改为当前来源投影）

- 旧 V1 `EvidenceDocument.recognizedFacts` 不做伪回写；原生 V3 证明卡改为从当前案卷 Observation / 当前 Run 的 SourceRef 投影事实，排除已撤销、跨案、旧 parseRevision、退役版本和过期运行。
- 显示区分“已确认/待核实”，不把 AI 抽取冒充人工核验。
- **未完成**：非原生 V1 的旧字段仍保持原样；若产品要求历史 V1 事实迁移，需要独立数据迁移合同，本轮不做。

## 自动分类闭环（已从“暂停”转为 Main 自动应用）

- 上传先按真实 `attachment` 入案；C Main 本地高置信则直接 CAS 写角色/兼容槽位，难例后台限并发 2 走本地 OCR，仍不明确才发一次短模型请求。模板绑定后重检未绑槽材料。
- 57 号补充：本地角色已定时，若没有合法槽位且模板存在兼容槽，可再走一次短模型补槽；模型只能从同角色、同文件格式兼容槽中选，不能改角色或覆盖人工改类。
- 机器结果带来源（`local-rules/same-byte-confirmation/local-ocr/ai`）与回执；人工改类写 `classificationCorrection` 并清除当前机器标记，不可变历史保留。
- 已删除 `MaterialClassificationSuggestions.tsx` 及 CenterPanel 挂载；自动调度只在 Main，不在 Renderer 重复请求。旧的建议模型纯函数/测试保留为算法回归。
- **未完成**：真实模型槽位成功率、队列高峰延迟、扫描件全页 OCR、GUI 实机均未验收；不能据此声称分类准确率或“所有近义词都自动绑定”。

## 用户待验项（未做自动 GUI）

- 模板匹配页默认收起复杂配置，底部“高级选项”Radix Switch 单入口（默认关闭）。
- 材料拖入后自动分类/自动补槽在真实 Electron 页面中的刷新与切案不串案。
- 同栏/跨栏拖动、文件名预览、选模板进入三栏、冻结计划下 F05 纠错与 D4 恢复提示。
- 用户桌面未由本轮重启；renderer 走 Vite 热更新，Main/preload 变更需重启后生效。

## 验证与提交状态

- 合并提交：`1de8a0494`；合并树 `561438a1962ff66d77a2ac194e9e9219e4d6f9f3`，与隔离演练树一致，无冲突。
- 本轮定向测试：57 指定 4 文件 **29 pass / 0 fail / 133 expect**；F05/D4/facts/OCR/slot **25 pass / 0 fail / 164 expect**；shared+Electron typecheck PASS；boundaries/diff-check PASS。
- 已知非本轮回归：`pi-case-review-service.test.ts` 两个 preupload 授权断言在目标 `474d170cb` 基线与合并树上同样失败（测试期望 `PROFER_REVIEW_TEST_PREUPLOAD_BLOCK` 抛错，当前 gate 合同只提醒不抛错）。未修改 gate 凑绿，保留为独立授权合同待裁决项。
- GUI / 真实模型 / 全页 OCR / 真实用户材料：未验收，不得写成 PASS。

## 追补（2026-10-25）：本机样本分类覆盖不足与 4 秒超时

- 本机合成案卷 `case-7a65d898…`（25 份材料）实测：仅 3 份（01 活动申请表、05 实验室风险评估表、07 设备使用与操作人员清单）由 `local-rules` 高置信落角色，其余 22 份仍为 `attachment`；`electron-latest.log` 记录 22 次“模型请求超时（超过 4 秒未响应）”。
- 原因有两层：① `material-classifier.ts` 对 `parseStatus=partial` 且无正文的图片/PDF 在检查文件名前直接返回 `needs-ocr`，且原 `ROLE_HINTS` 不含“申请材料目录/实施方案/人员名单/风险评估表/预算/采购申请/承诺书/培训完成/报价单/保险凭证”等具体材料名，属于算法词库与判定顺序不足；② 兜底短模型请求上限仅 4 秒，对较大材料或较慢渠道偏紧。
- 已开始局部修复（按用户本次请求，不代表准确率完成）：两路兜底超时统一为 `CLASSIFICATION_AI_TIMEOUT_MS = 30_000`（仍单次、限并发 2、失败保留原件）；分类器新增窄范围强文件名线索，无正文时先按明确名称定“角色”，通用文件名仍 `needs-ocr`。
- 边界：文件名只能定“角色”，正文事实（人名、金额、日期、是否完成等）仍需 OCR/阅读；本轮未宣称所有格式无 OCR 即可完整识读，也未做真实 25 份材料的写回验证（用户案卷只读）。

### 追补（2026-10-25）：分类短请求的有限重试

- 仅自动分类兜底路径新增“至多重发一次、约 1 秒退避”的瞬时重试：重试网络错误、超时、HTTP 429/5xx；不重试其它 4xx、门禁拒绝、用户取消与无效 JSON（无效输出仍由解析层返回 unresolved）。
- 单次超时仍 30 秒；全局后台并发仍 2，不排队重放、不重复读取 OCR；重试日志不记录文件名与正文。
- 网关自身对 429 已有最多 3 次退避；分类外层在其之上最多再发一次，因此最坏情况仍有限。真实成功率仍待 Main 重建后观察，不据此宣称已解决超时问题。
