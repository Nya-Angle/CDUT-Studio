import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assertF04OriginalUnchanged } from './review-v3-f04-intake-identity'
import { snapshotF04Folder } from './review-v3-f04-folder-snapshot'

const root = mkdtempSync(join(tmpdir(), 'review-f04-folder-'))
afterAll(() => rmSync(root, { recursive: true, force: true }))

describe('F04 trusted folder material snapshot', () => {
  test('enumerates nested originals with verified hashes and preserves duplicate basenames', async () => {
    const directory = join(root, 'nested')
    mkdirSync(join(directory, 'A'), { recursive: true })
    mkdirSync(join(directory, 'B'), { recursive: true })
    writeFileSync(join(directory, 'A', 'award.txt'), 'A proof')
    writeFileSync(join(directory, 'B', 'award.txt'), 'B proof')
    const snapshot = await snapshotF04Folder(directory)
    expect(snapshot.originals.map(x => x.relativePath)).toEqual(['A/award.txt', 'B/award.txt'])
    expect(new Set(snapshot.identity.entries.map(x => x.entryId)).size).toBe(2)
    expect(snapshot.warnings).toEqual([])
    expect(() => assertF04OriginalUnchanged(snapshot.identity.entries[0]!, Buffer.from('A proof'))).not.toThrow()
    expect(() => assertF04OriginalUnchanged(snapshot.identity.entries[0]!, Buffer.from('B proof')))
      .toThrow('F04_ORIGINAL_CHANGED_AFTER_PREVIEW')
  })

  test('skips file symlinks, reports excluded files and enforces file-count limit', async () => {
    const directory = join(root, 'limited')
    mkdirSync(directory)
    writeFileSync(join(directory, 'a.txt'), 'hello')
    writeFileSync(join(directory, 'b.txt'), 'world')
    if (process.platform !== 'win32') symlinkSync(join(directory, 'a.txt'), join(directory, 'linked.txt'))
    const snapshot = await snapshotF04Folder(directory, { maxEntries: 1 })
    expect(snapshot.originals).toHaveLength(1)
    expect(snapshot.warnings.join(';')).toContain('超过 1 条')
    if (process.platform !== 'win32') expect(snapshot.warnings.join(';')).toContain('符号链接未导入')
  })
})
