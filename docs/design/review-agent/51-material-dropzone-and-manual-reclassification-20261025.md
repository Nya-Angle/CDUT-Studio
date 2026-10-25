# 材料拖入区与人工栏位匹配记录（2026-10-25，0.15.167 整合版迁移）

> 后续整合：55/58 已实现 F05 后受控 D4 同源恢复与 Main 自动分类；本文“仍未解决/自动恢复未实现”等段落保留当时边界，当前状态见 [53](53-open-issues-and-plan-recovery-20261025.md)/[55](55-material-autoapply-remediation-unified-20261025.md)/[58](58-material-autoapply-f05-integration-20261025.md)。

> 版本基线：`0.15.167`（整合工作树 HEAD `7b1898f56`）。本文件迁移自整合前提交
> `31faead0e`（批量拖入与人工栏位匹配）/ `b8d27a15b`（读取状态提示澄清）的旧初稿，
> 并按本整合版 `document-service.ts`、`document-parser.ts`、`case-import.ts`、
> `native-workspace-case-v3.ts` 的实际提取/分类/SourceNavigator/OCR 行为校正事实描述。

## 问题记录

三栏审核工作台的“将文件拖到这里添加证明材料”入口位于材料列表之后。一次拖入多个文件虽然能够逐份导入，但入口会被文件列表推到下方；当 AI 把文件识别到错误栏位时，页面只有删除和同栏排序，审核员无法把材料移动到申报材料、证明材料或审核依据栏。

AI 将文件归入“申报材料 / 申报事项 / 审核依据”的准确率问题单独记录为待观察项：本次增加人工纠正路径，不代表自动分类效果已经解决或验证。

后续低成本本地分类候选、自动按需 OCR/模型候选与 V3 槽位确认的独立实现、适用边界和回归记录，见 [52-local-material-classification-r01-20261025.md](52-local-material-classification-r01-20261025.md)。第 51 号的原始人工改类结论保持不变。

## 设计处理（迁移自 31faead0e 初稿）

- 申报材料和证明材料的拖入区固定在各自文件列表上方，所有已导入文件数量都不影响入口位置。
- 拖入支持同一批多个文件，逐份导入并保留成功/失败提示；导入与文件选择器共用同一条 `case-import.ts` 导入链。
- 每份材料行最左侧增加拖拽手柄。把材料拖到另一栏的拖入区会原子更新材料角色，不复制原文件，也不改变材料 ID、解析块或历史来源。
- 每份材料行同时提供栏位选择控件，支持键盘操作和无法使用鼠标拖动时的人工匹配。
- 审核依据栏复用现有拖入区作为第三个投放目标。
- 角色变更会清理受影响的申报事项锚点、证明卡和证明关联，并使旧审核派生结果失效；审核员需要重新审核。

拖拽/人工改类的三栏 UI 已随 `2ab7f3aa3` 提交（紧凑行、手柄、三栏投放、插入线与落位动画、点击文件名预览、底部“高级选项”开关），renderer 走现有 Vite 热更新；GUI 仍由用户自测，未做自动 GUI 验收。

## 边界

角色移动只改变当前审核输入的语义栏位，案卷原始文件和历史回执继续保留。材料移动到审核依据后，规则包会以未确认状态重新建立，需人工对照原文确认。

## 补充调查：格式、原文预览与读取状态（已按 0.15.167 整合版校正）

### CDUTStudio 当前材料入口格式

审核材料选择器（`case-import.ts`）明确列出以下扩展名，拖拽入口由同一导入解析链处理：

- 文本/邮件：`.md`、`.txt`、`.csv`、`.json`、`.html`、`.htm`、`.eml`、`.svg`
- PDF/旧版 Word 与 WPS Writer：`.pdf`、`.doc`、`.docx`、`.docm`、`.dot`、`.dotx`、`.dotm`、`.wps`、`.wpt`
- 表格：`.xls`、`.xlsx`、`.xlsm`、`.xltx`、`.xltm`、`.et`、`.ett`
- 演示：`.ppt`、`.pptx`、`.pptm`、`.potx`、`.potm`、`.ppsx`、`.ppsm`、`.dps`、`.dpt`
- 富文本/OpenDocument：`.rtf`、`.odt`、`.ods`、`.odp`
- 图片：`.png`、`.jpg`、`.jpeg`、`.gif`、`.webp`、`.bmp`（选择器注释即标明“走 Vision 识别”）

这是审核导入入口的白名单，不等于每个格式都保证完整提取。`document-parser.ts` 另有通用文本能力（XML、JS/TS、Python、YAML、配置/脚本等），但这些格式不在审核选择器白名单；不能据此声称审核流程支持它们。

### 提取、分类、SourceNavigator 与 OCR 的当前真实状态

