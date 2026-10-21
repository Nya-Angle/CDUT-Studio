/**
 * CSLab 列式存储：ZSTD 压缩 Parquet + 首屏预览 JSON
 *
 * 设计取舍：
 * - Parquet 保存完整二维矩阵，供后续列式计算 / DuckDB 适配器消费；
 * - 前 500 行生成 preview.json，避免渲染进程解析大二进制，保证毫秒级首屏；
 * - ZSTD 依赖 Node 22.15+ 的 zlib.zstdCompressSync；不可用时自动回退 Snappy。
 */

import { promises as fs, createWriteStream } from 'node:fs'
import { finished } from 'node:stream/promises'
import type { Writable } from 'node:stream'
import type { CsLabCellValue, CsLabColumn, CsLabTableSeries } from '@profer/shared'
import { parquetWriteBuffer } from 'hyparquet-writer'
import { asyncBufferFromFile, parquetReadObjects, parquetScan } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'
import type { ParsedDataset } from './cslab-formats/types'

export const PREVIEW_ROW_LIMIT = 500

export interface CsLabTablePreview {
  columns: CsLabColumn[]
  rows: CsLabCellValue[][]
  totalRows: number
  totalCols: number
  previewLimit: number
  generatedAt: number
}

type ZstdCompressor = (input: Uint8Array) => Uint8Array

function getZstdCompressor(): ZstdCompressor | null {
  try {
    const zlib = require('node:zlib') as {
      zstdCompressSync?: (input: Uint8Array) => Uint8Array
    }
    if (typeof zlib.zstdCompressSync === 'function') {
      return (input: Uint8Array) => new Uint8Array(zlib.zstdCompressSync!(input))
    }
  } catch {
    // 运行时缺少 zstd 时回退 Snappy。
  }
  return null
}

function sanitizeNumber(value: number): number | null {
  if (!Number.isFinite(value)) return null
  return value
}

export interface ParquetWriteResult {
  bytes: number
  codec: 'ZSTD' | 'SNAPPY'
}

/**
 * 将统一的 ParsedDataset 写入 Parquet。
 */
export async function writeDatasetParquet(
  dataset: ParsedDataset,
  outPath: string,
): Promise<ParquetWriteResult> {
  const columnData = [
    { name: 'x', data: dataset.x, type: 'DOUBLE' as const },
    ...dataset.columns
      .filter((column) => column.key !== 'x')
      .map((column) => ({
        name: column.key,
        data: dataset.series[column.key] ?? [],
        type: 'DOUBLE' as const,
      })),
  ]

  const compressor = getZstdCompressor()
  let buffer: ArrayBuffer
  let codec: 'ZSTD' | 'SNAPPY'

  if (compressor) {
    try {
      buffer = parquetWriteBuffer({
        columnData,
        codec: 'ZSTD',
        compressors: { ZSTD: compressor },
      })
      codec = 'ZSTD'
    } catch (error) {
      console.warn('[CSLab] ZSTD Parquet 写入失败，回退 Snappy:', error)
      buffer = parquetWriteBuffer({ columnData, codec: 'SNAPPY' })
      codec = 'SNAPPY'
    }
  } else {
    buffer = parquetWriteBuffer({ columnData, codec: 'SNAPPY' })
    codec = 'SNAPPY'
  }

  await fs.writeFile(outPath, new Uint8Array(buffer))
  return { bytes: buffer.byteLength, codec }
}

/** 生成首屏预览（前 N 行）。 */
export function buildDatasetPreview(
  dataset: ParsedDataset,
  previewLimit = PREVIEW_ROW_LIMIT,
): CsLabTablePreview {
  const seriesColumns = dataset.columns.filter((column) => column.key !== 'x')
  const limit = Math.min(previewLimit, dataset.rowCount)
  const rows: CsLabCellValue[][] = []

  for (let row = 0; row < limit; row += 1) {
    const cells: CsLabCellValue[] = [sanitizeNumber(dataset.x[row] ?? Number.NaN)]
    for (const column of seriesColumns) {
      cells.push(sanitizeNumber(dataset.series[column.key]?.[row] ?? Number.NaN))
    }
    rows.push(cells)
  }

  return {
    columns: dataset.columns,
    rows,
    totalRows: dataset.rowCount,
    totalCols: dataset.columns.length,
    previewLimit,
    generatedAt: Date.now(),
  }
}

export async function writeDatasetPreview(
  dataset: ParsedDataset,
  outPath: string,
  previewLimit = PREVIEW_ROW_LIMIT,
): Promise<CsLabTablePreview> {
  const preview = buildDatasetPreview(dataset, previewLimit)
  await fs.writeFile(outPath, `${JSON.stringify(preview)}\n`, 'utf-8')
  return preview
}

