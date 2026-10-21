/**
 * CSLab 资产能力解析器
 *
 * 舞台窗格由「文件本质能力」决定，而不是由窗格类型倒推。
 * 所有判断只依赖资产元数据，不读取文件内容。
 */

import type {
  CsLabAssetSummary,
  CsLabFileAction,
  CsLabFileCapability,
} from '@profer/shared'

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp', 'avif'])

const TABLE_ACTIONS: CsLabFileAction[] = [
  'open-dataset',
  'open-origin-plot',
  'link-crystal',
  'run-tool',
  'export-table',
  'link-run',
]

const FIGURE_ACTIONS: CsLabFileAction[] = [
  'open-figure',
  'digitize-plot',
  'verify-formula',
]

function extensionOf(asset: CsLabAssetSummary): string {
  const source = asset.relPath || asset.title || ''
  const match = /\.([A-Za-z0-9]+)$/.exec(source)
  return match?.[1]?.toLowerCase() ?? ''
}

/** 是否为可直接在图表窗格渲染的图片资产（含 fig 与图片类 raw）。 */
export function isImageAsset(asset: CsLabAssetSummary): boolean {
  if (asset.layerType === 'fig') return true
  return IMAGE_EXTENSIONS.has(extensionOf(asset))
}

export function resolveAssetCapability(asset: CsLabAssetSummary): CsLabFileCapability {
  if (isImageAsset(asset)) {
    return { kind: 'figure', defaultView: 'figure', actions: FIGURE_ACTIONS }
  }

  switch (asset.layerType) {
    case 'table':
      return { kind: 'dataset', defaultView: 'table', actions: TABLE_ACTIONS }
    case 'raw':
      // raw 的具体落点由 openAssetInPane 通过 derived_from 血缘解析；
      // 能力层先声明为数据集，无法解析时上层回退资产抽屉。
      return { kind: 'dataset', defaultView: 'table', actions: TABLE_ACTIONS }
    case 'mol':
      return {
        kind: 'molecule',
        defaultView: 'mol',
        actions: ['open-structure', 'analyze-crystal', 'simulate-pxrd'],
      }
    case 'lit':
    case 'fact':
      return { kind: 'literature', defaultView: 'pdf', actions: ['open-literature'] }
    case 'doc':
      return { kind: 'manuscript', defaultView: 'manuscript', actions: ['open-manuscript'] }
    case 'note':
    case 'node':
      return {
        kind: 'canvas',
        defaultView: 'dag',
        actions: asset.format === 'canvas' ? ['open-canvas'] : [],
      }
    default:
      return { kind: 'generic', defaultView: 'empty', actions: [] }
  }
}