- **导入提取**：`case-import.ts` 先把原件复制进案卷（`source-docs/{versionId}/`），再由 `document-service.ts` 的 `parseFileIntoSourceDocument` 按扩展名提取为 `ReviewDocumentBlock`。文本/CSV/HTML/EML 本地解析为文本块；`.svg` 抽取 `<text>` 进 `imageAlt` 并产出单个 image 块；PDF 文本层提取为空（典型为扫描件）记 `partial` 并附中文原因；不支持或提取抛异常记 `failed` + 中文原因，零个可读块。
- **图片与 OCR/视觉（不得沿用“无 OCR”的旧结论）**：旧版导入阶段纯文本管线读不到图内文字，图片只产出单个 image 块 + `imageAssetPath` 并记 `partial`，这一点未变；但本整合版已有真实的 OCR/视觉链路补齐：`review-v3-t02-visual-ocr.ts`（可选的真实 OCR 富化，覆盖位图原件、PPTX 图片与 PDF 页面栅格，产出带来源坐标的 OCR 假设文本块；无 OCR 可执行文件时显式降级为 partial 覆盖 + 警告）、`review-v3-t02-staged-visual-ocr.ts`、`ocr-port.ts`，以及 `pi-review-ops-tools.ts` 的“图像块直接交给当前 Pi 会话视觉识别”。`DocumentVersion.blocks` 有 `ocr-text`/`vision-text` 块格式与 `ocr`（引擎/置信度/矩形）/`vision`（引擎）字段。`pi-review-agent-client.ts` 的降级提示仍明确：未被 OCR 精确读取或其他材料支持的图像事实一律待人工核对。因此正确结论是“导入期纯文本不保证图内文字，但后续 OCR/视觉核验可以补足并留下带坐标的读取证据”，而不是“本系统没有 OCR”。
- **分类**：材料角色（`rule`/`application`/`evidence`/`attachment`）由导入入口人工指定；`native-workspace-case-v3.ts` 校验 `materialSlot.acceptedRoles`（不匹配直接拒绝“材料类别不匹配”），且 `attachment` 不冒充 V1 三栏的任一栏。AI 自动归栏准确率仍是待观察项。
- **SourceNavigator**：`review-v3-source-navigation.ts` 的来源去重包含 `parseRevision` 与坐标（同文件不同出处不折叠成一个按钮）；目标栏判定只用 V2 `DocumentVersion.role`，不从文件名或旧 V1 ID 猜测；定位状态区分“已定位到解析块 / 仅能定位到文件，需人工核对原件 / 原件版本已不可用 / 解析版本不匹配，禁止按旧坐标定位”。

### “未提取事实”与“读取不完整”

- “未提取事实”是证明卡 `EvidenceDocument.parseStatus === 'unrecognized'` 的初始状态。导入只创建空的 `recognizedFacts`，AI 审核运行会把解析出的证明内容放进审核上下文并生成事实/检查结果，但当前链路没有把结果回写到这个旧证明卡字段，所以不能把该徽标当成格式解析失败或“模型没有读取”的证据。这是识别结果持久化/状态更新缺口，待单独修复。
- 读取记录由 `pi-document-coverage.ts` 根据材料工具块读取回执、原件预览回执、引用、解析状态、视觉核验回执以及审核员手工核验回执生成。解析块全部读完且解析完整，或图片/扫描 PDF 的所有图像页都被视觉核验/完整预览，才会记为完整读取。**原始读取账本如无回执仍如实记为 unread/partially-read；改文案不是解决模型漏读，账本不因本次提示语修改而放松。**

### 读取状态提示（本任务迁移并修正）

旧提示把“未开始 / 运行中 / 新上传未入本轮”一律说成“本次审核未记录完整读取”，既误导审核员，也把内部观测说成了材料问题。本轮由 `review-workspace-view-model.ts` 按真实状态分档（全部仍进入待办，不隐藏未读项、不伪造已读，`coverage`/`manualReadReceipt`/`parseStatus` 判定门槛原样保留）：

| 真实状态 | 标题 | 提示要点 |
|----------|------|----------|
| 审核未开始（无运行） | 待审核材料：{文件名} | 尚未开始审核运行，还没有本次读取记录，**不能说成漏读**；可先人工核对并记录 |
| 运行进行中、账本暂无记录 | 运行中待读取：{文件名} | 运行进行中，**运行结束前不能定性为漏读**；可稍后刷新或人工核对 |
| 运行进行中、部分读取 | 待补充核对：{文件名} | 读取记录目前仅覆盖部分内容，待运行完成后复查 |
| 新上传未入本轮（不在运行输入清单） | 新上传未入本轮：{文件名} | 本轮读取账本不覆盖它，**不能说成漏读**；重新审核时纳入或人工核对 |
| 终态运行、完全未读 | 待人工核对：{文件名} | 本次运行没有记录 Agent 读取；这是读取记录状态，**不代表材料不合格** |
| 终态运行、部分读取 | 待补充核对：{文件名} | 读取记录显示本次仅覆盖部分内容 + 运行账本原因 |
| 解析失败 | 待人工核对 / 待补充核对：{文件名} | 空占位内容不能证明读过原件；打开原件核验或记录忽略 |
| 旧版导入无可用文本 | 待人工核对：{文件名} | 请打开原件逐页检查后确认；这不代表材料不合格 |