export async function readDatasetPreview(previewPath: string): Promise<CsLabTablePreview | null> {
  try {
    const raw = await fs.readFile(previewPath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<CsLabTablePreview>
    if (!Array.isArray(parsed.columns) || !Array.isArray(parsed.rows)) return null
    return {
      columns: parsed.columns,
      rows: parsed.rows,
      totalRows: Number(parsed.totalRows ?? parsed.rows.length),
      totalCols: Number(parsed.totalCols ?? parsed.columns.length),
      previewLimit: Number(parsed.previewLimit ?? PREVIEW_ROW_LIMIT),
      generatedAt: Number(parsed.generatedAt ?? Date.now()),
    }
  } catch {
    return null
  }
}

/** 从预览中读取单元格值（胶囊更新链路使用）。 */
export function readPreviewCell(
  preview: CsLabTablePreview,
  columnKey: string,
  rowIndex: number,
): CsLabCellValue {
  const columnIndex = preview.columns.findIndex((column) => column.key === columnKey)
  if (columnIndex < 0) return null
  const row = preview.rows[rowIndex]
  if (!row) return null
  return row[columnIndex] ?? null
}

/**
 * 超出首屏预览行数时，直接从 Parquet 读取单个单元格。
 *
 * 使用 rowStart / rowEnd 让 hyparquet 只解码命中的行组与页，
 * 避免整列反序列化出大量 JS 对象造成内存峰值。
 */
export async function readDatasetCell(
  parquetPath: string,
  columnKey: string,
  rowIndex: number,
): Promise<CsLabCellValue> {
  if (!Number.isInteger(rowIndex) || rowIndex < 0) return null
  try {
    const file = await asyncBufferFromFile(parquetPath)
    const rows = (await parquetReadObjects({
      file,
      columns: [columnKey],
      rowStart: rowIndex,
      rowEnd: rowIndex + 1,
      compressors,
    })) as Array<Record<string, unknown>>
    const value = rows[0]?.[columnKey]
    return typeof value === 'number' ? sanitizeNumber(value) : null
  } catch (error) {
    console.warn('[CSLab] Parquet 单元格直读失败:', error)
    return null
  }
}

/**
 * 读取完整 Parquet 序列并按 min/max 分桶降采样。
 *
 * 为什么不直接用 preview：
 * - preview 只保留前 500 行，XRD 这类连续谱会丢掉高角度峰；
 * - min/max 分桶保留峰形（不做平均），并返回真实总行数。
 */
export async function readDatasetSeries(
  parquetPath: string,
  columns: CsLabColumn[],
  maxPoints = 3000,
): Promise<CsLabTableSeries | null> {
  if (!columns.some((column) => column.key === 'x')) return null
  let rows: Array<Record<string, unknown>>
  try {
    const file = await asyncBufferFromFile(parquetPath)
    rows = (await parquetReadObjects({
      file,
      columns: columns.map((column) => column.key),
      compressors,
    })) as Array<Record<string, unknown>>
  } catch (error) {
    console.warn('[CSLab] 完整序列读取失败，回退预览:', error)
    return null
  }
  if (rows.length === 0) return null

  const totalRows = rows.length
  const xAll = rows.map((row) => Number(row.x))
  const seriesKeys = columns.filter((column) => column.key !== 'x').map((column) => column.key)
  const yAll: Record<string, number[]> = {}
  for (const key of seriesKeys) {
    yAll[key] = rows.map((row) => Number(row[key]))
  }

  const limit = Math.max(2, Math.floor(maxPoints))
  if (totalRows <= limit) {
    return {
      columns,
      x: xAll.map((value) => (Number.isFinite(value) ? value : Number.NaN)),
      series: Object.fromEntries(
        seriesKeys.map((key) => [
          key,
          yAll[key]!.map((value) => (Number.isFinite(value) ? value : Number.NaN)),
        ]),
      ),
      totalRows,
      downsampled: false,
    }
  }

  const bucketCount = Math.max(1, Math.floor(limit / 2))
  const bucketSize = totalRows / bucketCount
  const picked = new Set<number>()

  for (let bucket = 0; bucket < bucketCount; bucket += 1) {
    const start = Math.floor(bucket * bucketSize)
    const end = Math.min(totalRows, Math.floor((bucket + 1) * bucketSize))
    if (end <= start) continue
    // 以第一条可用序列的极值定位两个采样点，保留峰与谷。
    const primary = seriesKeys[0]
    if (!primary) {
      picked.add(start)
      continue
    }
    let minIndex = start
    let maxIndex = start
    for (let index = start; index < end; index += 1) {
      const value = yAll[primary]![index] ?? Number.NaN
      if (!Number.isFinite(value)) continue
      if (!Number.isFinite(yAll[primary]![minIndex] ?? Number.NaN) || value < (yAll[primary]![minIndex] ?? Number.POSITIVE_INFINITY)) {
        minIndex = index
      }
      if (!Number.isFinite(yAll[primary]![maxIndex] ?? Number.NaN) || value > (yAll[primary]![maxIndex] ?? Number.NEGATIVE_INFINITY)) {
        maxIndex = index
      }
    }
    picked.add(minIndex)
    picked.add(maxIndex)
  }

  const indices = [...picked].sort((left, right) => left - right)
  return {
    columns,
    x: indices.map((index) => xAll[index] ?? Number.NaN),
    series: Object.fromEntries(
      seriesKeys.map((key) => [
        key,
        indices.map((index) => {
          const value = yAll[key]![index] ?? Number.NaN
          return Number.isFinite(value) ? value : Number.NaN
        }),
      ]),
    ),
    totalRows,
    downsampled: true,
  }
}

/** CSV 分块写入行数：避免单次拼接超大字符串。 */
const CSV_FLUSH_ROWS = 2000

function csvCell(value: unknown): string {
  if (value == null) return ''
  let text: string
  if (typeof value === 'number') {
    text = Number.isFinite(value) ? String(value) : ''
  } else if (typeof value === 'bigint') {
    text = value.toString()
  } else if (value instanceof Date) {
    text = value.toISOString()
  } else if (typeof value === 'object') {
    try {
      text = JSON.stringify(value)
    } catch {
      text = String(value)
    }
  } else {
    text = String(value)
  }
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function waitForDrain(stream: Writable): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      stream.off('drain', onDrain)
      stream.off('error', onError)
    }
    const onDrain = (): void => {
      cleanup()
      resolve()
    }
    const onError = (error: Error): void => {
      cleanup()
      reject(error)
    }
    stream.once('drain', onDrain)
    stream.once('error', onError)
  })
}

