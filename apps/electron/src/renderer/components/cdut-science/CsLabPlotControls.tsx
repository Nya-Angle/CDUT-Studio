/**
 * CSLab 绘图图层面板
 */

import * as React from 'react'
import type { CsLabPlotAxisScale, CsLabPlotDocument } from '@profer/shared'

interface CsLabPlotControlsProps {
  document: CsLabPlotDocument
  onChange: (next: CsLabPlotDocument) => void
}

const SCALES: Array<{ id: CsLabPlotAxisScale; label: string }> = [
  { id: 'linear', label: '线性' },
  { id: 'log10', label: 'Log10' },
  { id: 'log2', label: 'Log2' },
]

export function CsLabPlotControls({ document, onChange }: CsLabPlotControlsProps): React.ReactElement {
  const layer = document.layers[0]
  if (!layer) return <div className="p-3 text-xs text-muted-foreground">暂无图层</div>

  const updateLayer = (patch: Partial<typeof layer>): void => {
    onChange({
      ...document,
      layers: document.layers.map((item, index) => (index === 0 ? { ...item, ...patch } : item)),
      updatedAt: Date.now(),
    })
  }

  return (
    <div className="space-y-4 p-3 text-xs">
      <section className="space-y-2">
        <h4 className="font-medium">图层</h4>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={(event) => updateLayer({ visible: event.target.checked })}
          />
          <span>{layer.name}</span>
        </label>
        {layer.series.map((series) => (
          <label key={series.id} className="flex items-center justify-between gap-2 pl-4">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={series.visible}
                onChange={(event) =>
                  updateLayer({
                    series: layer.series.map((item) =>
                      item.id === series.id ? { ...item, visible: event.target.checked } : item,
                    ),
                  })
                }
              />
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
              <span className="max-w-[120px] truncate">{series.name}</span>
            </span>
            <span className="text-muted-foreground">Y{series.yAxis + 1}</span>
          </label>
        ))}
      </section>

      <section className="space-y-2">
        <h4 className="font-medium">坐标轴</h4>
        <label className="flex items-center justify-between gap-2">
          <span>X 轴</span>
          <select
            value={layer.xAxis.scale}
            onChange={(event) =>
              updateLayer({ xAxis: { ...layer.xAxis, scale: event.target.value as CsLabPlotAxisScale } })
            }
            className="rounded-md border bg-background px-2 py-1"
          >
            {SCALES.map((scale) => (
              <option key={scale.id} value={scale.id}>
                {scale.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>左 Y 轴</span>
          <select
            value={layer.yAxes[0]!.scale}
            onChange={(event) =>
              updateLayer({
                yAxes: [
                  { ...layer.yAxes[0]!, scale: event.target.value as CsLabPlotAxisScale },
                  layer.yAxes[1]!,
                ],
              })
            }
            className="rounded-md border bg-background px-2 py-1"
          >
            {SCALES.map((scale) => (
              <option key={scale.id} value={scale.id}>
                {scale.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>右 Y 轴</span>
          <select
            value={layer.yAxes[1]!.scale}
            onChange={(event) =>
              updateLayer({
                yAxes: [
                  layer.yAxes[0]!,
                  { ...layer.yAxes[1]!, scale: event.target.value as CsLabPlotAxisScale },
                ],
              })
            }
            className="rounded-md border bg-background px-2 py-1"
          >
            {SCALES.map((scale) => (
              <option key={scale.id} value={scale.id}>
                {scale.label}
              </option>
            ))}
          </select>
        </label>
      </section>
    </div>
  )
}
