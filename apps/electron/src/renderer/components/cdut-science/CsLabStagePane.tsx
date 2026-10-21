/**
 * CsLabStagePane — 单个科研窗格
 *
 * 窗格自身只接收资产拖拽（CSLAB_ASSET_MIME）；单元格拖拽必须继续下沉给
 * TipTap 编辑器处理，否则会抢走胶囊投递。
 */

import * as React from 'react'
import type { Editor } from '@tiptap/core'
import {
  Atom,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Sigma,
  Table2,
  Workflow,
  X,
} from 'lucide-react'
import type {
  CsLabAssetSummary,
  CsLabCanvasDocument,
  CsLabCanvasWriteResult,
  CsLabCapsule,
  CsLabCellRef,
  CsLabLiteratureItem,
  CsLabManuscript,
  CsLabMolAsset,
  CsLabTablePayload,
} from '@profer/shared'
import { canvasTitleFromRelPath } from '@profer/shared'
import { cn } from '@/lib/utils'
import type { CsLabPaneState, CsLabPdfSelection } from '@/atoms/cslab-atoms'
import { CsLabDatasetView } from './CsLabDatasetView'
import { CsLabFigureView } from './CsLabFigureView'
import { CsLabManuscriptEditor } from './CsLabManuscriptEditor'
import { CsLabPdfViewer } from './CsLabPdfViewer'
import { CsLabDagCanvas } from './CsLabDagCanvas'
import { CsLabOriginPlotPane } from './CsLabOriginPlotPane'
import { CsLabVestaCrystalPane } from './crystal/CsLabVestaCrystalPane'
import {
  CSLAB_ASSET_MIME,
  hasDragType,
  readAssetDrag,
  type CsLabAssetDragPayload,
} from './cslab-dnd'

interface CsLabStagePaneProps {
  pane: CsLabPaneState
  active: boolean
  isHidden?: boolean
  title?: string
  labId: string
  table: CsLabTablePayload | null
  manuscript: CsLabManuscript | null
  literature: CsLabLiteratureItem | null
  canvas: CsLabCanvasDocument | null
  mol: CsLabMolAsset | null
  figureAsset?: CsLabAssetSummary | null
  initialPage?: number
  loading: boolean
  saving: boolean
  staleCapsuleIds: Set<string>
  onActivate: () => void
  onClose: () => void
  onMaximize: () => void
  onEditorReady: (editor: Editor | null) => void
  onSaveManuscript: (
    docJson: unknown,
    title: string,
    capsules: CsLabCapsule[],
  ) => Promise<void>
  onSaveManuscriptAs?: (
    docJson: unknown,
    title: string,
    capsules: CsLabCapsule[],
  ) => Promise<void>
  onDirtyChange: (dirty: boolean) => void
  onTitleChange: (title: string) => void
  onCapsuleClick: (capsuleId: string) => void
  onCellClick: (cell: CsLabCellRef) => void
  onPdfSelection: (selection: CsLabPdfSelection) => void
  onDropAsset: (payload: CsLabAssetDragPayload) => void
  onCanvasSaved: (document: CsLabCanvasDocument, result: CsLabCanvasWriteResult) => void
  onToast: (
    kind: 'info' | 'success' | 'error',
    text: string,
    action?: { label: string; path: string },
  ) => void
}

