/**
 * CsLabDatasetView — 科学数据集复合窗格
 *
 * 默认分屏：上方多通道曲线，下方只读数据铁笼；
 * 可在「曲线谱图 / 数据表格 / 分屏联动」之间切换。
 * 动作栏把后端已有能力（晶体关联、Python 工具、数据导出、实验批次）接到当前文件上。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import {
  Activity,
  Atom,
  Columns2,
  Download,
  FlaskConical,
  Loader2,
  Sigma,
  Table2,
  Wrench,
  X,
} from 'lucide-react'
import {
  CSLAB_XRAY_WAVELENGTHS,
  createPlotDocument,
  enumerateReflections,
  parseCifLattice,
  type CsLabAssetSummary,
  type CsLabCellRef,
  type CsLabCrystalCell,
  type CsLabTableExportFormat,
  type CsLabTablePayload,
  type CsLabTableSeries,
  type CsLabXrdReflection,
} from '@profer/shared'
import { cn } from '@/lib/utils'
import {
  cslabDrawerAtom,
  cslabPanePlotsAtom,
  cslabPanesAtom,
  cslabRunSeedAtom,
  cslabToolSeedAtom,
  type CsLabDatasetDisplayMode,
  type CsLabPaneState,
} from '@/atoms/cslab-atoms'
import { CsLabIronCageTable } from './CsLabIronCageTable'
import { CsLabSpectrumStrip } from './CsLabSpectrumStrip'

interface CsLabDatasetViewProps {
  labId: string
  pane: CsLabPaneState
  table: CsLabTablePayload
  title?: string
  onCellClick: (cell: CsLabCellRef) => void
  onToast: (
    kind: 'info' | 'success' | 'error',
    text: string,
    action?: { label: string; path: string },
  ) => void
}

const DISPLAY_OPTIONS: Array<{
  value: CsLabDatasetDisplayMode
  label: string
  icon: typeof Activity
}> = [
  { value: 'strip', label: '曲线谱图', icon: Activity },
  { value: 'table', label: '数据表格', icon: Table2 },
  { value: 'split', label: '分屏联动', icon: Columns2 },
]

const WAVELENGTH_OPTIONS = [
  { id: 'Cu-Kα', label: 'Cu Kα' },
  { id: 'Co-Kα', label: 'Co Kα' },
  { id: 'Mo-Kα', label: 'Mo Kα' },
] as const

type WavelengthId = (typeof WAVELENGTH_OPTIONS)[number]['id']

export function CsLabDatasetView({
  labId,
  pane,
  table,
  title,
  onCellClick,
  onToast,
}: CsLabDatasetViewProps): React.ReactElement {
  const setPanes = useSetAtom(cslabPanesAtom)
  const setPanePlots = useSetAtom(cslabPanePlotsAtom)
  const setDrawer = useSetAtom(cslabDrawerAtom)
  const setToolSeed = useSetAtom(cslabToolSeedAtom)
  const setRunSeed = useSetAtom(cslabRunSeedAtom)

  const [series, setSeries] = React.useState<CsLabTableSeries | null>(null)
  const [seriesLoading, setSeriesLoading] = React.useState(false)
  const [pickedRow, setPickedRow] = React.useState<number | null>(null)
  const [exporting, setExporting] = React.useState<CsLabTableExportFormat | null>(null)

  const [crystalOpen, setCrystalOpen] = React.useState(false)
  const [molAssets, setMolAssets] = React.useState<CsLabAssetSummary[]>([])
  const [molsLoaded, setMolsLoaded] = React.useState(false)
  const [selectedMolUri, setSelectedMolUri] = React.useState('')
  const [crystalTitle, setCrystalTitle] = React.useState('')
  const [crystalBusy, setCrystalBusy] = React.useState(false)
  const [cell, setCell] = React.useState<CsLabCrystalCell | null>(null)
  const [wavelengthId, setWavelengthId] = React.useState<WavelengthId>('Cu-Kα')
  const [reflections, setReflections] = React.useState<CsLabXrdReflection[]>([])

  const displayMode: CsLabDatasetDisplayMode = pane.datasetDisplayMode ?? 'split'

  const patchPane = React.useCallback(
    (patch: Partial<CsLabPaneState>): void => {
      setPanes((previous) => ({
        ...previous,
        [pane.id]: { ...previous[pane.id], ...patch },
      }))
    },
    [pane.id, setPanes],
  )

  // ===== 曲线数据 =====
  React.useEffect(() => {
    let cancelled = false
    setSeries(null)
    setSeriesLoading(true)
    setPickedRow(null)
    // 切换数据表时清除上一张表的晶体关联，避免跨数据集误标晶面。
    setSelectedMolUri('')
    setCrystalTitle('')
    setCell(null)
    setReflections([])
    void window.electronAPI.cslab
      .getTableSeries({ labId, tableUri: table.uri, maxPoints: 4000 })
      .then((payload) => {
        if (!cancelled) setSeries(payload)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          onToast('error', error instanceof Error ? error.message : '曲线读取失败')
        }
      })
      .finally(() => {
        if (!cancelled) setSeriesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [labId, table.uri, onToast])

  const xColumnIndex = React.useMemo(
    () => table.columns.findIndex((column) => column.key === 'x'),
    [table.columns],
  )

  const seriesBounds = React.useMemo(() => {
    if (!series) return null
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const value of series.x) {
      if (!Number.isFinite(value)) continue
      if (value < min) min = value
      if (value > max) max = value
    }
    return Number.isFinite(min) && Number.isFinite(max) && max > min ? { min, max } : null
  }, [series])

  const isTwoThetaAxis = React.useMemo(() => {
    const column = table.columns.find((item) => item.key === 'x')
    if (!column) return false
    const label = `${column.label} ${column.unit ?? ''}`.toLowerCase()
    return label.includes('2θ') || label.includes('2theta')
  }, [table.columns])

  // ===== 晶体关联 =====
  React.useEffect(() => {
    if (!crystalOpen || molsLoaded) return
    let cancelled = false
    void window.electronAPI.cslab
      .listAssets(labId)
      .then((assets) => {
        if (cancelled) return
        setMolAssets(assets.filter((asset) => asset.layerType === 'mol'))
        setMolsLoaded(true)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          onToast('error', error instanceof Error ? error.message : '结构资产读取失败')
        }
      })
    return () => {
      cancelled = true
    }
  }, [crystalOpen, labId, molsLoaded, onToast])

  React.useEffect(() => {
    if (!cell) {
      setReflections([])
      return
    }
    const min = seriesBounds?.min ?? 0
    const max = seriesBounds?.max ?? 90
    const list = enumerateReflections(cell, {
      maxIndex: 8,
      wavelengthAngstrom: CSLAB_XRAY_WAVELENGTHS[wavelengthId],
      minTwoTheta: Math.max(0, min),
      maxTwoTheta: Math.min(180, max),
      limit: 120,
    })
    setReflections(list)
  }, [cell, wavelengthId, seriesBounds])

  const handleSelectCrystal = async (uri: string): Promise<void> => {
    if (!uri) {
      setSelectedMolUri('')
      setCrystalTitle('')
      setCell(null)
      setReflections([])
      return
    }
    setSelectedMolUri(uri)
    setCrystalBusy(true)
    try {
      const mol = await window.electronAPI.cslab.getMolAsset({ labId, uri })
      if (!mol) throw new Error('结构文件不可读')
      setCrystalTitle(mol.title)
      if (mol.format !== 'cif') {
        setCell(null)
        onToast('info', 'PDB 结构没有晶胞参数，无法由 2θ 反算晶面')
        return
      }
      const lattice = parseCifLattice(mol.text)
      if (!lattice) {
        setCell(null)
        onToast('info', '该 CIF 缺少完整晶胞参数，无法枚举晶面')
        return
      }
      setCell(lattice)
      onToast(
        'success',
        `已关联 ${mol.title}：${lattice.a.toFixed(2)}×${lattice.b.toFixed(2)}×${lattice.c.toFixed(2)} Å`,
      )
    } catch (error) {
      setSelectedMolUri('')
      setCrystalTitle('')
      setCell(null)
      onToast('error', error instanceof Error ? error.message : '结构读取失败')
    } finally {
      setCrystalBusy(false)
    }
  }

  // ===== 动作 =====
  const handleRunTool = async (): Promise<void> => {
    try {
      const info = await window.electronAPI.cslab.getAssetFileInfo({
        labId,
        uri: table.uri,
      })
      setToolSeed({ path: info.path, label: info.name })
      setDrawer({ open: true, mode: 'tools', title: '科研工具运行时' })
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '无法定位数据表文件')
    }
  }

  const handleExport = async (format: CsLabTableExportFormat): Promise<void> => {
    setExporting(format)
    try {
      const result = await window.electronAPI.cslab.exportTable({
        labId,
        tableUri: table.uri,
        format,
      })
      if (!result.success) {
        onToast('info', result.message ?? '已取消导出')
        return
      }
      onToast('success', `${format.toUpperCase()} 已导出`, {
        label: '在文件夹中显示',
        path: result.path,
      })
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '数据导出失败')
    } finally {
      setExporting(null)
    }
  }

  const handleLinkRun = (): void => {
    setRunSeed({ assetUri: table.uri, title: title ?? '当前数据表' })
    setDrawer({ open: true, mode: 'runs', title: '实验规程与批次' })
  }

  const handleCreateOriginPlot = (): void => {
    if (!series) {
      onToast('info', '当前数据表尚未加载完成')
      return
    }
    const document = createPlotDocument({
      id: `plot-${Date.now()}`,
      labId,
      title: title ?? '出版绘图',
      presetId: 'nature',
    })
    const layer = document.layers[0]!
    const palette = ['#1f77b4', '#d62728', '#2ca02c', '#9467bd', '#ff7f0e', '#8c564b']
    const yColumns = series.columns.filter((column) => column.key !== 'x')
    const xColumn = series.columns.find((column) => column.key === 'x')
    const plotSeries = yColumns.map((column, index) => ({
      id: `series-${index + 1}`,
      name: column.label,
      x: series.x,
      y: series.series[column.key] ?? [],
      color: palette[index % palette.length]!,
      lineWidth: 0.8,
      lineStyle: 'solid' as const,
      marker: 'none' as const,
      yAxis: (index === 1 ? 1 : 0) as 0 | 1,
      visible: true,
      alpha: 1,
    }))
    const next = {
      ...document,
      layers: [
        {
          ...layer,
          series: plotSeries,
          xAxis: {
            ...layer.xAxis,
            title: xColumn?.label ?? 'x',
            unit: xColumn?.unit,
          },
          yAxes: [
            {
              ...layer.yAxes[0]!,
              title: yColumns[0]?.label ?? '强度',
              unit: yColumns[0]?.unit,
            },
            {
              ...layer.yAxes[1]!,
              title: yColumns[1]?.label ?? '',
              unit: yColumns[1]?.unit,
            },
          ] as typeof layer.yAxes,
        },
        ...document.layers.slice(1),
      ],
      updatedAt: Date.now(),
    }
    setPanePlots((previous) => ({ ...previous, [pane.id]: next }))
    setPanes((previous) => ({
      ...previous,
      [pane.id]: { ...previous[pane.id], viewType: 'origin-plot', plotId: next.id },
    }))
  }

  const handlePick = (x: number): void => {
    if (xColumnIndex < 0 || table.rows.length === 0) return
    let bestIndex = -1
    let bestDistance = Number.POSITIVE_INFINITY
    for (let index = 0; index < table.rows.length; index += 1) {
      const value = table.rows[index]?.[xColumnIndex]
      if (typeof value !== 'number' || !Number.isFinite(value)) continue
      const distance = Math.abs(value - x)
      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    }
    setPickedRow(bestIndex >= 0 ? bestIndex : null)
  }

  const showSpectrum = displayMode === 'strip' || displayMode === 'split'
  const showTable = displayMode === 'table' || displayMode === 'split'

  return (
    <div className="flex h-full min-h-0 flex-col bg-cslab-bg">
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-cslab-border px-2 py-1.5">
        <div className="flex overflow-hidden rounded-md border border-cslab-border">
          {DISPLAY_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => patchPane({ datasetDisplayMode: option.value })}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 text-[10px] transition-colors',
                  displayMode === option.value
                    ? 'bg-cslab-surface text-cslab-text'
                    : 'text-cslab-muted hover:text-cslab-text',
                )}
              >
                <Icon size={10} />
                {option.label}
              </button>
            )
          })}
        </div>

        <span className="mx-0.5 h-4 w-px bg-cslab-border" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setCrystalOpen((value) => !value)}
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] transition-colors',
            crystalOpen || selectedMolUri
              ? 'border-cslab-accent/40 bg-cslab-accent/10 text-cslab-accent'
              : 'border-cslab-border text-cslab-muted hover:text-cslab-text',
          )}
        >
          <Atom size={10} />
          关联晶体
        </button>
        <button
          type="button"
          onClick={handleCreateOriginPlot}
          className="inline-flex items-center gap-1 rounded-md border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted transition-colors hover:text-cslab-text"
        >
          <Sigma size={10} />
          出版绘图
        </button>
        <button
          type="button"
          onClick={() => void handleRunTool()}
          className="inline-flex items-center gap-1 rounded-md border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted transition-colors hover:text-cslab-text"
        >
          <Wrench size={10} />
          运行工具
        </button>
        {(['parquet', 'csv'] as const).map((format) => (
          <button
            key={format}
            type="button"
            disabled={exporting !== null}
            onClick={() => void handleExport(format)}
            className="inline-flex items-center gap-1 rounded-md border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted transition-colors hover:text-cslab-text disabled:opacity-50"
          >
            {exporting === format ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Download size={10} />
            )}
            {format === 'parquet' ? 'Parquet' : 'CSV'}
          </button>
        ))}
        <button
          type="button"
          onClick={handleLinkRun}
          className="inline-flex items-center gap-1 rounded-md border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted transition-colors hover:text-cslab-text"
        >
          <FlaskConical size={10} />
          关联批次
        </button>
      </div>

      {crystalOpen && (
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-cslab-border/70 bg-cslab-surface/40 px-2 py-1.5">
          <select
            value={selectedMolUri}
            onChange={(event) => void handleSelectCrystal(event.target.value)}
            className="min-w-0 max-w-[240px] flex-1 rounded-md border border-cslab-border bg-cslab-elevated px-2 py-1 text-[10px] text-cslab-text outline-none"
          >
            <option value="">选择 CIF / PDB 结构</option>
            {molAssets.map((asset) => (
              <option key={asset.uri} value={asset.uri}>
                {asset.title}
              </option>
            ))}
          </select>
          <select
            value={wavelengthId}
            onChange={(event) => setWavelengthId(event.target.value as WavelengthId)}
            className="rounded-md border border-cslab-border bg-cslab-elevated px-2 py-1 text-[10px] text-cslab-text outline-none"
            title="X 射线波长（用于 2θ ↔ d 换算）"
          >
            {WAVELENGTH_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {crystalBusy && <Loader2 size={11} className="animate-spin text-cslab-muted" />}
          {selectedMolUri && (
            <button
              type="button"
              onClick={() => void handleSelectCrystal('')}
              title="清除晶体关联"
              className="inline-flex items-center gap-1 rounded-md border border-cslab-border px-1.5 py-1 text-[10px] text-cslab-muted hover:text-cslab-text"
            >
              <X size={9} />
              清除
            </button>
          )}
          <span className="text-[9px] text-cslab-muted">
            {cell
              ? `${crystalTitle} · ${reflections.length} 个可能晶面`
              : '仅 CIF 含晶胞参数，可枚举晶面'}
          </span>
          {cell && !isTwoThetaAxis && (
            <span className="text-[9px] text-amber-700">
              当前 X 轴不是 2θ，晶面标注仅作坐标参考
            </span>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1">
        {displayMode === 'split' ? (
          <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 p-1.5">
              <CsLabSpectrumStrip
                series={series}
                reflections={reflections}
                loading={seriesLoading}
                height={200}
                emptyHint="当前数据表没有可绘制的 X/Y 序列"
                activeKeys={pane.activeSeriesKeys}
                onActiveKeysChange={(keys) => patchPane({ activeSeriesKeys: keys })}
                onPick={handlePick}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden border-t border-cslab-border">
              <CsLabIronCageTable
                payload={table}
                onCellClick={onCellClick}
                highlightRowIndex={pickedRow ?? undefined}
              />
            </div>
          </div>
        ) : displayMode === 'strip' ? (
          <div className="h-full min-h-0 overflow-auto p-2">
            <CsLabSpectrumStrip
              series={series}
              reflections={reflections}
              loading={seriesLoading}
              height={320}
              emptyHint="当前数据表没有可绘制的 X/Y 序列"
              activeKeys={pane.activeSeriesKeys}
              onActiveKeysChange={(keys) => patchPane({ activeSeriesKeys: keys })}
              onPick={handlePick}
            />
            {pickedRow != null && (
              <p className="mt-1 text-[10px] text-cslab-muted">
                已选第 {pickedRow + 1} 行；切换到分屏模式可在表格中查看。
              </p>
            )}
          </div>
        ) : (
          <div className="h-full min-h-0 overflow-hidden">
            <CsLabIronCageTable
              payload={table}
              onCellClick={onCellClick}
              highlightRowIndex={pickedRow ?? undefined}
            />
          </div>
        )}
      </div>

      {showSpectrum && !showTable && series?.downsampled && (
        <p className="shrink-0 border-t border-cslab-border px-2 py-1 text-[9px] text-cslab-muted">
          曲线已按 {series.totalRows.toLocaleString()} 点分桶降采样，峰谷极值保留。
        </p>
      )}
    </div>
  )
}
