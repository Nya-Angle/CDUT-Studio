import { expect, test } from 'bun:test'
import { encodeT08ImagePdf } from './review-v3-t08-pdf'

test('T08 creates real multi-page A4 PDF bytes with image streams and a valid xref offset', () => {
  const pdf = encodeT08ImagePdf([
    { width: 100, height: 120, jpeg: new Uint8Array([255, 216, 255, 217]) },
    { width: 100, height: 120, jpeg: new Uint8Array([255, 216, 255, 217]) },
  ])
  const text = new TextDecoder('latin1').decode(pdf)
  expect(text.startsWith('%PDF-1.4\n')).toBe(true)
  expect(text).toContain('/Count 2')
  expect(text).toContain('/MediaBox [0 0 595.28 841.89]')
  expect((text.match(/\/Subtype \/Image/g) ?? []).length).toBe(2)
  expect((text.match(/\/Type \/Page \/Parent/g) ?? []).length).toBe(2)
  expect((text.match(/\/Length 4 >>\nstream\n/g) ?? []).length).toBe(2)
  const start = /startxref\n(\d+)\n%%EOF\n$/.exec(text)
  expect(start).not.toBeNull()
  const offset = Number(start![1])
  expect(text.slice(offset, offset + 5)).toBe('xref\n')
})
test('T08 refuses empty PDF output', () => {
  expect(() => encodeT08ImagePdf([])).toThrow('PDF 没有可输出的页面')
})