export function CsLabStagePane({
  pane,
  active,
  isHidden = false,
  title,
  labId,
  table,
  manuscript,
  literature,
  canvas,
  mol,
  figureAsset,
  initialPage,
  loading,
  saving,
  staleCapsuleIds,
  onActivate,
  onClose,
  onMaximize,
  onEditorReady,
  onSaveManuscript,
  onSaveManuscriptAs,
  onDirtyChange,
  onTitleChange,
  onCapsuleClick,
  onCellClick,
  onPdfSelection,
  onDropAsset,
  onCanvasSaved,
  onToast,
}: CsLabStagePaneProps): React.ReactElement {
  const [assetOver, setAssetOver] = React.useState(false)

  const displayTitle =
    pane.viewType === 'manuscript'
      ? manuscript?.title ?? '论文文稿'
      : pane.viewType === 'table'
        ? title ?? (table ? `数据表 · ${table.totalRows} 行` : '数据表')
        : pane.viewType === 'pdf'
          ? literature?.title ?? '文献阅读'
          : pane.viewType === 'dag'
          ? pane.canvasRelPath
            ? canvasTitleFromRelPath(pane.canvasRelPath)
            : '推演画布'
          : pane.viewType === 'mol'
            ? mol?.title ?? '分子与晶体'
            : pane.viewType === 'figure'
              ? figureAsset?.title ?? title ?? '科研图表'
              : pane.viewType === 'origin-plot'
                ? title ?? '出版绘图'
                : '空窗格'

  return (
    <section
      aria-label={displayTitle}
      onMouseDown={onActivate}
      onDragOver={(event) => {
        if (!hasDragType(event.dataTransfer, CSLAB_ASSET_MIME)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
        setAssetOver(true)
      }}
      onDragLeave={() => setAssetOver(false)}
      onDrop={(event) => {
        if (!hasDragType(event.dataTransfer, CSLAB_ASSET_MIME)) return
        event.preventDefault()
        event.stopPropagation()
        setAssetOver(false)
        const payload = readAssetDrag(event.dataTransfer)
        if (payload) onDropAsset(payload)
      }}
      className={cn(
        'flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-cslab-surface transition-colors',
        isHidden && '!hidden',
        active ? 'border-cslab-border border-t-2 border-t-cslab-accent' : 'border-cslab-border',
        assetOver && 'border-cslab-accent/60 bg-cslab-accent/5',
      )}
    >
      <header className="flex h-8 shrink-0 items-center gap-2 border-b border-cslab-border px-2.5">
        {pane.viewType === 'table' ? (
          <Table2 size={11} className="shrink-0 text-cslab-muted" />
        ) : pane.viewType === 'pdf' ? (
          <BookOpen size={11} className="shrink-0 text-cslab-muted" />
        ) : pane.viewType === 'dag' ? (
          <Workflow size={11} className="shrink-0 text-cslab-muted" />
        ) : pane.viewType === 'mol' ? (
          <Atom size={11} className="shrink-0 text-cslab-muted" />
        ) : pane.viewType === 'figure' ? (
          <ImageIcon size={11} className="shrink-0 text-cslab-muted" />
        ) : pane.viewType === 'origin-plot' ? (
          <Sigma size={11} className="shrink-0 text-cslab-muted" />
        ) : (
          <FileText size={11} className="shrink-0 text-cslab-muted" />
        )}
        <span className="min-w-0 flex-1 truncate text-[11px] text-cslab-text">
          {displayTitle}
        </span>
        {pane.viewType !== 'empty' && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onMaximize()
              }}
              title="最大化当前窗格"
              aria-label="最大化当前窗格"
              className="rounded p-0.5 text-cslab-muted transition-colors hover:bg-cslab-bg hover:text-cslab-text"
            >
              <Maximize2 size={11} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onClose()
              }}
              title="关闭当前窗格"
              aria-label="关闭当前窗格"
              className="rounded p-0.5 text-cslab-muted transition-colors hover:bg-cslab-bg hover:text-cslab-text"
            >
              <X size={11} />
            </button>
          </>
        )}
      </header>

      <div className="min-h-0 flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-[11px] text-cslab-muted">
            <Loader2 size={13} className="animate-spin" />
            正在载入…
          </div>
        ) : pane.viewType === 'table' && table ? (
          <CsLabDatasetView
            labId={labId}
            pane={pane}
            table={table}
            title={title}
            onCellClick={onCellClick}
            onToast={onToast}
          />
        ) : pane.viewType === 'figure' && figureAsset ? (
          <CsLabFigureView labId={labId} asset={figureAsset} onToast={onToast} />
        ) : pane.viewType === 'manuscript' && manuscript ? (
          <CsLabManuscriptEditor
            labId={labId}
            manuscript={manuscript}
            staleCapsuleIds={staleCapsuleIds}
            saving={saving}
            onEditorReady={onEditorReady}
            onCapsuleClick={onCapsuleClick}
            onSave={onSaveManuscript}
            onSaveAs={onSaveManuscriptAs}
            onDirtyChange={onDirtyChange}
            onTitleChange={onTitleChange}
            onToast={onToast}
          />
        ) : pane.viewType === 'pdf' && literature ? (
          <CsLabPdfViewer
            labId={labId}
            literature={literature}
            initialPage={initialPage}
            onSelection={onPdfSelection}
          />
        ) : pane.viewType === 'dag' && canvas && pane.canvasRelPath ? (
          <CsLabDagCanvas
            labId={labId}
            relPath={pane.canvasRelPath}
            initialDocument={canvas}
            initialMtimeMs={pane.canvasMtimeMs ?? 0}
            onSaved={onCanvasSaved}
            onToast={onToast}
          />
        ) : pane.viewType === 'mol' && mol ? (
          <CsLabVestaCrystalPane labId={labId} asset={mol} onToast={onToast} />
        ) : pane.viewType === 'origin-plot' ? (
          <CsLabOriginPlotPane labId={labId} pane={pane} onToast={onToast} />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <div
              className={cn(
                'flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 text-center transition-colors',
                assetOver
                  ? 'border-cslab-accent/60 bg-cslab-accent/10'
                  : 'border-cslab-border',
              )}
            >
              <p className="text-[11px] text-cslab-muted">
                {assetOver ? '松手在此窗格打开' : '把左侧资产拖到这里'}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-cslab-muted/70">
                也可以点击左侧资产，在激活窗格中打开
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
