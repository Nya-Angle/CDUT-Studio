/**
 * CSLab Origin 级出版绘图窗格
 */

import * as React from 'react'
import { Download, Loader2, Save, ScanLine, Sigma, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useAtom } from 'jotai'
import type {
  CsLabAgentPlotRoi,
  CsLabFitResult,
  CsLabJournalPresetId,
  CsLabPlotDocument,
} from '@profer/shared'
import { JOURNAL_PRESETS, createPlotDocument } from '@profer/shared'
import { cn } from '@/lib/utils'
import type { CsLabPaneState } from '@/atoms/cslab-atoms'
import { cslabPanePlotsAtom } from '@/atoms/cslab-atoms'
import { CsLabPlotControls } from './CsLabPlotControls'
import { CsLabPlotExportDialog } from './origin/CsLabPlotExportDialog'
import { CsLabPeakFitDrawer, type CsLabFitData } from './origin/CsLabPeakFitDrawer'
import { buildPlotRenderModel } from './origin/cslab-plot-render-model'
import { drawPlotToCanvas, pixelToData } from './origin/canvas-plot-renderer'

interface CsLabOriginPlotPaneProps {
  labId: string
  pane: CsLabPaneState
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

export function CsLabOriginPlotPane({
  labId,
  pane,
  onToast,
}: CsLabOriginPlotPaneProps): React.ReactElement {
  const [plots, setPlots] = useAtom(cslabPanePlotsAtom)
  const plot = plots[pane.id]
  const [plotState, setPlotState] = React.useState<CsLabPlotDocument | null>(plot)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [fitOpen, setFitOpen] = React.useState(false)
  const [fitData, setFitData] = React.useState<CsLabFitData | null>(null)
  const [roiMode, setRoiMode] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [selection, setSelection] = React.useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  /** 最近一次框选的数据坐标区间；用于「发送至助理」时复用。 */
  const [lastRoi, setLastRoi] = React.useState<CsLabAgentPlotRoi | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const dragRef = React.useRef<{ x: number; y: number; startPlot: CsLabPlotDocument } | null>(null)

  React.useEffect(() => {
    setPlotState(plot)
  }, [plot])

  const updatePlot = React.useCallback(
    (next: CsLabPlotDocument): void => {
      setPlotState(next)
      setPlots((previous) => ({ ...previous, [pane.id]: next }))
    },
    [pane.id, setPlots],
  )

  const preset = plotState ? JOURNAL_PRESETS[plotState.presetId] ?? JOURNAL_PRESETS.default : JOURNAL_PRESETS.default

  const draw = React.useCallback((): void => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !plotState) return
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const context = canvas.getContext('2d')
    if (!context) return
    const model = buildPlotRenderModel(plotState, preset, width, height)
    drawPlotToCanvas(context, model, plotState, preset, dpr)
    if (selection) {
      context.save()
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.strokeStyle = '#2f6fed'
      context.setLineDash([4, 3])
      context.strokeRect(
        Math.min(selection.x1, selection.x2),
        Math.min(selection.y1, selection.y2),
        Math.abs(selection.x2 - selection.x1),
        Math.abs(selection.y2 - selection.y1),
      )
      context.restore()
    }
  }, [plotState, preset, selection])

  React.useEffect(() => {
    draw()
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => draw())
    observer.observe(container)
    return () => observer.disconnect()
  }, [draw])

  const firstSeries = plotState?.layers[0]?.series.find((series) => series.visible !== false)

  const openFit = (data?: CsLabFitData): void => {
    if (data && data.x.length > 5) {
      setFitData(data)
      setFitOpen(true)
      return
    }
    if (!firstSeries) {
      onToast('info', '当前绘图没有可拟合的曲线')
      return
    }
    setFitData({ x: firstSeries.x, y: firstSeries.y })
    setFitOpen(true)
  }

  const handleFitApply = (result: CsLabFitResult, data: CsLabFitData): void => {
    if (!plotState) return
    const layer = plotState.layers[0]
    if (!layer) return
    const fittedSeries = {
      id: `fit-${Date.now()}`,
      name: '拟合',
      x: data.x,
      y: result.fitted,
      color: '#d04a7a',
      lineWidth: 0.8,
      lineStyle: 'dash' as const,
      marker: 'none' as const,
      yAxis: 0 as const,
      visible: true,
      alpha: 1,
    }
    updatePlot({
      ...plotState,
      layers: [{ ...layer, series: [...layer.series, fittedSeries] }, ...plotState.layers.slice(1)],
      updatedAt: Date.now(),
    })
    setFitOpen(false)
    onToast('success', '拟合曲线已加入图层')
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!plotState) return
    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      startPlot: plotState,
    }
    if (roiMode) {
      setSelection({
        x1: dragRef.current.x,
        y1: dragRef.current.y,
        x2: dragRef.current.x,
        y2: dragRef.current.y,
      })
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!dragRef.current || !plotState) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (roiMode) {
      setSelection((previous) => (previous ? { ...previous, x2: x, y2: y } : previous))
      return
    }
    const container = containerRef.current
    if (!container) return
    const scale = Math.min(container.clientWidth / plotState.sizeMm.width, container.clientHeight / plotState.sizeMm.height)
    const dx = (x - dragRef.current.x) / scale
    const dy = (y - dragRef.current.y) / scale
    const layer = plotState.layers[0]
    if (!layer) return
    const model = buildPlotRenderModel(plotState, preset, container.clientWidth, container.clientHeight)
    const entry = model.series[0]
    if (!entry) return
    const xRange = entry.xBounds.max - entry.xBounds.min
    const yRange = entry.yBounds.max - entry.yBounds.min
    const next: CsLabPlotDocument = {
      ...plotState,
      layers: [
        {
          ...layer,
          xAxis: {
            ...layer.xAxis,
            min: (layer.xAxis.min ?? entry.xBounds.min) - (dx / model.plotRect.width) * xRange,
            max: (layer.xAxis.max ?? entry.xBounds.max) - (dx / model.plotRect.width) * xRange,
          },
          yAxes: [
            {
              ...layer.yAxes[0]!,
              min: (layer.yAxes[0]!.min ?? entry.yBounds.min) + (dy / model.plotRect.height) * yRange,
              max: (layer.yAxes[0]!.max ?? entry.yBounds.max) + (dy / model.plotRect.height) * yRange,
            },
            layer.yAxes[1]!,
          ],
        },
        ...plotState.layers.slice(1),
      ],
      updatedAt: Date.now(),
    }
    updatePlot(next)
    dragRef.current = { ...dragRef.current, x, y, startPlot: next }
  }

  const handleMouseUp = (): void => {
    dragRef.current = null
    if (!roiMode || !selection || !plotState) return
    const container = containerRef.current
    if (!container) return
    const model = buildPlotRenderModel(plotState, preset, container.clientWidth, container.clientHeight)
    const start = pixelToData(model, plotState, Math.min(selection.x1, selection.x2), Math.min(selection.y1, selection.y2))
    const end = pixelToData(model, plotState, Math.max(selection.x1, selection.x2), Math.max(selection.y1, selection.y2))
    if (start && end) {
      setLastRoi({
        xMin: Math.min(start.x, end.x),
        xMax: Math.max(start.x, end.x),
        yMin: Math.min(start.y, end.y),
        yMax: Math.max(start.y, end.y),
      })
    }
    if (start && end && firstSeries) {
      const xMin = Math.min(start.x, end.x)
      const xMax = Math.max(start.x, end.x)
      const xs: number[] = []
      const ys: number[] = []
      for (let index = 0; index < firstSeries.x.length; index += 1) {
        const value = firstSeries.x[index]!
        if (value >= xMin && value <= xMax) {
          xs.push(value)
          ys.push(firstSeries.y[index] ?? 0)
        }
      }
      if (xs.length > 5) openFit({ x: xs, y: ys })
    }
    setSelection(null)
    setRoiMode(false)
  }

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>): void => {
    event.preventDefault()
    if (!plotState) return
    const layer = plotState.layers[0]
    const container = containerRef.current
    if (!layer || !container) return
    const model = buildPlotRenderModel(plotState, preset, container.clientWidth, container.clientHeight)
    const entry = model.series[0]
    if (!entry) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const factor = event.deltaY > 0 ? 1.2 : 1 / 1.2
    const min = layer.xAxis.min ?? entry.xBounds.min
    const max = layer.xAxis.max ?? entry.xBounds.max
    const anchor = min + ratio * (max - min)
    const nextMin = anchor - (anchor - min) * factor
    const nextMax = anchor + (max - anchor) * factor
    updatePlot({
      ...plotState,
      layers: [
        { ...layer, xAxis: { ...layer.xAxis, min: nextMin, max: nextMax } },
        ...plotState.layers.slice(1),
      ],
      updatedAt: Date.now(),
    })
  }

  const handleSave = async (): Promise<void> => {
    if (!plotState) return
    setSaving(true)
    try {
      const summary = await window.electronAPI.cslab.savePlot({ labId, plot: plotState })
      onToast('success', `已保存：${summary.title}`)
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  /** 把当前选区（或整条可见曲线范围）作为上下文发送给科学助理。 */
  const sendSelectionToAgent = async (): Promise<void> => {
    if (!plotState) return
    let roi = lastRoi
    if (!roi) {
      const layer = plotState.layers[0]
      const series = layer?.series.find((item) => item.visible !== false)
      if (layer && series && series.x.length > 0) {
        let min = series.x[0]!
        let max = min
        for (const value of series.x) {
          if (value < min) min = value
          if (value > max) max = value
        }
        roi = {
          xMin: layer.xAxis.min ?? min,
          xMax: layer.xAxis.max ?? max,
        }
      }
    }
    const roiText = roi ? `在 x = ${roi.xMin.toFixed(2)} ~ ${roi.xMax.toFixed(2)} 区间` : ''
    try {
      const result = await window.electronAPI.cslab.sendToAgentWindow({
        labId,
        source: 'plot-roi',
        prompt: `请读取绘图《${plotState.title}》（plotId=${plotState.id}），${roiText}执行多峰解叠拟合，并用 cslab_render_plot 把拟合曲线追加到画板。`,
        plotId: plotState.id,
        plotTitle: plotState.title,
        roi: roi ?? undefined,
        createdAt: Date.now(),
      })
      onToast(
        result.delivered ? 'success' : 'info',
        result.delivered ? '已发送至科学助理' : '科学助理未就绪，请重试',
      )
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '发送至助理失败')
    }
  }

  const changePreset = (presetId: CsLabJournalPresetId): void => {
    if (!plotState) return
    const nextPreset = JOURNAL_PRESETS[presetId]
    updatePlot({
      ...plotState,
      presetId,
      sizeMm: { width: nextPreset.singleColumnMm, height: Math.round(nextPreset.singleColumnMm * 0.75 * 10) / 10 },
      updatedAt: Date.now(),
    })
  }

  if (!plotState) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-xs text-muted-foreground">
        <Sigma className="h-6 w-6" />
        <p>当前窗格没有出版图。</p>
        <button
          type="button"
          onClick={() => {
            const created = createPlotDocument({
              id: `plot-${Date.now()}`,
              labId,
              title: '新绘图',
            })
            updatePlot(created)
          }}
          className="rounded-md border px-3 py-1.5 hover:bg-muted"
        >
          新建空白绘图
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5 border-b px-2 py-1.5">
          <select
            value={plotState.presetId}
            onChange={(event) => changePreset(event.target.value as CsLabJournalPresetId)}
            className="rounded-md border bg-background px-2 py-1 text-[11px]"
          >
            {Object.values(JOURNAL_PRESETS).map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setRoiMode((value) => !value)}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px]',
              roiMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
            )}
          >
            <ScanLine className="h-3 w-3" /> 框选
          </button>
          <button
            type="button"
            onClick={() => void sendSelectionToAgent()}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted"
            title="把当前选区与绘图上下文发送给科学助理"
          >
            <Sparkles className="h-3 w-3" /> 发送至助理
          </button>
          <button
            type="button"
            onClick={() => openFit()}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted"
          >
            <Sigma className="h-3 w-3" /> 拟合
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} 保存
          </button>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted"
          >
            <Download className="h-3 w-3" /> 导出
          </button>
        </div>

        <div ref={containerRef} className="relative min-h-0 flex-1 bg-white">
          <canvas
            ref={canvasRef}
            className={cn('absolute inset-0', roiMode ? 'cursor-crosshair' : 'cursor-grab')}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={() => {
              const layer = plotState.layers[0]
              if (!layer) return
              updatePlot({
                ...plotState,
                layers: [
                  {
                    ...layer,
                    xAxis: { ...layer.xAxis, min: undefined, max: undefined },
                    yAxes: [
                      { ...layer.yAxes[0]!, min: undefined, max: undefined },
                      layer.yAxes[1]!,
                    ],
                  },
                  ...plotState.layers.slice(1),
                ],
                updatedAt: Date.now(),
              })
            }}
            onWheel={handleWheel}
          />
        </div>
      </div>

      <aside className="hidden w-[220px] shrink-0 border-l lg:block">
        <div className="flex items-center gap-1 border-b px-2 py-1.5 text-[11px] text-muted-foreground">
          <SlidersHorizontal className="h-3 w-3" /> 图层与坐标轴
        </div>
        <CsLabPlotControls document={plotState} onChange={updatePlot} />
      </aside>

      <CsLabPeakFitDrawer
        open={fitOpen}
        data={fitData}
        onClose={() => setFitOpen(false)}
        onApply={handleFitApply}
        onToast={onToast}
      />

      <CsLabPlotExportDialog
        open={exportOpen}
        labId={labId}
        document={plotState}
        onClose={() => setExportOpen(false)}
        onToast={onToast}
      />
    </div>
  )
}
