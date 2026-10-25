/**
 * CsLabMolstarViewer — 3D 分子/晶体表征（Mol* PluginContext）
 *
 * 设计红线：
 * - 直接使用 PluginContext（无默认 UI），背景随 CSLab 深浅主题切换；
 * - 卸载三部曲强杀 WebGL 上下文，避免 Electron 上下文上限崩溃；
 * - 所有 Mol* 深路径 API 收敛在 cslab-molstar-state.ts；
 * - XRD 峰 -> 晶面、原子 -> 谱带均为「可解释的启发式联动」，失败必须明确提示。
 */

import * as React from 'react'
import 'molstar/build/viewer/molstar.css'
import { PluginContext } from 'molstar/lib/mol-plugin/context'
import { PluginCommands } from 'molstar/lib/mol-plugin/commands'
import { Color } from 'molstar/lib/mol-util/color'
import { Vec3 } from 'molstar/lib/mol-math/linear-algebra'
import { Asset } from 'molstar/lib/mol-util/assets'
import { StructureElement, StructureProperties } from 'molstar/lib/mol-model/structure'
import {
  CSLAB_XRAY_WAVELENGTHS,
  assignReflections,
  buildMillerPlane,
  cellCenter,
  cellMaxLength,
  parseCifLattice,
  type CsLabAssetSummary,
  type CsLabAtomSiteSelection,
  type CsLabCrystalCell,
  type CsLabIsoMesh,
  type CsLabMillerPlane,
  type CsLabMolAsset,
  type CsLabPolyhedron,
  type CsLabTableSeries,
} from '@profer/shared'
import { cn } from '@/lib/utils'
import { useIsDarkTheme } from '@/hooks/use-is-dark-theme'
import { registerCsLabSnapshotProvider } from '@/lib/cslab/cslab-snapshot-registry'
import type { CsLabPaneId } from '@/atoms/cslab-atoms'
import { Atom as AtomIcon, Box, Camera, Loader2, Ruler, Triangle } from 'lucide-react'
import { CsLabSpectrumStrip } from './CsLabSpectrumStrip'
import { findVibrationalBands } from './cslab-vibrational'
import {
  buildPluginSpec,
  DrawCrystalPolyhedra,
  DrawIsoSurface,
  DrawMillerPlane,
} from './cslab-molstar-state'

