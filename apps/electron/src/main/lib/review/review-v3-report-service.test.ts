import { afterEach, expect, test } from 'bun:test'
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { T08Report, T08ReportProjection } from '@profer/shared'
import {
  assertT08ExportDestination, calculateT08ProjectionHash, encodeT08ReportFormat, exportT08ReportProjectionV3, getT08ReportArchiveV3,
  exportT08ReportArchiveV3, findT08ReportAmendments, listT08LocalSaveRecordsV3,
  listT08ReportArchivesV3, makeT08ReportSnapshot, persistT08ReportSnapshot,
  renderT08ReportHtml, verifyT08ReportSnapshot,
} from './review-v3-report-service'

const tempRoots: string[] = []
function root(): string {
  const value = mkdtempSync(join(tmpdir(), 't08-report-'))
  tempRoots.push(value)
  return value
}
afterEach(() => { for (const path of tempRoots.splice(0)) rmSync(path, { recursive: true, force: true }) })

function fixtureReport(): T08Report {
  return {
    audience: 'student', runId: 'run-1', caseId: 'case-1', status: 'completed', stale: false,
    markdown: '# 报告\n安全文本 <script>alert(1)</script>',
    json: JSON.stringify({ schema: 'review-v3-t08-report/2', caseId: 'case-1', audience: 'student', historical: false,
      run: { id: 'run-1', status: 'completed', inputHash: 'input-1', templateId: 'template-1', templateVersion: 2,
        coverage: { plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } },
      sources: [], decision: null, subjects: [], supplements: [] }),
    rows: [{ kind: 'check', id: 'c1', status: 'compliant', detail: '=HYPERLINK("x")', source: '来源' }],
  }
}
function fixtureProjection(): T08ReportProjection {
  const report = fixtureReport()
  const base = {
    schema: 'review-v3-t08-report-projection/1' as const, caseId: 'case-1', caseTitle: '测试案卷',
    caseRevision: 3, runId: 'run-1', audience: 'student' as const, inputHash: 'input-1',
    templateId: 'template-1', templateVersion: 2, templateDigest: 'template-digest',
    decisionIds: ['decision-1'], decisionDigest: 'decision-digest', historical: false,
    renderVersion: 't08-report-renderer/2' as const, report,
  }
  return { ...base, projectionHash: calculateT08ProjectionHash(base) }
}

test('T08 snapshot is immutable, binds the projected report and can be reopened after restart', () => {
  const projection = fixtureProjection()
  const snapshot = makeT08ReportSnapshot(projection, { reportId: 'report-fixed', createdAt: '2026-10-24T00:00:00.000Z' })
  expect(verifyT08ReportSnapshot(snapshot)).toBe(true)
  const rootDir = root()
  persistT08ReportSnapshot(snapshot, rootDir)
  const reopened = getT08ReportArchiveV3({ caseId: snapshot.caseId, reportId: snapshot.reportId }, rootDir)
  expect(reopened.snapshotHash).toBe(snapshot.snapshotHash)
  expect(reopened.report.markdown).toBe(snapshot.report.markdown)
  expect(listT08ReportArchivesV3(snapshot.caseId, rootDir)[0]?.valid).toBe(true)
})

test('T08 snapshot rejects changed report bytes and changed binding metadata', () => {
  const snapshot = makeT08ReportSnapshot(fixtureProjection(), { reportId: 'report-fixed', createdAt: '2026-10-24T00:00:00.000Z' })
  expect(verifyT08ReportSnapshot({ ...snapshot, report: { ...snapshot.report, markdown: '# Tampered' } })).toBe(false)
  expect(verifyT08ReportSnapshot({ ...snapshot, inputHash: 'different-input' })).toBe(false)
})

test('T08 report type is hash-bound, while existing snapshots without the optional type remain readable', () => {
  const legacySnapshot = makeT08ReportSnapshot(fixtureProjection(), { reportId: 'old-report' })
  expect(verifyT08ReportSnapshot(legacySnapshot)).toBe(true)
  const projection = fixtureProjection()
  const newProjection = { ...projection, reportKind: 'preliminary' as const, report: {
    ...projection.report, kind: 'preliminary' as const,
    json: JSON.stringify({ ...JSON.parse(projection.report.json), reportKind: 'preliminary' }),
  } }
  newProjection.projectionHash = calculateT08ProjectionHash(newProjection)
  const snapshot = makeT08ReportSnapshot(newProjection, { reportId: 'new-report' })
  expect(verifyT08ReportSnapshot(snapshot)).toBe(true)
  expect(verifyT08ReportSnapshot({ ...snapshot, reportKind: 'decided' })).toBe(false)
})

