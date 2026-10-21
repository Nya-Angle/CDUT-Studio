/**
 * CSLab VESTA 级晶体工作台
 *
 * 左侧控制栏 + 中间 Mol* 视图 + 底部理论 PXRD 对照谱 + 结构信息。
 */

import * as React from 'react'
import { Atom, Boxes, Loader2, RefreshCw, Triangle } from 'lucide-react'
import type {
  CsLabAssetSummary,
  CsLabCrystalAnalysis,
  CsLabCrystalStructure,
  CsLabMillerPlane,
  CsLabMolAsset,
  CsLabPxrdPattern,
  CsLabPolyhedron,
  CsLabStructureFormat,
  CsLabTableSeries,
  CsLabVolumeGrid,
} from '@profer/shared'
import { CSLAB_XRAY_WAVELENGTHS, buildMillerPlane, formatMetric } from '@profer/shared'
import { cn } from '@/lib/utils'
import { cslabWorkers } from '@/lib/cslab/cslab-worker-client'
import { useCsLabIsosurface } from '@/lib/webgpu/use-cslab-isosurface'
import { CsLabMolstarViewer } from '../CsLabMolstarViewer'
import { CsLabSpectrumStrip } from '../CsLabSpectrumStrip'

interface CsLabVestaCrystalPaneProps {
  labId: string
  asset: CsLabMolAsset
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

const WAVELENGTH_OPTIONS = [
  { id: 'Cu-Kα', label: 'Cu Kα', value: CSLAB_XRAY_WAVELENGTHS['Cu-Kα'] },
  { id: 'Co-Kα', label: 'Co Kα', value: CSLAB_XRAY_WAVELENGTHS['Co-Kα'] },
  { id: 'Mo-Kα', label: 'Mo Kα', value: CSLAB_XRAY_WAVELENGTHS['Mo-Kα'] },
] as const

function structureFormatOf(asset: CsLabMolAsset): CsLabStructureFormat | null {
  return asset.format === 'cif' || asset.format === 'poscar' || asset.format === 'xyz'
    ? asset.format
    : null
}

function formatValue(value: number | undefined, digits = 3): string {
  return value === undefined || !Number.isFinite(value) ? '—' : formatMetric(value, digits)
}

function toTableSeries(pattern: CsLabPxrdPattern): CsLabTableSeries {
  return {
    columns: [
      { key: 'x', label: '2θ', unit: 'deg' },
      { key: 'intensity', label: '理论强度', unit: 'a.u.' },
    ],
    x: pattern.curve.x,
    series: { intensity: pattern.curve.y },
    totalRows: pattern.curve.x.length,
    downsampled: false,
  }
}

export function CsLabVestaCrystalPane({
  labId,
  asset,
  onToast,
}: CsLabVestaCrystalPaneProps): React.ReactElement {
  const format = structureFormatOf(asset)
  const [analysis, setAnalysis] = React.useState<CsLabCrystalAnalysis | null>(null)
  const [analysisLoading, setAnalysisLoading] = React.useState(Boolean(format))
  const [analysisError, setAnalysisError] = React.useState<string | null>(null)
  const [supercell, setSupercell] = React.useState({ na: 1, nb: 1, nc: 1 })
  const [wavelengthId, setWavelengthId] = React.useState<(typeof WAVELENGTH_OPTIONS)[number]['id']>('Cu-Kα')
  const [fwhmDeg, setFwhmDeg] = React.useState(0.08)
  const [pattern, setPattern] = React.useState<CsLabPxrdPattern | null>(null)
  const [patternLoading, setPatternLoading] = React.useState(false)
  const [pickedPeak, setPickedPeak] = React.useState<{ h: number; k: number; l: number; twoTheta: number } | null>(null)

  const [centerElement, setCenterElement] = React.useState('Ti')
  const [neighborElement, setNeighborElement] = React.useState('O')
  const [cutoff, setCutoff] = React.useState(2.2)
  const [polyhedra, setPolyhedra] = React.useState<CsLabPolyhedron[]>([])
  const [polyhedraLoading, setPolyhedraLoading] = React.useState(false)

  const [planeH, setPlaneH] = React.useState(1)
  const [planeK, setPlaneK] = React.useState(1)
  const [planeL, setPlaneL] = React.useState(0)
  const [plane, setPlane] = React.useState<CsLabMillerPlane | null>(null)

  const [volumeAssets, setVolumeAssets] = React.useState<CsLabAssetSummary[]>([])
  const [volumeUri, setVolumeUri] = React.useState('')
  const [volumeGrid, setVolumeGrid] = React.useState<CsLabVolumeGrid | null>(null)
  const [isovalue, setIsovalue] = React.useState(0.01)
  const [isosurfaceEnabled, setIsosurfaceEnabled] = React.useState(false)

  // ===== 晶体分析 =====
  React.useEffect(() => {
    if (!format) {
      setAnalysisLoading(false)
      setAnalysisError('当前资产不是 CIF/POSCAR/XYZ 结构文件，结构分析不可用')
      return
    }
    let cancelled = false
    setAnalysisLoading(true)
    setAnalysisError(null)
    void window.electronAPI.cslab
      .analyzeCrystal({ labId, uri: asset.uri })
      .then((result) => {
        if (cancelled) return
        setAnalysis(result)
        const elements = result.structure.atoms.map((atom) => atom.element)
        const metal = elements.find((element) => element !== 'O' && element !== 'H') ?? elements[0] ?? 'Ti'
        const anion = elements.find((element) => element !== metal) ?? 'O'
        setCenterElement(metal)
        setNeighborElement(anion)
      })
      .catch((error) => {
        if (!cancelled) setAnalysisError(error instanceof Error ? error.message : '结构分析失败')
      })
      .finally(() => {
        if (!cancelled) setAnalysisLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [asset.uri, format, labId])

  // ===== 理论 PXRD =====
  React.useEffect(() => {
    if (!format || !analysis) return
    let cancelled = false
    setPatternLoading(true)
    const wavelength = WAVELENGTH_OPTIONS.find((item) => item.id === wavelengthId)?.value ?? 1.5406
    void window.electronAPI.cslab
      .simulatePxrd({
        labId,
        uri: asset.uri,
        options: { wavelengthAngstrom: wavelength, fwhmDeg, maxIndex: 8, minTwoTheta: 5, maxTwoTheta: 90 },
      })
      .then((result) => {
        if (!cancelled) setPattern(result)
      })
      .catch((error) => {
        if (!cancelled) onToast('error', error instanceof Error ? error.message : 'PXRD 模拟失败')
      })
      .finally(() => {
        if (!cancelled) setPatternLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [analysis, asset.uri, fwhmDeg, format, labId, wavelengthId])

  // ===== 体数据资产 =====
  React.useEffect(() => {
    let cancelled = false
    void window.electronAPI.cslab
      .listAssets(labId)
      .then((assets) => {
        if (cancelled) return
        setVolumeAssets(
          assets.filter(
            (item) =>
              item.layerType === 'mol' &&
              ['cube', 'chgcar', 'locpot'].includes(String(item.format ?? '')),
          ),
        )
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [labId])

  React.useEffect(() => {
    if (!volumeUri) {
      setVolumeGrid(null)
      return
    }
    let cancelled = false
    void window.electronAPI.cslab
      .getVolumeGrid({ labId, uri: volumeUri, maxDimension: 192 })
      .then((grid) => {
        if (cancelled) return
        setVolumeGrid(grid)
        const magnitude = Math.max(Math.abs(grid.max), Math.abs(grid.min))
        setIsovalue(Number((magnitude * 0.6).toExponential(2)))
      })
      .catch((error) => {
        if (!cancelled) onToast('error', error instanceof Error ? error.message : '体数据读取失败')
      })
    return () => {
      cancelled = true
    }
  }, [labId, volumeUri])

  const isosurface = useCsLabIsosurface({
    grid: volumeGrid,
    isovalue,
    enabled: isosurfaceEnabled && Boolean(volumeGrid),
  })

  // ===== 配位多面体 =====
  const buildPolyhedra = async (): Promise<void> => {
    if (!format) {
      onToast('info', '当前资产不是结构文件，无法计算配位多面体')
      return
    }
    setPolyhedraLoading(true)
    try {
      const result = await cslabWorkers.polyhedra(asset.text, format, centerElement, [neighborElement], cutoff)
      setPolyhedra(result)
      onToast('success', `已生成 ${result.length} 个 ${centerElement}–${neighborElement} 配位多面体`)
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '配位多面体计算失败')
    } finally {
      setPolyhedraLoading(false)
    }
  }

  const structure: CsLabCrystalStructure | null = analysis?.structure ?? null
  const elements = React.useMemo(() => {
    if (!structure) return []
    return [...new Set(structure.atoms.map((atom) => atom.element))]
  }, [structure])

  const pxrdSeries = pattern ? toTableSeries(pattern) : null
  const reflections = pattern?.peaks.map((peak) => ({
    h: peak.h,
    k: peak.k,
    l: peak.l,
    d: peak.d,
    twoTheta: peak.twoTheta,
    delta: 0,
  }))

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-[236px] shrink-0 space-y-2 overflow-y-auto border-r border-cslab-border bg-cslab-surface/60 p-2 text-[11px]">
        <section className="rounded-lg border border-cslab-border bg-cslab-surface p-2 shadow-sm">
          <h4 className="mb-1 flex items-center gap-1 font-medium">
            <Atom size={11} /> 结构信息
          </h4>
          {analysisLoading ? (
            <p className="flex items-center gap-1 text-cslab-muted">
              <Loader2 size={11} className="animate-spin" /> 分析中…
            </p>
          ) : analysisError ? (
            <p className="text-destructive">{analysisError}</p>
          ) : analysis ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-cslab-muted">
              <dt>空间群</dt>
              <dd className="text-cslab-text">
                {analysis.structure.spaceGroup.symbol}（{analysis.structure.spaceGroup.number ?? '—'}）
                {analysis.structure.spaceGroup.source === 'assumed-p1' ? ' · P1 降级' : ''}
              </dd>
              <dt>化学式</dt>
              <dd className="text-cslab-text">{analysis.formula}</dd>
              <dt>晶胞</dt>
              <dd className="text-cslab-text">
                {formatValue(analysis.structure.cell.a, 4)} × {formatValue(analysis.structure.cell.b, 4)} ×{' '}
                {formatValue(analysis.structure.cell.c, 4)} Å
              </dd>
              <dt>体积</dt>
              <dd className="text-cslab-text">{formatValue(analysis.cellVolume, 2)} Å³</dd>
              <dt>密度</dt>
              <dd className="text-cslab-text">{formatValue(analysis.density, 3)} g/cm³</dd>
              <dt>原子</dt>
              <dd className="text-cslab-text">
                {analysis.atomCount} 位点 / {analysis.expandedAtomCount} 展开
              </dd>
            </dl>
          ) : null}
          {analysis?.warnings.length ? (
            <p className="mt-1 text-[10px] leading-relaxed text-amber-600">{analysis.warnings[0]}</p>
          ) : null}
        </section>

        <section className="rounded-lg border border-cslab-border bg-cslab-surface p-2 shadow-sm">
          <h4 className="mb-1 flex items-center gap-1 font-medium">
            <Boxes size={11} /> 超胞
          </h4>
          <div className="grid grid-cols-3 gap-1">
            {(['na', 'nb', 'nc'] as const).map((axis) => (
              <label key={axis} className="space-y-0.5">
                <span className="text-[10px] uppercase text-cslab-muted">{axis.slice(1)}</span>
                <select
                  value={supercell[axis]}
                  onChange={(event) => setSupercell((previous) => ({ ...previous, [axis]: Number(event.target.value) }))}
                  className="w-full rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
                >
                  {[1, 2, 3].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-cslab-muted">
            {supercell.na}×{supercell.nb}×{supercell.nc} 超胞
          </p>
        </section>

        <section className="rounded-lg border border-cslab-border bg-cslab-surface p-2 shadow-sm">
          <h4 className="mb-1 font-medium">Miller 晶面 (hkl)</h4>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: 'h', value: planeH, set: setPlaneH },
              { label: 'k', value: planeK, set: setPlaneK },
              { label: 'l', value: planeL, set: setPlaneL },
            ].map((item) => (
              <label key={item.label} className="space-y-0.5">
                <span className="text-[10px] text-cslab-muted">{item.label}</span>
                <input
                  type="number"
                  step={1}
                  value={item.value}
                  onChange={(event) => item.set(Math.round(Number(event.target.value)))}
                  className="w-full rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={!analysis}
            onClick={() => {
              if (!analysis) return
              const built = buildMillerPlane(
                analysis.structure.cell,
                planeH,
                planeK,
                planeL,
                WAVELENGTH_OPTIONS.find((item) => item.id === wavelengthId)?.value,
              )
              if (!built) {
                onToast('info', '该 (hkl) 组合无法构建合法晶面')
                return
              }
              setPlane(built)
            }}
            className="mt-1 w-full rounded-md border border-cslab-border px-2 py-1 hover:bg-cslab-bg disabled:opacity-50"
          >
            显示晶面
          </button>
          {plane ? (
            <p className="mt-1 text-[10px] text-cslab-muted">
              d = {plane.d.toFixed(3)} Å · n = ({plane.normal.map((value) => value.toFixed(2)).join(', ')})
            </p>
          ) : null}
        </section>

        <section className="rounded-lg border border-cslab-border bg-cslab-surface p-2 shadow-sm">
          <h4 className="mb-1 flex items-center gap-1 font-medium">
            <Triangle size={11} /> 配位多面体
          </h4>
          <div className="grid grid-cols-2 gap-1">
            <label className="space-y-0.5">
              <span className="text-[10px] text-cslab-muted">中心</span>
              <select
                value={centerElement}
                onChange={(event) => setCenterElement(event.target.value)}
                className="w-full rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
              >
                {elements.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-0.5">
              <span className="text-[10px] text-cslab-muted">配位</span>
              <select
                value={neighborElement}
                onChange={(event) => setNeighborElement(event.target.value)}
                className="w-full rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
              >
                {elements.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-1 block space-y-0.5">
            <span className="text-[10px] text-cslab-muted">截断半径 {cutoff.toFixed(2)} Å</span>
            <input
              type="range"
              min={1.2}
              max={4}
              step={0.05}
              value={cutoff}
              onChange={(event) => setCutoff(Number(event.target.value))}
              className="w-full"
            />
          </label>
          <button
            type="button"
            disabled={polyhedraLoading || !format}
            onClick={() => void buildPolyhedra()}
            className="mt-1 inline-flex w-full items-center justify-center gap-1 rounded-md border border-cslab-border px-2 py-1 hover:bg-cslab-bg disabled:opacity-50"
          >
            {polyhedraLoading ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
            生成多面体
          </button>
          <p className="mt-1 text-[10px] text-cslab-muted">已生成 {polyhedra.length} 个</p>
        </section>

        <section className="rounded-lg border border-cslab-border bg-cslab-surface p-2 shadow-sm">
          <h4 className="mb-1 font-medium">电荷密度等值面</h4>
          <select
            value={volumeUri}
            onChange={(event) => setVolumeUri(event.target.value)}
            className="w-full rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
          >
            <option value="">选择 Cube / CHGCAR / LOCPOT</option>
            {volumeAssets.map((item) => (
              <option key={item.uri} value={item.uri}>
                {item.title}
              </option>
            ))}
          </select>
          {volumeGrid ? (
            <>
              <label className="mt-1 block space-y-0.5">
                <span className="text-[10px] text-cslab-muted">等值面阈值 {isovalue.toExponential(2)}</span>
                <input
                  type="range"
                  min={Math.min(-Math.abs(volumeGrid.max), volumeGrid.min)}
                  max={Math.abs(volumeGrid.max)}
                  step={Math.abs(volumeGrid.max) / 200 || 0.001}
                  value={isovalue}
                  onChange={(event) => setIsovalue(Number(event.target.value))}
                  className="w-full"
                />
              </label>
              <label className="mt-1 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isosurfaceEnabled}
                  onChange={(event) => setIsosurfaceEnabled(event.target.checked)}
                />
                <span>显示等值面</span>
              </label>
              <p className="mt-1 text-[10px] text-cslab-muted">
                后端：{isosurface.backend ?? '待计算'}
                {isosurface.busy ? ' · 计算中…' : ''}
                {isosurface.error ? ` · ${isosurface.error}` : ''}
              </p>
            </>
          ) : (
            <p className="mt-1 text-[10px] text-cslab-muted">尚未选择体数据文件</p>
          )}
        </section>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          <CsLabMolstarViewer
            labId={labId}
            asset={asset}
            onToast={onToast}
            polyhedra={polyhedra}
            isoPositive={isosurfaceEnabled ? isosurface.positive : null}
            isoNegative={isosurfaceEnabled ? isosurface.negative : null}
            supercellRange={supercell}
            externalPlane={plane}
          />
        </div>

        <div className="shrink-0 border-t border-cslab-border bg-cslab-surface/60 px-2 py-1.5">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] text-cslab-muted">
            <span className="font-medium text-cslab-text">理论 PXRD</span>
            <select
              value={wavelengthId}
              onChange={(event) => setWavelengthId(event.target.value as typeof wavelengthId)}
              className="rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
            >
              {WAVELENGTH_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1">
              FWHM
              <input
                type="number"
                min={0.02}
                max={1}
                step={0.01}
                value={fwhmDeg}
                onChange={(event) => setFwhmDeg(Number(event.target.value))}
                className="w-16 rounded border border-cslab-border bg-cslab-elevated px-1 py-0.5"
              />
            </label>
            {patternLoading ? <Loader2 size={10} className="animate-spin" /> : null}
            {pickedPeak ? (
              <span className="text-cslab-accent">
                ({pickedPeak.h} {pickedPeak.k} {pickedPeak.l}) · {pickedPeak.twoTheta.toFixed(2)}°
              </span>
            ) : (
              <span>点击谱峰查看 (hkl)</span>
            )}
          </div>
          <CsLabSpectrumStrip
            series={pxrdSeries}
            reflections={reflections}
            height={132}
            loading={patternLoading}
            emptyHint={format ? '正在等待结构分析结果' : '当前资产不支持 PXRD 模拟'}
            onPick={(x: number) => {
              if (!pattern) return
              const nearest = pattern.peaks.reduce<CsLabPxrdPattern['peaks'][number] | null>((best, peak) => {
                if (!best) return peak
                return Math.abs(peak.twoTheta - x) < Math.abs(best.twoTheta - x) ? peak : best
              }, null)
              if (nearest && Math.abs(nearest.twoTheta - x) < 0.6) {
                setPickedPeak({ h: nearest.h, k: nearest.k, l: nearest.l, twoTheta: nearest.twoTheta })
                setPlaneH(nearest.h)
                setPlaneK(nearest.k)
                setPlaneL(nearest.l)
                if (analysis) {
                  const built = buildMillerPlane(
                    analysis.structure.cell,
                    nearest.h,
                    nearest.k,
                    nearest.l,
                    WAVELENGTH_OPTIONS.find((item) => item.id === wavelengthId)?.value,
                  )
                  if (built) setPlane(built)
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
