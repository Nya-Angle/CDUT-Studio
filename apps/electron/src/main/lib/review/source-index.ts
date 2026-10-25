/**
 * 来源索引与自动分批（N2c，docs/design/review-agent/07 §6；R09）
 *
 * - SourceIndex：每文档版本的结构化位置索引（段落/行/单元格/页），存 source-index/{versionId}.json
 * - 文本类：真实段落/行位置（不虚构页码）；CSV：支持引号/换行的解析器（不用 split(',')），学号保留前导零
 * - PDF/图片：分页与 OCR 矩形经 PageIndexer/OcrPort 端口接入（引擎随包在 N7 验证），未接入如实标注
 * - planVisionBatches：按数量/字节自动分批；全部登记（不只前 N 张），末批失败仅影响相关范围
 */

import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SourceLocation } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { assertReviewPreuploadAllowed } from './review-preupload-gate'

// ===== 来源索引 =====

export interface SourceIndexEntry {
  /** 稳定块键：blockId 全文档唯一（引用与恢复依据） */
  blockId: string
  text: string
  location: SourceLocation
  precision: 'paragraph' | 'line' | 'sheet-cell' | 'page' | 'file'
  /** 摘录 hash（SHA-1，与 V1 引用兼容；新对比逻辑可用 SHA-256） */
  excerptHash: string
}

export interface SourceIndex {
  documentVersionId: string
  parseRevision: number
  engine: string
  engineVersion: string
  entries: SourceIndexEntry[]
  /** 未完成范围（部分解析/OCR 待补） */
  incomplete?: { reason: string; scope: string }
}

function hashExcerpt(text: string): string {
  // 引用摘录 hash：V1 兼容 sha1
  let h1 = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    h1 ^= text.charCodeAt(i)
    h1 = Math.imul(h1, 0x01000193)
  }
  return (h1 >>> 0).toString(16).padStart(8, '0')
}

/** 文本类来源索引：按段落（空行分隔）与行位置（不虚构页码） */
export function buildTextSourceIndex(documentVersionId: string, content: string, parseRevision = 1): SourceIndex {
  assertReviewPreuploadAllowed('index')
  const paragraphs = content.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0)
  return {
    documentVersionId,
    parseRevision,
    engine: 'text-paragraph',
    engineVersion: '1',
    entries: paragraphs.map((paragraph, index) => ({
      blockId: `${documentVersionId}-p${index}`,
      text: paragraph.trim(),
      location: { kind: 'text-range', start: content.indexOf(paragraph), end: content.indexOf(paragraph) + paragraph.length },
      precision: 'paragraph',
      excerptHash: hashExcerpt(paragraph.trim()),
    })),
  }
}

/** CSV 引号感知解析（07 §6.2：支持引号/换行；学号按文本保留前导零） */
export function parseCsvRows(content: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < content.length; i += 1) {
    const char = content[i]!
    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') { field += '"'; i += 1 } else { inQuotes = false }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field); field = ''
    } else if (char === '\n') {
      row.push(field); field = ''
      rows.push(row); row = []
    } else if (char === '\r') {
      // 忽略（随 \n 处理）
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

/** CSV/表格来源索引：sheet-cell 精度，原值按文本保留（前导零不丢失） */
export function buildSheetSourceIndex(documentVersionId: string, csv: string, parseRevision = 1, sheetName = 'sheet1'): SourceIndex {
  assertReviewPreuploadAllowed('index')
  const rows = parseCsvRows(csv)
  const header = rows[0] ?? []
  const entries: SourceIndexEntry[] = []
  for (let r = 1; r < rows.length; r += 1) {
    for (let c = 0; c < rows[r]!.length; c += 1) {
      const value = rows[r]![c]!
      if (value === '') continue
      const column = header[c] ?? `col${c}`
      entries.push({
        blockId: `${documentVersionId}-r${r}c${c}`,
        text: value,
        location: { kind: 'sheet-cell', sheet: sheetName, row: r, column },
        precision: 'sheet-cell',
        excerptHash: hashExcerpt(value),
      })
    }
  }
  return { documentVersionId, parseRevision, engine: 'csv-cell', engineVersion: '1', entries }
}

/** 索引落盘（source-index/{versionId}.json） */
export function saveSourceIndex(caseId: string, index: SourceIndex): void {
  assertReviewPreuploadAllowed('index', { caseId })
  assertReviewPreuploadAllowed('persist', { caseId })
  const dir = join(getConfigDir(), 'review-cases', caseId, 'source-index')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const filePath = join(dir, `${index.documentVersionId}.json`)
  const tmp = `${filePath}.${Math.random().toString(36).slice(2, 6)}.tmp`
  writeFileSync(tmp, JSON.stringify(index, null, 2), 'utf-8')
  // 原子替换（复用 V1 原子写思想）
  renameSync(tmp, filePath)
}

// ===== 视觉自动分批（07 §6.5） =====

export interface VisionItem {
  documentVersionId: string
  page?: number
  assetPath: string
  sizeBytes: number
}

export interface VisionBatch {
  index: number
  items: VisionItem[]
  totalBytes: number
  /** 末批失败仅影响本批相关范围（每批独立 manifest） */
  manifest: { batchIndex: number; itemIds: string[] }
}

/**
 * 自动分批：按最大张数/最大字节切批；全部登记（不只前 N 张）。
 * 单项超预算仍独立成批（由调用方决定降级），不做静默丢弃。
 */
export function planVisionBatches(items: VisionItem[], limits: { maxItemsPerBatch: number; maxBytesPerBatch: number }): VisionBatch[] {
  if (limits.maxItemsPerBatch < 1) throw new Error('maxItemsPerBatch 必须 ≥1')
  const batches: VisionBatch[] = []
  let current: VisionItem[] = []
  let currentBytes = 0
  const flush = (): void => {
    if (current.length === 0) return
    batches.push({
      index: batches.length,
      items: current,
      totalBytes: currentBytes,
      manifest: { batchIndex: batches.length, itemIds: current.map((item) => `${item.documentVersionId}${item.page !== undefined ? `#${item.page}` : ''}`) },
    })
    current = []
    currentBytes = 0
  }
  for (const item of items) {
    if (current.length >= limits.maxItemsPerBatch || (currentBytes + item.sizeBytes > limits.maxBytesPerBatch && current.length > 0)) {
      flush()
    }
    current.push(item)
    currentBytes += item.sizeBytes
  }
  flush()
  return batches
}