test('T08 amendment indicator is derived without rewriting old report contents', () => {
  expect(findT08ReportAmendments(['decision-old'], [
    { id: 'decision-old' }, { id: 'decision-other' },
    { id: 'decision-third', amendsDecisionId: 'decision-new' },
    { id: 'decision-new', amendsDecisionId: 'decision-old' },
  ])).toEqual(['decision-new', 'decision-third'])
  expect(findT08ReportAmendments(['decision-old'], [{ id: 'another', amendsDecisionId: 'unrelated' }])).toEqual([])
})

test('T08 HTML is text-searchable content with no script execution or remote resource dependency', () => {
  const html = renderT08ReportHtml(fixtureReport())
  expect(html).toContain('default-src \'none\'')
  expect(html).toContain('&lt;script&gt;')
  expect(html).not.toContain('<script>')
  expect(html).not.toContain('https://')
})

test('F16 spreadsheet export neutralizes formula-like content; PDF and bundle consume the same projection', async () => {
  const report = fixtureReport()
  const pdfRenderer = async (html: string) => new TextEncoder().encode('%PDF-1.7\n' + html + '\n%%EOF')
  const workbookBytes = await encodeT08ReportFormat(report, 'xlsx', pdfRenderer)
  expect(workbookBytes.byteLength).toBeGreaterThan(0)
  const workbook = XLSX.read(workbookBytes, { type: 'array' })
  const detail = workbook.Sheets['检查与来源']!['D2']!
  expect(detail.t).toBe('s')
  expect(detail.f).toBeUndefined()
  expect(detail.v).toContain('HYPERLINK')
  const pdf = await encodeT08ReportFormat(report, 'pdf', pdfRenderer)
  expect(new TextDecoder().decode(pdf)).toContain('%PDF-1.7')
  const snapshot = makeT08ReportSnapshot(fixtureProjection(), { reportId: 'report-fixed', createdAt: '2026-10-24T00:00:00.000Z' })
  const zipBytes = await encodeT08ReportFormat(report, 'bundle', pdfRenderer, snapshot)
  const zip = await JSZip.loadAsync(zipBytes)
  expect(Object.keys(zip.files).sort()).toEqual(['README.txt', 'manifest.json', 'report.html', 'report.json', 'report.md', 'report.pdf', 'report.xlsx'])
  const manifest = JSON.parse(await zip.file('manifest.json')!.async('string')) as { snapshotHash: string; reportId: string }
  expect(manifest.snapshotHash).toBe(snapshot.snapshotHash)
  expect(manifest.reportId).toBe(snapshot.reportId)
})

test('F16 cancellation keeps the immutable archive but does not claim an external save', async () => {
  const rootDir = root()
  const receipt = await exportT08ReportProjectionV3(fixtureProjection(), 'md', {
    rootDir, now: () => '2026-10-24T00:00:00.000Z', chooseDestination: async () => undefined,
  })
  expect(receipt.status).toBe('cancelled')
  expect(receipt.filePath).toBeUndefined()
  expect(existsSync(join(receipt.archivePath, 'snapshot.json'))).toBe(true)
  expect(existsSync(receipt.archiveFilePath!)).toBe(true)
  expect(listT08ReportArchivesV3(receipt.caseId, rootDir)[0]?.valid).toBe(true)
  const snapshot = getT08ReportArchiveV3({ caseId: receipt.caseId, reportId: receipt.reportId }, rootDir)
  expect(listT08LocalSaveRecordsV3(snapshot, rootDir).map((item) => item.status)).toEqual(['cancelled'])
})

