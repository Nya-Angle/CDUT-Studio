/**
 * B2 ZIP intake decoder, input is RAW bytes acquired by the trusted Main
 * picker/drop adapter (never a model-supplied filename/path). Does not extract
 * to filesystem, change CurrentCase or create a ReviewBatchAttempt.
 *
 * Bounds, central/local consistency, CRC, Unix symlinks, data descriptors,
 * duplicate Windows-equivalent paths and compression bombs are fail-closed.
 */
import { createHash } from 'node:crypto'
import { inflateRawSync } from 'node:zlib'

const SIG_EOCD = 0x06054b50
const SIG_CENTRAL = 0x02014b50
const SIG_LOCAL = 0x04034b50
const SIG_DESCRIPTOR = 0x08074b50
const MAX_ARCHIVE_BYTES = 256 * 1024 * 1024
const MAX_ENTRY_BYTES = 50 * 1024 * 1024
const MAX_TOTAL_BYTES = 200 * 1024 * 1024
const MAX_ENTRIES = 1000
const MAX_RATIO = 100
const SHA = (b: Uint8Array): string => createHash('sha256').update(b).digest('hex')
const error = (code: string): never => { throw new Error('B2_ZIP_' + code) }
const read16 = (buf: Buffer, i: number): number => buf.readUInt16LE(i)
const read32 = (buf: Buffer, i: number): number => buf.readUInt32LE(i)
const decoder = new TextDecoder('utf-8', { fatal: true })

export interface B2ZipLimits {
  maxArchiveBytes?: number
  maxEntryBytes?: number
  maxTotalBytes?: number
  maxEntries?: number
  maxCompressionRatio?: number
}
export interface B2ZipEntry {
  index: number
  entryName: string
  rawSha256: string
  bytes: Buffer
}
export interface B2ZipFileReceipt {
  index: number
  entryName: string
  status: 'accepted' | 'skipped' | 'rejected'
  reason?: string
  rawSha256?: string
  compressedSha256: string
}
export interface B2ZipDecodeResult {
  archiveSha256: string
  accepted: B2ZipEntry[]
  receipts: B2ZipFileReceipt[]
  compressedBytes: number
  expandedBytes: number
}
interface CentralEntry {
  index: number
  name: string
  nameBytes: Buffer
  flags: number
  method: number
  crc: number
  compressedSize: number
  uncompressedSize: number
  localOffset: number
  externalAttributes: number
  extra: Buffer
  invalidNameEncoding: boolean
}

