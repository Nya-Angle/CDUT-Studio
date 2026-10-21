/**
 * F04 preflight for physical image originals.
 *
 * A filename or an OS picker receipt is not evidence that the bytes are an
 * image. Check the container boundaries before the material is advertised as
 * visually inspectable. This is deliberately not a full pixel decoder: a
 * successful preflight still requires OCR/Vision or human inspection.
 *
 * Only the bounded header/trailer are read, including for very large images.
 */
import { open } from 'node:fs/promises'

type RasterExt = '.png' | '.jpg' | '.jpeg' | '.gif' | '.webp' | '.bmp'

const starts = (bytes: Buffer, signature: number[]): boolean =>
  signature.every((value, index) => bytes[index] === value)

export async function inspectF04RasterOriginal(
  filePath: string,
  extension: RasterExt,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  let handle: Awaited<ReturnType<typeof open>> | undefined
  try {
    handle = await open(filePath, 'r')
    const info = await handle.stat()
    if (!info.isFile() || info.size === 0) {
      return { ok: false, reason: '图片原件为空或不是普通文件' }
    }
    const head = Buffer.alloc(Math.min(32, info.size))
    const tail = Buffer.alloc(Math.min(16, info.size))
    await handle.read(head, 0, head.length, 0)
    await handle.read(tail, 0, tail.length, info.size - tail.length)

    let plausible = false
    switch (extension) {
      case '.png':
        plausible = info.size >= 45 &&
          starts(head, [137, 80, 78, 71, 13, 10, 26, 10]) &&
          head.toString('ascii', 12, 16) === 'IHDR' &&
          head.readUInt32BE(16) > 0 && head.readUInt32BE(20) > 0 &&
          tail.subarray(tail.length - 12).equals(Buffer.from('0000000049454e44ae426082', 'hex'))
        break
      case '.jpg':
      case '.jpeg':
        plausible = info.size >= 4 && starts(head, [0xff, 0xd8, 0xff]) &&
          tail.subarray(tail.length - 2).equals(Buffer.from([0xff, 0xd9]))
        break
      case '.gif':
        plausible = info.size >= 14 && ['GIF87a', 'GIF89a'].includes(head.toString('ascii', 0, 6)) &&
          head.readUInt16LE(6) > 0 && head.readUInt16LE(8) > 0 && tail[tail.length - 1] === 0x3b
        break
      case '.webp':
        plausible = info.size >= 20 && head.toString('ascii', 0, 4) === 'RIFF' &&
          head.toString('ascii', 8, 12) === 'WEBP' && head.readUInt32LE(4) + 8 === info.size &&
          ['VP8 ', 'VP8L', 'VP8X'].includes(head.toString('ascii', 12, 16))
        break
      case '.bmp':
        plausible = info.size >= 26 && starts(head, [0x42, 0x4d]) &&
          head.readUInt32LE(2) === info.size && head.readUInt32LE(14) >= 12
        break
    }
    return plausible ? { ok: true } : {
      ok: false,
      reason: `图片文件损坏、截断或实际格式与 ${extension} 扩展名不一致，不能作为已读取的视觉原件`,
    }
  } catch (error) {
    return { ok: false, reason: `图片原件不可读取：${error instanceof Error ? error.message : String(error)}` }
  } finally {
    await handle?.close()
  }
}
