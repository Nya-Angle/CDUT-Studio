/**
 * CSLab 多峰解叠拟合抽屉
 */

import * as React from 'react'
import { Loader2, Plus, Trash2, X } from 'lucide-react'
import type {
  CsLabBaselineKind,
  CsLabFitResult,
  CsLabPeakProfileName,
  CsLabPeakSpec,
} from '@profer/shared'
import { formatMetric } from '@profer/shared'
import { cslabWorkers } from '@/lib/cslab/cslab-worker-client'

export interface CsLabFitData {
  x: number[]
  y: number[]
}

interface CsLabPeakFitDrawerProps {
  open: boolean
  data: CsLabFitData | null
  onClose: () => void
  onApply: (result: CsLabFitResult, data: CsLabFitData) => void
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

function detectPeaks(data: CsLabFitData, limit = 6): CsLabPeakSpec[] {
  const { x, y } = data
  if (y.length < 5) return []
  const peaks: Array<{ x: number; y: number }> = []
  const window = Math.max(2, Math.floor(x.length / 120))
  for (let index = window; index < y.length - window; index += 1) {
    let isMax = true
    for (let offset = -window; offset <= window; offset += 1) {
      if (offset === 0) continue
      if (y[index + offset]! > y[index]!) {
        isMax = false
        break
      }
    }
    if (isMax) peaks.push({ x: x[index]!, y: y[index]! })
  }
  peaks.sort((left, right) => right.y - left.y)
  const span = (x[x.length - 1] ?? 0) - (x[0] ?? 0)
  const minDistance = span / 30
  const selected: CsLabPeakSpec[] = []
  for (const peak of peaks) {
    if (selected.length >= limit) break
    if (selected.some((item) => Math.abs(item.center - peak.x) < minDistance)) continue
    selected.push({
      center: peak.x,
      height: Math.max(1e-6, peak.y),
      fwhm: Math.max(span / 80, 1e-6),
    })
  }
  return selected.sort((left, right) => left.center - right.center)
}

export function CsLabPeakFitDrawer({
  open,
  data,
  onClose,
  onApply,
  onToast,
}: CsLabPeakFitDrawerProps): React.ReactElement | null {
  const [model, setModel] = React.useState<CsLabPeakProfileName>('gaussian')
  const [baseline, setBaseline] = React.useState<CsLabBaselineKind>('constant')
  const [peaks, setPeaks] = React.useState<CsLabPeakSpec[]>([])
  const [busy, setBusy] = React.useState(false)
  const [result, setResult] = React.useState<CsLabFitResult | null>(null)

  React.useEffect(() => {
    if (!open || !data) return
    setPeaks(detectPeaks(data))
    setResult(null)
  }, [open, data])

  if (!open) return null

  const addPeak = (): void => {
    if (!data) return
    const span = (data.x[data.x.length - 1] ?? 1) - (data.x[0] ?? 0)
    const center = (data.x[0] ?? 0) + span / 2
    setPeaks((previous) => [
      ...previous,
      { center, height: Math.max(1e-6, Math.max(...data.y) * 0.5), fwhm: Math.max(span / 80, 1e-6) },
    ])
  }

  const removePeak = (index: number): void => {
    setPeaks((previous) => previous.filter((_item, itemIndex) => itemIndex !== index))
  }

  const runFit = async (): Promise<void> => {
    if (!data || peaks.length === 0) {
      onToast('info', '请先添加至少一个峰')
      return
    }
    setBusy(true)
    try {
      const fitted = await cslabWorkers.fit({
        x: data.x,
        y: data.y,
        peaks,
        model,
        baseline,
        polynomialOrder: baseline === 'polynomial' ? 2 : undefined,
      })
      setResult(fitted)
      onToast(
        fitted.converged ? 'success' : 'info',
        fitted.converged ? `拟合完成，R² = ${formatMetric(fitted.rSquared, 4)}` : '拟合未完全收敛，请检查初始峰',
      )
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '拟合失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="absolute inset-y-0 right-0 z-30 flex w-[360px] flex-col border-l border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-semibold">多峰解叠拟合</h3>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1">
            <span className="text-muted-foreground">峰形</span>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value as CsLabPeakProfileName)}
              className="w-full rounded-md border bg-background px-2 py-1"
            >
              <option value="gaussian">高斯</option>
              <option value="lorentzian">洛伦兹</option>
              <option value="pseudo_voigt">Pseudo-Voigt</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-muted-foreground">基线</span>
            <select
              value={baseline}
              onChange={(event) => setBaseline(event.target.value as CsLabBaselineKind)}
              className="w-full rounded-md border bg-background px-2 py-1"
            >
              <option value="none">不扣除</option>
              <option value="constant">常数</option>
              <option value="linear">线性</option>
              <option value="polynomial">二次多项式</option>
              <option value="asls">AsLS</option>
            </select>
          </label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">初始峰（{peaks.length}）</span>
            <button
              type="button"
              onClick={addPeak}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-muted"
            >
              <Plus className="h-3 w-3" /> 加峰
            </button>
          </div>
          {peaks.map((peak, index) => (
            <div key={`${peak.center}-${index}`} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <label className="space-y-1">
                <span className="text-muted-foreground">中心</span>
                <input
                  type="number"
                  value={Number(peak.center.toFixed(5))}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    setPeaks((previous) =>
                      previous.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, center: value } : item,
                      ),
                    )
                  }}
                  className="w-full rounded-md border bg-background px-2 py-1"
                />
              </label>
              <label className="space-y-1">
                <span className="text-muted-foreground">半高宽</span>
                <input
                  type="number"
                  value={Number(peak.fwhm.toFixed(5))}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    setPeaks((previous) =>
                      previous.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, fwhm: value } : item,
                      ),
                    )
                  }}
                  className="w-full rounded-md border bg-background px-2 py-1"
                />
              </label>
              <button
                type="button"
                onClick={() => removePeak(index)}
                className="rounded-md border p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="删除峰"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => void runFit()}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          执行拟合
        </button>

        {result ? (
          <div className="space-y-2">
            <div className="rounded-md bg-muted/40 p-2">
              R² = {formatMetric(result.rSquared, 5)} · RMSE = {formatMetric(result.rmse, 4)} ·{' '}
              {result.converged ? '已收敛' : '未完全收敛'}
            </div>
            <table className="w-full text-[11px]">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left">中心</th>
                  <th className="text-right">高度</th>
                  <th className="text-right">FWHM</th>
                  <th className="text-right">面积</th>
                  <th className="text-right">占比</th>
                </tr>
              </thead>
              <tbody>
                {result.peaks.map((peak, index) => (
                  <tr key={`${peak.center}-${index}`} className="border-t">
                    <td>{formatMetric(peak.center, 3)}</td>
                    <td className="text-right">{formatMetric(peak.height, 3)}</td>
                    <td className="text-right">{formatMetric(peak.fwhm, 3)}</td>
                    <td className="text-right">{formatMetric(peak.area, 3)}</td>
                    <td className="text-right">{(peak.areaFraction * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => data && onApply(result, data)}
              className="w-full rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              应用为图层
            </button>
          </div>
        ) : null}

      </div>
    </div>
  )
}