const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n += 1) {
  let c = n
  for (let k = 0; k < 8; k += 1) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) >>> 0 : c >>> 1
  crcTable[n] = c >>> 0
}
function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff
  for (const value of bytes) c = crcTable[(c ^ value) & 0xff]! ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function safeLimit(value: number | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue
  if (!Number.isSafeInteger(value) || value < 1 || value > defaultValue) error('LIMIT_INVALID')
  return value
}
function safeName(name: string): boolean {
  if (!name || name.length > 1024 || name.includes('\u0000') ||
      name.includes('\\') || name.startsWith('/') || name.startsWith('//') ||
      /^[A-Za-z]:/.test(name) || name.includes(':') || /[\u0000-\u001f\u007f]/.test(name)) return false
  const parts = name.split('/')
  return !parts.some(p => p === '.' || p === '..' || p === '' || p.endsWith('.') ||
    p.endsWith(' ') || /[<>?"|*]/.test(p))
}
function hasZip64(extra: Buffer): boolean {
  let i = 0
  while (i + 4 <= extra.length) {
    const id = extra.readUInt16LE(i), len = extra.readUInt16LE(i + 2)
    if (i + 4 + len > extra.length) error('EXTRA_TRUNCATED')
    if (id === 0x0001) return true
    i += 4 + len
  }
  if (i !== extra.length) error('EXTRA_TRUNCATED')
  return false
}
function lastEOCD(bytes: Buffer): number {
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (read32(bytes, i) !== SIG_EOCD) continue
    const commentLen = read16(bytes, i + 20)
    if (i + 22 + commentLen === bytes.length) return i
  }
  throw new Error('B2_ZIP_EOCD_NOT_FOUND')
}
/** Decode archives as sealed isolated entries; no unsafe partial extraction to disk. */
export function decodeReviewB2Zip(raw: Uint8Array, limits: B2ZipLimits = {}): B2ZipDecodeResult {
  const maxArchive = safeLimit(limits.maxArchiveBytes, MAX_ARCHIVE_BYTES)
  const maxEntry = safeLimit(limits.maxEntryBytes, MAX_ENTRY_BYTES)
  const maxTotal = safeLimit(limits.maxTotalBytes, MAX_TOTAL_BYTES)
  const maxEntries = safeLimit(limits.maxEntries, MAX_ENTRIES)
  const maxRatio = safeLimit(limits.maxCompressionRatio, MAX_RATIO)
  if (!(raw instanceof Uint8Array) || raw.byteLength < 22 || raw.byteLength > maxArchive) error('ARCHIVE_SIZE')
  const bytes = Buffer.from(raw)
  const eocd = lastEOCD(bytes)
  if (read16(bytes, eocd + 4) !== 0 || read16(bytes, eocd + 6) !== 0 ||
      read16(bytes, eocd + 8) !== read16(bytes, eocd + 10)) error('MULTIDISK_UNSUPPORTED')
  const count = read16(bytes, eocd + 10)
  const centralSize = read32(bytes, eocd + 12)
  const centralOffset = read32(bytes, eocd + 16)
  if (count === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff) error('ZIP64_UNSUPPORTED')
  if (count > maxEntries || centralOffset + centralSize > eocd || count === 0) error('CENTRAL_INVALID')
  const centers: CentralEntry[] = []
  let offset = centralOffset
  for (let i = 0; i < count; i++) {
    if (offset + 46 > centralOffset + centralSize || read32(bytes, offset) !== SIG_CENTRAL) {
      error('CENTRAL_TRUNCATED')
    }
    const fileNameLength = read16(bytes, offset + 28)
    const extraLength = read16(bytes, offset + 30)
    const commentLength = read16(bytes, offset + 32)
    const end = offset + 46 + fileNameLength + extraLength + commentLength
    if (end > centralOffset + centralSize) error('CENTRAL_TRUNCATED')
    if (read16(bytes, offset + 34) !== 0) error('MULTIDISK_UNSUPPORTED')
    const nameBytes = bytes.subarray(offset + 46, offset + 46 + fileNameLength)
    const extra = bytes.subarray(offset + 46 + fileNameLength, offset + 46 + fileNameLength + extraLength)
    if (hasZip64(extra)) error('ZIP64_UNSUPPORTED')
    let name: string
    let invalidNameEncoding = false
    try { name = decoder.decode(nameBytes) } catch { name = '[invalid-utf8-' + i + ']'; invalidNameEncoding = true }
    centers.push({
      index: i, name, nameBytes, extra, invalidNameEncoding,
      flags: read16(bytes, offset + 8), method: read16(bytes, offset + 10),
      crc: read32(bytes, offset + 16),
      compressedSize: read32(bytes, offset + 20),
      uncompressedSize: read32(bytes, offset + 24),
      externalAttributes: read32(bytes, offset + 38),
      localOffset: read32(bytes, offset + 42),
    })
    offset = end
  }
  if (offset !== centralOffset + centralSize) error('CENTRAL_SIZE_MISMATCH')

  const accepted: B2ZipEntry[] = [], receipts: B2ZipFileReceipt[] = []
  const seen = new Set<string>()
  let expandedBytes = 0, compressedBytes = 0
  const ranges: Array<{ start: number; end: number }> = []
  for (const entry of centers) {
    const possibleStart = entry.localOffset
    const possibleDataStart = possibleStart + 30 <= centralOffset && read32(bytes, possibleStart) === SIG_LOCAL
      ? possibleStart + 30 + read16(bytes, possibleStart + 26) + read16(bytes, possibleStart + 28) : -1
    const compressedHash = possibleDataStart >= 0 && possibleDataStart + entry.compressedSize <= centralOffset
      ? SHA(bytes.subarray(possibleDataStart, possibleDataStart + entry.compressedSize))
      : SHA(entry.nameBytes) // fallback entry-name evidence; rejected entries have no validated payload
    const receipt = (status: B2ZipFileReceipt['status'], reason?: string, rawSha256?: string): void => {
      receipts.push({
        index: entry.index, entryName: entry.name, status, compressedSha256: compressedHash,
        ...(reason ? { reason } : {}), ...(rawSha256 ? { rawSha256 } : {}),
      })
    }
    const isDirectory = entry.name.endsWith('/')
    const normalized = entry.name.normalize('NFC')
    const caseFold = normalized.toLocaleLowerCase('en-US')
    // Directory records are skipped; malicious paths/symlink metadata still rejected.
    if (isDirectory) {
      const unixMode = (entry.externalAttributes >>> 16) & 0xffff
      if (entry.invalidNameEncoding || !safeName(entry.name.slice(0, -1)) || (unixMode & 0xf000) === 0xa000) receipt('rejected', 'UNSAFE_DIRECTORY')
      else receipt('skipped', 'DIRECTORY')
      continue
    }
    if (entry.invalidNameEncoding || !safeName(normalized) || seen.has(caseFold)) {
      receipt('rejected', entry.invalidNameEncoding ? 'INVALID_NAME_ENCODING' : seen.has(caseFold) ? 'DUPLICATE_PATH' : 'UNSAFE_PATH')
      continue
    }
    seen.add(caseFold)
    const unixMode = (entry.externalAttributes >>> 16) & 0xffff
    const fileType = unixMode & 0xf000
    if (fileType !== 0 && fileType !== 0x8000) {
      receipt('rejected', fileType === 0xa000 ? 'SYMLINK' : 'SPECIAL_FILE')
      continue
    }
    if (entry.flags & (1 | 0x20 | 0x40 | 0x2000) || (entry.flags & ~0x808)) {
      receipt('rejected', 'UNSUPPORTED_FLAGS')
      continue
    }
    if (entry.method !== 0 && entry.method !== 8) {
      receipt('rejected', 'UNSUPPORTED_COMPRESSION')
      continue
    }
    if (entry.uncompressedSize < 1 || entry.uncompressedSize > maxEntry ||
        entry.compressedSize < 1 || entry.compressedSize > maxArchive ||
        entry.uncompressedSize / entry.compressedSize > maxRatio ||
        expandedBytes + entry.uncompressedSize > maxTotal) {
      receipt('rejected', 'BOMB_OR_SIZE_LIMIT')
      continue
    }
    const start = entry.localOffset
    if (start + 30 > centralOffset || read32(bytes, start) !== SIG_LOCAL) {
      receipt('rejected', 'LOCAL_HEADER_INVALID')
      continue
    }
    const localFlags = read16(bytes, start + 6), localMethod = read16(bytes, start + 8)
    const localNameLength = read16(bytes, start + 26), localExtraLength = read16(bytes, start + 28)
    const dataStart = start + 30 + localNameLength + localExtraLength
    const dataEnd = dataStart + entry.compressedSize
    if (dataEnd > centralOffset || localFlags !== entry.flags || localMethod !== entry.method ||
        !bytes.subarray(start + 30, start + 30 + localNameLength).equals(entry.nameBytes)) {
      receipt('rejected', 'LOCAL_CENTRAL_MISMATCH')
      continue
    }
    if (hasZip64(bytes.subarray(start + 30 + localNameLength, dataStart))) error('ZIP64_UNSUPPORTED')
    let fullEnd = dataEnd
    if (entry.flags & 0x8) {
      // Streaming descriptor after compressed payload (optional 0x08074b50 signature).
      if (fullEnd + 12 > centralOffset) { receipt('rejected', 'DESCRIPTOR_TRUNCATED'); continue }
      if (read32(bytes, fullEnd) === SIG_DESCRIPTOR) fullEnd += 4
      if (fullEnd + 12 > centralOffset ||
          read32(bytes, fullEnd) !== entry.crc ||
          read32(bytes, fullEnd + 4) !== entry.compressedSize ||
          read32(bytes, fullEnd + 8) !== entry.uncompressedSize) {
        receipt('rejected', 'DESCRIPTOR_MISMATCH'); continue
      }
      fullEnd += 12
    } else if (read32(bytes, start + 14) !== entry.crc ||
               read32(bytes, start + 18) !== entry.compressedSize ||
               read32(bytes, start + 22) !== entry.uncompressedSize) {
      receipt('rejected', 'LOCAL_SIZE_CRC_MISMATCH'); continue
    }
    if (ranges.some(r => start < r.end && fullEnd > r.start)) {
      receipt('rejected', 'OVERLAPPING_DATA'); continue
    }
    ranges.push({ start, end: fullEnd })
    const compressed = bytes.subarray(dataStart, dataEnd)
    let extracted: Buffer
    try {
      extracted = entry.method === 0 ? Buffer.from(compressed)
        : inflateRawSync(compressed, { maxOutputLength: maxEntry + 1 })
    } catch {
      receipt('rejected', 'DECOMPRESSION_FAILED')
      continue
    }
    if (extracted.byteLength !== entry.uncompressedSize || crc32(extracted) !== entry.crc) {
      receipt('rejected', 'CRC_OR_LENGTH_MISMATCH')
      continue
    }
    expandedBytes += extracted.byteLength
    compressedBytes += entry.compressedSize
    const rawSha256 = SHA(extracted)
    accepted.push({ index: entry.index, entryName: normalized, rawSha256, bytes: extracted })
    receipt('accepted', undefined, rawSha256)
  }
  return { archiveSha256: SHA(bytes), accepted, receipts, compressedBytes, expandedBytes }
}