interface CsLabMolstarViewerProps {
  labId: string
  /** 所属舞台窗格；用于按窗格注册 3D 视窗截图能力。 */
  paneId: CsLabPaneId
  asset: CsLabMolAsset
  onToast: (
    kind: 'info' | 'success' | 'error',
    text: string,
    action?: { label: string; path: string },
  ) => void
  onAtomSelection?: (selection: CsLabAtomSiteSelection) => void
  /** 配位多面体（由 VESTA 工作台计算）。 */
  polyhedra?: CsLabPolyhedron[]
  /** 正/负相位等值面网格。 */
  isoPositive?: CsLabIsoMesh | null
  isoNegative?: CsLabIsoMesh | null
  /** 超胞倍数（1-3）。 */
  supercellRange?: { na: number; nb: number; nc: number }
  /** 外部指定的 Miller 晶面（VESTA 工作台）。 */
  externalPlane?: CsLabMillerPlane | null
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

const WAVELENGTH_OPTIONS = [
  { id: 'Cu-Kα', label: 'Cu Kα', value: CSLAB_XRAY_WAVELENGTHS['Cu-Kα'] },
  { id: 'Co-Kα', label: 'Co Kα', value: CSLAB_XRAY_WAVELENGTHS['Co-Kα'] },
  { id: 'Mo-Kα', label: 'Mo Kα', value: CSLAB_XRAY_WAVELENGTHS['Mo-Kα'] },
] as const

export function CsLabMolstarViewer({
  labId,
  paneId,
  asset,
  onToast,
  onAtomSelection,
  polyhedra,
  isoPositive,
  isoNegative,
  supercellRange,
  externalPlane,
}: CsLabMolstarViewerProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const pluginRef = React.useRef<PluginContext | null>(null)
  const planeRef = React.useRef<string | null>(null)
  const polyhedraRef = React.useRef<string | null>(null)
  const isoPositiveRef = React.useRef<string | null>(null)
  const isoNegativeRef = React.useRef<string | null>(null)
  const [ready, setReady] = React.useState(false)
  const [state, setState] = React.useState<LoadState>('idle')
  const [supercell, setSupercell] = React.useState(true)
  const [atomCount, setAtomCount] = React.useState(0)
  const [performanceMode, setPerformanceMode] = React.useState(false)
  const [selection, setSelection] = React.useState<CsLabAtomSiteSelection | null>(null)
  const [plane, setPlane] = React.useState<CsLabMillerPlane | null>(null)
  const [wavelengthId, setWavelengthId] =
    React.useState<(typeof WAVELENGTH_OPTIONS)[number]['id']>('Cu-Kα')
  const isDark = useIsDarkTheme()

  const [tables, setTables] = React.useState<CsLabAssetSummary[]>([])
  const [tableUri, setTableUri] = React.useState('')
  const [series, setSeries] = React.useState<CsLabTableSeries | null>(null)
  const [seriesLoading, setSeriesLoading] = React.useState(false)
  const [pickedX, setPickedX] = React.useState<number | undefined>(undefined)
  const [exportingSnapshot, setExportingSnapshot] = React.useState(false)

  /**
   * 用 Mol* 的 ImagePass 全量重绘并导出当前视口 PNG。
   * 不走 canvas.toDataURL：WebGL 默认 preserveDrawingBuffer=false，直接抓帧会黑屏。
   */
  const captureViewport = React.useCallback(async (scale: number): Promise<string> => {
    const plugin = pluginRef.current
    if (!plugin?.canvas3d) throw new Error('3D 视窗尚未初始化完成')
    const helper = plugin.helpers.viewportScreenshot
    if (!helper) throw new Error('当前 Mol* 运行时不支持视口截图')
    const base = helper.getSizeAndViewport()
    if (base.viewport.width <= 0 || base.viewport.height <= 0) {
      throw new Error('3D 视窗当前不可见，无法截图')
    }
    const maxSide = Math.min(
      plugin.canvas3d.webgl.maxRenderbufferSize,
      plugin.canvas3d.webgl.maxTextureSize,
    )
    const factor = Math.max(1, Math.min(3, Math.round(scale)))
    const width = Math.min(maxSide, Math.round(base.viewport.width * factor))
    const height = Math.min(maxSide, Math.round(base.viewport.height * factor))
    const previous = helper.values
    helper.behaviors.values.next({
      ...previous,
      resolution: { name: 'custom', params: { width, height } },
      format: { name: 'png', params: {} },
      transparent: false,
    })
    try {
      return await helper.getImageDataUri()
    } finally {
      helper.behaviors.values.next(previous)
    }
  }, [])

  React.useEffect(
    () => registerCsLabSnapshotProvider(paneId, captureViewport),
    [paneId, captureViewport],
  )

  const handleExportSnapshot = React.useCallback(async (): Promise<void> => {
    setExportingSnapshot(true)
    try {
      const dataUrl = await captureViewport(2)
      const result = await window.electronAPI.cslab.snapshotStructure({
        labId,
        dataUrl,
        scale: 2,
        filenamePrefix: asset.title,
      })
      onToast('success', `已导出 3D 快照 ${result.width}×${result.height}`, {
        label: '打开所在文件夹',
        path: result.path,
      })
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '3D 快照导出失败')
    } finally {
      setExportingSnapshot(false)
    }
  }, [asset.title, captureViewport, labId, onToast])

  const cell = React.useMemo<CsLabCrystalCell | null>(
    () => (asset.format === 'cif' ? parseCifLattice(asset.text) : null),
    [asset.format, asset.text],
  )

  const bands = React.useMemo(
    () => (selection ? findVibrationalBands(selection.element) : []),
    [selection],
  )

  React.useEffect(() => {
    if (externalPlane !== undefined) setPlane(externalPlane)
  }, [externalPlane])

