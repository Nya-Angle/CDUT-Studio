import type { ReviewDocumentBlock, SourceDocument, SourceRef } from '@profer/shared'

/** Map a V2 SourceRef to the closest V1-rendered source block without inventing precision. */
export function sourceRefTargetsBlock(ref: SourceRef, document: SourceDocument, block: ReviewDocumentBlock): boolean {
  if (ref.documentVersionId !== document.id && !ref.documentVersionId.startsWith(`${document.id}-v`)) return false
  const blockIndex = document.blocks.findIndex((candidate) => candidate.id === block.id)
  if (blockIndex < 0) return false
  const location = ref.location
  if (location.kind === 'paragraph') return blockIndex === location.index
  if (location.kind === 'sheet-cell') {
    const column = typeof block.table?.column === 'number' ? spreadsheetColumnName(block.table.column) : String(block.table?.column ?? '')
    return block.table?.row === location.row && column.toLocaleUpperCase() === location.column.toLocaleUpperCase() && (!block.table.sheet || block.table.sheet === location.sheet)
  }
  if (location.kind === 'pdf-rect') return block.page === location.page
  if (location.kind === 'text-range') {
    if (ref.quote && block.text.includes(ref.quote)) return true
    const start = document.blocks.slice(0, blockIndex).reduce((offset, item) => offset + item.text.length + 1, 0)
    const end = start + block.text.length
    return start < location.end && end > location.start
  }
  return location.kind === 'file' && blockIndex === 0
}

function spreadsheetColumnName(index: number): string {
  if (index <= 0) return ''
  let value = index
  let name = ''
  while (value > 0) {
    value -= 1
    name = String.fromCharCode(65 + value % 26) + name
    value = Math.floor(value / 26)
  }
  return name
}
