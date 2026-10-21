# M4 F04 → Local Main/F14 接线请求 R01

Owner: F04；协议 ACK：`M4-F01-F18-SUBMISSION-R01@0c4b8e406c4a1357b1812fc5abee0c7b957e9836`

固定共同祖先：`5b0f5faf7869ba47a867c9cfaed0bbd1cfdd16b5`
状态：`CONTRACT_REQUEST`；**不代表已接线、不代表 A03 已通过**。

## CR-F04-01｜T06 物理入库身份、原件变更检测及跨案卷幂等

当前 Main 使用 `review-v3-t06-main-service.ts`：

1. `entryId` 只取 `relativePath + byteLength`。不同选区中同名同尺寸文件会撞 token；`registered: Map<entryId, versionId>` 还会跨案卷重用已登记 `DocumentVersion`。
2. `fingerprintOf` 也只覆盖路径和尺寸；预览后原件字节改变、但尺寸未变的情况无法被指纹发现。
3. 文件夹遍历调用 `statSync` 后再检查 `isSymbolicLink()`，已经跟随符号链接，不能达到注释所说的防越界目标。
4. 目录原件的读取和临时文件名仍与不透明选择的单次身份未严格绑定；进程冷重启后的请求回执仅在内存中。

F04 已提供可直接使用的独立生产适配器：

- `review-v3-f04-folder-snapshot.ts`：`snapshotF04Folder(trustedRoot, options)`，返回已按实际字节 SHA-256 封存的文件夹条目、隐藏/符号链接/无法读取/超限的可见警告，以及不包含任何绝对路径的 `identity`。`originals[].absolutePath` **仅允许 Main 内部使用**。
- `review-v3-f04-intake-identity.ts`：`identifyF04PhysicalSelectionFromDigests(kind, originalEntries, nonce?)`，也适用于已由 `decodeReviewB2Zip` 校验并提供 `rawSha256` 的 ZIP 内容；`assertF04OriginalUnchanged(entry, bytes)` 与 `f04CaseRegistrationKey(selectionId, entryId, caseId)`。

**请求 Main Owner 的最小接线**：

1. 目录选择时调用 `snapshotF04Folder`；ZIP 保留原有解码和拒绝回执，只将 `accepted[]` 的 `entryName/bytes.length/rawSha256` 输入 `identifyF04PhysicalSelectionFromDigests`。Renderer 继续只看到 `selectionId/previewFingerprint/entryId/relativePath/byteLength/warnings`，不得看到路径或原件字节。
2. `StoredEntry` 增加 Main-only `rawSha256`，提交前实际读取时调用 `assertF04OriginalUnchanged`。若内容变化，返回逐文件失败，不将该案卷列为成功批次成员，不吞掉此前已入库原件。
3. `registered` 至少改用 `f04CaseRegistrationKey(...)`，重复请求不得把案卷 A 的版本 ID 伪装成案卷 B 的版本 ID；同一 case、selection、entry 的重复调用保持幂等。
4. 提交过程中使用 Main 已有的可信 `Actor`、`registerMaterial` / `registerNativeWorkspaceMaterialV3`、`CaseAggregateV2` writer；不得额外引入 `DocumentVersion` 第二真值。若要持久化冷重启幂等，需由 Main 现有 Receipt/CAS 方案承接。

**错误口径**：损坏/改变/不可读的文件给出可理解原因；成功/部分失败/失败案卷严格区分；已入库文件不能因同批其他文件失败被悄悄删除。涉及 F14 的最终 Batch 提交仍由 Main/F14 负责。

## CR-F04-02｜OCR 候选进入正式材料版本

当前 `review-v3-t02-visual-ocr.ts` 能对扫描 PDF 页、图片和 PPTX 提取的实际图片产生有原件页/置信度/可得时 bbox 的 OCR **候选**。`previewT02StagedVisualOcr` 当前为 read-only staging；案卷正式导入仍由 `parseFileIntoSourceDocument` 和现有 DocumentVersion writer 管理。

请求 Main Owner 在可信物理原件和 `DocumentVersion` 已确定后，复用既有 `OcrPort` 和解析版本机制将候选作为待确认来源保存，并给 Renderer 一个可见的 OCR 未配置/失败/未处理剩余页状态。不允许 OCR 文本自动晋升成用户确认事实、确定性 Check PASS 或学校政策。若新增写入端口，需定义 `caseId/documentVersionId/expectedRevision/actor/sourceBlockId/parseRevision` 与失败回执，不由 F04 自行新增共享 IPC。

## 可自行验收与不可自行声明的部分

- F04 定向测试：`document-service.test.ts`、`review-v3-t02-visual-material.test.ts`、三个 `review-v3-f04-*.test.ts`。
- F04 源码已改善损坏视觉原件的真实检查、PDF 回退页码误报，以及未 OCR 的 PDF 页数计数。
- 尚需 Main/F14 合约接线和实际 OS 选择器 → DocumentVersion → 原件预览的用户旅程。完整 A03 还包括扫描 PDF/OCR 引擎、Word 段落、所有 Office/历史格式、100 案/500 文件、同名修订和错误文件的跨平台证据。
- F04 不修改 `review-ipc.ts`、`preload/index.ts`、`CaseAggregateV2`、正式 writer 或 T06 Main 服务，避免和本地 Agent / F14 抢写共享边界。
