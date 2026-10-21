/**
 * CsLabIronCageTable — 只读数据铁笼表
 *
 * 红线：所有单元格只读；显示 SHA-256 只读徽章；单元格可拖拽为 cdut:// 胶囊载荷。
 */

import * as React from 'react'
import { Check, Copy, Lock } from 'lucide-react'
import type { CsLabCellRef, CsLabCellValue, CsLabTablePayload } from '@profer/shared'
import { CSLAB_CELL_MIME } from './cslab-dnd'

interface CsLabIronCageTableProps {
  payload: CsLabTablePayload
  onCellClick?: (cell: CsLabCellRef) => void
  /** 与曲线联动时高亮的预览行索引。 */
  highlightRowIndex?: number
}

function formatCell(value: CsLabCellValue): string {
  if (value == null) return '—'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '—'
    const absolute = Math.abs(value)
    if (absolute !== 0 && (absolute >= 1e6 || absolute < 1e-4)) return value.toExponential(4)
    return String(Number(value.toPrecision(8)))
  }
  return value
}

function buildCellRef(payload: CsLabTablePayload, columnIndex: number, rowIndex: number): CsLabCellRef | null {
  const column = payload.columns[columnIndex]
  const row = payload.rows[rowIndex]
  if (!column || !row) return null
  return {
    labId: payload.uri.split('/')[2] ?? '',
    tableUri: payload.uri,
    column: column.key,
    rowIndex,
    value: row[columnIndex] ?? null,
    unit: column.unit,
    label: column.label,
    tableRevision: payload.revision,
  }
}

export function CsLabIronCageTable({
  payload,
  onCellClick,
  highlightRowIndex,
}: CsLabIronCageTableProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false)
  const highlightRowRef = React.useRef<HTMLTableRowElement | null>(null)

  React.useEffect(() => {
    if (highlightRowIndex == null) return
    highlightRowRef.current?.scrollIntoView({ block: 'nearest' })
  }, [highlightRowIndex])

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(payload.sha256)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // 剪贴板不可用时静默降级，SHA 仍可通过 title 查看。
    }
  }

  const loaded = payload.rows.length
  const hasMore = payload.totalRows > loaded

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-cslab-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-cslab-border bg-cslab-surface px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cslab-muted">
            <Lock size={10} />
            只读
          </span>
          {payload.format && (
            <span className="rounded-full bg-cslab-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-cslab-accent">
              {payload.format}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleCopy()}
          title={payload.sha256}
          className="inline-flex items-center gap-1.5 rounded-full border border-cslab-border px-2 py-0.5 text-[10px] text-cslab-muted transition-colors hover:border-cslab-accent/40 hover:text-cslab-accent"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          SHA-256 {payload.sha256.slice(0, 12)}…
        </button>

        <span className="ml-auto text-[11px] tabular-nums text-cslab-muted">
          已加载前 {loaded} 行 / 共 {payload.totalRows} 行 · {payload.totalCols} 列
          {hasMore ? '（预览）' : ''}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead className="sticky top-0 z-10 bg-cslab-surface/95 backdrop-blur-sm">
            <tr>
              <th className="w-14 border-b border-cslab-border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-cslab-muted">
                #
              </th>
              {payload.columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap border-b border-cslab-border px-3 py-2 font-medium text-cslab-text"
                >
                  {column.label}
                  {column.unit && (
                    <span className="ml-1 text-[10px] font-normal text-cslab-muted">
                      / {column.unit}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payload.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                ref={highlightRowIndex === rowIndex ? highlightRowRef : undefined}
                className={
                  highlightRowIndex === rowIndex
                    ? 'group bg-cslab-accent/10'
                    : 'group'
                }
              >
                <td className="border-b border-cslab-border/60 px-3 py-1.5 text-[10px] tabular-nums text-cslab-muted/70">
                  {rowIndex + 1}
                </td>
                {payload.columns.map((column, columnIndex) => {
                  const value = row[columnIndex] ?? null
                  const cellRef = buildCellRef(payload, columnIndex, rowIndex)
                  return (
                    <td
                      key={column.key}
                      draggable={!!cellRef}
                      onDragStart={(event) => {
                        if (!cellRef) return
                        event.dataTransfer.effectAllowed = 'copy'
                        event.dataTransfer.setData(
                          CSLAB_CELL_MIME,
                          JSON.stringify(cellRef),
                        )
                        event.dataTransfer.setData(
                          'text/plain',
                          `{{capsule:${cellRef.tableUri}#${cellRef.column}:${cellRef.rowIndex}}}`,
                        )
                        event.dataTransfer.setData(
                          'text/uri-list',
                          `${cellRef.tableUri}#${cellRef.column}:${cellRef.rowIndex}`,
                        )
                      }}
                      onClick={() => {
                        if (cellRef) onCellClick?.(cellRef)
                      }}
                      className="cursor-grab whitespace-nowrap border-b border-cslab-border/60 px-3 py-1.5 tabular-nums text-cslab-text transition-colors hover:bg-cslab-accent/10 active:cursor-grabbing"
                    >
                      {formatCell(value)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {payload.rows.length === 0 && (
          <p className="px-5 py-10 text-center text-xs text-cslab-muted">数据表为空</p>
        )}
      </div>

      <div className="shrink-0 border-t border-cslab-border px-5 py-2">
        <span className="text-[10px] leading-relaxed text-cslab-muted">
          把任意单元格拖入右侧论文正文即可生成活体胶囊；数据更新后胶囊会以呼吸灯提示。
        </span>
      </div>
    </div>
  )
}
