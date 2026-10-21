import { describe, expect, test } from 'bun:test'
import {
  assertF04OriginalUnchanged, f04CaseRegistrationKey, identifyF04PhysicalSelection,
} from './review-v3-f04-intake-identity'

const bytes = (value: string): Uint8Array => Buffer.from(value, 'utf8')

describe('F04 physical selection identity', () => {
  test('same filenames and byte lengths from separate physical selections have separate entry tokens', () => {
    const a = identifyF04PhysicalSelection('folder', [{ relativePath: '申请/证明.txt', bytes: bytes('ABCD') }], 'a')
    const b = identifyF04PhysicalSelection('folder', [{ relativePath: '申请/证明.txt', bytes: bytes('WXYZ') }], 'b')
    expect(a.entries[0]?.entryId).not.toBe(b.entries[0]?.entryId)
    expect(a.previewFingerprint).not.toBe(b.previewFingerprint)
    expect(a.entries[0]?.byteLength).toBe(b.entries[0]?.byteLength)
    expect(() => assertF04OriginalUnchanged(a.entries[0]!, bytes('WXYZ')))
      .toThrow('F04_ORIGINAL_CHANGED_AFTER_PREVIEW')
    expect(() => assertF04OriginalUnchanged(a.entries[0]!, bytes('ABCD'))).not.toThrow()
  })

  test('identical files still have independent selection and case registration identity', () => {
    const original = [{ relativePath: 'award.pdf', bytes: bytes('valid-file-bytes') }]
    const first = identifyF04PhysicalSelection('zip', original, 'one')
    const second = identifyF04PhysicalSelection('zip', original, 'two')
    expect(first.entries[0]?.entryId).not.toBe(second.entries[0]?.entryId)
    expect(first.previewFingerprint).toBe(second.previewFingerprint)
    const id = first.entries[0]!.entryId
    expect(f04CaseRegistrationKey(first.selectionId, id, 'case-A'))
      .not.toBe(f04CaseRegistrationKey(first.selectionId, id, 'case-B'))
  })

  test('rejects duplicate case-insensitive paths and unsafe relative paths', () => {
    expect(() => identifyF04PhysicalSelection('folder', [
      { relativePath: 'A.txt', bytes: bytes('first') },
      { relativePath: 'a.txt', bytes: bytes('second') },
    ])).toThrow('F04_DUPLICATE_RELATIVE_PATH')
    expect(() => identifyF04PhysicalSelection('zip', [
      { relativePath: '../other.txt', bytes: bytes('bytes') },
    ])).toThrow('F04_UNSAFE_RELATIVE_PATH')
  })
})