async function writeWithBackpressure(stream: Writable, text: string): Promise<void> {
  if (!stream.write(text)) await waitForDrain(stream)
}

/**
 * 将数据表按 RowGroup 流式导出为 CSV。
 *
 * 红线：
 * - 逐 RowGroup 读取列式数组，绝不调用 parquetReadObjects 全量载入；
 * - 以固定行数分块格式化并写入 createWriteStream，显式处理背压；
 * - 绝不把全量数据拼成一个大字符串。
 */
export async function writeDatasetCsvStream(
  parquetPath: string,
  columns: CsLabColumn[],
  outPath: string,
): Promise<{ rows: number; bytes: number }> {
  if (columns.length === 0) throw new Error('数据表没有可导出的列')
  const keys = columns.map((column) => column.key)
  const file = await asyncBufferFromFile(parquetPath)
  const scan = await parquetScan({ file, columns: keys, compressors })
  const stream = createWriteStream(outPath, { encoding: 'utf8' })
  let writtenRows = 0

  try {
    await writeWithBackpressure(stream, `\uFEFF${keys.map((key) => csvCell(key)).join(',')}\n`)

    for (const range of scan.ranges) {
      const rowCount = range.rowEnd - range.rowStart
      if (rowCount <= 0) continue
      const arrays = await Promise.all(
        keys.map((key) =>
          scan.readColumn({ column: key, rowStart: range.rowStart, rowEnd: range.rowEnd }),
        ),
      )

      for (let start = 0; start < rowCount; start += CSV_FLUSH_ROWS) {
        const end = Math.min(rowCount, start + CSV_FLUSH_ROWS)
        const lines: string[] = []
        for (let row = start; row < end; row += 1) {
          lines.push(arrays.map((data) => csvCell(data?.[row])).join(','))
        }
        await writeWithBackpressure(stream, `${lines.join('\n')}\n`)
        writtenRows += end - start
      }
      // 当前 RowGroup 处理完毕即释放列数组，避免内存随文件行数增长。
      arrays.length = 0
    }

    stream.end()
    await finished(stream)
    const stat = await fs.stat(outPath)
    return { rows: writtenRows, bytes: stat.size }
  } catch (error) {
    stream.destroy()
    await fs.rm(outPath, { force: true }).catch(() => undefined)
    throw error
  }
}
