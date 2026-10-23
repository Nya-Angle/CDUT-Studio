import type { DocumentVersion, ReviewRunV2 } from '@profer/shared'

type RunDocumentCoverage = ReviewRunV2['coverage']['documents'][number]

/** 根据一次 Pi 运行里实际记录的 block 读取状态生成材料覆盖账本。 */
export function finalizePiDocumentCoverage(input: {
  documents: DocumentVersion[]
  previous: RunDocumentCoverage[]
  readBlocksByDocument: Record<string, string[]>
  previewedDocumentVersionIds?: ReadonlySet<string>
  fullyPreviewedDocumentVersionIds?: ReadonlySet<string>
  citedDocumentVersionIds: ReadonlySet<string>
}): RunDocumentCoverage[] {
  const previousByVersion = new Map(input.previous.map((entry) => [entry.documentVersionId, entry]))
  return input.documents.filter((document) => document.active !== false).map((document) => {
    const previous = previousByVersion.get(document.versionId)
    if (document.manualReadReceipt) {
      return {
        documentVersionId: document.versionId,
        status: 'read',
        reason: `审核员已核对原件：${document.manualReadReceipt.reason}`,
      }
    }
    if (previous?.status === 'read' && document.parseStatus !== 'failed') return previous
    if (input.fullyPreviewedDocumentVersionIds?.has(document.versionId)) {
      return { documentVersionId: document.versionId, status: 'read' }
    }

    // `failed` means no parser-produced text is trustworthy. Older case files may still
    // contain one empty compatibility placeholder; never count it as a real block.
    const expectedBlockIds = document.parseStatus === 'failed' ? [] : document.blocks.map((block) => block.blockId)
    const expected = new Set(expectedBlockIds)
    const readBlockIds = new Set((input.readBlocksByDocument[document.versionId] ?? []).filter((blockId) => expected.has(blockId)))
    const allParsedBlocksRead = expectedBlockIds.length > 0 && readBlockIds.size === expectedBlockIds.length
    // Raster files intentionally have no extracted text. Their image block is the
    // complete source; a successful visual inspection can therefore cover the file.
    const fullyRepresentedImage = document.mimeType.startsWith('image/')
      && expectedBlockIds.length > 0
      && document.blocks.every((block) => block.kind === 'image')
    if (allParsedBlocksRead && (document.parseStatus === 'parsed' || fullyRepresentedImage)) {
      return { documentVersionId: document.versionId, status: 'read' }
    }

    const hasCitation = input.citedDocumentVersionIds.has(document.versionId)
    const hasReadReceipt = readBlockIds.size > 0
    const hasPreviewReceipt = input.previewedDocumentVersionIds?.has(document.versionId) ?? false
    if (document.parseStatus === 'failed') {
      const detail = document.parseError ? `解析原因：${document.parseError}` : '没有可用的解析文本'
      if (hasPreviewReceipt) {
        return {
          documentVersionId: document.versionId,
          status: 'partially-read',
          reason: `自动解析失败；本次虽打开过原件，但未登记完整页面核验。${detail}`,
        }
      }
      return {
        documentVersionId: document.versionId,
        status: 'unread',
        reason: `自动解析失败；读取空占位块不代表读取了原件，请重新解析或打开原件核验。${detail}`,
      }
    }
    if (hasPreviewReceipt && expectedBlockIds.length === 0) {
      return {
        documentVersionId: document.versionId,
        status: 'partially-read',
        reason: document.parseError ?? '本次已通过文件预览查看，但解析器未提供可追溯的完整文本块，不能据此确认原件全文已读',
      }
    }
    if (hasPreviewReceipt || hasReadReceipt || hasCitation || previous?.status === 'partially-read') {
      const reason = document.parseStatus !== 'parsed'
        ? hasPreviewReceipt && !hasReadReceipt
          ? `本次通过 inspect_preview 查看了原件；解析状态为 ${document.parseStatus}，仍不能确认原件全文已读`
          : `已读取当前解析出的 ${readBlockIds.size}/${expectedBlockIds.length} 个材料块，但解析状态为 ${document.parseStatus}，不能据此确认原件全文已读`
        : hasPreviewReceipt && !hasReadReceipt
          ? `本次通过 inspect_preview 查看了原件，但没有逐块读取 ${expectedBlockIds.length} 个解析块`
        : hasReadReceipt
          ? `本次审核通过材料工具读取了 ${readBlockIds.size}/${expectedBlockIds.length} 个材料块`
          : hasCitation
            ? '本次审核引用了相关材料片段，但没有完整读取记录'
            : previous?.reason ?? '本次运行只记录了部分材料读取'
      return { documentVersionId: document.versionId, status: 'partially-read', reason }
    }

    const reason = expectedBlockIds.length === 0
      ? document.parseError ?? previous?.reason ?? '没有可追溯的本次读取记录，且解析器未提取出可读取内容'
      : previous?.reason ?? '本次运行没有可追溯的读取记录'
    return { documentVersionId: document.versionId, status: 'unread', reason }
  })
}
