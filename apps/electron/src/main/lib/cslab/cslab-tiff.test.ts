import { describe, expect, test } from 'bun:test'
import { encodeTiffRgb } from './cslab-tiff'

describe('基线 TIFF 编码', () => {
  test('Given 2x2 BGRA 像素 When 编码 Then 头部与 strip 元数据正确', () => {
    const bgra = new Uint8Array([
      0, 0, 255, 255, // 红
      0, 255, 0, 255, // 绿
      255, 0, 0, 255, // 蓝
      255, 255, 255, 255, // 白
    ])
    const buffer = encodeTiffRgb(2, 2, bgra, 600, false)
    expect(buffer.toString('latin1', 0, 2)).toBe('II')
    expect(buffer.readUInt16LE(2)).toBe(42)
    const ifdOffset = buffer.readUInt32LE(4)
    expect(ifdOffset).toBe(8)
    const entryCount = buffer.readUInt16LE(ifdOffset)
    expect(entryCount).toBe(12)

    const entries = new Map<number, { type: number; count: number; value: number }>()
    for (let index = 0; index < entryCount; index += 1) {
      const offset = ifdOffset + 2 + index * 12
      const tag = buffer.readUInt16LE(offset)
      const type = buffer.readUInt16LE(offset + 2)
      const count = buffer.readUInt32LE(offset + 4)
      const value = buffer.readUInt32LE(offset + 8)
      entries.set(tag, { type, count, value })
    }

    expect(entries.get(256)?.value).toBe(2)
    expect(entries.get(257)?.value).toBe(2)
    expect(entries.get(277)?.value).toBe(3)
    expect(entries.get(279)?.value).toBe(12)
    const stripOffset = entries.get(273)?.value ?? 0
    expect(stripOffset).toBeGreaterThan(ifdOffset)
    expect(buffer.length).toBe(stripOffset + 12)
    // 第一像素 RGB = 红（输入为 BGRA，编码后应为 RGB）
    expect(Array.from(buffer.subarray(stripOffset, stripOffset + 3))).toEqual([255, 0, 0])
  })
})