test('F16 successful save returns the actual destination and saved bytes', async () => {
  const rootDir = root()
  const destination = join(rootDir, 'saved-report.md')
  const receipt = await exportT08ReportProjectionV3(fixtureProjection(), 'md', {
    rootDir, now: () => '2026-10-24T00:00:00.000Z', chooseDestination: async () => destination,
  })
  expect(receipt.status).toBe('saved')
  expect(receipt.filePath).toBe(destination)
  expect(readFileSync(destination, 'utf-8')).toBe(fixtureReport().markdown)
  const snapshot = getT08ReportArchiveV3({ caseId: receipt.caseId, reportId: receipt.reportId }, rootDir)
  const saved = listT08LocalSaveRecordsV3(snapshot, rootDir)
  expect(saved).toHaveLength(1)
  expect(saved[0]).toMatchObject({ status: 'saved', filePath: destination, fileHash: expect.any(String) })
  // 冷重开后重导出，独立追加第二条本机记录，不改变快照 hash 或原始正文。
  await exportT08ReportArchiveV3({ caseId: receipt.caseId, reportId: receipt.reportId, format: 'json' }, {
    rootDir, chooseDestination: async () => undefined,
  })
  expect(listT08LocalSaveRecordsV3(snapshot, rootDir).map((item) => item.status).sort()).toEqual(['cancelled', 'saved'])
  expect(getT08ReportArchiveV3({ caseId: receipt.caseId, reportId: receipt.reportId }, rootDir).snapshotHash).toBe(snapshot.snapshotHash)
})

test('T08 archive cannot be overwritten; a changed baseline invalidates its index and cold-open', () => {
  const rootDir = root()
  const snapshot = makeT08ReportSnapshot(fixtureProjection(), { reportId: 'report-same' })
  const directory = persistT08ReportSnapshot(snapshot, rootDir)
  expect(() => persistT08ReportSnapshot(snapshot, rootDir)).toThrow()
  writeFileSync(join(directory, 'report.md'), '# altered baseline')
  expect(listT08ReportArchivesV3(snapshot.caseId, rootDir)[0]?.valid).toBe(false)
  expect(() => getT08ReportArchiveV3({ caseId: snapshot.caseId, reportId: snapshot.reportId }, rootDir))
    .toThrow('基线文件与不可变快照不一致')
})

test('F16 Save As cannot overwrite another case report or follow symlinks into protected data', async () => {
  const rootDir = root()
  const snapshot = makeT08ReportSnapshot(fixtureProjection(), { reportId: 'another-report' })
  const directory = persistT08ReportSnapshot(snapshot, rootDir)
  const protectedFile = join(directory, 'report.md')
  const original = readFileSync(protectedFile, 'utf8')
  expect(() => assertT08ExportDestination(rootDir, protectedFile)).toThrow('不能覆盖案卷数据')
  const alias = join(rootDir, 'alias-to-report.md')
  symlinkSync(protectedFile, alias)
  expect(() => assertT08ExportDestination(rootDir, alias)).toThrow('不能覆盖案卷数据')
  await expect(exportT08ReportProjectionV3(fixtureProjection(), 'md', {
    rootDir, chooseDestination: async () => protectedFile,
  })).rejects.toThrow('不能覆盖案卷数据')
  expect(readFileSync(protectedFile, 'utf8')).toBe(original)
})

test('F16 failed external Save As leaves the archived report intact and returns no saved receipt', async () => {
  const rootDir = root()
  const invalidDestination = join(rootDir, 'no-such-folder', 'saved.md')
  await expect(exportT08ReportProjectionV3(fixtureProjection(), 'md', {
    rootDir, chooseDestination: async () => invalidDestination,
  })).rejects.toThrow()
  const archived = listT08ReportArchivesV3('case-1', rootDir)
  expect(archived).toHaveLength(1)
  expect(archived[0]?.valid).toBe(true)
  const snapshot = getT08ReportArchiveV3({ caseId: archived[0]!.caseId, reportId: archived[0]!.reportId }, rootDir)
  expect(listT08LocalSaveRecordsV3(snapshot, rootDir)[0]?.status).toBe('failed')
})

test('T08 local save record tampering is reported without corrupting the immutable report snapshot', async () => {
  const rootDir = root()
  const receipt = await exportT08ReportProjectionV3(fixtureProjection(), 'md', {
    rootDir, chooseDestination: async () => undefined,
  })
  const snapshot = getT08ReportArchiveV3({ caseId: receipt.caseId, reportId: receipt.reportId }, rootDir)
  const recordsDir = join(receipt.archivePath, 'local-save-records')
  const record = listT08LocalSaveRecordsV3(snapshot, rootDir)[0]!
  writeFileSync(join(recordsDir, record.id + '.json'), JSON.stringify({ ...record, status: 'saved' }))
  const summary = listT08ReportArchivesV3(receipt.caseId, rootDir)[0]!
  expect(summary.valid).toBe(true)
  expect(summary.localSaveError).toContain('完整性校验失败')
  expect(getT08ReportArchiveV3({ caseId: receipt.caseId, reportId: receipt.reportId }, rootDir).snapshotHash)
    .toBe(snapshot.snapshotHash)
})
