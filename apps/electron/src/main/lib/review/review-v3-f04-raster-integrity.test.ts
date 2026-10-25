import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectF04RasterOriginal } from './review-v3-f04-raster-integrity'

const root = mkdtempSync(join(tmpdir(), 'review-f04-raster-'))
afterAll(() => rmSync(root, { recursive: true, force: true }))

const validPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
  'base64',
)

describe('F04 physical image preflight', () => {
  test('accepts actual bounded PNG bytes without claiming content was OCR-verified', async () => {
    const file = join(root, 'proof.png')
    writeFileSync(file, validPng)
    expect(await inspectF04RasterOriginal(file, '.png')).toEqual({ ok: true })
  })

  test('rejects a truncated picture, extension camouflage and absent original', async () => {
    const broken = join(root, 'truncated.png')
    const spoofed = join(root, 'not-image.jpg')
    writeFileSync(broken, validPng.subarray(0, 32))
    writeFileSync(spoofed, '%PDF-1.4')
    expect((await inspectF04RasterOriginal(broken, '.png')).ok).toBe(false)
    expect((await inspectF04RasterOriginal(spoofed, '.jpg')).ok).toBe(false)
    const absent = await inspectF04RasterOriginal(join(root, 'missing.webp'), '.webp')
    expect(absent.ok).toBe(false)
    if (!absent.ok) expect(absent.reason).toContain('不可读取')
  })
})