“待补充核对 / 待人工核对”的措辞沿用 `b8d27a15b` 的读取状态提示方向；新增“未开始 / 运行中 / 新上传未入本轮 /账本未收录”四类真实区分。人工 `manualReadReceipt` 与“[审核员忽略]”仍分别落入已处理，不重复排队。

## 版本迁移与下一步

- 本轮把 `31faead0e`/`b8d27a15b` 的读取状态提示迁入 `0.15.167` 整合版（HEAD `7b1898f56`），并按整合版真实行为修正了旧初稿中“无 OCR”等过时结论与误报漏读的提示；版本号保持 `0.15.167`，未做任何包版本变更。
- 下一步：① 修复“未提取事实”识别结果持久化/状态更新缺口（独立任务）；② 模型漏读本身仍需在运行侧解决——读取账本、`manualReadReceipt` 门槛与视觉核验路径保持真实，不因提示语改动而关闭；③ 材料拖入/人工栏位匹配的 TSX UI 落地与验证由并行任务完成并另行记录。

## 本轮验证

- `bun test --isolate --timeout 30000` 覆盖 `review-workspace-view-model.test.ts`、`pi-document-coverage.test.ts`、`document-preview-path.test.ts`：33 项全部通过（含新增 5 项读取状态回归：运行中不误报漏读、新上传未入本轮、未开始、终态完全未读如实提示、账本未收录凭据）。
- 类型检查与其余验证结果见同目录 `STATE-DONE.json`。

## 2026-10-25 追补：人工改类的槽位透传与用户可见语义（真实边界）

- **槽位透传（已修）**：材料在已冻结技术计划下改类时，前端先直接调用 `reclassifyNativeMaterialV3`；被计划冻结守卫拒绝后转为既有 F05 纠错（`proposeNativeRemediationV3` → 用户确认 → `applyNativeRemediationV3`）。此前纠错提案只带角色、漏带 `materialSlotId`，人工选择的槽位会被静默丢弃。现由 `buildReclassifyMaterialRequest` / `buildRemediationProposalRequest` 统一构造请求，两处携带同一槽位；只换槽位（角色不变）同样写入。
- **槽位省略语义（以 Main 为准）**：请求中省略 `materialSlotId` **等于清空槽位**——`native-workspace-case-v3.ts` 以 `input.materialSlotId ?? null` 归一化并在写入时按无槽位落盘；F05 apply 也直接写 `proposal.nextMaterialSlotId`（省略即清槽）。因此本实现不再声称“省略=保持”：非空字符串按原字节提交（不 trim 改变身份），未提供时按 Main 的既有行为处理，不新增 null 协议或额外保持逻辑。
- **含槽位的写入**：`applyNativeRemediationV3` 仍写入 `proposal.nextMaterialSlotId`，所以“只换槽位（角色不变）”必须显式带槽位；漏传会把槽位清空而不是保留。
- **用户可见文案**：确认框标题为“确认更改材料分类？”，按钮“确认更改”，描述如实说明当前审核结果与待办失效、材料原件与历史记录保留、需要重新选择审核模板后重新审核；按钮本身不会启动重跑。`rebuildAcknowledgement` 的协议字面量 `我确认旧技术预审计划及审核结果失效` 仍是传输协议值，不随界面文案改动。
- **仍未解决**：本追补只修“槽位被丢弃”与措辞，不改后端重建逻辑；`applyNativeRemediationV3` 在 D2 冻结路径仍会清空 `templateId`/`subjects`/`reviewRules` 并把案卷退回 draft（普通未冻结改类不会）。自动恢复当前未实现，需重新校验作者源与对象/条件上下文；真实调用链、可复用快照与最小下一步见 [53-open-issues-and-plan-recovery-20261025.md](53-open-issues-and-plan-recovery-20261025.md)。自动分类/OCR/AI 自动应用本轮不涉及，也不得据此声称已恢复。
- **验证**：新增 `review-material-reclassify-request.test.ts`（3 项）覆盖请求构造：选定槽位时直接改类与纠错提案一致、只换槽位仍带值、未提供槽位时不带字段（并注明 Main 会据此清槽）。hook 内部是否把槽位传入两处调用属交互测试，本轮未做，未以镜像测试冒充覆盖；Electron typecheck 通过。GUI 由用户自测，未做自动 GUI 或真实材料操作。