  // ===== 初始化 / 销毁 =====
  React.useEffect(() => {
    let disposed = false
    let ro: ResizeObserver | null = null
    const container = containerRef.current
    if (!container) return

    const init = async (): Promise<void> => {
      try {
        const plugin = new PluginContext(buildPluginSpec())
        pluginRef.current = plugin
        await plugin.init()
        if (disposed) {
          plugin.dispose()
          return
        }
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        container.appendChild(canvas)
        const ok = await plugin.initViewerAsync(canvas, container)
        if (!ok) throw new Error('WebGL 画布初始化失败')

        if (typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(() => {
            if (plugin.canvas3d) {
              plugin.canvas3d.handleResize()
              plugin.canvas3d.requestDraw()
            }
          })
          ro.observe(container)
        }

        try {
          const renderer = plugin.canvas3d?.props.renderer
          if (renderer) {
            await PluginCommands.Canvas3D.SetSettings(plugin, {
              settings: {
                renderer: {
                  ...renderer,
                  backgroundColor: Color(isDark ? 0x171614 : 0xfaf9f5),
                },
              },
            })
          }
        } catch (error) {
          console.warn('[CSLab Mol*] 背景色设置失败:', error)
        }

        if (!disposed) {
          setReady(true)
          requestAnimationFrame(() => {
            plugin.canvas3d?.handleResize()
            plugin.canvas3d?.requestDraw()
          })
        }
      } catch (error) {
        console.error('[CSLab Mol*] 初始化失败:', error)
        if (!disposed) {
          setState('error')
          onToast('error', error instanceof Error ? error.message : '3D 视图初始化失败')
        }
      }
    }

    void init()

    return () => {
      disposed = true
      ro?.disconnect()
      ro = null
      setReady(false)
      const plugin = pluginRef.current
      pluginRef.current = null
      planeRef.current = null
      if (!plugin) return
      const canvas = container.querySelector('canvas')
      // 卸载三部曲：先释放 canvas3d，再 dispose 插件，最后显式丢弃 WebGL 上下文。
      try {
        plugin.canvas3d?.dispose()
      } catch {
        // 可能已释放。
      }
      try {
        plugin.dispose()
      } catch {
        // 可能已释放。
      }
      try {
        const gl =
          canvas?.getContext('webgl2') ?? canvas?.getContext('webgl')
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
      } catch {
        // 上下文可能已丢失。
      }
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
        canvas.remove()
      }
    }
  }, [onToast, isDark])

  // ===== 结构载入 =====
  React.useEffect(() => {
    if (!ready) return
    const plugin = pluginRef.current
    if (!plugin) return
    let cancelled = false

    const load = async (): Promise<void> => {
      setState('loading')
      setAtomCount(0)
      setPlane(null)
      setSelection(null)
      planeRef.current = null
      try {
        await plugin.clear()
        const file = Asset.File(
          new File([asset.text], asset.title || `structure.${asset.format}`, {
            type: 'text/plain',
          }),
        )
        const { data: dataRef } = await plugin.builders.data.readFile({
          file,
          isBinary: false,
        })

        // CIF 走 cifCore（小分子晶体学字典），失败再回退 mmcif；PDB 直接 pdb。
        const formatCandidates: Array<'pdb' | 'cifCore' | 'mmcif'> =
          asset.format === 'pdb' ? ['pdb'] : ['cifCore', 'mmcif']
        let trajectory: Awaited<
          ReturnType<typeof plugin.builders.structure.parseTrajectory>
        > | null = null
        let parseError: unknown = null
        for (const format of formatCandidates) {
          try {
            trajectory = await plugin.builders.structure.parseTrajectory(dataRef, format)
            break
          } catch (error) {
            parseError = error
          }
        }
        if (!trajectory) {
          throw parseError instanceof Error
            ? parseError
            : new Error('未能解析结构文件（CIF/PDB）')
        }

        const model = await plugin.builders.structure.createModel(trajectory)

        // v5 的超晶胞通过 RootStructureDefinition 的 symmetry 参数展开。
        const structure = await plugin.builders.structure.createStructure(
          model,
          supercell
            ? {
                name: 'symmetry',
                params: {
                  ijkMin: Vec3.create(0, 0, 0),
                  ijkMax: Vec3.create(
                    Math.max(1, Math.min(3, Math.round(supercellRange?.na ?? 2))) - 1,
                    Math.max(1, Math.min(3, Math.round(supercellRange?.nb ?? 2))) - 1,
                    Math.max(1, Math.min(3, Math.round(supercellRange?.nc ?? 2))) - 1,
                  ),
                  mergeBySymmetry: true,
                  dynamicBonds: undefined,
                },
              }
            : undefined,
        )
        if (cancelled) return

        // 单胞虚线框挂在原始 Model 上，避免超晶胞重复画框。
        await plugin.builders.structure.tryCreateUnitcell(model)

        const count = Number(structure.data?.elementCount ?? 0)
        setAtomCount(count)
        const heavy = count > 500_000
        setPerformanceMode(heavy)

        await plugin.builders.structure.representation.addRepresentation(structure, {
          type: heavy ? 'point' : count > 200_000 ? 'spacefill' : 'ball-and-stick',
          color: 'element-symbol',
        })

        if (heavy) {
          try {
            await PluginCommands.Canvas3D.SetSettings(plugin, {
              settings: {
                postprocessing: { occlusion: { name: 'off', params: {} } },
              } as never,
            })
          } catch (error) {
            console.warn('[CSLab Mol*] 关闭 SSAO 失败:', error)
          }
        }

        await PluginCommands.Camera.Reset(plugin, {})
        if (plugin.canvas3d) {
          plugin.canvas3d.handleResize()
          plugin.canvas3d.requestCameraReset()
        }
        if (!cancelled) setState('ready')
      } catch (error) {
        console.error('[CSLab Mol*] 结构载入失败:', error)
        if (!cancelled) {
          setState('error')
          onToast(
            'error',
            error instanceof Error ? `结构载入失败：${error.message}` : '结构载入失败',
          )
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [
    ready,
    asset.uri,
    asset.text,
    asset.format,
    asset.title,
    supercell,
    supercellRange?.na,
    supercellRange?.nb,
    supercellRange?.nc,
    onToast,
  ])

  // ===== 原子拾取（逆向联动） =====
  React.useEffect(() => {
    const plugin = pluginRef.current
    if (!ready || !plugin) return

    const subscription = plugin.behaviors.interaction.click.subscribe((event) => {
      const loci = event.current.loci
      if (!StructureElement.Loci.is(loci)) return
      const location = StructureElement.Location.create()
      StructureElement.Loci.getFirstLocation(loci, location)
      if (!location) return

      let element = ''
      try {
        element = StructureProperties.atom.type_symbol(location)
      } catch {
        element = ''
      }
      if (!element) return

      let chain = ''
      let residue = ''
      try {
        chain = String(StructureProperties.chain.auth_asym_id(location) ?? '')
        residue = String(StructureProperties.residue.auth_seq_id(location) ?? '')
      } catch {
        // PDB/CIF 缺字段时忽略。
      }

      const payload: CsLabAtomSiteSelection = {
        element,
        siteId: chain || residue ? `${chain}-${residue}` : undefined,
        symmetryLabel: chain || undefined,
      }
      setSelection(payload)
      onAtomSelection?.(payload)

      const matched = findVibrationalBands(element)
      if (matched.length === 0) {
        onToast('info', `元素 ${element} 暂无内置振动参考区间（不伪造谱带）`)
      }
    })

    return () => subscription.unsubscribe()
  }, [ready, onAtomSelection, onToast])

  // ===== Miller 晶面（正向联动） =====
  React.useEffect(() => {
    const plugin = pluginRef.current
    if (!ready || !plugin) return
    let cancelled = false

    const apply = async (): Promise<void> => {
      try {
        const update = plugin.state.data.build()
        if (planeRef.current) update.delete(planeRef.current)
        let nextRef: string | null = null
        if (plane) {
          const center = cell ? cellCenter(cell) : [0, 0, 0]
          const size = cell ? cellMaxLength(cell) * 2.4 : 20
          const node = update.toRoot().apply(DrawMillerPlane, {
            h: plane.h,
            k: plane.k,
            l: plane.l,
            nx: plane.normal[0],
            ny: plane.normal[1],
            nz: plane.normal[2],
            cx: center[0]!,
            cy: center[1]!,
            cz: center[2]!,
            size,
          })
          nextRef = node.ref
        }
        await update.commit()
        if (!cancelled) planeRef.current = nextRef
      } catch (error) {
        console.error('[CSLab Mol*] 晶面绘制失败:', error)
        if (!cancelled) {
          onToast(
            'error',
            error instanceof Error ? `晶面绘制失败：${error.message}` : '晶面绘制失败',
          )
        }
      }
    }

    void apply()
    return () => {
      cancelled = true
    }
  }, [ready, plane, cell, onToast])

  // ===== 配位多面体 =====
  React.useEffect(() => {
    const plugin = pluginRef.current
    if (!ready || !plugin) return
    let cancelled = false

    const apply = async (): Promise<void> => {
      try {
        const update = plugin.state.data.build()
        if (polyhedraRef.current) update.delete(polyhedraRef.current)
        let nextRef: string | null = null
        if (polyhedra && polyhedra.length > 0) {
          const vertices: number[] = []
          const faces: number[] = []
          let vertexOffset = 0
          for (const polyhedron of polyhedra) {
            vertices.push(...polyhedron.vertices)
            for (const face of polyhedron.faces) faces.push(face + vertexOffset)
            vertexOffset += polyhedron.vertices.length / 3
          }
          const node = update.toRoot().apply(DrawCrystalPolyhedra, {
            vertices,
            faces,
            color: 0x4a90d9,
            opacity: 0.45,
          })
          nextRef = node.ref
        }
        await update.commit()
        if (!cancelled) polyhedraRef.current = nextRef
      } catch (error) {
        console.error('[CSLab Mol*] 配位多面体绘制失败:', error)
      }
    }

    void apply()
    return () => {
      cancelled = true
    }
  }, [ready, polyhedra])

  // ===== 等值面（增量更新） =====
  React.useEffect(() => {
    const plugin = pluginRef.current
    if (!ready || !plugin) return
    let cancelled = false

    const applyMesh = async (
      mesh: CsLabIsoMesh | null | undefined,
      reference: React.MutableRefObject<string | null>,
      color: number,
      label: string,
    ): Promise<void> => {
      const update = plugin.state.data.build()
      if (!mesh || mesh.indices.length < 3) {
        if (reference.current) update.delete(reference.current)
        await update.commit()
        reference.current = null
        return
      }
      const maxTriangles = 40_000
      const triangleCount = Math.min(mesh.triangleCount, maxTriangles)
      const vertexCount = triangleCount * 3
      const positions = Array.from(mesh.positions.slice(0, vertexCount * 3))
      const normals = Array.from(mesh.normals.slice(0, vertexCount * 3))
      const indices = Array.from(mesh.indices.slice(0, vertexCount))
      const params = { positions, normals, indices, color, label }
      if (reference.current) {
        update.to(reference.current).update(params)
      } else {
        const node = update.toRoot().apply(DrawIsoSurface, params)
        reference.current = node.ref
      }
      await update.commit()
    }

    const apply = async (): Promise<void> => {
      try {
        await applyMesh(isoPositive, isoPositiveRef, 0xf2c94c, 'Isosurface (+)')
        if (!cancelled) await applyMesh(isoNegative, isoNegativeRef, 0x5da8d8, 'Isosurface (-)')
      } catch (error) {
        console.error('[CSLab Mol*] 等值面绘制失败:', error)
      }
    }

    void apply()
    return () => {
      cancelled = true
    }
  }, [ready, isoPositive, isoNegative])

  // ===== 谱图数据 =====
  React.useEffect(() => {
    let cancelled = false
    const loadTables = async (): Promise<void> => {
      try {
        const assets = await window.electronAPI.cslab.listAssets(labId)
        if (cancelled) return
        const next = assets.filter((item) => item.layerType === 'table')
        setTables(next)
        setTableUri((previous) => previous || next[0]?.uri || '')
      } catch (error) {
        console.warn('[CSLab Mol*] 数据表列表读取失败:', error)
      }
    }
    void loadTables()
    return () => {
      cancelled = true
    }
  }, [labId])

  React.useEffect(() => {
    if (!tableUri) {
      setSeries(null)
      return
    }
    let cancelled = false
    setSeriesLoading(true)
    void window.electronAPI.cslab
      .getTableSeries({ labId, tableUri, maxPoints: 3000 })
      .then((next) => {
        if (!cancelled) setSeries(next)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          onToast('error', error instanceof Error ? error.message : '谱图读取失败')
        }
      })
      .finally(() => {
        if (!cancelled) setSeriesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [labId, tableUri, onToast])

  const handlePick = (x: number): void => {
    setPickedX(x)
    if (asset.format !== 'cif' || !cell) {
      onToast('info', '该结构没有可用晶胞参数，无法由 2θ 反算晶面')
      return
    }
    const wavelength = WAVELENGTH_OPTIONS.find((item) => item.id === wavelengthId)?.value
    const matches = assignReflections(x, cell, {
      maxIndex: 6,
      toleranceDeg: 0.35,
      wavelengthAngstrom: wavelength,
    })
    if (matches.length === 0) {
      onToast('info', `2θ = ${x.toFixed(2)}° 与当前晶胞/波长无匹配晶面`)
      return
    }
    const best = matches[0]!
    const next = buildMillerPlane(cell, best.h, best.k, best.l, wavelength)
    if (!next) {
      onToast('error', '晶面法向量计算失败')
      return
    }
    setPlane(next)
    onToast(
      'success',
      `(${best.h}${best.k}${best.l}) · d = ${best.d.toFixed(3)} Å · 2θ = ${best.twoTheta.toFixed(2)}°`,
    )
  }

  const handleTableChange = (uri: string): void => {
    setTableUri(uri)
    setPlane(null)
    setPickedX(undefined)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-cslab-bg">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-cslab-border px-2.5">
        <AtomIcon size={11} className="shrink-0 text-cslab-muted" />
        <span className="text-[10px] text-cslab-muted">
          {asset.format.toUpperCase()}
          {cell ? ` · ${cell.a.toFixed(2)}×${cell.b.toFixed(2)}×${cell.c.toFixed(2)} Å` : ' · 无晶胞参数'}
        </span>
        {atomCount > 0 && (
          <span className="text-[10px] tabular-nums text-cslab-muted">
            · {atomCount.toLocaleString()} 原子
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => void handleExportSnapshot()}
            disabled={!ready || exportingSnapshot}
            className="inline-flex items-center gap-1 rounded-md border border-cslab-border px-1.5 py-0.5 text-[10px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text disabled:opacity-50"
            title="导出当前晶体视角为 2× 超清 PNG"
          >
            {exportingSnapshot ? <Loader2 size={9} className="animate-spin" /> : <Camera size={9} />}
            快照
          </button>
          <button
            type="button"
            onClick={() => setSupercell((value) => !value)}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] transition-colors',
              supercell
                ? 'border-cslab-accent/40 bg-cslab-accent/10 text-cslab-accent'
                : 'border-cslab-border text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text',
            )}
            title="切换 2×2×2 超晶胞"
          >
            <Box size={9} />
            {supercell ? '2×2×2' : '单胞'}
          </button>
          {performanceMode && (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] text-amber-700">
              性能模式（已关 SSAO）
            </span>
          )}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div ref={containerRef} className="absolute inset-0" />
        {state !== 'ready' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cslab-bg/70">
            <div className="flex items-center gap-2 text-[11px] text-cslab-muted">
              {state === 'error' ? (
                <Triangle size={13} className="text-red-500" />
              ) : (
                <Loader2 size={13} className="animate-spin" />
              )}
              {state === 'error' ? '3D 视图不可用' : '正在构建 3D 结构…'}
            </div>
          </div>
        )}
        {selection && (
          <div className="pointer-events-none absolute bottom-2 left-2 rounded-md border border-cslab-border bg-cslab-elevated/95 px-2 py-1 text-[10px] text-cslab-muted shadow-subtle">
            已选 <span className="font-mono text-cslab-text">{selection.element}</span>
            {selection.siteId && <span className="ml-1 font-mono">({selection.siteId})</span>}
            {bands.length > 0 && (
              <span className="ml-1 text-cslab-accent">{bands.map((band) => band.label).join(' / ')}</span>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-1 border-t border-cslab-border px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <Ruler size={10} className="text-cslab-muted" />
          <span className="text-[10px] text-cslab-muted">关联谱图</span>
          <select
            value={tableUri}
            onChange={(event) => handleTableChange(event.target.value)}
            className="min-w-0 flex-1 rounded border border-cslab-border bg-cslab-elevated px-1.5 py-0.5 text-[10px] text-cslab-text focus:outline-none"
          >
            <option value="">未选择</option>
            {tables.map((table) => (
              <option key={table.uri} value={table.uri}>
                {table.title}
              </option>
            ))}
          </select>
          <select
            value={wavelengthId}
            onChange={(event) =>
              setWavelengthId(event.target.value as (typeof WAVELENGTH_OPTIONS)[number]['id'])
            }
            className="rounded border border-cslab-border bg-cslab-elevated px-1.5 py-0.5 text-[10px] text-cslab-text focus:outline-none"
            title="X 射线波长（用于 2θ ↔ d 换算）"
          >
            {WAVELENGTH_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <CsLabSpectrumStrip
          series={series}
          highlights={bands}
          selectedX={pickedX}
          loading={seriesLoading}
          onPick={handlePick}
        />
        {plane && (
          <p className="text-[9px] text-cslab-muted">
            Miller 晶面 ({plane.h}
            {plane.k}
            {plane.l}) · d = {plane.d.toFixed(3)} Å
            {plane.twoTheta ? ` · 2θ = ${plane.twoTheta.toFixed(2)}°` : ''}
          </p>
        )}
      </div>
    </div>
  )
}
