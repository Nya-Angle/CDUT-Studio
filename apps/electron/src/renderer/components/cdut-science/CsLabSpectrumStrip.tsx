/**
 * CsLabSpectrumStrip — 多通道 1D 谱图（XRD / 拉曼 / 红外 / MAT 多列曲线）
 *
 * 只负责画线与命中：不做任何峰识别或拟合；
 * 点击返回的是真实 X 轴数值，由上层决定如何解释（晶面匹配或谱带高亮）。
 *
 * 多通道量纲红线：
 * - 默认共享绝对 Y 轴；
 * - 支持线性 / 对数 / 归一化（各通道 0–100%）三种量程，避免微弱信号被压成死线；
 * - 每个通道胶囊展示真实 [min, max]，不隐藏量纲差异。
 */

import * as React from 'react'
import type { CsLabTableSeries, CsLabXrdReflection } from '@profer/shared'
import { cn } from '@/lib/utils'
import type { CsLabVibrationalBand } from './cslab-vibrational'

interface CsLabSpectrumStripProps {
  series: CsLabTableSeries | null
  highlights?: CsLabVibrationalBand[]
  reflections?: CsLabXrdReflection[]
  selectedX?: number
  loading?: boolean
  onPick?: (x: number) => void
  height?: number
  activeKeys?: string[]
  onActiveKeysChange?: (keys: string[]) => void
  showChannelToggles?: boolean
  emptyHint?: string
}

type ScaleMode = 'linear' | 'log' | 'normalized'

const VIEW_WIDTH = 1000
const PADDING = { left: 44, right: 14, top: 14, bottom: 22 }
const CHANNEL_COLORS = [
  '#C2502F',
  '#2D7FA6',
  '#4F7D55',
  '#B8873A',
  '#5B5F97',
  '#8C4A7F',
  '#3F6E75',
  '#7A5C3E',
]

const SCALE_OPTIONS: Array<{ value: ScaleMode; label: string; title: string }> = [
  { value: 'linear', label: '线性', title: '所有通道共享绝对 Y 轴' },
  { value: 'log', label: '对数', title: '共享 log10 正值区间，非正值断笔' },
  { value: 'normalized', label: '归一化', title: '每个通道按自身量程映射到 0–100%' },
]

function formatTick(value: number): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs >= 10000) return value.toExponential(1)
  if (abs >= 100) return value.toFixed(0)
  if (abs >= 10) return value.toFixed(1)
  return value.toFixed(2)
}

function formatRange(min: number, max: number): string {
  return `${formatTick(min)} ~ ${formatTick(max)}`
}

function nearestIndex(xs: number[], target: number): number {
  if (xs.length === 0) return -1
  const first = xs[0] ?? Number.NaN
  const last = xs[xs.length - 1] ?? Number.NaN
  const ascending = !Number.isFinite(first) || !Number.isFinite(last) || first <= last
  let low = 0
  let high = xs.length - 1
  while (low < high) {
    const middle = (low + high) >> 1
    const value = xs[middle] ?? Number.NaN
    if (!Number.isFinite(value)) {
      low += 1
      continue
    }
    if (ascending ? value < target : value > target) low = middle + 1
    else high = middle
  }
  const candidate = low
  const previous = Math.max(0, low - 1)
  const currentValue = xs[candidate] ?? Number.NaN
  const previousValue = xs[previous] ?? Number.NaN
  if (!Number.isFinite(previousValue)) return candidate
  if (!Number.isFinite(currentValue)) return previous
  return Math.abs(currentValue - target) <= Math.abs(previousValue - target)
    ? candidate
    : previous
}

interface ChannelStat {
  key: string
  label: string
  unit?: string
  color: string
  min: number
  max: number
  hasPositive: boolean
}

