/**
 * CsLabAssetRail — 六维科研资产导航
 *
 * 按文献 / 笔记 / 实验 / 数据 / 图表 / 文稿六个维度分组；
 * 所有条目来自真实资产，空维度显示克制的空态说明。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import {
  Atom,
  BookOpen,
  Database,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Loader2,
  Lock,
  PenLine,
  Plus,
  Search,
  type LucideIcon,
} from 'lucide-react'
import type {
  CsLabAssetSummary,
  CsLabCellRef,
  CsLabLayerType,
  CsLabManuscriptSummary,
  CsLabPlotSummary,
} from '@profer/shared'
import { cn } from '@/lib/utils'
import { cslabAssetDragAtom } from '@/atoms/cslab-atoms'
import {
  CSLAB_ASSET_MIME,
  CSLAB_CELL_MIME,
  hasDragType,
  readCellRef,
  type CsLabAssetDragPayload,
} from './cslab-dnd'

interface CsLabAssetRailProps {
  assets: CsLabAssetSummary[]
  manuscripts: CsLabManuscriptSummary[]
  plotList?: CsLabPlotSummary[]
  activeAssetUri: string | null
  activeManuscriptUri: string | null
  loading: boolean
  onSelectAsset: (asset: CsLabAssetSummary) => void
  onSelectManuscript: (manuscript: CsLabManuscriptSummary) => void
  onSelectPlot?: (plotId: string) => void
  onCreateManuscript: () => void
  onAppendCellToManuscript: (
    manuscript: CsLabManuscriptSummary,
    cellRef: CsLabCellRef,
  ) => void
}

interface AssetGroup {
  id: string
  label: string
  layerTypes: CsLabLayerType[]
  icon: LucideIcon
}

const GROUPS: AssetGroup[] = [
  { id: 'lit', label: '文献与事实', layerTypes: ['lit', 'fact'], icon: BookOpen },
  { id: 'note', label: '笔记与节点', layerTypes: ['note', 'node'], icon: PenLine },
  { id: 'run', label: '实验规程', layerTypes: ['proto', 'run'], icon: FlaskConical },
  { id: 'data', label: '数据铁笼', layerTypes: ['raw', 'table'], icon: Database },
  { id: 'figure', label: '科研图表', layerTypes: ['fig'], icon: ImageIcon },
]

/** 分子/晶体结构单独成组。 */
const EXTRA_GROUP: AssetGroup = {
  id: 'mol',
  label: '分子与晶体',
  layerTypes: ['mol'],
  icon: Atom,
}

