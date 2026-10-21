/**
 * CSLab 出版图导出（主进程）
 *
 * - SVG：共享纯函数直接生成；
 * - PNG/TIFF：离屏 BrowserWindow 渲染后截图；
 * - PDF：离屏 BrowserWindow + printToPDF 输出矢量 PDF。
 *
 * 零新增依赖；所有离屏窗口在 finally 中强制销毁。
 */

import { promises as fs } from 'node:fs'
import { BrowserWindow, nativeImage } from 'electron'
import type {
  CsLabPlotDocument,
  CsLabPlotExportOptions,
  CsLabPlotExportResult,
} from '@profer/shared'
import { JOURNAL_PRESETS, renderPlotSvg } from '@profer/shared'
import { encodeTiffRgb } from './cslab-tiff'

const MAX_PIXELS = 64_000_000

function resolveSize(plot: CsLabPlotDocument, options: CsLabPlotExportOptions): { widthMm: number; heightMm: number } {
  return {
    widthMm: options.widthMm ?? plot.sizeMm.width,
    heightMm: options.heightMm ?? plot.sizeMm.height,
  }
}

function pixelSize(widthMm: number, heightMm: number, dpi: number): { widthPx: number; heightPx: number } {
  const widthPx = Math.max(1, Math.round((widthMm / 25.4) * dpi))
  const heightPx = Math.max(1, Math.round((heightMm / 25.4) * dpi))
  if (widthPx * heightPx > MAX_PIXELS) {
    throw new Error(`导出像素数 ${widthPx}×${heightPx} 超过 6400 万上限，请降低 DPI 或物理尺寸`)
  }
  return { widthPx, heightPx }
}

function svgForPlot(plot: CsLabPlotDocument, widthMm: number, heightMm: number): string {
  const preset = JOURNAL_PRESETS[plot.presetId] ?? JOURNAL_PRESETS.default
  return renderPlotSvg({ ...plot, sizeMm: { width: widthMm, height: heightMm } }, preset)
}

function htmlForSvg(svg: string, widthPx: number, heightPx: number, transparent: boolean): string {
  const encoded = Buffer.from(svg, 'utf8').toString('base64')
  return [
    '<!doctype html><html><head><meta charset="utf-8">',
    '<style>',
    `html,body{margin:0;padding:0;width:${widthPx}px;height:${heightPx}px;overflow:hidden;`,
    `background:${transparent ? 'transparent' : '#ffffff'};}`,
    `img{display:block;width:${widthPx}px;height:${heightPx}px;}`,
    '</style></head><body>',
    `<img src="data:image/svg+xml;base64,${encoded}">`,
    '</body></html>',
  ].join('')
}

async function waitForWindowReady(win: BrowserWindow): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('离屏渲染窗口加载超时（15s）')), 15_000)
    win.webContents.once('did-finish-load', () => {
      clearTimeout(timer)
      resolve()
    })
    win.webContents.once('did-fail-load', (_event, code, description) => {
      clearTimeout(timer)
      reject(new Error(`离屏渲染窗口加载失败：${code} ${description}`))
    })
  })
  try {
    await win.webContents.executeJavaScript('document.fonts.ready.then(() => true)')
  } catch {
    // 字体 API 不可用时继续，Chromium 会在截图前完成排版
  }
  await new Promise((resolve) => setTimeout(resolve, 80))
}

async function withOffscreenWindow<T>(
  html: string,
  widthPx: number,
  heightPx: number,
  transparent: boolean,
  task: (win: BrowserWindow) => Promise<T>,
): Promise<T> {
  const win = new BrowserWindow({
    show: false,
    width: Math.max(1, widthPx),
    height: Math.max(1, heightPx),
    backgroundColor: transparent ? '#00000000' : '#ffffffff',
    webPreferences: {
      offscreen: true,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })
  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    await waitForWindowReady(win)
    return await task(win)
  } finally {
    if (!win.isDestroyed()) win.destroy()
  }
}

async function rasterizePlot(
  plot: CsLabPlotDocument,
  options: CsLabPlotExportOptions,
  widthMm: number,
  heightMm: number,
): Promise<{ buffer: Buffer; widthPx: number; heightPx: number }> {
  const { widthPx, heightPx } = pixelSize(widthMm, heightMm, options.dpi)
  if (options.rasterDataUrl) {
    const image = nativeImage.createFromDataURL(options.rasterDataUrl)
    if (image.isEmpty()) throw new Error('渲染进程提供的位图数据无效')
    return { buffer: image.toPNG(), widthPx, heightPx }
  }
  const svg = svgForPlot(plot, widthMm, heightMm)
  const html = htmlForSvg(svg, widthPx, heightPx, options.transparentBackground)
  return withOffscreenWindow(html, widthPx, heightPx, options.transparentBackground, async (win) => {
    // 确保页面按目标像素尺寸排版
    win.setContentSize(widthPx, heightPx)
    const image = await win.webContents.capturePage({ x: 0, y: 0, width: widthPx, height: heightPx })
    return { buffer: image.toPNG(), widthPx, heightPx }
  })
}

async function renderPdf(
  plot: CsLabPlotDocument,
  options: CsLabPlotExportOptions,
  widthMm: number,
  heightMm: number,
): Promise<Buffer> {
  const { widthPx, heightPx } = pixelSize(widthMm, heightMm, options.dpi)
  const svg = svgForPlot(plot, widthMm, heightMm)
  const html = htmlForSvg(svg, widthPx, heightPx, options.transparentBackground)
  return withOffscreenWindow(html, widthPx, heightPx, options.transparentBackground, async (win) => {
    return win.webContents.printToPDF({
      printBackground: true,
      pageSize: { width: Math.round(widthMm * 1000), height: Math.round(heightMm * 1000) },
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    })
  })
}

/** 导出绘图到指定路径，返回文件元数据。 */
export async function exportPlotToFile(
  plot: CsLabPlotDocument,
  options: CsLabPlotExportOptions,
  targetPath: string,
): Promise<CsLabPlotExportResult> {
  const { widthMm, heightMm } = resolveSize(plot, options)
  // 仅位图导出需要像素上限校验；SVG/PDF 为矢量输出
  if (options.format === 'png' || options.format === 'tiff') {
    pixelSize(widthMm, heightMm, options.dpi)
  }

  let buffer: Buffer
  if (options.format === 'svg') {
    buffer = Buffer.from(svgForPlot(plot, widthMm, heightMm), 'utf8')
  } else if (options.format === 'pdf') {
    buffer = await renderPdf(plot, options, widthMm, heightMm)
  } else if (options.format === 'png') {
    const raster = await rasterizePlot(plot, options, widthMm, heightMm)
    buffer = raster.buffer
  } else {
    const raster = await rasterizePlot(plot, options, widthMm, heightMm)
    const image = nativeImage.createFromBuffer(raster.buffer)
    if (image.isEmpty()) throw new Error('PNG 位图解码失败，无法生成 TIFF')
    buffer = encodeTiffRgb(
      raster.widthPx,
      raster.heightPx,
      image.toBitmap(),
      options.dpi,
      options.transparentBackground,
    )
  }

  await fs.writeFile(targetPath, buffer)
  return {
    path: targetPath,
    format: options.format,
    bytes: buffer.length,
    dpi: options.dpi,
    widthMm,
    heightMm,
  }
}