export function CsLabSpectrumStrip({
  series,
  highlights = [],
  reflections = [],
  selectedX,
  loading = false,
  onPick,
  height = 150,
  activeKeys,
  onActiveKeysChange,
  showChannelToggles = true,
  emptyHint = '选择一张数据表以显示谱图',
}: CsLabSpectrumStripProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [scaleMode, setScaleMode] = React.useState<ScaleMode>('linear')
  const [internalActive, setInternalActive] = React.useState<string[]>([])
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  const controlled = activeKeys !== undefined
  const viewHeight = Math.max(120, Math.round(height))

  const channels = React.useMemo(() => {
    if (!series) return [] as Array<{ key: string; label: string; unit?: string; color: string }>
    return series.columns
      .filter((column) => column.key !== 'x')
      .map((column, index) => ({
        key: column.key,
        label: column.label || column.key,
        unit: column.unit,
        color: CHANNEL_COLORS[index % CHANNEL_COLORS.length]!,
      }))
  }, [series])

  const channelKeys = React.useMemo(() => channels.map((channel) => channel.key), [channels])

  React.useEffect(() => {
    if (controlled) return
    setInternalActive((previous) => {
      if (previous.length === 0) return channelKeys
      const next = previous.filter((key) => channelKeys.includes(key))
      return next.length > 0 ? next : channelKeys
    })
  }, [channelKeys, controlled])

  const activeSet = React.useMemo(
    () => new Set(controlled ? activeKeys ?? [] : internalActive),
    [controlled, activeKeys, internalActive],
  )

  const toggleChannel = (key: string): void => {
    const next = new Set(activeSet)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    const ordered = channelKeys.filter((item) => next.has(item))
    if (controlled) onActiveKeysChange?.(ordered)
    else setInternalActive(ordered)
  }

  const showAllChannels = (): void => {
    if (controlled) onActiveKeysChange?.(channelKeys)
    else setInternalActive(channelKeys)
  }

  const model = React.useMemo(() => {
    if (!series || series.x.length < 2) return null
    let minX = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    for (const x of series.x) {
      if (!Number.isFinite(x)) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
    }
    if (!Number.isFinite(minX) || !Number.isFinite(maxX) || maxX <= minX) return null

    const stats: ChannelStat[] = channels.map((channel) => {
      const values = series.series[channel.key] ?? []
      let min = Number.POSITIVE_INFINITY
      let max = Number.NEGATIVE_INFINITY
      let hasPositive = false
      for (const value of values) {
        if (!Number.isFinite(value)) continue
        if (value > 0) hasPositive = true
        if (value < min) min = value
        if (value > max) max = value
      }
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        min = 0
        max = 0
      }
      return { ...channel, min, max, hasPositive }
    })

    const activeStats = stats.filter((stat) => activeSet.has(stat.key))
    const activeHasPositive = activeStats.some((stat) => stat.hasPositive)

    let yMin = Number.POSITIVE_INFINITY
    let yMax = Number.NEGATIVE_INFINITY
    if (scaleMode === 'normalized') {
      yMin = 0
      yMax = 100
    } else {
      for (const stat of activeStats) {
        if (scaleMode === 'log') {
          if (!stat.hasPositive) continue
          const low = stat.min > 0 ? Math.log10(stat.min) : Math.log10(Number.MIN_VALUE)
          const high = Math.log10(stat.max)
          if (Number.isFinite(low)) yMin = Math.min(yMin, low)
          if (Number.isFinite(high)) yMax = Math.max(yMax, high)
        } else {
          yMin = Math.min(yMin, stat.min)
          yMax = Math.max(yMax, stat.max)
        }
      }
      if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
        yMin = 0
        yMax = 1
      }
      if (yMax === yMin) yMax = yMin + 1
    }

    const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right
    const plotHeight = viewHeight - PADDING.top - PADDING.bottom
    const toX = (x: number): number =>
      PADDING.left + ((x - minX) / (maxX - minX)) * plotWidth
    const toYFromScale = (value: number): number =>
      PADDING.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight

    const paths = activeStats.map((stat) => {
      const values = series.series[stat.key] ?? []
      let path = ''
      let penDown = false
      for (let index = 0; index < series.x.length; index += 1) {
        const x = series.x[index] ?? Number.NaN
        const raw = values[index] ?? Number.NaN
        if (!Number.isFinite(x) || !Number.isFinite(raw)) {
          penDown = false
          continue
        }
        let scaled: number
        if (scaleMode === 'normalized') {
          const span = stat.max - stat.min
          scaled = span === 0 ? 50 : ((raw - stat.min) / span) * 100
        } else if (scaleMode === 'log') {
          if (raw <= 0) {
            penDown = false
            continue
          }
          scaled = Math.log10(raw)
          if (!Number.isFinite(scaled)) {
            penDown = false
            continue
          }
        } else {
          scaled = raw
        }
        path += `${penDown ? 'L' : 'M'} ${toX(x).toFixed(2)} ${toYFromScale(scaled).toFixed(2)} `
        penDown = true
      }
      return { key: stat.key, color: stat.color, path }
    })

    const ranges = activeStats
      .map((stat) => Math.abs(stat.max - stat.min))
      .filter((range) => Number.isFinite(range) && range > 0)
    const spreadWarning =
      ranges.length > 1 && Math.max(...ranges) / Math.max(1e-12, Math.min(...ranges)) > 100

    const xColumn = series.columns.find((column) => column.key === 'x')
    return {
      minX,
      maxX,
      yMin,
      yMax,
      stats,
      activeStats,
      activeHasPositive,
      spreadWarning,
      toX,
      toY: toYFromScale,
      paths,
      xLabel: `${xColumn?.label ?? 'X'}${xColumn?.unit ? ` / ${xColumn.unit}` : ''}`,
    }
  }, [series, channels, activeSet, scaleMode, viewHeight])

  const hover =
    model && hoverIndex != null && totalIndexValid(series, hoverIndex)
      ? {
          index: hoverIndex,
          x: series!.x[hoverIndex]!,
          values: model.activeStats.map((stat) => ({
            key: stat.key,
            label: stat.label,
            unit: stat.unit,
            color: stat.color,
            value: series!.series[stat.key]?.[hoverIndex] ?? Number.NaN,
          })),
        }
      : null

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>): void => {
    if (!model || !series) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width <= 0) return
    const ratio = (event.clientX - rect.left) / rect.width
    const viewX = ratio * VIEW_WIDTH
    const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right
    if (viewX < PADDING.left || viewX > PADDING.left + plotWidth) {
      setHoverIndex(null)
      return
    }
    const clamped = (viewX - PADDING.left) / plotWidth
    const dataX = model.minX + clamped * (model.maxX - model.minX)
    const index = nearestIndex(series.x, dataX)
    setHoverIndex(index >= 0 ? index : null)
  }

  const handleClick = (event: React.MouseEvent<SVGSVGElement>): void => {
    if (!model || !onPick || !containerRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / Math.max(1, rect.width)
    const viewX = ratio * VIEW_WIDTH
    const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right
    const clamped = Math.min(1, Math.max(0, (viewX - PADDING.left) / plotWidth))
    onPick(model.minX + clamped * (model.maxX - model.minX))
  }

  const tooltipLeft = model && hover
    ? Math.min(
        92,
        Math.max(
          8,
          (model.toX(hover.x) / VIEW_WIDTH) * 100,
        ),
      )
    : 50

  const yAxisLabel =
    scaleMode === 'normalized'
      ? '归一化 %'
      : scaleMode === 'log'
        ? 'log10'
        : model?.activeStats[0]?.label ?? 'Y'

  return (
    <div
      ref={containerRef}
      className="rounded-lg border border-cslab-border bg-cslab-bg px-2 py-1.5"
    >
      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-cslab-muted">
        <span>
          {model
            ? `${model.activeStats.length}/${model.stats.length} 通道 · ${model.xLabel}`
            : '尚未关联谱图'}
          {series?.downsampled && model && (
            <span className="ml-1 text-cslab-muted/70">
              （{series.totalRows.toLocaleString()} 点已降采样）
            </span>
          )}
        </span>
        {model?.spreadWarning && scaleMode !== 'normalized' && (
          <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] text-amber-700">
            通道量纲差异大，建议切换归一化
          </span>
        )}
        {loading && <span className="text-cslab-accent">载入谱图…</span>}
        <div className="ml-auto flex items-center gap-1">
          {SCALE_OPTIONS.map((option) => {
            const disabled = option.value === 'log' && !!model && !model.activeHasPositive
            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                title={disabled ? '当前可见通道没有正值，无法使用对数轴' : option.title}
                onClick={() => setScaleMode(option.value)}
                className={cn(
                  'rounded border px-1.5 py-0.5 text-[9px] transition-colors',
                  scaleMode === option.value
                    ? 'border-cslab-accent/50 bg-cslab-accent/10 text-cslab-accent'
                    : 'border-cslab-border text-cslab-muted hover:text-cslab-text',
                  disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {showChannelToggles && model && model.stats.length > 0 && (
        <div className="mb-1 flex flex-wrap items-center gap-1">
          {model.stats.map((stat) => {
            const active = activeSet.has(stat.key)
            return (
              <button
                key={stat.key}
                type="button"
                onClick={() => toggleChannel(stat.key)}
                title={`${stat.label} ${formatRange(stat.min, stat.max)}${stat.unit ? ` ${stat.unit}` : ''}`}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] transition-colors',
                  active
                    ? 'border-cslab-border bg-cslab-elevated text-cslab-text'
                    : 'border-cslab-border/60 text-cslab-muted/60',
                )}
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: active ? stat.color : '#C9C5BE' }}
                />
                <span className="max-w-[120px] truncate">{stat.label}</span>
                <span className="tabular-nums text-cslab-muted/80">
                  {formatRange(stat.min, stat.max)}
                </span>
              </button>
            )
          })}
          {model.stats.some((stat) => !activeSet.has(stat.key)) && (
            <button
              type="button"
              onClick={showAllChannels}
              className="rounded-full border border-dashed border-cslab-border px-1.5 py-0.5 text-[9px] text-cslab-muted hover:text-cslab-text"
            >
              全显
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`}
          preserveAspectRatio="none"
          onClick={handleClick}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
          style={{ height: `${viewHeight}px` }}
          className={cn('w-full', onPick && model ? 'cursor-crosshair' : 'cursor-default')}
          role="img"
          aria-label="一维谱图"
        >
          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={VIEW_WIDTH - PADDING.left - PADDING.right}
            height={viewHeight - PADDING.top - PADDING.bottom}
            fill="#FAF9F5"
            stroke="#E8E5DF"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />

          {model &&
            [0.25, 0.5, 0.75].map((ratio) => {
              const y =
                PADDING.top + (viewHeight - PADDING.top - PADDING.bottom) * ratio
              return (
                <line
                  key={`grid-${ratio}`}
                  x1={PADDING.left}
                  x2={VIEW_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="#EFEDE7"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}

          {model &&
            highlights.map((band) => {
              const from = Math.max(model.minX, Math.min(band.from, band.to))
              const to = Math.min(model.maxX, Math.max(band.from, band.to))
              if (to <= model.minX || from >= model.maxX) return null
              const x1 = model.toX(Math.max(from, model.minX))
              const x2 = model.toX(Math.min(to, model.maxX))
              return (
                <rect
                  key={`${band.label}-${band.from}-${band.to}`}
                  x={x1}
                  y={PADDING.top}
                  width={Math.max(1, x2 - x1)}
                  height={viewHeight - PADDING.top - PADDING.bottom}
                  fill="#D97757"
                  opacity={0.16}
                />
              )
            })}

          {model &&
            reflections.map((reflection) => {
              if (reflection.twoTheta < model.minX || reflection.twoTheta > model.maxX) {
                return null
              }
              const x = model.toX(reflection.twoTheta)
              return (
                <line
                  key={`reflection-${reflection.h}-${reflection.k}-${reflection.l}-${reflection.twoTheta}`}
                  x1={x}
                  x2={x}
                  y1={PADDING.top}
                  y2={viewHeight - PADDING.bottom}
                  stroke="#8A6A3B"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  opacity={0.55}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}

          {model &&
            reflections.slice(0, 16).map((reflection, index) => {
              if (reflection.twoTheta < model.minX || reflection.twoTheta > model.maxX) {
                return null
              }
              return (
                <text
                  key={`reflection-label-${index}`}
                  x={model.toX(reflection.twoTheta)}
                  y={index % 2 === 0 ? 9 : 18}
                  fontSize={8}
                  fill="#8A6A3B"
                  textAnchor="middle"
                >
                  ({reflection.h}
                  {reflection.k}
                  {reflection.l})
                </text>
              )
            })}

          {model &&
            model.paths.map((path) => (
              <path
                key={path.key}
                d={path.path}
                fill="none"
                stroke={path.color}
                strokeWidth={1.1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

          {model && Number.isFinite(selectedX) && (
            <>
              <line
                x1={model.toX(selectedX!)}
                x2={model.toX(selectedX!)}
                y1={PADDING.top}
                y2={viewHeight - PADDING.bottom}
                stroke="#D97757"
                strokeWidth={1}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={model.toX(selectedX!)}
                cy={PADDING.top + 4}
                r={2.5}
                fill="#D97757"
              />
            </>
          )}

          {model && hover && (
            <line
              x1={model.toX(hover.x)}
              x2={model.toX(hover.x)}
              y1={PADDING.top}
              y2={viewHeight - PADDING.bottom}
              stroke="#242220"
              strokeWidth={0.8}
              strokeDasharray="2 2"
              opacity={0.45}
              vectorEffect="non-scaling-stroke"
            />
          )}

          {model && (
            <>
              <text
                x={PADDING.left}
                y={viewHeight - 6}
                fontSize={9}
                fill="#7A7672"
                textAnchor="start"
              >
                {formatTick(model.minX)}
              </text>
              <text
                x={VIEW_WIDTH - PADDING.right}
                y={viewHeight - 6}
                fontSize={9}
                fill="#7A7672"
                textAnchor="end"
              >
                {formatTick(model.maxX)}
              </text>
              <text x={4} y={PADDING.top + 8} fontSize={8} fill="#7A7672">
                {scaleMode === 'normalized' ? '100%' : formatTick(
                  scaleMode === 'log' ? 10 ** model.yMax : model.yMax,
                )}
              </text>
              <text x={4} y={viewHeight - PADDING.bottom} fontSize={8} fill="#7A7672">
                {scaleMode === 'normalized' ? '0%' : formatTick(
                  scaleMode === 'log' ? 10 ** model.yMin : model.yMin,
                )}
              </text>
              <text x={4} y={viewHeight - 6} fontSize={8} fill="#7A7672">
                {yAxisLabel}
              </text>
            </>
          )}

          {!model && !loading && (
            <text
              x={VIEW_WIDTH / 2}
              y={viewHeight / 2}
              fontSize={11}
              fill="#7A7672"
              textAnchor="middle"
            >
              {emptyHint}
            </text>
          )}
        </svg>
        {hover && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[120px] -translate-x-1/2 rounded-md border border-cslab-border bg-cslab-elevated/95 px-2 py-1 text-[9px] leading-relaxed text-cslab-text shadow-subtle"
            style={{ left: `${tooltipLeft}%` }}
          >
            <p className="font-mono text-[9px] text-cslab-muted">X = {formatTick(hover.x)}</p>
            {hover.values.map((item) => (
              <p key={item.key} className="flex items-center gap-1">
                <span
                  className="inline-block size-1.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="max-w-[110px] truncate text-cslab-muted">{item.label}</span>
                <span className="ml-auto font-mono tabular-nums">
                  {formatTick(item.value)}
                  {item.unit ? ` ${item.unit}` : ''}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] text-cslab-muted">
          {highlights.map((band) => (
            <span key={`${band.label}-${band.from}`} className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-3 rounded-sm bg-cslab-accent/30" />
              {band.label} {band.from}–{band.to} cm⁻¹
            </span>
          ))}
          <span className="text-cslab-muted/70">（内置参考区间，非本样品实测）</span>
        </div>
      )}

      {reflections.length > 0 && (
        <p className="mt-1 text-[9px] text-cslab-muted">
          晶面标注由 CIF 晶胞几何枚举，未含结构因子/强度，仅作坐标参考。
        </p>
      )}
    </div>
  )
}

function totalIndexValid(series: CsLabTableSeries | null, index: number): boolean {
  return !!series && index >= 0 && index < series.x.length
}
