import { app } from 'electron'
import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
/**
 * CSLab 科学引擎 × Pi Agent 工具集
 *
 * 只读工具：晶体分析、PXRD 模拟、峰拟合；
 * 写操作工具：更新画板、导出出版图（保留逐次审批）。
 */

import { Type } from 'typebox'
import type { ToolDefinition } from '@earendil-works/pi-coding-agent'
import type { AgentToolResult } from '@earendil-works/pi-agent-core'
import type {
  CsLabFitRequest,
  CsLabPeakProfileName,
  CsLabPlotDocument,
  CsLabPlotSeries,
  CsLabPlotExportFormat,
  CsLabPxrdOptions,
} from '@profer/shared'
import { getAgentSessionMeta } from '../agent-session-manager'
import { assertLabId } from '../cslab/cslab-paths'
import { broadcastCsLabEvent } from '../cslab/cslab-events'
import { CSLAB_IPC_CHANNELS } from '../cslab/cslab-types'
import { getTableSeries, ingestMolAsset } from '../cslab/cslab-mol'
import { createPlotUndoSnapshot } from '../cslab/cslab-plot-history'
import {
  analyzeCrystalAsset,
  exportFigure,
  fitPeaks,
  loadPlot,
  savePlot,
  simulatePxrdAsset,
} from '../cslab/cslab-science'

type PiSdkLike = typeof import('@earendil-works/pi-coding-agent')

export interface PiCsLabScienceToolsContext {
  sessionId: string
}

function jsonToolResult<T>(value: T): AgentToolResult<unknown> {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
    details: value,
  } as AgentToolResult<unknown>
}

function jsonToolError(message: string): AgentToolResult<unknown> {
  return {
    content: [{ type: 'text' as const, text: `执行失败：${message}` }],
    details: { error: message },
    isError: true,
  } as AgentToolResult<unknown>
}

function downsampleCurve(x: number[], y: number[], maxPoints = 2000): { x: number[]; y: number[] } {
  if (x.length <= maxPoints) return { x, y }
  const stride = Math.ceil(x.length / maxPoints)
  const sampleX: number[] = []
  const sampleY: number[] = []
  for (let index = 0; index < x.length; index += stride) {
    sampleX.push(x[index]!)
    sampleY.push(y[index] ?? 0)
  }
  return { x: sampleX, y: sampleY }
}

