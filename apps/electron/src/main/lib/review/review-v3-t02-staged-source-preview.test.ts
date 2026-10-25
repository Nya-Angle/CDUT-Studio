import * as XLSX from 'xlsx'
import AdmZip from 'adm-zip'
import { stageReviewB2TrustedZip } from './review-zip-staging-v3-b2'
import { describe, expect, test } from 'bun:test'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import { previewT02StagedInventory, previewT02StagedSource } from './review-v3-t02-staged-source-preview'

const ctx: B2MainContext = {
  senderId: 1, frameId: 2, ownerId: 'main-owner', ownerGeneration: 1,
  caseCandidateId: 'candidate-case',
}

function stage(staging: ReviewB2StagingService, fileName: string, bytes: Uint8Array, key: string) {
  const grant = staging.grant(ctx)
  return staging.stage(ctx, grant.token, {
    requestId: key, physicalSourceKey: key, fileName, bytes,
    role: 'supporting', subjectId: null,
  })
}

describe('T02 trusted staged material parsing', () => {
  test('quotes/newlines stay in the same physical CSV cell and previews are repeatable', async () => {
    const staging = new ReviewB2StagingService()
    const material = stage(staging, '报送清单.csv',
      Buffer.from('学号,内容\r\n00081,"一等\r\n奖"\r\n00082,二等奖'), 'main-file-A')
    const first = await previewT02StagedSource(ctx, staging, material.candidateId)
    const second = await previewT02StagedSource(ctx, staging, material.candidateId)
    expect(first).toMatchObject({
      checkpoint: 'staging-only', candidateOnly: true,
      documentVersionId: material.documentVersionId,
      parseStatus: 'parsed', blockCount: 6,
      imageBlocksAwaitingInspection: 0, sheets: ['CSV'],
    })
    expect(first.blocks.find((b) => b.table?.row === 2 && b.table?.column === 1)?.text).toBe('00081')
    expect(first.blocks.find((b) => b.table?.row === 2 && b.table?.column === 2)?.text).toBe('一等\r\n奖')
    expect(first.blocks.map((b) => b.sourceBlockKey)).toEqual(second.blocks.map((b) => b.sourceBlockKey))
  })

  test('two same-name physical originals retain separate source versions', async () => {
    const staging = new ReviewB2StagingService()
    const a = stage(staging, '证明.txt', Buffer.from('第一次'), 'main-file-1')
    const b = stage(staging, '证明.txt', Buffer.from('第二次'), 'main-file-2')
    const [first, second] = await Promise.all([
      previewT02StagedSource(ctx, staging, a.candidateId),
      previewT02StagedSource(ctx, staging, b.candidateId),
    ])
    expect(first.documentVersionId).not.toBe(second.documentVersionId)
    expect(first.blocks[0]?.sourceBlockKey).not.toBe(second.blocks[0]?.sourceBlockKey)
    expect(first.blocks[0]?.text).toBe('第一次')
    expect(second.blocks[0]?.text).toBe('第二次')
  })

  test('a real XLSX workbook retains worksheet and cell precision in a staged preview', async () => {
    const staging = new ReviewB2StagingService()
    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([['学号', '分值'], ['00031', '10']])
    XLSX.utils.book_append_sheet(workbook, sheet, '综测清单')
    const bytes = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
    const candidate = stage(staging, '登记.xlsx', bytes, 'native-xlsx-1')
    const result = await previewT02StagedSource(ctx, staging, candidate.candidateId)
    expect(result.parseStatus).toBe('parsed')
    expect(result.sheets).toContain('综测清单')
    expect(result.blocks.some((b) =>
      b.text === '00031' && b.table?.sheet === '综测清单' && b.table.row === 2,
    )).toBeTrue()
  })

  test('an image remains partial and awaiting inspection, not magically parsed as text', async () => {
    const staging = new ReviewB2StagingService()
    const image = stage(staging, '获奖证书.jpg', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'main-image')
    const result = await previewT02StagedSource(ctx, staging, image.candidateId)
    expect(result).toMatchObject({
      parseStatus: 'partial', imageBlocksAwaitingInspection: 1,
      blockCount: 1, indexedPages: [1],
    })
    expect(result.blocks[0]).toMatchObject({ kind: 'image', requiresVisualInspection: true })
  })

  test('unknown binary remains failed and never generates placeholder evidence', async () => {
    const staging = new ReviewB2StagingService()
    const item = stage(staging, '无法解析.bin', Buffer.from([1, 2, 3]), 'main-unknown')
    const result = await previewT02StagedSource(ctx, staging, item.candidateId)
    expect(result.parseStatus).toBe('failed')
    expect(result.blocks).toHaveLength(0)
    expect(result.parseError).toContain('暂不支持')
  })

  test('real ZIP files with the same basename survive as separate original candidates', async () => {
    const staging = new ReviewB2StagingService()
    const archive = new AdmZip()
    archive.addFile('申请一/证明.txt', Buffer.from('第一份 ZIP 文件'))
    archive.addFile('申请二/证明.txt', Buffer.from('第二份 ZIP 文件'))
    const receipt = stageReviewB2TrustedZip(ctx, staging, {
      physicalArchiveKey: 'native-picked-zip-1', requestId: 'archive-request-1',
      bytes: archive.toBuffer(),
    })
    expect(receipt.candidates).toHaveLength(2)
    const result = await previewT02StagedInventory(ctx, staging)
    expect(result.total).toBe(2)
    expect(result.parsed).toBe(2)
    expect(new Set(result.sources.map((source) => source.documentVersionId)).size).toBe(2)
    expect(result.sources.map((source) => source.blocks[0]?.text).sort())
      .toEqual(['第一份 ZIP 文件', '第二份 ZIP 文件'])
  })

  test('all twelve staged image originals are reported, including same-name files', async () => {
    const staging = new ReviewB2StagingService()
    for (let index = 0; index < 12; index++) {
      stage(staging, '图片.jpg', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'main-image-' + index)
    }
    const summary = await previewT02StagedInventory(ctx, staging)
    expect(summary).toMatchObject({
      candidateOnly: true, checkpoint: 'staging-only', total: 12,
      partial: 12, parsed: 0, failed: 0, imagesAwaitingInspection: 12,
    })
    expect(new Set(summary.sources.map((s) => s.documentVersionId)).size).toBe(12)
    expect(summary.sources.every((s) => s.blocks.length === 1 && s.blocks[0]?.kind === 'image')).toBeTrue()
  })

  test('staging scope revoked before source read cannot yield a usable preview', async () => {
    const staging = new ReviewB2StagingService()
    const item = stage(staging, '证据.txt', Buffer.from('可读文本'), 'main-revoked')
    staging.revoke(ctx)
    await expect(previewT02StagedSource(ctx, staging, item.candidateId)).rejects.toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
})
