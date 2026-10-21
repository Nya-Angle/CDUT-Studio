/**
 * F04 physical-intake identity adapter, independent of IPC and Case writers.
 *
 * A preview's identity must bind the exact bytes, not merely a filename and
 * length. Entry tokens must also be unique to a selection: two people can
 * submit `award.pdf` of the same size to two different cases.
 */
import { createHash, randomUUID } from 'node:crypto'

const sha256 = (bytes: Uint8Array | string): string =>
  createHash('sha256').update(bytes).digest('hex')

export interface F04PhysicalEntryBytes {
  relativePath: string
  bytes: Uint8Array
}

export interface F04PhysicalEntryDigest {
  relativePath: string
  byteLength: number
  rawSha256: string
}

export interface F04PhysicalEntryIdentity {
  entryId: string
  relativePath: string
  byteLength: number
  rawSha256: string
}

export interface F04PhysicalSelectionIdentity {
  selectionId: string
  previewFingerprint: string
  entries: F04PhysicalEntryIdentity[]
}

/** Main supplies already-authorized physical bytes, not Renderer paths. */
export function identifyF04PhysicalSelection(
  kind: 'folder' | 'zip',
  originalEntries: readonly F04PhysicalEntryBytes[],
  nonce: string = randomUUID(),
): F04PhysicalSelectionIdentity {
  return identifyF04PhysicalSelectionFromDigests(kind, originalEntries.map(source => {
    if (!(source.bytes instanceof Uint8Array)) throw new Error('F04_ENTRY_BYTES_INVALID')
    return {
      relativePath: source.relativePath,
      byteLength: source.bytes.byteLength,
      rawSha256: sha256(source.bytes),
    }
  }), nonce)
}

/** Streaming folder/ZIP readers may supply verified digests without buffering files. */
export function identifyF04PhysicalSelectionFromDigests(
  kind: 'folder' | 'zip',
  originalEntries: readonly F04PhysicalEntryDigest[],
  nonce: string = randomUUID(),
): F04PhysicalSelectionIdentity {
  if (kind !== 'folder' && kind !== 'zip') throw new Error('F04_SOURCE_KIND_INVALID')
  if (originalEntries.length === 0) throw new Error('F04_EMPTY_SELECTION')
  const selectionId = 'sel-f04-' + sha256(JSON.stringify([kind, nonce])).slice(0, 24)
  const paths = new Set<string>()
  const entries = originalEntries.map((source, index) => {
    if (!Number.isSafeInteger(source.byteLength) || source.byteLength < 1 ||
        !/^[a-f0-9]{64}$/.test(source.rawSha256)) {
      throw new Error('F04_EMPTY_ENTRY')
    }
    if (!source.relativePath || source.relativePath.includes(String.fromCharCode(92)) ||
        source.relativePath.startsWith('/') || /[\u0000-\u001f\u007f]/.test(source.relativePath) ||
        source.relativePath.split('/').some(part => !part || part === '.' || part === '..' ||
          part.endsWith('.') || part.endsWith(' ') || /[<>:"|?*]/.test(part))) {
      throw new Error('F04_UNSAFE_RELATIVE_PATH')
    }
    const normalized = source.relativePath.normalize('NFC').toLocaleLowerCase('en-US')
    if (paths.has(normalized)) throw new Error('F04_DUPLICATE_RELATIVE_PATH')
    paths.add(normalized)
    const rawSha256 = source.rawSha256
    return {
      entryId: 'e-f04-' + sha256(JSON.stringify([selectionId, index, source.relativePath, rawSha256])).slice(0, 24),
      relativePath: source.relativePath,
      byteLength: source.byteLength,
      rawSha256,
    }
  })
  const previewFingerprint = sha256(JSON.stringify({
    kind,
    entries: entries.map(({ relativePath, byteLength, rawSha256 }) =>
      [relativePath, byteLength, rawSha256]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
  }))
  return { selectionId, previewFingerprint, entries }
}

/** Call immediately before a writer consumes the selected physical bytes. */
export function assertF04OriginalUnchanged(entry: F04PhysicalEntryIdentity, bytes: Uint8Array): void {
  if (entry.byteLength !== bytes.byteLength || entry.rawSha256 !== sha256(bytes)) {
    throw new Error('F04_ORIGINAL_CHANGED_AFTER_PREVIEW')
  }
}

/** Per-case dedup identity: never reuse a DocumentVersion across two cases. */
export function f04CaseRegistrationKey(selectionId: string, entryId: string, caseId: string): string {
  if (!selectionId || !entryId || !caseId) throw new Error('F04_REGISTRATION_SCOPE_INVALID')
  return sha256(JSON.stringify([selectionId, entryId, caseId]))
}
