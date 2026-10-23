/**
 * T02: recover real PPTX/OOXML picture bytes with slide-level provenance.
 *
 * Geometry-only Office AST figures cannot be submitted to Vision until their
 * physical bytes are recovered. This reader never treats a relationship target
 * or alt text as recognized image content. Caller owns the trusted file path;
 * no Renderer-supplied filesystem paths enter this module.
 */
import JSZip from 'jszip'
import { createHash } from 'node:crypto'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, posix } from 'node:path'

export interface T02SlideImage {
  page: number
  order: number
  /** Physical media hash; same image reused in different slides keeps two source positions. */
  sha256: string
  contentType: string
  /** Present only when caller provided a trusted case-owned asset destination. */
  imageAssetPath?: string
  /** Not an OCR result; informational label only. */
  imageAlt: string
}

export interface T02SlideImagesResult {
  images: T02SlideImage[]
  warnings: string[]
  slideCount: number
}

function attributes(xml: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [, key, value] of xml.matchAll(/([\w:.-]+)\s*=\s*["']([^"']*)["']/g)) {
    if (key) result[key] = value ?? ''
  }
  return result
}

function relationships(xml: string): Map<string, { target: string; type: string }> {
  const rels = new Map<string, { target: string; type: string }>()
  for (const match of xml.matchAll(/<Relationship\b[^>]*\/?>/g)) {
    const a = attributes(match[0])
    if (a.Id && a.Target) rels.set(a.Id, { target: a.Target, type: a.Type ?? '' })
  }
  return rels
}

const IMAGE_EXTENSIONS: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.bmp': 'image/bmp',
}

/** PPT presentation sldId order is authoritative; slide1.xml does not imply first visible slide. */
async function orderedSlideParts(zip: JSZip): Promise<string[]> {
  const pres = zip.file('ppt/presentation.xml')
  const rel = zip.file('ppt/_rels/presentation.xml.rels')
  if (pres && rel) {
    const [xml, relXml] = await Promise.all([pres.async('string'), rel.async('string')])
    const refs = relationships(relXml)
    const parts = [...xml.matchAll(/<p:sldId\b[^>]*\/?>/g)]
      .map(m => attributes(m[0])['r:id'])
      .flatMap(id => {
        const target = id ? refs.get(id)?.target : undefined
        if (!target) return []
        const fixedTarget = target.replace(/\\/g, '/')
        const normalized = posix.normalize(fixedTarget.startsWith('/')
          ? fixedTarget.slice(1)
          : posix.join('ppt', fixedTarget))
        return normalized.startsWith('ppt/slides/') && zip.file(normalized) ? [normalized] : []
      })
    if (parts.length > 0) return parts
  }
  // The fallback remains explicitly slide-part order, not a claim of presentation order.
  return Object.keys(zip.files).filter(p => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => Number(a.match(/slide(\d+)\.xml$/)?.[1] ?? 0) -
      Number(b.match(/slide(\d+)\.xml$/)?.[1] ?? 0))
}

export async function extractT02PptxImages(
  filePath: string,
  destination?: { directory: string; relativeOriginalPath: string },
): Promise<T02SlideImagesResult> {
  const warnings: string[] = []
  const zip = await JSZip.loadAsync(await readFile(filePath))
  const slides = await orderedSlideParts(zip)
  const images: T02SlideImage[] = []

  for (const [pageIndex, slidePart] of slides.entries()) {
    const xml = await zip.file(slidePart)?.async('string')
    if (!xml) continue
    const relFile = posix.join(posix.dirname(slidePart), '_rels', posix.basename(slidePart) + '.rels')
    const rels = zip.file(relFile) ? relationships(await zip.file(relFile)!.async('string')) : new Map()
    const imageReferences = [...xml.matchAll(/<a:blip\b[^>]*\/?>/g)]
      .map(match => attributes(match[0])['r:embed'])
      .filter((id): id is string => Boolean(id))

    for (const [imageIndex, relId] of imageReferences.entries()) {
      const ref = rels.get(relId)
      if (!ref || !/\/image$/.test(ref.type) || /^[a-z]+:/i.test(ref.target)) {
        warnings.push('第 ' + (pageIndex + 1) + ' 页图片 ' + (imageIndex + 1) + ' 无本地媒体关系')
        continue
      }
      // OPC package relationships may address an image as either
      // ../media/pic.png or /ppt/media/pic.png. Both are local package parts.
      const rawTarget = ref.target.replace(/\\/g, '/')
      const target = posix.normalize(rawTarget.startsWith('/')
        ? rawTarget.slice(1)
        : posix.join(posix.dirname(slidePart), rawTarget))
      // Do not read arbitrary relationships, external URLs, charts, or OLE objects.
      if (!target.startsWith('ppt/media/') || !zip.file(target)) {
        warnings.push('第 ' + (pageIndex + 1) + ' 页图片 ' + (imageIndex + 1) + ' 缺少 PPTX 媒体字节')
        continue
      }
      const ext = posix.extname(target).toLowerCase()
      const contentType = IMAGE_EXTENSIONS[ext]
      if (!contentType) {
        warnings.push('第 ' + (pageIndex + 1) + ' 页媒体格式未支持: ' + ext)
        continue
      }
      const bytes = await zip.file(target)!.async('uint8array')
      const sha256 = createHash('sha256').update(bytes).digest('hex')
      let imageAssetPath: string | undefined
      if (destination) {
        const filename = 't02-ppt-slide-' + (pageIndex + 1) + '-img-' + (imageIndex + 1) + '-' + sha256.slice(0, 12) + ext
        await mkdir(destination.directory, { recursive: true })
        await writeFile(join(destination.directory, filename), bytes)
        imageAssetPath = posix.join(posix.dirname(destination.relativeOriginalPath.replace(/\\/g, '/')), filename)
      }
      images.push({
        page: pageIndex + 1, order: imageIndex + 1, sha256, contentType,
        ...(imageAssetPath ? { imageAssetPath } : {}),
        imageAlt: '第 ' + (pageIndex + 1) + ' 页图片 ' + (imageIndex + 1) + '；原件字节已提取，尚未 OCR/视觉核验',
      })
    }
  }

  return { images, warnings, slideCount: slides.length }
}