function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function CsLabAssetRail({
  assets,
  manuscripts,
  plotList,
  activeAssetUri,
  activeManuscriptUri,
  loading,
  onSelectAsset,
  onSelectManuscript,
  onSelectPlot,
  onCreateManuscript,
  onAppendCellToManuscript,
}: CsLabAssetRailProps): React.ReactElement {
  const [query, setQuery] = React.useState('')
  const [dropTargetUri, setDropTargetUri] = React.useState<string | null>(null)
  const setAssetDrag = useSetAtom(cslabAssetDragAtom)

  const startAssetDrag = (
    event: React.DragEvent<HTMLElement>,
    payload: CsLabAssetDragPayload,
  ): void => {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData(CSLAB_ASSET_MIME, JSON.stringify(payload))
    event.dataTransfer.setData('text/plain', payload.title)
    setAssetDrag(payload)
  }

  const endAssetDrag = (): void => {
    setAssetDrag(null)
  }

  const filtered = React.useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return assets
    return assets.filter((asset) =>
      [asset.title, asset.format ?? '', asset.uri].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  }, [assets, query])

  const grouped = React.useMemo(() => {
    const map = new Map<string, CsLabAssetSummary[]>()
    for (const group of [...GROUPS, EXTRA_GROUP]) {
      map.set(
        group.id,
        filtered.filter((asset) => group.layerTypes.includes(asset.layerType)),
      )
    }
    return map
  }, [filtered])

  const filteredManuscripts = React.useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return manuscripts
    return manuscripts.filter((item) => item.title.toLowerCase().includes(keyword))
  }, [manuscripts, query])

  return (
    <aside className="flex w-[248px] shrink-0 flex-col border-r border-cslab-border bg-cslab-bg">
      <div className="px-3 pb-2 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-cslab-border bg-cslab-elevated px-2.5 py-1.5">
          <Search size={13} className="shrink-0 text-cslab-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索资产…"
            aria-label="搜索资产"
            className="w-full bg-transparent text-xs text-cslab-text placeholder:text-cslab-muted/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {loading && (
          <div className="flex items-center gap-2 px-2 py-4 text-[11px] text-cslab-muted">
            <Loader2 size={12} className="animate-spin" />
            正在载入资产…
          </div>
        )}

        {[...GROUPS, EXTRA_GROUP].map((group) => {
          const items = grouped.get(group.id) ?? []
          if (items.length === 0) return null
          const Icon = group.icon
          // 万篇笔记场景下避免一次性渲染全部条目；搜索框仍可在全量资产中定位。
          const visibleItems = items.slice(0, 80)
          return (
            <section key={group.id} className="mt-3">
              <div className="flex items-center gap-1.5 px-2 pb-1">
                <Icon size={11} className="text-cslab-muted" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-cslab-muted">
                  {group.label}
                </span>
                <span className="ml-auto text-[10px] tabular-nums text-cslab-muted/70">
                  {items.length}
                </span>
              </div>
              <ul className="space-y-0.5">
                {visibleItems.map((asset) => {
                  const active = activeAssetUri === asset.uri
                  return (
                    <li key={asset.uri}>
                      <button
                        type="button"
                        onClick={() => onSelectAsset(asset)}
                        draggable={
                          asset.layerType === 'table' ||
                          asset.layerType === 'doc' ||
                          asset.layerType === 'lit'
                        }
                        onDragStart={(event) => {
                          if (
                            asset.layerType !== 'table' &&
                            asset.layerType !== 'doc' &&
                            asset.layerType !== 'lit'
                          ) {
                            event.preventDefault()
                            return
                          }
                          startAssetDrag(event, {
                            kind: 'asset',
                            uri: asset.uri,
                            title: asset.title,
                            layerType: asset.layerType,
                          })
                        }}
                        onDragEnd={endAssetDrag}
                        className={cn(
                          'group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                          active
                            ? 'bg-cslab-surface text-cslab-text'
                            : 'text-cslab-muted hover:bg-cslab-surface/70 hover:text-cslab-text',
                        )}
                      >
                        <span className="mt-0.5 shrink-0">
                          {asset.locked ? (
                            <Lock size={11} className="text-cslab-muted/70" />
                          ) : (
                            <FileText size={11} className="text-cslab-muted/70" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] leading-snug">
                            {asset.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-cslab-muted/80">
                            {asset.format && <span className="uppercase">{asset.format}</span>}
                            {asset.bytes ? <span>{formatBytes(asset.bytes)}</span> : null}
                            {asset.unsupported && (
                              <span className="text-amber-600">未解析</span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              {items.length > visibleItems.length && (
                <p className="px-2 pt-1 text-[10px] leading-relaxed text-cslab-muted/70">
                  另有 {items.length - visibleItems.length} 项，请在「笔记」抽屉中搜索
                </p>
              )}
            </section>
          )
        })}

        {plotList && plotList.length > 0 ? (
          <section className="mt-3">
            <div className="flex items-center gap-1.5 px-2 pb-1">
              <ImageIcon size={11} className="text-cslab-muted" />
              <span className="text-[10px] uppercase tracking-[0.16em] text-cslab-muted">
                出版图
              </span>
              <span className="ml-auto text-[10px] tabular-nums text-cslab-muted/70">
                {plotList.length}
              </span>
            </div>
            <ul className="space-y-0.5">
              {plotList.slice(0, 40).map((plot) => (
                <li key={plot.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPlot?.(plot.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-cslab-muted transition-colors hover:bg-cslab-surface/70 hover:text-cslab-text"
                  >
                    <ImageIcon size={11} className="shrink-0 text-cslab-muted/70" />
                    <span className="min-w-0 flex-1 truncate text-[12px]">{plot.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-4">
          <div className="flex items-center gap-1.5 px-2 pb-1">
            <FileText size={11} className="text-cslab-muted" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-cslab-muted">
              论文文稿
            </span>
            <button
              type="button"
              onClick={onCreateManuscript}
              title="新建文稿"
              aria-label="新建文稿"
              className="ml-auto rounded p-0.5 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-accent"
            >
              <Plus size={12} />
            </button>
          </div>

          {filteredManuscripts.length === 0 ? (
            <p className="px-2 py-2 text-[11px] leading-relaxed text-cslab-muted/70">
              还没有文稿。新建后即可把数据表单元格拖入正文，生成活体胶囊。
            </p>
          ) : (
            <ul className="space-y-0.5">
              {filteredManuscripts.map((manuscript) => {
                const active = activeManuscriptUri === manuscript.uri
                return (
                  <li key={manuscript.uri}>
                    <button
                      type="button"
                      onClick={() => onSelectManuscript(manuscript)}
                      draggable
                      onDragStart={(event) =>
                        startAssetDrag(event, {
                          kind: 'manuscript',
                          uri: manuscript.uri,
                          title: manuscript.title,
                        })
                      }
                      onDragEnd={endAssetDrag}
                      onDragOver={(event) => {
                        if (!hasDragType(event.dataTransfer, CSLAB_CELL_MIME)) return
                        event.preventDefault()
                        event.dataTransfer.dropEffect = 'copy'
                        setDropTargetUri(manuscript.uri)
                      }}
                      onDragLeave={() => {
                        setDropTargetUri((current) =>
                          current === manuscript.uri ? null : current,
                        )
                      }}
                      onDrop={(event) => {
                        if (!hasDragType(event.dataTransfer, CSLAB_CELL_MIME)) return
                        event.preventDefault()
                        event.stopPropagation()
                        setDropTargetUri(null)
                        const cellRef = readCellRef(event.dataTransfer)
                        if (cellRef) onAppendCellToManuscript(manuscript, cellRef)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                        dropTargetUri === manuscript.uri
                          ? 'bg-cslab-accent/10 ring-1 ring-cslab-accent/50'
                          : active
                            ? 'bg-cslab-surface text-cslab-text'
                            : 'text-cslab-muted hover:bg-cslab-surface/70 hover:text-cslab-text',
                      )}
                    >
                      <FileText size={11} className="shrink-0 text-cslab-muted/70" />
                      <span className="min-w-0 flex-1 truncate text-[12px]">
                        {manuscript.title}
                      </span>
                      {manuscript.hasDocx && (
                        <span className="shrink-0 text-[9px] uppercase tracking-wide text-cslab-accent">
                          docx
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {!loading && assets.length === 0 && manuscripts.length === 0 && (
          <p className="mt-4 rounded-lg border border-dashed border-cslab-border px-2.5 py-3 text-[11px] leading-relaxed text-cslab-muted">
            把仪器文件拖入右侧主舞台即可开始。原始文件将以 SHA-256 只读入笼。
          </p>
        )}
      </div>
    </aside>
  )
}
