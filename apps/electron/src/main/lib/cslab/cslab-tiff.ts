/**
 * CSLab 基线 TIFF 编码器（未压缩 RGB）
 *
 * 仅依赖 Node Buffer，不引入第三方图像库；用于期刊级 300/600/1200 DPI 位图导出。
 * 输入为 Electron NativeImage.toBitmap() 的 BGRA 像素。
 */

function uint16(value: number): Buffer {
  const buffer = Buffer.alloc(2)
  buffer.writeUInt16LE(value & 0xffff, 0)
  return buffer
}

function uint32(value: number): Buffer {
  const buffer = Buffer.alloc(4)
  buffer.writeUInt32LE(value >>> 0, 0)
  return buffer
}

function entry(tag: number, type: number, count: number, value: number): Buffer {
  const buffer = Buffer.alloc(12)
  buffer.writeUInt16LE(tag, 0)
  buffer.writeUInt16LE(type, 2)
  buffer.writeUInt32LE(count, 4)
  // SHORT 且 count=1 时，值左对齐写入 4 字节 value 字段
  if (type === 3 && count === 1) {
    buffer.writeUInt16LE(value & 0xffff, 8)
    buffer.writeUInt16LE(0, 10)
  } else {
    buffer.writeUInt32LE(value >>> 0, 8)
  }
  return buffer
}

function rational(numerator: number, denominator: number): Buffer {
  return Buffer.concat([uint32(numerator), uint32(denominator)])
}

/**
 * 将 BGRA 位图编码为基线 TIFF。
 *
 * @param width 图像宽度（像素）
 * @param height 图像高度（像素）
 * @param bgra Electron NativeImage.toBitmap() 返回的 BGRA 数据
 * @param dpi 分辨率（每英寸点数）
 * @param transparentBackground 是否把透明像素合成到白色背景
 */
export function encodeTiffRgb(
  width: number,
  height: number,
  bgra: Uint8Array,
  dpi = 300,
  transparentBackground = false,
): Buffer {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('TIFF 尺寸非法')
  }
  const pixelCount = width * height
  if (bgra.length < pixelCount * 4) {
    throw new Error('TIFF 像素数据长度不足')
  }

  const rgb = Buffer.alloc(pixelCount * 3)
  for (let index = 0; index < pixelCount; index += 1) {
    const offset = index * 4
    const blue = bgra[offset] ?? 0
    const green = bgra[offset + 1] ?? 0
    const red = bgra[offset + 2] ?? 0
    const alpha = bgra[offset + 3] ?? 255
    if (transparentBackground && alpha < 255) {
      const factor = alpha / 255
      rgb[index * 3] = Math.round(red * factor + 255 * (1 - factor))
      rgb[index * 3 + 1] = Math.round(green * factor + 255 * (1 - factor))
      rgb[index * 3 + 2] = Math.round(blue * factor + 255 * (1 - factor))
    } else {
      rgb[index * 3] = red
      rgb[index * 3 + 1] = green
      rgb[index * 3 + 2] = blue
    }
  }

  const entries: Buffer[] = []
  // 图像宽度与高度
  entries.push(entry(256, 4, 1, width))
  entries.push(entry(257, 4, 1, height))
  // 每样本位数：3 个 SHORT，数据在 IFD 之后
  entries.push(entry(258, 3, 3, 0))
  // 无压缩
  entries.push(entry(259, 3, 1, 1))
  // RGB
  entries.push(entry(262, 3, 1, 2))
  // 单 strip 偏移
  entries.push(entry(273, 4, 1, 0))
  // 每像素样本数
  entries.push(entry(277, 3, 1, 3))
  // 每 strip 行数
  entries.push(entry(278, 4, 1, height))
  // strip 字节数
  entries.push(entry(279, 4, 1, rgb.length))
  // X/Y 分辨率
  entries.push(entry(282, 5, 1, 0))
  entries.push(entry(283, 5, 1, 0))
  // 分辨率单位：英寸
  entries.push(entry(296, 3, 1, 2))

  const ifdOffset = 8
  const ifdSize = 2 + entries.length * 12 + 4
  const extraOffset = ifdOffset + ifdSize
  const bitsPerSampleOffset = extraOffset
  const xResolutionOffset = bitsPerSampleOffset + 6
  const yResolutionOffset = xResolutionOffset + 8
  const dataOffset = yResolutionOffset + 8

  // 回填偏移量
  entries[2] = entry(258, 3, 3, bitsPerSampleOffset)
  entries[5] = entry(273, 4, 1, dataOffset)
  entries[9] = entry(282, 5, 1, xResolutionOffset)
  entries[10] = entry(283, 5, 1, yResolutionOffset)

  const header = Buffer.concat([
    Buffer.from([0x49, 0x49]), // 小端
    uint16(42),
    uint32(ifdOffset),
  ])

  const ifd = Buffer.concat([
    uint16(entries.length),
    ...entries,
    uint32(0),
  ])

  const extra = Buffer.concat([
    uint16(8),
    uint16(8),
    uint16(8),
    rational(Math.round(dpi), 1),
    rational(Math.round(dpi), 1),
  ])

  const total = Buffer.concat([header, ifd, extra, rgb])
  return total
}