/** 构建当前会话可用科学工具；未绑定实验室时返回空数组。 */
export function buildCsLabScienceTools(
  sdk: PiSdkLike,
  ctx: PiCsLabScienceToolsContext,
): ToolDefinition[] {
  const meta = getAgentSessionMeta(ctx.sessionId)
  if (!meta?.cslabLabId) return []

  let labId: string
  try {
    labId = assertLabId(meta.cslabLabId)
  } catch {
    return []
  }

  const tools: ToolDefinition[] = []

  tools.push(
    sdk.defineTool({
      name: 'cslab_analyze_crystal',
      label: 'CSLab 分析晶体结构',
      description:
        '解析实验室内的 CIF/POSCAR/XYZ 结构，返回空间群、晶胞、体积、密度、化学式与 Wyckoff 占位列表。',
      promptSnippet: 'cslab_analyze_crystal: 分析晶体结构、空间群与 Wyckoff 占位',
      parameters: Type.Object({
        uri: Type.String({ minLength: 1, description: '结构资产 URI' }),
        tolerance: Type.Optional(Type.Number({ minimum: 0.001, maximum: 1 })),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as { uri: string; tolerance?: number }
        try {
          const analysis = await analyzeCrystalAsset({
            labId,
            uri: input.uri,
            tolerance: input.tolerance,
          })
          return jsonToolResult({
            spaceGroup: analysis.structure.spaceGroup,
            cell: analysis.structure.cell,
            formula: analysis.formula,
            density: analysis.density,
            atomCount: analysis.atomCount,
            expandedAtomCount: analysis.expandedAtomCount,
            wyckoff: analysis.wyckoff,
            warnings: analysis.warnings,
          })
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : '晶体分析失败')
        }
      },
    }) as ToolDefinition,
  )

  tools.push(
    sdk.defineTool({
      name: 'cslab_simulate_pxrd',
      label: 'CSLab 模拟理论 PXRD',
      description:
        '基于晶体结构计算理论粉末 XRD 峰位与相对强度（运动学近似），返回 (hkl)、d 值、2θ、多重度与连续谱线。',
      promptSnippet: 'cslab_simulate_pxrd: 由晶体结构模拟理论粉末 XRD',
      parameters: Type.Object({
        uri: Type.String({ minLength: 1, description: '结构资产 URI' }),
        wavelengthAngstrom: Type.Optional(Type.Number({ minimum: 0.1, maximum: 3 })),
        minTwoTheta: Type.Optional(Type.Number({ minimum: 0, maximum: 180 })),
        maxTwoTheta: Type.Optional(Type.Number({ minimum: 1, maximum: 180 })),
        fwhmDeg: Type.Optional(Type.Number({ minimum: 0.001, maximum: 5 })),
        maxIndex: Type.Optional(Type.Integer({ minimum: 1, maximum: 12 })),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as {
          uri: string
          wavelengthAngstrom?: number
          minTwoTheta?: number
          maxTwoTheta?: number
          fwhmDeg?: number
          maxIndex?: number
        }
        try {
          const options: CsLabPxrdOptions = {
            wavelengthAngstrom: input.wavelengthAngstrom,
            minTwoTheta: input.minTwoTheta,
            maxTwoTheta: input.maxTwoTheta,
            fwhmDeg: input.fwhmDeg,
            maxIndex: input.maxIndex,
          }
          const pattern = await simulatePxrdAsset({ labId, uri: input.uri, options })
          return jsonToolResult({
            wavelengthAngstrom: pattern.wavelengthAngstrom,
            peaks: pattern.peaks,
            curve: downsampleCurve(pattern.curve.x, pattern.curve.y),
            warnings: pattern.warnings,
          })
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : 'PXRD 模拟失败')
        }
      },
    }) as ToolDefinition,
  )

  tools.push(
    sdk.defineTool({
      name: 'cslab_fit_peaks',
      label: 'CSLab 多峰解叠拟合',
      description:
        '对实验谱线执行高斯/洛伦兹/Pseudo-Voigt 多峰解叠，返回峰中心、半高宽、面积、面积占比、R² 与拟合曲线。',
      promptSnippet: 'cslab_fit_peaks: 对实验谱线执行多峰解叠拟合',
      parameters: Type.Object({
        x: Type.Optional(Type.Array(Type.Number())),
        y: Type.Optional(Type.Array(Type.Number())),
        tableUri: Type.Optional(Type.String({ description: '数据表资产 URI（与 x/y 二选一）' })),
        yKey: Type.Optional(Type.String({ description: '数据表强度列 key' })),
        plotId: Type.Optional(Type.String({ description: '从实验室绘图文档的首条可见曲线取数' })),
        xMin: Type.Optional(Type.Number({ description: 'ROI 起点（仅用于 plotId 取数）' })),
        xMax: Type.Optional(Type.Number({ description: 'ROI 终点（仅用于 plotId 取数）' })),
        peakCenters: Type.Array(Type.Number(), { minItems: 1 }),
        model: Type.Optional(
          Type.Union([
            Type.Literal('gaussian'),
            Type.Literal('lorentzian'),
            Type.Literal('pseudo_voigt'),
          ]),
        ),
        baseline: Type.Optional(
          Type.Union([
            Type.Literal('none'),
            Type.Literal('constant'),
            Type.Literal('linear'),
            Type.Literal('polynomial'),
            Type.Literal('asls'),
          ]),
        ),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as {
          x?: number[]
          y?: number[]
          tableUri?: string
          yKey?: string
          plotId?: string
          xMin?: number
          xMax?: number
          peakCenters: number[]
          model?: CsLabPeakProfileName
          baseline?: CsLabFitRequest['baseline']
        }
        try {
          let x = input.x
          let y = input.y
          if ((!x || !y) && input.tableUri) {
            const series = await getTableSeries(labId, input.tableUri, 20000)
            if (!series) return jsonToolError('数据表不存在或无法读取')
            x = series.x
            const key =
              input.yKey ??
              series.columns.find((column) => column.key !== 'x')?.key
            if (!key) return jsonToolError('数据表中没有可用的强度列')
            y = series.series[key]
          }
          if ((!x || !y) && input.plotId) {
            const plot = await loadPlot({ labId, plotId: input.plotId })
            const series = plot?.layers[0]?.series.find((item) => item.visible !== false)
            if (!series) return jsonToolError('绘图文档没有可用曲线')
            const lo = input.xMin ?? -Infinity
            const hi = input.xMax ?? Infinity
            const pickedX: number[] = []
            const pickedY: number[] = []
            for (let index = 0; index < series.x.length; index += 1) {
              const value = series.x[index]!
              if (value >= lo && value <= hi) {
                pickedX.push(value)
                pickedY.push(series.y[index] ?? 0)
              }
            }
            if (pickedX.length < 5) return jsonToolError('ROI 内数据点不足')
            x = pickedX
            y = pickedY
          }
          if (!x || !y || x.length !== y.length || x.length < 5) {
            return jsonToolError('拟合数据缺失或长度不足')
          }
          const span = (x[x.length - 1] ?? 1) - (x[0] ?? 0)
          const request: CsLabFitRequest = {
            x,
            y,
            peaks: input.peakCenters.map((center) => ({
              center,
              fwhm: Math.max(span / 80, 1e-4),
            })),
            model: input.model ?? 'pseudo_voigt',
            baseline: input.baseline ?? 'constant',
          }
          const result = await fitPeaks(request)
          const fittedCurve = downsampleCurve(x, result.fitted)
          return jsonToolResult({
            peaks: result.peaks,
            rSquared: result.rSquared,
            rmse: result.rmse,
            iterations: result.iterations,
            converged: result.converged,
            warnings: result.warnings,
            fitted: fittedCurve.y,
            fittedX: fittedCurve.x,
          })
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : '峰拟合失败')
        }
      },
    }) as ToolDefinition,
  )

  tools.push(
    sdk.defineTool({
      name: 'cslab_render_plot',
      label: 'CSLab 更新出版画板',
      description:
        '把绘图文档保存到实验室并推送到渲染进程画板（会写入 vault/plots）。可传完整 plot，或传 plotId + appendSeries 在现有绘图上追加一条曲线。',
      promptSnippet: 'cslab_render_plot: 保存并推送出版绘图到画板',
      parameters: Type.Object({
        plot: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
        plotId: Type.Optional(Type.String({ description: '在现有绘图上追加曲线时必填' })),
        appendSeries: Type.Optional(
          Type.Record(Type.String(), Type.Unknown()),
        ),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as {
          plot?: CsLabPlotDocument
          plotId?: string
          appendSeries?: CsLabPlotSeries
        }
        try {
          let plot: CsLabPlotDocument
          if (input.plot) {
            plot = { ...input.plot, labId }
          } else if (input.plotId && input.appendSeries) {
            const current = await loadPlot({ labId, plotId: input.plotId })
            if (!current) return jsonToolError('绘图文档不存在')
            const layer = current.layers[0]
            if (!layer) return jsonToolError('绘图文档没有可用图层')
            plot = {
              ...current,
              layers: [
                { ...layer, series: [...layer.series, input.appendSeries] },
                ...current.layers.slice(1),
              ],
              updatedAt: Date.now(),
            }
          } else {
            return jsonToolError('需要 plot，或 plotId + appendSeries')
          }

          // 覆盖写之前先留旧版本快照；首次创建无旧文件时返回 null。
          const undoToken = await createPlotUndoSnapshot({ labId, plotId: plot.id })
          const summary = await savePlot({ labId, plot })
          const savedPlot: CsLabPlotDocument = { ...plot, updatedAt: summary.updatedAt }
          broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_PLOT_UPDATED, {
            labId,
            plot: savedPlot,
            source: 'agent',
            undoToken: undoToken ?? undefined,
          })
          return jsonToolResult({
            plotId: summary.id,
            updatedAt: summary.updatedAt,
            undoToken,
            canUndo: Boolean(undoToken),
          })
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : '画板更新失败')
        }
      },
    }) as ToolDefinition,
  )

  tools.push(
    sdk.defineTool({
      name: 'cslab_export_figure',
      label: 'CSLab 导出出版图',
      description: '把已保存的绘图导出为 SVG/PDF/PNG/TIFF，返回文件路径与物理尺寸。',
      promptSnippet: 'cslab_export_figure: 导出期刊级 SVG/PDF/PNG/TIFF',
      parameters: Type.Object({
        plotId: Type.String({ minLength: 1 }),
        format: Type.Union([
          Type.Literal('svg'),
          Type.Literal('pdf'),
          Type.Literal('png'),
          Type.Literal('tiff'),
        ]),
        dpi: Type.Optional(Type.Union([Type.Literal(300), Type.Literal(600), Type.Literal(1200)])),
        widthMm: Type.Optional(Type.Number({ minimum: 20, maximum: 500 })),
        heightMm: Type.Optional(Type.Number({ minimum: 20, maximum: 500 })),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as {
          plotId: string
          format: CsLabPlotExportFormat
          dpi?: 300 | 600 | 1200
          widthMm?: number
          heightMm?: number
        }
        try {
          const plot = await loadPlot({ labId, plotId: input.plotId })
          if (!plot) return jsonToolError('绘图文档不存在')
          const result = await exportFigure({
            labId,
            plot,
            options: {
              format: input.format,
              dpi: input.dpi ?? 600,
              widthMm: input.widthMm,
              heightMm: input.heightMm,
              transparentBackground: false,
            },
          })
          return jsonToolResult(result)
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : '图表导出失败')
        }
      },
    }) as ToolDefinition,
  )


  tools.push(
    sdk.defineTool({
      name: 'cslab_create_structure',
      label: 'CSLab 创建晶体结构资产',
      description:
        '在实验室中创建一个新的晶体结构文件（CIF 或 POSCAR 格式），经铁笼校验后入笼保存并返回资产 URI。',
      promptSnippet: 'cslab_create_structure: 在实验室中创建 CIF/POSCAR 结构资产',
      parameters: Type.Object({
        title: Type.String({ minLength: 1, description: '结构标题（如 SrTiO3 钙钛矿晶胞）' }),
        format: Type.Union([Type.Literal('cif'), Type.Literal('poscar')]),
        content: Type.String({ minLength: 10, description: '标准 CIF 或 POSCAR 文本内容' }),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as { title: string; format: 'cif' | 'poscar'; content: string }
        let tempPath: string | null = null
        try {
          const ext = input.format === 'cif' ? '.cif' : '.poscar'
          const safeTitle = input.title.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '_')
          tempPath = join(app.getPath('temp'), `${Date.now()}-${randomUUID().slice(0, 6)}-${safeTitle}${ext}`)
          await fs.writeFile(tempPath, input.content, 'utf8')
          const result = await ingestMolAsset(labId, tempPath)
          broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, { labId, asset: result.asset })
          return jsonToolResult({
            uri: result.asset.uri,
            title: result.asset.title,
            format: result.asset.format,
            bytes: result.asset.bytes,
            message: '晶体结构已成功入笼并注册为实验室资产',
          })
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : '创建晶体结构失败')
        } finally {
          if (tempPath) await fs.unlink(tempPath).catch(() => undefined)
        }
      },
    }) as ToolDefinition,
  )

  tools.push(
    sdk.defineTool({
      name: 'cslab_focus_structure',
      label: 'CSLab 聚焦展示 3D 晶体视窗',
      description:
        '命令主窗口在 Stage 窗格中以 VESTA 3D 晶体工作台展开并聚焦该结构，可设置超晶胞倍数和配位多面体高亮。',
      promptSnippet: 'cslab_focus_structure: 在主窗口 VESTA 视窗中展示 3D 晶体',
      parameters: Type.Object({
        uri: Type.String({ minLength: 1, description: '晶体资产 URI' }),
        supercell: Type.Optional(
          Type.Object({
            na: Type.Integer({ minimum: 1, maximum: 5, default: 1 }),
            nb: Type.Integer({ minimum: 1, maximum: 5, default: 1 }),
            nc: Type.Integer({ minimum: 1, maximum: 5, default: 1 }),
          }),
        ),
        highlightPolyhedra: Type.Optional(Type.Boolean({ description: '是否高亮配位多面体' })),
      }),
      async execute(_toolCallId: string, params: unknown) {
        const input = params as {
          uri: string
          supercell?: { na: number; nb: number; nc: number }
          highlightPolyhedra?: boolean
        }
        try {
          broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_STRUCTURE_FOCUSED, {
            labId,
            uri: input.uri,
            supercell: input.supercell,
            highlightPolyhedra: input.highlightPolyhedra,
          })
          return jsonToolResult({
            uri: input.uri,
            status: 'focused',
            message: '已向主窗口发出 3D 晶体视窗展开指令',
          })
        } catch (error) {
          return jsonToolError(error instanceof Error ? error.message : '聚焦展示结构失败')
        }
      },
    }) as ToolDefinition,
  )

  return tools
}
