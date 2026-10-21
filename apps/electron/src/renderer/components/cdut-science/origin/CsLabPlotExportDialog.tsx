/**
 * CSLab 出版图导出对话框
 */

import * as React from 'react'
import { Loader2, X } from 'lucide-react'
import type { CsLabPlotDocument, CsLabPlotExportFormat } from '@profer/shared'
import { JOURNAL_PRESETS } from '@profer/shared'
import { exportPlot } from './cslab-plot-export'

interface CsLabPlotExportDialogProps {
  open: boolean
  labId: string
  document: CsLabPlotDocument
  onClose: () => void
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

const FORMATS: Array<{ id: CsLabPlotExportFormat; label: string }> = [
  { id: 'svg', label: 'SVG 矢量' },
  { id: 'pdf', label: 'PDF 矢量' },
  { id: 'png', label: 'PNG 位图' },
  { id: 'tiff', label: 'TIFF 位图' },
]

export function CsLabPlotExportDialog({
  open,
  labId,
  document,
  onClose,
  onToast,
}: CsLabPlotExportDialogProps): React.ReactElement | null {
  const [format, setFormat] = React.useState<CsLabPlotExportFormat>('svg')
  const [dpi, setDpi] = React.useState<300 | 600 | 1200>(600)
  const [transparent, setTransparent] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  if (!open) return null

  const preset = JOURNAL_PRESETS[document.presetId] ?? JOURNAL_PRESETS.default
  const widthMm = document.sizeMm.width
  const heightMm = document.sizeMm.height
  const pixels = Math.round((widthMm / 25.4) * dpi) * Math.round((heightMm / 25.4) * dpi)
  const tooLarge = pixels > 64_000_000

  const handleExport = async (): Promise<void> => {
    if (tooLarge) {
      onToast('error', '导出像素数超过 6400 万，请降低 DPI 或尺寸')
      return
    }
    setBusy(true)
    try {
      const result = await exportPlot(labId, document, {
        format,
        dpi,
        widthMm,
        heightMm,
        transparentBackground: transparent,
        fileName: `${document.title || document.id}.${format}`,
      })
      onToast('success', `已导出到 ${result.path}`)
      onClose()
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '导出失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-md rounded-xl border border bg-card p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">导出出版级图</h3>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <label className="block space-y-1">
            <span className="text-muted-foreground">格式</span>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as CsLabPlotExportFormat)}
              className="w-full rounded-md border border bg-background px-2 py-1.5"
            >
              {FORMATS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-muted-foreground">分辨率</span>
            <select
              value={dpi}
              onChange={(event) => setDpi(Number(event.target.value) as 300 | 600 | 1200)}
              className="w-full rounded-md border border bg-background px-2 py-1.5"
            >
              <option value={300}>300 DPI</option>
              <option value={600}>600 DPI</option>
              <option value={1200}>1200 DPI</option>
            </select>
          </label>

          <div className="rounded-md bg-muted/40 px-2 py-1.5 text-muted-foreground">
            {preset.label} · {widthMm.toFixed(1)} × {heightMm.toFixed(1)} mm ·{' '}
            {Math.round((widthMm / 25.4) * dpi)} × {Math.round((heightMm / 25.4) * dpi)} px
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(event) => setTransparent(event.target.checked)}
            />
            <span>透明背景（PNG/TIFF）</span>
          </label>

          {tooLarge ? (
            <p className="text-destructive">像素数超过 6400 万，请降低 DPI。</p>
          ) : null}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border px-3 py-1.5 text-xs"
          >
            取消
          </button>
          <button
            type="button"
            disabled={busy || tooLarge}
            onClick={() => void handleExport()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            导出
          </button>
        </div>
      </div>
    </div>
  )
}

