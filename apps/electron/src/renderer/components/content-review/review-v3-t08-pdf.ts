/**
 * T08: actual A4 PDF bytes from the selected Run's already audience-filtered
 * report. Uses the Chromium canvas available in Electron: no remote service,
 * no server filesystem permission and no Latin-only standard PDF font.
 *
 * The report is painted as page images to preserve Chinese on machines without
 * bundled CJK PDF fonts. It is a real multi-page PDF, but not searchable text.
 * L may later replace this with Main printToPDF for selectable glyphs.
 */

export interface T08PdfPage {
  width: number
  height: number
  jpeg: Uint8Array
}

const enc = new TextEncoder()
const bytes = (text: string): Uint8Array => enc.encode(text)
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89

/** Low-level PDF assembler; separated from canvas so page streams can be tested. */
export function encodeT08ImagePdf(pages: T08PdfPage[]): Uint8Array {
  if (!pages.length) throw new Error('PDF 没有可输出的页面')
  const chunks: Uint8Array[] = []
  const offsets: number[] = [0]
  let cursor = 0
  const append = (data: Uint8Array | string) => {
    const next = typeof data === 'string' ? bytes(data) : data
    chunks.push(next)
    cursor += next.byteLength
  }
  const object = (id: number, build: () => void) => {
    offsets[id] = cursor
    append(id + ' 0 obj\n')
    build()
    append('\nendobj\n')
  }

  append('%PDF-1.4\n%T08\n')
  object(1, () => append('<< /Type /Catalog /Pages 2 0 R >>'))
  object(2, () => append('<< /Type /Pages /Kids [' +
    pages.map((_, i) => (3 + 3 * i) + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>'))

  pages.forEach((page, i) => {
    if (!page.jpeg.length || page.width < 1 || page.height < 1) throw new Error('PDF 页面图像无效')
    const pageId = 3 + 3 * i
    const imageId = pageId + 1
    const contentId = pageId + 2
    const imageName = 'Im' + i
    object(pageId, () => append('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' +
      PAGE_WIDTH + ' ' + PAGE_HEIGHT + '] /Resources << /XObject << /' +
      imageName + ' ' + imageId + ' 0 R >> >> /Contents ' + contentId + ' 0 R >>'))
    object(imageId, () => {
      append('<< /Type /XObject /Subtype /Image /Width ' + page.width +
        ' /Height ' + page.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8' +
        ' /Filter /DCTDecode /Length ' + page.jpeg.byteLength + ' >>\nstream\n')
      append(page.jpeg)
      append('\nendstream')
    })
    const stream = 'q\n' + PAGE_WIDTH + ' 0 0 ' + PAGE_HEIGHT + ' 0 0 cm\n/' + imageName + ' Do\nQ\n'
    object(contentId, () => append('<< /Length ' + bytes(stream).byteLength + ' >>\nstream\n' + stream + 'endstream'))
  })

  const xref = cursor
  const count = 3 + pages.length * 3
  append('xref\n0 ' + count + '\n0000000000 65535 f \n')
  for (let i = 1; i < count; i++) {
    append(String(offsets[i]).padStart(10, '0') + ' 00000 n \n')
  }
  append('trailer\n<< /Size ' + count + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n')
  const result = new Uint8Array(cursor)
  let at = 0
  for (const chunk of chunks) {
    result.set(chunk, at)
    at += chunk.byteLength
  }
  return result
}

function fromJpegDataUrl(data: string): Uint8Array {
  const marker = 'data:image/jpeg;base64,'
  if (!data.startsWith(marker)) throw new Error('当前客户端不支持生成 JPEG PDF 页面')
  const raw = atob(data.slice(marker.length))
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

/** Render audience-filtered Markdown text into real printable PDF pages. */
export function renderT08ReportPdf(markdown: string, title = '审核报告'): Uint8Array {
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(PAGE_WIDTH * scale)
  canvas.height = Math.round(PAGE_HEIGHT * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('PDF 页面画布不可用')

  ctx.scale(scale, scale)
  const margin = 42
  const printableWidth = PAGE_WIDTH - margin * 2
  const bottom = PAGE_HEIGHT - 50
  const pages: T08PdfPage[] = []
  let y = 64

  const begin = () => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)
    ctx.fillStyle = '#222222'
    ctx.font = '12px "Noto Sans CJK SC","Microsoft YaHei","PingFang SC",sans-serif'
    ctx.fillText(title.slice(0, 72), margin, 29)
    ctx.fillStyle = '#777777'
    ctx.font = '10px sans-serif'
    ctx.fillText('Page ' + (pages.length + 1), PAGE_WIDTH - 85, PAGE_HEIGHT - 26)
    ctx.fillStyle = '#222222'
    y = 64
  }
  const finish = () => {
    pages.push({ width: canvas.width, height: canvas.height, jpeg: fromJpegDataUrl(canvas.toDataURL('image/jpeg', 0.90)) })
  }
  begin()

  for (const source of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const match = /^(#{1,4})\s+/.exec(source)
    const heading = match?.[1]?.length ?? 0
    const text = heading ? source.slice(match![0].length) : source
    const size = heading === 1 ? 18 : heading === 2 ? 15 : heading ? 13 : 11
    const lineHeight = size * 1.68
    ctx.font = (heading ? 'bold ' : '') + size +
      'px "Noto Sans CJK SC","Microsoft YaHei","PingFang SC",sans-serif'
    const drawn = text || ' '
    let segment = ''
    const flush = () => {
      if (y + lineHeight > bottom) {
        finish()
        begin()
        ctx.font = (heading ? 'bold ' : '') + size +
          'px "Noto Sans CJK SC","Microsoft YaHei","PingFang SC",sans-serif'
      }
      if (segment.trim()) ctx.fillText(segment, margin, y)
      y += lineHeight
      segment = ''
    }
    for (const char of drawn) {
      if (ctx.measureText(segment + char).width > printableWidth && segment.length) flush()
      segment += char
    }
    flush()
    if (heading) y += 6
  }
  finish()
  return encodeT08ImagePdf(pages)
}
