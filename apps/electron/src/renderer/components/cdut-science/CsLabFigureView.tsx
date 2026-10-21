/**
 * CsLabFigureView — 科研图表与图像窗格
 *
 * 能力：高保真平移缩放、超大图分辨率预检、
 * 一键逆向数字化（全图）与框选公式验算（局部裁剪）。
 *
 * 红线：所有 Canvas 光栅化统一限制最大边 4096 / 总像素 24MP，
 * 绝不以原始分辨率直接 drawImage 超大图。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import {
  Crosshair,
  Loader2,
  RefreshCw,
  ScanText,
  Triangle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import type { CsLabAssetDataUrl, CsLabAssetSummary } from '@profer/shared'
import { cn } from '@/lib/utils'
import { cslabDrawerAtom, type CsLabPdfSelection } from '@/atoms/cslab-atoms'

interface CsLabFigureViewProps {
  labId: string
  asset: CsLabAssetSummary
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

const MAX_EDGE = 4096
const MAX_PIXELS = 24_000_000
const HARD_MAX_EDGE = 12_000

interface RasterResult {
  dataUrl: string
  width: number
  height: number
  scaled: boolean
}

interface SelectionRect {
  x0: number
  y0: number
  x1: number
  y1: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number): number {
  return clamp(value, 0, 1)
}

export function CsLabFigureView({
  labId,
  asset,
  onToast,
}: CsLabFigureViewProps): React.ReactElement {
  const setDrawer = useSetAtom(cslabDrawerAtom)
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  const imageRef = React.useRef<HTMLImageElement | null>(null)

  const [image, setImage] = React.useState<CsLabAssetDataUrl | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [naturalSize, setNaturalSize] = React.useState<{ width: number; height: number } | null>(null)
  const [scale, setScale] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [formulaMode, setFormulaMode] = React.useState(false)
  const [selection, setSelection] = React.useState<SelectionRect | null>(null)
  const [busy, setBusy] = React.useState<'digitize' | 'formula' | null>(null)

  const dragRef = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const selectStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const viewRef = React.useRef({ scale: 1, x: 0, y: 0 })

  React.useEffect(() => {
    viewRef.current = { scale, x: offset.x, y: offset.y }
  }, [scale, offset])

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setImage(null)
    setNaturalSize(null)
    viewRef.current = { scale: 1, x: 0, y: 0 }
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setFormulaMode(false)
    setSelection(null)
    void window.electronAPI.cslab
      .getAssetDataUrl({ labId, uri: asset.uri })
      .then((payload) => {
        if (!cancelled) setImage(payload)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '图像读取失败')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [asset.uri, labId])

  // 滚轮缩放必须以光标为中心，React 的 onWheel 在根节点是被动监听，无法 preventDefault。
  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault()
      const rect = viewport.getBoundingClientRect()
      const cursorX = event.clientX - rect.left - rect.width / 2
      const cursorY = event.clientY - rect.top - rect.height / 2
      const current = viewRef.current
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12
      const nextScale = clamp(current.scale * factor, 0.2, 8)
      const nextOffset = {
        x: cursorX - ((cursorX - current.x) * nextScale) / current.scale,
        y: cursorY - ((cursorY - current.y) * nextScale) / current.scale,
      }
      viewRef.current = { scale: nextScale, ...nextOffset }
      setScale(nextScale)
      setOffset(nextOffset)
    }
    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [])

  const dimensions = React.useMemo(() => {
    if (!image) return null
    const width = image.width ?? naturalSize?.width
    const height = image.height ?? naturalSize?.height
    if (!width || !height) return null
    return { width, height, pixels: width * height }
  }, [image, naturalSize])

  const tooLarge = !!dimensions && Math.max(dimensions.width, dimensions.height) > HARD_MAX_EDGE
  const downsampled =
    !!dimensions && (Math.max(dimensions.width, dimensions.height) > MAX_EDGE || dimensions.pixels > MAX_PIXELS)

  const rasterize = React.useCallback(async (): Promise<RasterResult> => {
    const img = imageRef.current
    if (!img) throw new Error('图像尚未加载完成')
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight
    if (!naturalWidth || !naturalHeight) throw new Error('图像尺寸不可用')

    let ratio = Math.min(1, MAX_EDGE / Math.max(naturalWidth, naturalHeight))
    if (naturalWidth * naturalHeight * ratio * ratio > MAX_PIXELS) {
      ratio = Math.sqrt(MAX_PIXELS / (naturalWidth * naturalHeight))
    }
    const width = Math.max(1, Math.round(naturalWidth * ratio))
    const height = Math.max(1, Math.round(naturalHeight * ratio))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('浏览器未提供 2D 画布上下文')
    context.drawImage(img, 0, 0, width, height)
    return {
      dataUrl: canvas.toDataURL('image/png'),
      width,
      height,
      scaled: ratio < 1,
    }
  }, [])

  const handleDigitize = async (): Promise<void> => {
    if (tooLarge) {
      onToast('error', '图片分辨率过高，请先离线降采样后再数字化')
      return
    }
    setBusy('digitize')
    try {
      const raster = await rasterize()
      if (raster.scaled) {
        onToast('info', `图像已降采样至 ${raster.width}×${raster.height} 用于数字化`)
      }
      const payload: CsLabPdfSelection = {
        literatureUri: asset.uri,
        pageIndex: 0,
        pageWidth: raster.width,
        pageHeight: raster.height,
        rect: { x: 0, y: 0, width: raster.width, height: raster.height },
        cropDataUrl: raster.dataUrl,
      }
      setDrawer({
        open: true,
        mode: 'plot',
        title: '图表逆向数字化',
        selection: payload,
      })
    } catch (err) {
      onToast('error', err instanceof Error ? err.message : '图像光栅化失败')
    } finally {
      setBusy(null)
    }
  }

  const handleFormula = (): void => {
    if (tooLarge) {
      onToast('error', '图片分辨率过高，请先离线降采样后再识别公式')
      return
    }
    setFormulaMode((value) => !value)
    setSelection(null)
  }

  const finishFormulaSelection = async (rect: SelectionRect): Promise<void> => {
    const img = imageRef.current
    if (!img) return
    const imgRect = img.getBoundingClientRect()
    if (imgRect.width <= 0 || imgRect.height <= 0) return

    const nx0 = clamp01((Math.min(rect.x0, rect.x1) - imgRect.left) / imgRect.width)
    const ny0 = clamp01((Math.min(rect.y0, rect.y1) - imgRect.top) / imgRect.height)
    const nx1 = clamp01((Math.max(rect.x0, rect.x1) - imgRect.left) / imgRect.width)
    const ny1 = clamp01((Math.max(rect.y0, rect.y1) - imgRect.top) / imgRect.height)
    if (nx1 - nx0 < 0.01 || ny1 - ny0 < 0.01) {
      onToast('info', '框选区域过小，请重新框选公式')
      return
    }

    setBusy('formula')
    try {
      const raster = await rasterize()
      const sx = Math.floor(nx0 * raster.width)
      const sy = Math.floor(ny0 * raster.height)
      const sw = Math.max(1, Math.ceil((nx1 - nx0) * raster.width))
      const sh = Math.max(1, Math.ceil((ny1 - ny0) * raster.height))

      // 先在降采样后的光栅画布上绘制，再裁剪，避免直接按原始分辨率操作超大图。
      const rasterCanvas = document.createElement('canvas')
      rasterCanvas.width = raster.width
      rasterCanvas.height = raster.height
      const rasterContext = rasterCanvas.getContext('2d')
      if (!rasterContext) throw new Error('浏览器未提供 2D 画布上下文')
      rasterContext.drawImage(imageRef.current!, 0, 0, raster.width, raster.height)

      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      const context = canvas.getContext('2d')
      if (!context) throw new Error('浏览器未提供 2D 画布上下文')
      context.drawImage(rasterCanvas, sx, sy, sw, sh, 0, 0, sw, sh)

      const payload: CsLabPdfSelection = {
        literatureUri: asset.uri,
        pageIndex: 0,
        pageWidth: raster.width,
        pageHeight: raster.height,
        rect: {
          x: Math.round(nx0 * raster.width),
          y: Math.round(ny0 * raster.height),
          width: sw,
          height: sh,
        },
        cropDataUrl: canvas.toDataURL('image/png'),
      }
      setDrawer({
        open: true,
        mode: 'formula',
        title: '公式识别与验算',
        selection: payload,
      })
      setFormulaMode(false)
      setSelection(null)
      onToast('success', '已截取公式区域')
    } catch (err) {
      onToast('error', err instanceof Error ? err.message : '公式区域裁剪失败')
    } finally {
      setBusy(null)
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!image || busy) return
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.setPointerCapture(event.pointerId)
    if (formulaMode) {
      selectStartRef.current = { x: event.clientX, y: event.clientY }
      setSelection({
        x0: event.clientX,
        y0: event.clientY,
        x1: event.clientX,
        y1: event.clientY,
      })
      return
    }
    dragRef.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (formulaMode && selectStartRef.current) {
      const start = selectStartRef.current
      setSelection({
        x0: start.x,
        y0: start.y,
        x1: event.clientX,
        y1: event.clientY,
      })
      return
    }
    const drag = dragRef.current
    if (!drag) return
    const nextOffset = {
      x: drag.ox + (event.clientX - drag.x),
      y: drag.oy + (event.clientY - drag.y),
    }
    viewRef.current = { scale: viewRef.current.scale, ...nextOffset }
    setOffset(nextOffset)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (formulaMode && selectStartRef.current) {
      const start = selectStartRef.current
      selectStartRef.current = null
      void finishFormulaSelection({
        x0: start.x,
        y0: start.y,
        x1: event.clientX,
        y1: event.clientY,
      })
      return
    }
    dragRef.current = null
  }

  const selectionStyle = selection
    ? (() => {
        const overlay = overlayRef.current
        if (!overlay) return undefined
        const rect = overlay.getBoundingClientRect()
        const left = Math.min(selection.x0, selection.x1) - rect.left
        const top = Math.min(selection.y0, selection.y1) - rect.top
        const width = Math.abs(selection.x1 - selection.x0)
        const height = Math.abs(selection.y1 - selection.y0)
        return { left, top, width, height }
      })()
    : undefined

  return (
    <div className="flex h-full min-h-0 flex-col bg-cslab-bg">
      <div className="flex h-8 shrink-0 flex-wrap items-center gap-1.5 border-b border-cslab-border px-2">
        <span className="max-w-[220px] truncate text-[10px] text-cslab-muted">{asset.title}</span>
        {dimensions && (
          <span className="text-[9px] tabular-nums text-cslab-muted/80">
            {dimensions.width}×{dimensions.height}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setScale((value) => clamp(value / 1.2, 0.2, 8))}
            title="缩小"
            aria-label="缩小"
            className="rounded p-0.5 text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text"
          >
            <ZoomOut size={11} />
          </button>
          <span className="w-8 text-center text-[9px] tabular-nums text-cslab-muted">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((value) => clamp(value * 1.2, 0.2, 8))}
            title="放大"
            aria-label="放大"
            className="rounded p-0.5 text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text"
          >
            <ZoomIn size={11} />
          </button>
          <button
            type="button"
            onClick={() => {
              viewRef.current = { scale: 1, x: 0, y: 0 }
              setScale(1)
              setOffset({ x: 0, y: 0 })
            }}
            title="重置视图"
            aria-label="重置视图"
            className="rounded p-0.5 text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text"
          >
            <RefreshCw size={11} />
          </button>
          <span className="mx-0.5 h-4 w-px bg-cslab-border" aria-hidden="true" />
          <button
            type="button"
            disabled={!image || !naturalSize || busy !== null || tooLarge}
            onClick={() => void handleDigitize()}
            className="inline-flex items-center gap-1 rounded-md bg-cslab-accent px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-cslab-accentHover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === 'digitize' ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Crosshair size={10} />
            )}
            逆向数字化
          </button>
          <button
            type="button"
            disabled={!image || !naturalSize || busy !== null || tooLarge}
            onClick={handleFormula}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              formulaMode
                ? 'border-cslab-accent/50 bg-cslab-accent/10 text-cslab-accent'
                : 'border-cslab-border text-cslab-muted hover:text-cslab-text',
            )}
          >
            <ScanText size={10} />
            {formulaMode ? '拖拽框选公式…' : '框选公式验算'}
          </button>
        </div>
      </div>

      {(downsampled || tooLarge) && (
        <p
          className={cn(
            'shrink-0 border-b px-2 py-1 text-[9px] leading-relaxed',
            tooLarge
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-amber-200 bg-amber-50 text-amber-700',
          )}
        >
          {tooLarge
            ? `图片分辨率 ${dimensions?.width}×${dimensions?.height} 过高，已禁用数字化与公式识别；请先离线降采样至 12000px 以内。`
            : `图片分辨率 ${dimensions?.width}×${dimensions?.height}，数字化时将按 4096 长边 / 24MP 上限降采样。`}
        </p>
      )}

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 overflow-hidden bg-[#FAF9F5]"
      >
        {loading && (
          <div className="flex h-full items-center justify-center gap-2 text-[11px] text-cslab-muted">
            <Loader2 size={13} className="animate-spin" />
            正在载入图像…
          </div>
        )}
        {!loading && error && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Triangle size={16} className="text-red-500" />
            <p className="text-[11px] leading-relaxed text-red-600">{error}</p>
          </div>
        )}
        {!loading && !error && image && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
              <img
                ref={imageRef}
                src={image.dataUrl}
                alt={asset.title}
                draggable={false}
                onLoad={(event) => {
                  setNaturalSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })
                }}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                }}
                className="max-h-full max-w-full select-none object-contain"
              />
            </div>
            <div
              ref={overlayRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                selectStartRef.current = null
                dragRef.current = null
                setSelection(null)
              }}
              className={cn(
                'absolute inset-0 touch-none',
                formulaMode
                  ? 'cursor-crosshair'
                  : dragRef.current
                    ? 'cursor-grabbing'
                    : 'cursor-grab',
              )}
            >
              {formulaMode && selectionStyle && (
                <div
                  className="pointer-events-none absolute border border-cslab-accent bg-cslab-accent/10"
                  style={selectionStyle}
                />
              )}
            </div>
          </>
        )}
      </div>

      <p className="shrink-0 border-t border-cslab-border px-2 py-1 text-[9px] leading-relaxed text-cslab-muted">
        滚轮以光标为中心缩放，拖拽平移；「逆向数字化」使用全图，「框选公式验算」只截取所选区域。
      </p>
    </div>
  )
}
