import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { SourceDocument } from '@profer/shared'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import {
  ReviewB2SourceVersionAdapter, locateB2ParserBlock, fingerprintB2ParserGeometry,
} from './review-source-version-adapter-v3-b2'

/**
 * 可控延迟 parser 端口：仅在本测试内替换 document-service 的解析入口，
 * adapter.parse 及其 staging/预接收授权逻辑保持真实。默认仍委托真实解析，
 * 不影响本文件原有正向用例。
 */
const realDocumentService = { ...(await import('./document-service')) }
const realParseFileIntoSourceDocument = realDocumentService.parseFileIntoSourceDocument
let parseImpl: typeof realParseFileIntoSourceDocument = realParseFileIntoSourceDocument
mock.module('./document-service', () => ({
  ...realDocumentService,
  parseFileIntoSourceDocument: (...args: Parameters<typeof realParseFileIntoSourceDocument>) =>
    parseImpl(...args),
}))
afterEach(() => {
  parseImpl = realParseFileIntoSourceDocument
  delete process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK
})

const a: B2MainContext = { senderId: 20, frameId: 3, ownerId: 'main-user',
  ownerGeneration: 1, caseCandidateId: 'case-1' }
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
  'base64',
)
const makePdf = (content: string): Buffer => {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content,'latin1')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf,'latin1'))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xref = Buffer.byteLength(pdf,'latin1')
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) pdf += `${String(offset).padStart(10,'0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf,'latin1')
}
const stage = (store: ReviewB2StagingService, name: string, raw: Uint8Array,
  request: string, physical: string) =>
  store.stage(a,store.grant(a).token,{
    requestId: request, fileName: name, physicalSourceKey: physical,
    bytes: raw, role: 'supporting', subjectId: 'subject-1',
  })

describe('B-DOC-01/02 source adapter consumes real original bytes and verified block registry', () => {
  test('TXT: full parser block, C0 SourceIdentity anchored to physical hash/version', async () => {
    const store = new ReviewB2StagingService()
    const svc = new ReviewB2SourceVersionAdapter(store)
    const mat = stage(store,'notes.txt',Buffer.from('First paragraph\nSecond paragraph'), 'req-a','picker-a')
    const parsed = await svc.parse(a,mat)
    expect(parsed.status).toBe('parsed')
    expect(parsed.blocks.length).toBe(2)
    expect(parsed.blocks[0]?.text).toBe('First paragraph')
    const source = svc.sourceForBlock(a,mat.candidateId,parsed.parseRevision,parsed.blocks[0]!.blockId)
    expect(source.documentVersionId).toBe(mat.documentVersionId)
    expect(source.rawSha256).toBe(mat.rawSha256)
    expect(source.parseRevision).toBe(parsed.parseRevision)
    expect(source.location.kind).toBe('paragraph')
    expect(() => svc.sourceForBlock(a,mat.candidateId,parsed.parseRevision,'forged-blob')).toThrow('B2_SOURCE_BLOCK_UNVERIFIED')
    expect(() => svc.sourceForBlock(a,mat.candidateId,'parse-old',parsed.blocks[0]!.blockId)).toThrow('B2_SOURCE_STALE')
  })
  test('Office71: same filename, same bytes but distinct physical source do not cross-use blocks', async () => {
    const store = new ReviewB2StagingService()
    const svc = new ReviewB2SourceVersionAdapter(store)
    const raw = Buffer.from('Same bytes, different physical source')
    const one = stage(store,'same-stem.txt',raw,'req-1','file-a')
    const two = stage(store,'same-stem.txt',raw,'req-2','file-b')
    const p1 = await svc.parse(a,one), p2 = await svc.parse(a,two)
    expect(p1.blocks[0]!.blockId).not.toBe(p2.blocks[0]!.blockId)
    expect(p1.documentVersionId).not.toBe(p2.documentVersionId)
    expect(p1.rawSha256).toBe(p2.rawSha256)
    expect(() => svc.sourceForBlock(a,two.candidateId,p2.parseRevision,p1.blocks[0]!.blockId))
      .toThrow('B2_SOURCE_BLOCK_UNVERIFIED')
    expect(() => svc.parse(a,{...one,documentVersionId:'forged-version'}))
      .toThrow('B2_SOURCE_CANDIDATE_TAMPERED')
  })
  test('Image/scan: authentic PNG remains partial, no OCR full-read claim', async () => {
    const store = new ReviewB2StagingService()
    const svc = new ReviewB2SourceVersionAdapter(store)
    const image = stage(store,'photo.png',ONE_PIXEL_PNG,'req-png','file-png')
    const parsed = await svc.parse(a,image)
    expect(parsed.status).toBe('partial')
    expect(parsed.blocks).toHaveLength(1)
    expect(parsed.blocks[0]!.precision).toBe('file')
    expect(parsed.blocks[0]!.uncertainty).toContain('visual inspection')
    const source = svc.sourceForBlock(a,image.candidateId,parsed.parseRevision,parsed.blocks[0]!.blockId)
    expect(source.location.kind).toBe('file')
  })
  test('PDF: parsed original bytes only; no fake geometry on text fallback and empty scan partial', async () => {
    const store = new ReviewB2StagingService()
    const svc = new ReviewB2SourceVersionAdapter(store)
    const mat = stage(store,'policy.pdf',makePdf('BT /F1 24 Tf 72 700 Td (Hello Review 123) Tj ET'),'req-pdf','file-pdf')
    const parsed = await svc.parse(a,mat)
    expect(parsed.status).toBe('parsed')
    expect(parsed.blocks.some((b) => b.text.includes('Hello Review'))).toBe(true)
    for (const block of parsed.blocks) {
      if (block.precision !== 'pdf-rect') expect(block.location.kind).toBe('file')
    }
    const scan = stage(store,'scan.pdf',makePdf(''),'req-scan','file-scan')
    const partial = await svc.parse(a,scan)
    expect(partial.status).toBe('partial')
    expect(partial.blocks).toHaveLength(0)
    expect(partial.error).toMatch(/扫描|OCR|原件/)
  }, 30_000)
  test('revoked owner cannot mint source from previous parsed registry', async () => {
    const store = new ReviewB2StagingService()
    const svc = new ReviewB2SourceVersionAdapter(store)
    const mat = stage(store,'item.txt',Buffer.from('Statement'), 'req-revoke','file-r')
    const parsed = await svc.parse(a,mat)
    store.revoke(a)
    expect(() => svc.sourceForBlock(a,mat.candidateId,parsed.parseRevision,parsed.blocks[0]!.blockId))
      .toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
})

describe('B-DOC-03: exact geometries vs DOCX parser ordinals and fallback', () => {
  test('DOCX paragraphs and table cells preserve parser order, never invent OOXML paragraph number', () => {
    const paragraph=locateB2ParserBlock('.docx',{id:'blk-doc-001',kind:'paragraph'},0)
    const cell=locateB2ParserBlock('.docx',{id:'blk-doc-002',kind:'table-cell',table:{row:2,column:1}},1)
    expect(paragraph.precision).toBe('document-block')
    expect(paragraph.location.kind).toBe('paragraph')
    const p=JSON.parse(paragraph.location.locator)
    expect(p).toMatchObject({locatorKind:'docx-parser-block',parserBlockIndex:0})
    expect(p.paragraphIndex).toBeUndefined()
    expect(paragraph.uncertainty).toContain('not verified')
    expect(cell.precision).toBe('document-block')
    expect(JSON.parse(cell.location.locator)).toMatchObject({
      locatorKind:'docx-table-cell',parserBlockIndex:1,table:{row:2,column:1},
    })
  })
  test('DOCX fallback and malformed table location fail to file-level, without false precision', () => {
    const fallback=locateB2ParserBlock(
      '.docx',{id:'blk-001',kind:'paragraph'},0,'DOCX 结构解析失败，已回退纯文本',
    )
    expect(fallback.precision).toBe('approximate')
    expect(fallback.location.kind).toBe('file')
    const missing=locateB2ParserBlock('.docx',{id:'blk-002',kind:'table-cell'},1)
    expect(missing.precision).toBe('approximate')
    expect(missing.uncertainty).toContain('no verified parser')
    expect(locateB2ParserBlock('.docx',{id:'blk-003',kind:'image'},2).precision).toBe('file')
  })
  test('spreadsheet and PDF require valid real coordinates; parser revision binds reading order', () => {
    const cell=locateB2ParserBlock('.xlsx',{
      id:'c1',kind:'table-cell',table:{sheet:'Score',row:2,column:3},
    },0)
    expect(cell.precision).toBe('sheet-cell')
    expect(JSON.parse(cell.location.locator)).toEqual({sheet:'Score',row:2,column:3})
    const bad=locateB2ParserBlock('.xlsx',{
      id:'c1',kind:'table-cell',table:{sheet:'Score',row:0,column:3},
    },0)
    expect(bad.precision).toBe('approximate')
    const pdf={id:'pdf-b',kind:'paragraph',text:'Read me',
      page:2,bbox:[0.1,0.2,0.4,0.5],readingOrder:1}
    expect(locateB2ParserBlock('.pdf',pdf,0).precision).toBe('pdf-rect')
    const rev=fingerprintB2ParserGeometry('hash','parsed',[pdf])
    expect(fingerprintB2ParserGeometry('hash','parsed',[{...pdf,readingOrder:2}]))
      .not.toBe(rev)
    expect(fingerprintB2ParserGeometry('hash','partial',[pdf])).not.toBe(rev)
    expect(fingerprintB2ParserGeometry('hash','parsed',[pdf],'parser warning')).not.toBe(rev)
    expect(locateB2ParserBlock('.pdf',{...pdf,bbox:[0,0,2,2]},0).precision)
      .toBe('approximate')
  })
})

const delayedSource = (text: string): SourceDocument => ({
  id: 'doc-delayed', fileName: 'delayed.txt', role: 'evidence',
  mimeType: 'text/plain', sizeBytes: Buffer.byteLength(text), parseStatus: 'parsed',
  blocks: [{ id: 'blk-delayed-001', kind: 'paragraph', text, page: 1 }],
  origin: 'upload', importedAt: '2026-10-25T00:00:00.000Z',
})

/** 真实 parse 到达 parser await 后暂停，由测试决定何时完成。 */
function controllableParser() {
  let start!: () => void
  let release!: (document: SourceDocument) => void
  const started = new Promise<void>((resolve) => { start = resolve })
  const result = new Promise<SourceDocument>((resolve) => { release = resolve })
  let calls = 0
  parseImpl = async () => {
    calls += 1
    start()
    return result
  }
  return { started, release: (text: string) => release(delayedSource(text)), calls: () => calls }
}

describe('B2 解析 await 后重新求值预接收授权（真实 adapter.parse）', () => {
  for (const [label, blockMode] of [
    ['授权状态未知', '1'],
    ['授权服务异常', 'throw'],
  ] as const) {
    test(`${label}：只发出提示，不阻断有效解析和缓存`, async () => {
      const store = new ReviewB2StagingService()
      const svc = new ReviewB2SourceVersionAdapter(store)
      const mat = stage(store, 'delayed.txt', Buffer.from('delayed parse ' + label),
        'req-delayed-' + blockMode, 'file-delayed-' + blockMode)
      const parser = controllableParser()
      const pending = svc.parse(a, mat)
      const outcome = pending.then(
        value => ({ ok: true as const, value }),
        error => ({ ok: false as const, error }),
      )
      // 入口检查已通过并进入 parser await；完成时改为未知/故障状态，应重新评估并提醒但不阻断。
      await parser.started
      process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK = blockMode
      parser.release('授权提醒不阻断的解析明文')
      const result = await outcome
      expect(result.ok).toBe(true)
      if (!result.ok) return
      const parsed = result.value
      expect(parsed.status).toBe('parsed')
      expect(parsed.blocks[0]?.text).toBe('授权提醒不阻断的解析明文')
      delete process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK
      expect(svc.compareCandidateSourceVersions(a, mat.candidateId, mat.candidateId).status)
        .toBe('same-active-version')
      const cached = await svc.parse(a, mat)
      expect(cached.parseRevision).toBe(parsed.parseRevision)
      expect(parser.calls()).toBe(1)
    })
  }

  test('延迟期间授权保持有效：解析成功并缓存，重复 parse 不重新解析', async () => {
    const store = new ReviewB2StagingService()
    const svc = new ReviewB2SourceVersionAdapter(store)
    const mat = stage(store, 'delayed.txt', Buffer.from('delayed parse valid'),
      'req-delayed-valid', 'file-delayed-valid')
    const parser = controllableParser()
    const pending = svc.parse(a, mat)
    await parser.started
    parser.release('获准解析的明文')
    const parsed = await pending
    expect(parsed.status).toBe('parsed')
    expect(parsed.blocks[0]?.text).toBe('获准解析的明文')
    expect(svc.compareCandidateSourceVersions(a, mat.candidateId, mat.candidateId).status)
      .toBe('same-active-version')
    // 有效授权仍走成功路径，并保留原有缓存复用。
    const cached = await svc.parse(a, mat)
    expect(cached.parseRevision).toBe(parsed.parseRevision)
    expect(parser.calls()).toBe(1)
  })
})
