import { describe, expect, test } from 'bun:test'
import { deflateRawSync } from 'node:zlib'
import { decodeReviewB2Zip } from './review-zip-intake-v3-b2'

const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[i] = c >>> 0
}
const crc32 = (bytes: Buffer): number => {
  let c = 0xffffffff
  for (const n of bytes) c = crcTable[(c ^ n) & 255]! ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
type Entry = {
  name: string
  content: Buffer
  method?: 0 | 8
  externalAttributes?: number
  flags?: number
  forgedUncompressedSize?: number
  corruptCrc?: boolean
}
function zip(entries: Entry[]): Buffer {
  const locals: Buffer[] = [], centrals: Buffer[] = []
  let position = 0
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8')
    const original = entry.content
    const method = entry.method ?? 8
    const packed = method === 8 ? deflateRawSync(original) : original
    const checksum = crc32(original) ^ (entry.corruptCrc ? 1 : 0)
    const unpacked = entry.forgedUncompressedSize ?? original.length
    const flags = entry.flags ?? 0x800
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(flags, 6)
    local.writeUInt16LE(method, 8)
    local.writeUInt32LE(checksum >>> 0, 14)
    local.writeUInt32LE(packed.length, 18)
    local.writeUInt32LE(unpacked, 22)
    local.writeUInt16LE(name.length, 26)
    locals.push(local, name, packed)
    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(0x0314, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(flags, 8)
    central.writeUInt16LE(method, 10)
    central.writeUInt32LE(checksum >>> 0, 16)
    central.writeUInt32LE(packed.length, 20)
    central.writeUInt32LE(unpacked, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt32LE((entry.externalAttributes ?? (0x81a4 << 16)) >>> 0, 38)
    central.writeUInt32LE(position, 42)
    centrals.push(central, name)
    position += local.length + name.length + packed.length
  }
  const centralSize = Buffer.concat(centrals).length
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(position, 16)
  return Buffer.concat([...locals, ...centrals, end])
}
const entry = (name: string, content = 'synthetic-material'): Entry => ({
  name, content: Buffer.from(content), method: 8,
})
describe('B-IN-01: real bounded ZIP byte decoding, no filesystem extraction', () => {
  test('valid compressed ZIP with two files emits exact bytes/hash and independent receipts', () => {
    const archive = zip([entry('application/form.txt'), entry('evidence/certificate.txt')])
    const result = decodeReviewB2Zip(archive)
    expect(result.accepted).toHaveLength(2)
    expect(result.receipts.map(x => x.status)).toEqual(['accepted','accepted'])
    expect(result.accepted[0]!.bytes.toString()).toBe('synthetic-material')
    expect(result.accepted[0]!.rawSha256).toMatch(/^[a-f0-9]{64}$/)
    expect(result.archiveSha256).toMatch(/^[a-f0-9]{64}$/)
  })
  test('ZIP slip and Windows separator/drive/UNC paths fail per-file; safe sibling retained', () => {
    const result=decodeReviewB2Zip(zip([
      entry('../outside.txt'), entry('safe\\..\\evil.txt'), entry('C:/Windows/file.txt'),
      entry('/etc/secret.txt'), entry('ok/form.txt'),
    ]))
    expect(result.receipts.map(x => x.status)).toEqual([
      'rejected','rejected','rejected','rejected','accepted',
    ])
    expect(result.accepted.map(x => x.entryName)).toEqual(['ok/form.txt'])
  })
  test('Unix symlink and Windows-equivalent duplicates never accepted', () => {
    const result=decodeReviewB2Zip(zip([
      {...entry('link.txt'),externalAttributes:0xa1ff0000},
      entry('Proof/CERT.txt'),entry('proof/cert.TXT'),entry('folder/'),
    ]))
    expect(result.receipts.map(x => x.reason ?? x.status)).toEqual([
      'SYMLINK','accepted','DUPLICATE_PATH','DIRECTORY',
    ])
    expect(result.accepted).toHaveLength(1)
  })
  test('malicious declared uncompressed size, ratio and aggregate budgets are per-file rejected', () => {
    const result=decodeReviewB2Zip(zip([
      {...entry('huge.txt','tiny'),forgedUncompressedSize:999_999_999},
      entry('ok.txt','visible'),
    ]), {maxEntryBytes:2048,maxTotalBytes:4096})
    expect(result.receipts.map(x => x.status)).toEqual(['rejected','accepted'])
    expect(result.receipts[0]!.reason).toBe('BOMB_OR_SIZE_LIMIT')
    const bomb=decodeReviewB2Zip(zip([entry('compressible.txt', 'x'.repeat(100_000))]))
    expect(bomb.receipts[0]!.reason).toBe('BOMB_OR_SIZE_LIMIT')
  })
  test('CRC mismatch isolates invalid entry, no fake success receipt', () => {
    const result=decodeReviewB2Zip(zip([
      {...entry('corrupt.txt'),corruptCrc:true},entry('valid.txt'),
    ]))
    expect(result.accepted).toHaveLength(1)
    expect(result.receipts.map(x => x.reason ?? x.status)).toEqual(['CRC_OR_LENGTH_MISMATCH','accepted'])
  })
  test('truncated/bogus central directory fails whole archive and never returns partial success', () => {
    const archive=zip([entry('a.txt')])
    expect(() => decodeReviewB2Zip(archive.subarray(0,archive.length-2))).toThrow('B2_ZIP_EOCD_NOT_FOUND')
    const tampered=Buffer.from(archive)
    tampered.writeUInt32LE(0xffff0000, tampered.length-6)
    expect(() => decodeReviewB2Zip(tampered)).toThrow('B2_ZIP_CENTRAL_INVALID')
  })
  test('unsupported encryption and filenames with colon or controls rejected without unsafe extraction', () => {
    const result=decodeReviewB2Zip(zip([
      {...entry('encrypted.txt'),flags:0x801},
      entry('invalid:name.txt'),entry('normal.txt'),
    ]))
    expect(result.receipts.map(x => x.reason ?? x.status)).toEqual([
      'UNSUPPORTED_FLAGS','UNSAFE_PATH','accepted',
    ])
  })
})
